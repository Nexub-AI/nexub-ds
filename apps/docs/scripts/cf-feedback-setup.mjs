#!/usr/bin/env node
// Applies the feedback endpoint's Cloudflare config as code (idempotent):
//   1. R2 lifecycle: delete screenshots 30 days after upload.
//   2. WAF rate limit: POST /api/feedback, 5 per minute per IP, block 10 min.
//
// Usage: node scripts/cf-feedback-setup.mjs [--dry-run] <bucket-name>
// Env:   CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID,
//        CLOUDFLARE_ZONE_ID (optional — without it the WAF rule is skipped;
//        rate-limit rules need a zone, i.e. a custom domain, not *.pages.dev).
// Token permissions: Account › Workers R2 Storage › Edit; Zone › Zone WAF › Edit.

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const bucket = args.find((a) => !a.startsWith('--'));
if (!bucket) {
  console.error('Usage: node scripts/cf-feedback-setup.mjs [--dry-run] <bucket-name>');
  process.exit(1);
}
const { CLOUDFLARE_API_TOKEN: token, CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_ZONE_ID: zone } = process.env;
if (!dryRun && (!token || !account)) {
  console.error('Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID (or pass --dry-run).');
  process.exit(1);
}

const RULE_REF = 'nexub_feedback_rate_limit';

const lifecycle = {
  rules: [
    {
      id: 'delete-after-30-days',
      enabled: true,
      conditions: { prefix: '' },
      deleteObjectsTransition: { condition: { type: 'Age', maxAge: 30 * 24 * 60 * 60 } },
    },
  ],
};

const rateLimitRule = {
  ref: RULE_REF,
  description: 'Feedback form: 5 POSTs per minute per IP',
  expression: '(http.request.uri.path eq "/api/feedback" and http.request.method eq "POST")',
  action: 'block',
  ratelimit: {
    characteristics: ['ip.src', 'cf.colo.id'],
    period: 60,
    requests_per_period: 5,
    mitigation_timeout: 600,
  },
  enabled: true,
};

async function cf(method, path, body) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: body && JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    const err = new Error(`${method} ${path} → ${res.status} ${JSON.stringify(json.errors ?? json)}`);
    err.status = res.status;
    throw err;
  }
  return json.result;
}

// 1. R2 lifecycle (PUT replaces the bucket's rules, so re-running is safe).
const lifecyclePath = `/accounts/${account ?? '<account_id>'}/r2/buckets/${bucket}/lifecycle`;
if (dryRun) {
  console.log(`PUT ${lifecyclePath}\n${JSON.stringify(lifecycle, null, 2)}\n`);
} else {
  await cf('PUT', lifecyclePath, lifecycle);
  console.log(`R2 lifecycle set on ${bucket}: delete after 30 days.`);
}

// 2. WAF rate limit in the zone's http_ratelimit entrypoint ruleset.
if (!zone && !dryRun) {
  console.log('CLOUDFLARE_ZONE_ID not set — skipping the WAF rate-limit rule.');
  process.exit(0);
}
const entry = `/zones/${zone ?? '<zone_id>'}/rulesets/phases/http_ratelimit/entrypoint`;
if (dryRun) {
  console.log(`PUT ${entry} (upserts rule ref "${RULE_REF}", keeps other rules)\n${JSON.stringify(rateLimitRule, null, 2)}`);
  process.exit(0);
}
let existing = [];
try {
  existing = (await cf('GET', entry)).rules ?? [];
} catch (e) {
  if (e.status !== 404) throw e; // 404 = no entrypoint yet; PUT creates it.
}
// Keep other rules (minus server-generated fields), replace ours by ref.
const keep = existing
  .filter((r) => r.ref !== RULE_REF)
  .map((r) => {
    const { version, last_updated, ...rest } = r; // eslint-disable-line @typescript-eslint/no-unused-vars
    return rest;
  });
await cf('PUT', entry, { rules: [...keep, rateLimitRule] });
console.log('WAF rate-limit rule upserted: POST /api/feedback, 5/min per IP, block 10 min.');

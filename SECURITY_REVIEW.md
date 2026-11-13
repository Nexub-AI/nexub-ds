# Security review

A structured internal review of everything Nexub DS ships or runs, against a written checklist: [OWASP ASVS 4.0.3](https://owasp.org/www-project-application-security-verification-standard/) Level 2 where a chapter applies. It is an internal review, not an outside audit or a penetration test.

- **Reviewed:** 2026-11-13, for release 9.8.0, at the commit that release was cut from.
- **How:** one pass read every code path in scope against the checklist below and reported findings with file, line and a failure scenario; each finding was then checked against the code and either fixed with a test or closed with the reason. Automated checks that run on every PR (CodeQL, zizmor, the XSS corpus, the CSP and Trusted Types run over every docs page, `pnpm audit`) are part of the evidence, not a substitute for the read.
- **Result:** no critical or high finding. 13 medium or low findings: 12 fixed in 9.8.0, 1 closed as not a defect. One item needs the Cloudflare account to confirm (the WAF rate-limit rule), listed under "Open".
- **Repeat:** before every major version, and after any change to the feedback endpoint, the docs middleware or the release workflows.

## Scope

| Part | What it is | Trust boundary |
|---|---|---|
| `@nexub/react`, `patterns`, `marketing`, `core`, `react-native` | Component libraries | Props that carry data from users, a CMS or a model |
| `@nexub/mcp` | MCP server over stdio, read-only reference docs | Tool and prompt arguments from an MCP client |
| Docs site (`apps/docs`) | Static export on Cloudflare Pages, with a middleware that sets the CSP | Every request |
| Feedback endpoint (`apps/docs/functions/api/feedback.ts`) | Public POST: Turnstile, optional screenshot to R2, card to a chat webhook | Every request; the only place we accept and store user data |
| Release pipeline (`.github/workflows`) | Build, attest, publish, deploy | Pull requests, dependencies |

## Checklist (ASVS 4.0.3, Level 2)

| Chapter | Applies | Status | Evidence |
|---|---|---|---|
| V1 Architecture | Partly | Met | Threat model per component on the docs Security page; this document; dependency policy in `SECURITY.md` |
| V2 Authentication | No | n/a | No accounts or passwords anywhere |
| V3 Session management | No | n/a | No sessions or cookies |
| V4 Access control | One item | Met | Screenshots are read through an unguessable link (122-bit random key, 30-day expiry), a capability URL, not an authenticated one. The key is validated before R2 is touched |
| V5 Validation, sanitisation, encoding | Yes | Met after fixes 2, 3, 7, 11 | `safeHref`/`safeSrc`/`safeUrl` on every data-driven link and image; nothing parses HTML; CSV formula escaping; XSS corpus over every component (`xss.test.tsx`); endpoint allowlists, length caps and HTML escaping |
| V6 Stored cryptography | No | n/a | We store no secrets or keys in code or data. Randomness is `crypto.getRandomValues` / `randomUUID` |
| V7 Errors and logging | Yes | Met after fixes 2, 8 | Logs carry a status only: never the webhook URL, message, email or IP (tested) |
| V8 Data protection | Yes | Met after fix 5 | Feedback goes to a private chat space; screenshots expire after 30 days; API answers are `no-store`; nonce'd HTML is `private` |
| V9 Communications | Yes | Met | HTTPS only, HSTS two years with subdomains, `upgrade-insecure-requests` |
| V10 Malicious code | Yes | Met | SLSA L3 provenance, reproducible builds, signed tags, pinned actions, install scripts off, 7-day package age, runtime dependency allowlist (9.7) |
| V11 Business logic / anti-automation | Yes | Met after fixes 1, 6; one item open | Turnstile on every submission (fails closed), honeypot, per-address limit in the function, WAF rule in front |
| V12 Files | Yes | Met | Type from magic bytes, 2 MB cap, random key, served with `nosniff` and a `sandbox` CSP |
| V13 API | Yes | Met after fixes 1–4 | Origin check before the body is read, multipart only, size cap, method-specific handler |
| V14 Configuration | Yes | Met after fixes 4, 5, 9, 10 | Nonce CSP with `strict-dynamic`, Trusted Types enforced, frame, referrer and permissions policies; no high or critical advisory in any dependency |

## Findings

| # | Severity | ASVS | Finding | Outcome |
|---|---|---|---|---|
| 1 | Medium | V13.1.3 | The endpoint's calls to Turnstile and the chat webhook had no timeout, so a slow upstream held the request open. The per-address limiter cleared its whole table at 1,000 addresses, so a flood reset everyone's count | Fixed: 5 s timeout on both calls; the limiter now forgets only the least recently seen address |
| 2 | Low | V7.4.1 | A malformed multipart body threw, and the platform answered with a generic 500 | Fixed: 400, tested |
| 3 | Low | V13.2.6 | The size check trusted a `Content-Length` such as `-1` | Fixed: only a positive integer passes; anything else is 411 |
| 4 | Low | V14.4 | Answers from `/api/*` carried no `nosniff`, `no-store` or HSTS: the static `_headers` file doesn't cover Functions | Fixed in the endpoint and in the middleware |
| 5 | Low | V8.1.1 | HTML with a per-request nonce was served `Cache-Control: public`, so a shared cache could hand one nonce to many readers | Fixed: `private` |
| 6 | Low | V11.1 | Turnstile verification read only `success`, not the host the token was solved on | Fixed: the host must be this site |
| 7 | Low | V5.3 | The "page" link shown to staff in the chat card could be any http(s) URL the sender chose | Fixed: only a URL on this site is kept |
| 8 | Low | V7.1 | With the webhook unset the endpoint answered `ok` and dropped the feedback | Fixed: 503, checked before anything is stored |
| 9 | Low | V14.2 | 36 advisories in dev tools (wrangler 3, Lighthouse CI, MCP SDK), 13 of them high. None shipped, but they run in CI with tokens nearby | Fixed: wrangler 4, MCP SDK 1.32.2 and overrides to patched versions. CI now fails on a high or critical advisory in any dependency, not only shipped ones. Two `extract-zip` advisories have no patched version: see `SECURITY.md` |
| 10 | Low | V14.2 | The release workflow's provenance check and tag signing were allowed to fail | Fixed: blocking, now that both passed on 9.7.0 |
| 11 | Low | V5.4 | Text passed to the MCP prompts could close its code fence and read as instructions | Fixed: the fence is always longer than any backtick run in the text, and the screen description is fenced and labelled as a description |
| 12 | Low | V5.3.3 | Reported: `CardLink` and the marketing `ProductCard` pass `href` to the DOM unguarded | Closed, not a defect: `CardLink` applies `safeHref` and `ProductCard` renders through it. `Link` is a primitive and passes your `href` as written, which the docs state |
| 13 | Low | V1.2 | The "Security vulnerability" link in the issue chooser led to a form that was switched off | Fixed: private vulnerability reporting is on for the repository |

## Checked and sound

- **CSP nonce:** 16 random bytes per request; set on every script, style and script preload; `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors` limited to the two preview paths.
- **Trusted Types default policy:** URLs are parsed before they are compared, so backslashes, encoded dots, `/_next/static/../` and protocol-relative URLs are refused; any string with `<` is refused as HTML; script text is never allowed.
- **Endpoint:** the webhook is a fixed binding, so no request can choose where the server connects (no SSRF); mention and markup injection into the chat card is not possible because `<` is escaped and the category is an allowlist.
- **MCP:** every lookup goes through the catalog, never a path; every argument has a maximum length; only the stdio transport is imported, so the SDK's HTTP server code is not reachable.
- **Libraries:** the only `dangerouslySetInnerHTML` is the escaped, nonce'd theme script; no `eval`, `new Function`, `innerHTML`, `document.write`, `postMessage`, `window.open` or `fetch` in shipped code; new-tab links always get `noopener noreferrer`; stored values (theme, recents) are validated when read.
- **Workflows:** every action pinned to a commit; `persist-credentials: false`; the one `pull_request_target` workflow has no permissions and no checkout; event text reaches the shell only through `env`; publishing uses OIDC, and no long-lived npm token exists.

## Open

- **WAF rate-limit rule for `POST /api/feedback`.** The function's own limit is per isolate and only a speed bump; the real limit is the Cloudflare WAF rule that `apps/docs/scripts/cf-feedback-setup.mjs` creates. Whether that rule is live can only be seen in the Cloudflare account, which this review had no access to. Owner: confirm under Security → WAF → Rate limiting rules.
- **`FileUpload` checks are for feedback only.** `accept`, `maxSize` and `validate` run in the browser. This is documented, and it stays the consumer's job to check again on the server.
- **Screenshot polyglots.** Only the first 12 bytes are checked. Accepted: the file is served with `nosniff`, an image content type and a `sandbox` CSP, so it can't run.

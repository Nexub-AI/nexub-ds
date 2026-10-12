# Feedback feature — operator setup

The floating "Feedback" widget on the docs site posts to a Cloudflare Pages
Function (`/api/feedback`) which:

1. Verifies a [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
   token (server-side).
2. Optionally uploads a screenshot to an R2 bucket.
3. Posts a Google Chat **card v2** to a webhook URL.

The webhook URL and Turnstile secret never reach the browser — they are bound
to the Pages Function via the Cloudflare dashboard, not committed to source.

This file is the operator runbook. **The feature is dark until every item
below is configured.** The form will still render but submissions will return
a `warning: webhook_not_configured` and silently drop.

---

## 1. Create a Google Chat webhook

1. Open the Google Chat space that should receive feedback.
2. Click the space name → **Apps & integrations** → **Webhooks** →
   **Add webhook**.
3. Name it (e.g. "Nexub DS feedback") and copy the URL. It looks like:
   `https://chat.googleapis.com/v1/spaces/<space-id>/messages?key=…&token=…`
4. Treat this URL as a secret — anyone who has it can post to that space.

## 2. Create a Cloudflare Turnstile site

1. Cloudflare dashboard → **Turnstile** → **Add site**.
2. Hostnames: add `staging.nexub-ds-docs.pages.dev` and your production
   custom domain (e.g. `docs.nexub.ai`).
3. Widget mode: **Managed** (handles its own challenge — invisible for
   most real users).
4. Copy the **Site key** (public, OK to embed) and **Secret key** (private).

## 3. Create an R2 bucket for screenshots

1. Cloudflare dashboard → **R2** → **Create bucket**.
2. Name: `nexub-feedback-screenshots` (or whatever you prefer).
3. Default storage class: **Standard**.
4. Public access: **leave disabled**. Screenshots are served via a same-origin
   Pages Function (`/api/feedback/screenshot/[key]`), not directly from R2.
5. **Settings → Object lifecycle rules → Add rule**: delete objects after
   **30 days**. Screenshot links are unauthenticated bearer URLs, so they
   should not live forever.

## 4. Wire the Pages project

Cloudflare dashboard → **Workers & Pages** → `nexub-ds-docs` → **Settings**.

### Environment variables (apply to both **Production** and **Preview**)

These are read by the **Pages Functions runtime** (server-side):

| Variable | Type | Value |
|---|---|---|
| `TURNSTILE_SECRET_KEY` | Encrypted | the Turnstile **secret key** from step 2 |
| `GOOGLE_CHAT_WEBHOOK_URL` | Encrypted | the webhook URL from step 1 |

`TURNSTILE_SECRET_KEY` is **required**: without it the function fails closed
and returns `503 not_configured` for every submission.

### Rate limiting (WAF)

The in-function rate limit is per Worker isolate, so it is only a speed bump.
Add the real limit in the Cloudflare dashboard → **Security → WAF →
Rate limiting rules**: match `URI Path equals /api/feedback` and
`Request Method equals POST`, **5 requests per 1 minute per IP**, action
**Block** for 10 minutes.

> **Important — `NEXT_PUBLIC_TURNSTILE_SITE_KEY` does NOT go here.**
> Public Next.js env vars are baked into the JS bundle at **build time**,
> and we build in **GitHub Actions** (not in Cloudflare Pages). Setting it
> in the Pages dashboard has no effect. See step 4½ below.

After saving, redeploy the latest Pages production build (Settings →
**Deployments** → "Retry deployment") so the new env vars are baked into the
Functions runtime.

### 4½. GitHub Actions repository variable

Add the **public** Turnstile site key as a repo variable so the build step
in `.github/workflows/{staging,release}.yml` can inject it:

GitHub repo → **Settings → Secrets and variables → Actions → Variables tab**
→ **New repository variable**:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | the Turnstile **site key** from step 2 |

> Use a **Variable**, not a Secret — the site key is public by design (it
> ends up in every page's HTML), and Variables show their values in the
> dashboard which makes debugging easier.

After adding, **re-run the latest Staging Deploy / Release workflow** so the
new value is baked into the next Pages deploy.

### Bindings

Settings → **Functions** → **R2 bucket bindings** → **Add binding**:

| Variable name | R2 bucket |
|---|---|
| `FEEDBACK_SCREENSHOTS` | the bucket from step 3 |

Save and redeploy.

---

## 5. Smoke test on staging

After the next push to the `staging` branch deploys:

1. `curl -i https://staging.nexub-ds-docs.pages.dev/api/feedback` → expect
   **405 Method Not Allowed** with `allow: POST` (Function exists).
2. Open any docs page on staging. A "Feedback" pill should sit at the
   bottom-right.
3. Submit a test "Bug" with message + screenshot → confirm a Google Chat card
   lands in the configured space with the message body, page URL, viewport,
   theme, and a "View screenshot" button.
   The screenshot field offers three sources:
   - **Capture page** — instant, captures the visible viewport via `html-to-image`
   - **Capture screen…** — native OS picker (browser/window/screen)
   - **Upload** — manual file fallback for PNG/JPEG/WebP up to 2 MB
   After capture, drag on the thumbnail to mark up red strokes, then click
   **Save annotations** to bake them into the image before submit.
4. Click the screenshot button → it streams the image from R2 via
   `/api/feedback/screenshot/<uuid>`.

If submission succeeds but no Chat card arrives, tail the Function logs:
**Pages → Functions → Real-time logs**. The handler logs warnings when env
vars are missing.

---

## 6. Future expansion (out of scope for the MVP)

The Function is intentionally one file. When you're ready to grow:

- **Storage**: bind a D1 database and `INSERT` every submission before
  posting to Chat. Lets you query history without scraping the Chat space.
- **Per-category routing**: read multiple webhook env vars
  (`CHAT_WEBHOOK_BUG`, `CHAT_WEBHOOK_SUGGESTION`, …) and pick by `category`.
- **Per-IP KV rate limit**: replace the in-memory `Map` with a Workers KV
  binding (key = IP, value = ring buffer of timestamps).
- **Email notifications**: add a second outbound POST to a transactional
  email API (Resend, MailChannels) for bug reports.
- **PII scrub**: strip the user-agent or coarsen viewport before persisting,
  if you start storing.

All of these slot into `apps/docs/functions/api/feedback.ts` without
touching the client form.

---

## 7. Files involved

| File | Responsibility |
|---|---|
| `apps/docs/src/components/feedback/FeedbackButton.tsx` | Floating action pill |
| `apps/docs/src/components/feedback/FeedbackDialog.tsx` | Dialog + form |
| `apps/docs/src/components/feedback/Turnstile.tsx` | Client-side widget |
| `apps/docs/src/components/feedback/submit.ts` | `submitFeedback()` + browser context |
| `apps/docs/src/components/ClientProviders.tsx` | Mount point (lazy) |
| `apps/docs/functions/api/feedback.ts` | Server: verify, R2 upload, Chat POST |
| `apps/docs/functions/api/feedback/screenshot/[key].ts` | Streams R2 image |
| `apps/docs/next.config.mjs` | Surfaces `NEXT_PUBLIC_TURNSTILE_SITE_KEY` |
| `.github/workflows/{staging,release}.yml` | Run `wrangler pages deploy out` from `apps/docs/`; wrangler picks up `apps/docs/functions/` automatically |

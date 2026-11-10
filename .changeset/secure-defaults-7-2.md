---
'@nexub/react': minor
'@nexub/patterns': minor
'@nexub/marketing': minor
'@nexub/core': minor
---

7.2: secure by default.

- **New** `safeHref` and `safeSrc` (also `@nexub/react/safeHref`). Every consumer-supplied link and image URL now goes through them: `Breadcrumb`, `MediaCard`, `CardLink`, `Avatar`, and the navs/links in `AppHeader`, `NotificationItem`, `NotificationCenter`, `SettingsPage`, `SettingsLayout`, `PlanCard`, `AppLauncher`, `MarketingNav`, `MarketingFooter`. `javascript:`, `vbscript:`, `data:` and `file:` links are dropped; images allow relative, http(s), `blob:` and `data:image/*`. `safeHref(url, { strict: true })` allows only web, mailto, tel and sms; it becomes the default in 8.0.
- **New** `NexubProvider` `nonce`: hands your CSP nonce to the `<style>` tags Radix overlays inject, so every overlay works under `style-src-elem 'nonce-…'`.
- **New** `scrollLock="class"` on `Dialog.Root` and `AlertDialog.Root` (already on Sheet/Drawer and CommandPalette): no `<style>` at all. It becomes the default in 8.0.
- **New** `FileUpload.Root` `validate(file)`: return a message to reject a file (reason `'custom'`).
- `PasswordInput`: the reveal button keeps one name ("Show password") and reports its state with `aria-pressed` and `aria-controls`. The `hidePassword` message is deprecated (removed in 9.0).
- `ThemeScript`: a stored product brand is applied only when it's a known product.

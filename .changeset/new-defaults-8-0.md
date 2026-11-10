---
'@nexub/tokens': minor
'@nexub/themes': minor
'@nexub/react': minor
'@nexub/react-native': minor
---

8.0: new defaults. No new features. Every change below shipped as an opt-in in 7.x, and `npx nexub-migrate --rules changes-in-8` reports where your code is affected. See "Migrating to 8.0" in the docs.

- **Signature is the default look.** Set `data-style="classic"` on `<html>` or any wrapper to keep the 7.x Material-derived look until 9.0; `data-style="signature"` inside a classic wrapper switches back. React Native: `NexubNativeProvider` defaults to `style="signature"` (`style="classic"` keeps 7.x).
- **`scrollLock` defaults to `"class"`** on `Dialog.Root`, `AlertDialog.Root`, `Drawer.Root` / `Sheet.Root` and `CommandPalette`: no injected `<style>`, so it works under a strict CSP. It needs `@nexub/themes/base` (the `html.nexub-scroll-lock` rule). `scrollLock="style"` keeps Radix's lock.
- **`safeHref` is strict by default,** and so is every Nexub link that uses it: only relative URLs, `#…`, http(s), `mailto:`, `tel:` and `sms:` render. `safeHref(url, { strict: false })` allows custom schemes again (script-capable schemes stay blocked).
- **Removed: the legacy motion tokens** `--duration-{instant,fast,normal,slow,slower}` and `--ease-{linear,in,out,in-out,out-expo,spring}` (deprecated in 7.3). Use the spring tokens, e.g. `var(--motion-spring-effects-default-duration)` and `var(--motion-spring-effects-default-easing)`.
- **Removed: the `easing` prop** on `Fade`, `Scale`, `Slide` and `Collapse` (deprecated in 7.3). `duration` rides the spring tokens.

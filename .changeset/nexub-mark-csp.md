---
'@nexub/icons': minor
'@nexub/themes': minor
---

Fix the colour `<NexubMark>` (and `<Logo>`, `AppHeader`, `SettingsLayout`) rendering black on server-rendered pages with a strict Content-Security-Policy. Its gradient stops now use `nxm-*` classes from `@nexub/themes/base` instead of inline `style` attributes, so make sure `base.css` is imported.

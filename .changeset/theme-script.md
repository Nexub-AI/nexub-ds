---
'@nexub/react': minor
---

Add `ThemeScript`: render it in `<head>` to apply the stored theme (and optionally the product brand) before first paint, so server-rendered apps no longer flash the wrong theme. Takes a `nonce` for pages with a strict Content-Security-Policy.

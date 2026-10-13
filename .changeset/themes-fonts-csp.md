---
"@nexub/themes": minor
---

**Fonts work under `font-src 'self'` with default Vite settings.** `@nexub/themes/base` now loads Plus Jakarta Sans from its own `fonts.css`, which only references font files over 8 KB, so Vite (4 KB) and webpack (8 KB) emit them as files instead of inlining `data:` URLs. The one subset left out, cyrillic-ext (≈1.7 KB, a few rare glyphs such as ₴), falls back to the system font. Apps can remove `build.assetsInlineLimit: 0`. The Strict CSP docs page has a Vite setting that never inlines fonts, and shows how to use the system font instead. `@fontsource-variable/plus-jakarta-sans` is no longer a runtime dependency.

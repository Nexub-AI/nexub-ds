---
'@nexub/themes': minor
'@nexub/tokens': minor
'@nexub/react-native': minor
---

Smaller published files, with no change to any style, value or component:

- `@nexub/themes`: the exports now point at `dist/`, a copy of `src/` without comments (src/ is still published, comments included). The same import paths work; `@nexub/themes/core` is 31% smaller gzipped, `@nexub/themes/base` 32%.
- `@nexub/tokens`: `css` drops the per-token description comments (they stay in `dist/json`), and the JavaScript token objects ship on one line. Same variables and values.
- `@nexub/react-native`: `lib/` is compiled without comments or indentation; source maps still point at `src/`, which keeps every comment. The main entry is 30% smaller gzipped.

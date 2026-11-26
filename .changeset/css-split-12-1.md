---
'@nexub/themes': minor
'@nexub/tokens': minor
'@nexub/react': minor
'@nexub/patterns': minor
'@nexub/marketing': minor
---

12.1 Performance: load only the CSS your components use (opt-in). Guide: `/getting-started/css-size`.

- **`@nexub/themes/base-lean` and `/core-lean`:** `base` and `core` without the CSS of particular components (drawer, charts, Aurora, Celebrate, dialog surfaces, sheet, reorder and 16 more). Each of those is now `@nexub/themes/parts/<name>.css`. `base` and `core` still load every part, in a new order: global rules first, then the parts. Nothing else changes for apps that keep them.
- **`nexub-usage --css <file>`** (`@nexub/tokens`): writes the parts and the `@source` lines for the components an app imports from `@nexub/react`, `@nexub/patterns` and `@nexub/marketing`, following each one to the files it uses. `--check` fails CI when the file is stale.
- **`nexub-usage --prune <css> --js <code>`:** after the build, removes the Nexub custom properties that no stylesheet or script names. Only Nexub's own properties, never the app's.
- **`dist/css-manifest.json`** in `@nexub/react`, `@nexub/patterns` and `@nexub/marketing` (exported as `./css-manifest.json`): what `--css` reads.
- A typical page (15 components) goes from 43.5 kB to 21.2 kB gzip. CI checks it stays under 21.9 kB (`pnpm check:css-page`).

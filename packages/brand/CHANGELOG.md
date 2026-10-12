# @nexub/brand

## 1.2.0

### Minor Changes

- d296fe3: **New package `@nexub/brand`**: the official brand files, so apps stop keeping their own copies.
  - `nexub-mark.svg` (the master, verbatim) and `nexub-mark-mono.svg` (single colour, `currentColor`, derived from the master's shapes).
  - `app-icon.svg` (the black glass tile with the mark) plus `app-icon-192.png` / `app-icon-512.png` for web manifests, and `favicon.ico` (16/32/48).
  - Per-product tiles: same tile, different glyph. Ships `app-icon-account.*` (person glyph). To add one, drop a glyph in `glyphs/` and run `pnpm --filter @nexub/brand build:assets` (see the README).
  - Files resolve as `@nexub/brand/<file>`. The README shows how to use them from Vite (imports, plus a copy step for `index.html` and the manifest) and from plain static hosting.

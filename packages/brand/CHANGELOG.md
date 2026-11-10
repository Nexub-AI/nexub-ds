# @nexub/brand

## 7.4.0

## 7.3.0

## 7.2.0

## 7.1.0

## 7.0.1

## 7.0.0

## 6.9.0

## 6.8.0

## 6.7.0

## 6.6.0

## 6.5.0

## 6.4.0

## 6.3.0

## 6.2.0

## 6.1.0

## 6.0.0

## 5.9.0

## 5.8.0

## 5.7.0

## 5.6.0

## 5.5.0

## 5.4.0

## 5.3.0

## 5.2.0

## 5.1.0

## 5.0.1

## 5.0.0

## 4.9.0

## 4.8.0

## 4.7.0

## 4.6.0

## 4.5.0

## 4.4.0

## 4.3.0

## 4.2.0

## 4.1.0

## 4.0.0

## 3.9.0

## 3.8.0

## 3.7.0

## 3.6.0

## 3.5.0

## 3.4.0

## 3.3.0

## 3.2.0

## 3.1.0

## 3.0.0

## 2.9.0

## 2.8.0

## 2.7.0

## 2.6.0

## 2.5.0

## 2.4.0

## 2.3.1

### Patch Changes

- c67c72a: Published with npm trusted publishing (OIDC) from the `Nexub-AI/nexub-ds` release workflow, so every version now carries npm provenance: you can check on npmjs.com that it was built from this repository's source. No code changes.

## 2.3.0

## 2.2.0

## 2.1.0

### Minor Changes

- 1983f67: **React Native: docs, AI tooling and app icons** (MOBILE_PLAN.md, phase M5):

  - `@nexub/react-native` README is the reference: install, provider, every component and screen pattern, and the rules they follow.
  - Claude skill and `llms.txt` / `llms-full.txt` include the React Native reference. `@nexub/mcp` adds a `get_react_native` tool.
  - Docs: a Getting started → React Native page, with a web-to-native component map.
  - `@nexub/brand`: mobile app icons for the hub and every product. `assets/mobile/<product>-ios.png` is a 1024 px full-bleed square; the Android adaptive icon ships as `-android-foreground/background/monochrome.png` layers, including a monochrome layer for Android 13+ themed icons.

## 2.0.0

### Minor Changes

- 80df74b: `@nexub/brand`: a tile for every Nexub app (`app-icon-command-hub`, `-admin`, `-people`, `-payhub`, `-commerce`, `-contracts`, `-leap`, `-founder-hub`), and a white-glass `-light.svg` of every tile for light themes. `AppLauncher`: apps can carry a `group`; the menu then shows them in titled sections (in order of each group's first app), and the arrow keys move between sections. Also body-parser 2.4.0 (GHSA-27r3-jxmh-p828).

## 1.9.0

## 1.8.0

## 1.7.0

## 1.6.0

## 1.5.1

## 1.5.0

## 1.4.0

## 1.3.0

### Minor Changes

- d907d10: **Brand assets: new "Using the brand assets" docs page.** `@nexub/brand` (shipped in 1.2.0) has the Nexub mark in colour and `currentColor` SVG, the app-icon tile as SVG plus 192 and 512 px PNGs, the Account tile, and `favicon.ico`, all at `@nexub/brand/<file>`. The new docs page (Getting Started → Using the brand assets) covers importing them in a Vite app, copying them into `public/` for `index.html` and the web manifest, plain static serving, and adding a tile for another product.

## 1.2.0

### Minor Changes

- d296fe3: **New package `@nexub/brand`**: the official brand files, so apps stop keeping their own copies.
  - `nexub-mark.svg` (the master, verbatim) and `nexub-mark-mono.svg` (single colour, `currentColor`, derived from the master's shapes).
  - `app-icon.svg` (the black glass tile with the mark) plus `app-icon-192.png` / `app-icon-512.png` for web manifests, and `favicon.ico` (16/32/48).
  - Per-product tiles: same tile, different glyph. Ships `app-icon-account.*` (person glyph). To add one, drop a glyph in `glyphs/` and run `pnpm --filter @nexub/brand build:assets` (see the README).
  - Files resolve as `@nexub/brand/<file>`. The README shows how to use them from Vite (imports, plus a copy step for `index.html` and the manifest) and from plain static hosting.

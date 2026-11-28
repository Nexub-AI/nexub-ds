---
'@nexub/react': minor
'@nexub/patterns': minor
'@nexub/marketing': minor
'@nexub/diagram': minor
'@nexub/core': minor
'@nexub/icons': minor
'@nexub/tokens': minor
---

Smaller published JavaScript, with no change to any export, type or behaviour:

- `@nexub/react`, `@nexub/patterns`, `@nexub/marketing`, `@nexub/diagram`, `@nexub/core`, `@nexub/icons` and `@nexub/tokens` ship their JavaScript minified, with a source map beside every file (`.js.map`, which includes the source). Stack traces and debuggers show the original TypeScript. Gzipped, the `@nexub/react` main entry is 18% smaller, `@nexub/patterns` 19%, `@nexub/diagram` 25%, `@nexub/core` 14% and `@nexub/tokens/seed` 54%.
- Nothing else changes: the same files and entry points (one module per component, so tree-shaking works as before), `'use client'` where it was, the `/* @__PURE__ */` annotations written in the source (every icon, the phone country table), property names, function and component names, and the type declarations.
- `@nexub/tokens/css/rem` (empty since 3.0) keeps a one-line comment instead of two.

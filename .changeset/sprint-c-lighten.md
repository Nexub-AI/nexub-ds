---
"@nexub/tokens": minor
"@nexub/icons": minor
"@nexub/react": minor
"@nexub/themes": patch
"@nexub/patterns": patch
---

Lighter packages and cleaner dependencies.

- `@nexub/icons`: add `Camera` and `Layers`. Drop the unused `@radix-ui/react-slot` dependency.
- `@nexub/tokens`: remove the empty `./css/light` and `./css/dark` stub exports; use `@nexub/themes/light` and `/dark`. Stop shipping source maps that pointed at unpublished `src/`.
- `@nexub/react`: `@nexub/tokens` moves from a dependency to a peer dependency. It was only used for CSS variables and the Tailwind preset, never imported from JS.

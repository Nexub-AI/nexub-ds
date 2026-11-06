---
"@nexub/react": minor
---

Docs site remix and `useScopedSeed`.

- **`useScopedSeed(ref, seed)`**: recolours one element and everything inside it from a brand seed, like `<ThemeProvider seed>` but scoped, for previewing a customer brand on one card or section. CSP-safe (CSSOM) and lazy-loads `@nexub/tokens/seed`.
- **nexub.design landing:** the hero now runs on the library itself, with `Aurora` and Vivid. A "Remix this page" bar recolours it live from six brand seeds and switches between Calm and Vivid, with a link to the theme builder.

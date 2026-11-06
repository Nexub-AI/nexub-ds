---
"@nexub/tokens": minor
"@nexub/react-native": minor
---

4.0 release candidate.

- **The API is frozen until 4.0.** 3.9 adds no features: only the deprecations below and fixes. 4.0 removes exactly these, and changes no component API.
- **Deprecated: the Tailwind 3 preset** (`@nexub/tokens/tailwind`). It now logs a one-time warning when it loads, and its type is marked `@deprecated`. Move to Tailwind 4 with `@import "@nexub/tokens/tailwind.css"`; the utilities keep their names.
- **Deprecated: Expo SDK 57** for `@nexub/react-native`. 4.0 requires Expo SDK 58 or later.
- **`nexub-migrate` rule `tailwind-3-preset`** finds every use of the Tailwind 3 preset (report only): `npx -p @nexub/tokens nexub-migrate . --rules tailwind-3-preset`.
- **New guide: Migrating to 4.0**, with the removals, the codemod and the Tailwind 4 and Expo SDK 58 steps.

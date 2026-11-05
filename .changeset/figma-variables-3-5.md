---
"@nexub/tokens": minor
---

Figma variables.

- **`@nexub/tokens/figma/*`**: the tokens as Figma variables in the W3C Design Tokens (DTCG) format, one file per mode. `color.<light|dark>.<standard|medium|high>.tokens.json` holds every colour role and the four product brands resolved to hex; `primitives.tokens.json` holds spacing, radius, shape, sizes and the type scale as numbers. Import them with Figma's Import variables (one collection, six modes) or Tokens Studio.
- Built from the same resolved values as `@nexub/tokens/native`, and a test fails the build if they differ, so a Figma library made from them can't drift from the code.
- New docs page: Getting started → Figma, with the import steps and download links.

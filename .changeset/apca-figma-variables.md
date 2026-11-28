---
'@nexub/tokens': minor
---

APCA contrast and Figma variables with aliases (12.6).

- `apcaContrast(text, background)` from `@nexub/tokens/seed` returns the APCA lightness contrast (Lc, APCA-W3 0.1.9): positive for dark text on light, negative for light on dark. It sits beside `contrastRatio` (WCAG 2), which stays the gate; the token contrast tests now report APCA Lc next to each WCAG ratio.
- New `@nexub/tokens/figma/variables/*.tokens.json`: W3C Design Tokens (DTCG) files for Figma's native variables import, as three collections. Primitives holds the reference palette, spacing, radius, shape, sizes and type scale. Product has a mode per `data-product` (default, leap, bookub, payub, founderub). Color has light and dark modes at each contrast level, and its roles alias the primitives with DTCG `{ref}` syntax. The Figma page in the docs covers importing and updating them.

The existing `@nexub/tokens/figma/*.tokens.json` files, the CSS, the Tailwind theme and the native tokens are unchanged.

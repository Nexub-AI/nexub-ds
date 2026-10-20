---
"@nexub/themes": minor
"@nexub/react": minor
"@nexub/patterns": minor
---

Glass 2.0 (design refresh Phase 3).

- **Recipe**: the fill is the surface role at the dial's opacity (`color-mix`), so dark glass needs no separate values. `backdrop-filter` is `blur + saturate`, and the edge is a hairline with a top specular highlight and a bottom rim. Same `surface="glass"` API.
- **Thickness** scales with size: buttons are thin (8px blur, elevation 1), bars and popovers regular (16px, elevation 2), dialogs and drawers thick (28px, elevation 3). Set `data-glass-thickness` to override.
- **Intensity dial**: `ThemeProvider` gains `glass` / `setGlass` (`'clear' | 'balanced' | 'tinted' | 'off'`), persisted under `nexub-glass` and applied pre-paint by `ThemeScript`. It sets `data-glass` on `<html>`, and any ancestor can set it too.
- **Variants**: `data-glass-tint="primary"` for the single emphasised action, and `data-glass-variant="clear"` over imagery only.
- **Scroll edge**: `TopNav.Root` / `AppHeader` accept `scrollEdge="soft" | "hard"`. Soft dissolves content under the bar instead of showing a divider.
- **Button `variant="glass"`** (thin glass).
- **Fallbacks are solid** under `prefers-reduced-transparency`, `prefers-contrast: more` (plus a 2px outline), `forced-colors`, `data-glass="off"`, and in browsers without `backdrop-filter`.

# Liquid Glass — build spec

A translucent **material layer**, orthogonal to light/dark. Not a new color theme.
Any surface opts in with `surface="glass"`; it works in both light and dark
automatically and falls back to a solid surface when the user needs it.

## Decisions (locked)
- **Model:** material layer, not themes. Activated per-component via a `surface="glass"`
  CVA variant, which also stamps `data-material="glass"` on the element so the glass
  vars resolve locally — no ThemeProvider or ancestor change required.
- **Fidelity:** CSS-only — `backdrop-filter: blur()` + translucent bg + hairline border +
  inset specular highlight + soft shadow. No SVG/WebGL refraction.
- **v1 scope:** Dialog, Popover, Drawer, TopNav, Card. Expand after the pattern proves out.
- **a11y:** mandatory solid fallback under `prefers-reduced-transparency` / `prefers-contrast`.

## Touchpoints
Follows the standard 3-touchpoint recipe; **tokens package untouched** (values live in the theme CSS, like light/dark).

### 1. `@nexub/themes` — new `packages/themes/src/glass.css`
```css
/* @nexub/themes — glass.css
   Liquid-glass MATERIAL. Orthogonal to light/dark. Import after base/light/dark. */
[data-material='glass'] {
  --glass-bg:        rgba(255, 255, 255, 0.55);
  --glass-border:    rgba(255, 255, 255, 0.35);
  --glass-highlight: rgba(255, 255, 255, 0.65);
  --glass-shadow:    0 8px 32px rgba(0, 0, 0, 0.12);
  --glass-blur:      16px;
}
/* glass-on-dark (covers data-theme and class modes of ThemeProvider) */
[data-theme='dark'] [data-material='glass'], [data-theme='dark'][data-material='glass'],
.dark [data-material='glass'], .dark[data-material='glass'] {
  --glass-bg:        rgba(20, 20, 24, 0.55);
  --glass-border:    rgba(255, 255, 255, 0.12);
  --glass-highlight: rgba(255, 255, 255, 0.10);
  --glass-shadow:    0 8px 32px rgba(0, 0, 0, 0.45);
}
/* a11y: no translucency/blur when the user opts out — fall back to the solid surface */
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  [data-material='glass'] {
    --glass-bg:     var(--color-bg-subtle);   /* confirm exact solid-surface token at build */
    --glass-border: var(--color-border-default);
    --glass-blur:   0px;
  }
}
```
- Add `"./glass": "./src/glass.css"` to `packages/themes/package.json` exports.

### 2. Wiring
- `apps/docs/src/styles/globals.css` → add `@import '@nexub/themes/glass';` after dark.
- Update the getting-started doc's import list to mention `@nexub/themes/glass`.

### 3. `@nexub/react` — `surface` variant on the v1 components
Add a shared CVA dimension to each surface component (default `solid`):
```ts
surface: {
  solid: '',
  glass:
    'bg-[var(--glass-bg)] border border-[var(--glass-border)] ' +
    'shadow-[var(--glass-shadow)] backdrop-blur-[var(--glass-blur)] ' +
    '[box-shadow:inset_0_1px_0_0_var(--glass-highlight)]',
},
```
Component contract: when `surface === 'glass'`, render `data-material="glass"` **and** the
glass classes (appended last so `tailwind-merge` wins over the solid bg/border). Default
`surface="solid"` → zero behavior change for existing usage.

### 4. Docs + stories
- Foundations → **Materials / Glass** page (what it is, when to use, a11y note).
- `surface="glass"` example + story for each v1 component; registry prop entry.

## Phases
1. **Foundation** — `glass.css` + wiring + prove on **Card** only; verify blur/contrast/dark in browser, confirm the a11y fallback with emulated `prefers-reduced-transparency`.
2. **Overlays** — Dialog, Popover, Drawer, TopNav (same variant; watch stacked-blur perf).
3. **Docs** — Materials page, examples, stories, registry entries.

## Known ceilings
- `backdrop-filter` is GPU-costly; keep glass to overlays/nav/cards, never a global default.
- White text/contrast on glass is the real risk — the a11y fallback is load-bearing, not polish.
- Web glass ≈ 80% of native; refraction/lensing intentionally out of scope.

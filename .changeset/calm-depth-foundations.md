---
"@nexub/tokens": minor
"@nexub/themes": minor
---

Calm Depth foundations (design refresh Phase 1).

- **Color roles**: generated tonal palettes (`--color-palette-<name>-<tone>`) and M3-style roles (`--color-primary`, `--color-on-primary`, `--color-*-container`, `--color-surface-container-{lowest…highest}`, `--color-on-surface(-variant|-muted)`, `--color-outline(-variant)`, `--color-inverse-*`, brand `--color-tertiary*`) in the new `@nexub/tokens/css/roles`, imported by `@nexub/themes/base`. Roles use `light-dark()`, so dark mode follows `color-scheme` at any depth; `data-contrast="high"` (or `prefers-contrast: more`) selects high-contrast tones. Every pair is WCAG 2.2 AA by construction and by test.
- **Legacy names keep working**: `--color-bg-*`, `--color-text-*`, `--color-border-*`, `--color-semantic-*`, `--color-fill-*` now alias the roles. Visible changes: brand-tinted neutrals, a deeper primary (`#0059c7`), and a focus ring and muted text that now meet contrast.
- **Typography**: Inter (variable, optical sizes) is the UI face (`--font-family-sans`); Plus Jakarta Sans moves to `--font-family-display` and headings. New role scale `--type-{display,headline,title,body,label}-{lg,md,sm}-*` (Tailwind `text-display-lg` …).
- **Shape / elevation / state**: `--shape-{control,field,container,overlay,tooltip,min}`, `--elevation-{0..3}`, `--state-{hover,focus,pressed,dragged,disabled-*}`, plus `.nx-state-layer` and `.nx-press` utilities.
- **Motion**: spring easings `--motion-spring-{spatial,effects,expressive}-{fast,default,slow}-{easing,duration}` (CSS `linear()`); Accordion/Collapsible height animation now works.
- **Density**: `data-density="compact"` shifts `--size-control-*` one step down (Tailwind `h-control-md`).
- Focus ring is one 3px outline (offset 2px) that follows the element's shape.

Requires `light-dark()` (Baseline 2024: Chrome 123, Safari 17.5, Firefox 120).

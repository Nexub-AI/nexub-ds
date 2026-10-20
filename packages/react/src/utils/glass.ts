/**
 * Glass 2.0 material (values in `@nexub/themes/glass`). Apply `glassSurfaceClass`
 * AND set `data-material="glass"` on the same element so the `--glass-*` vars
 * resolve. It overrides bg/border, so place it after a surface's solid classes.
 * Optional `data-glass-thickness` (thin | thick) scales blur and shadow with size.
 */
export const glassSurfaceClass =
  'border bg-[var(--glass-bg)] border-[var(--glass-border)] [-webkit-backdrop-filter:var(--glass-filter)] [backdrop-filter:var(--glass-filter)] [box-shadow:var(--glass-shadow)]';

export type SurfaceValue = 'solid' | 'glass';
export type GlassThickness = 'thin' | 'regular' | 'thick';

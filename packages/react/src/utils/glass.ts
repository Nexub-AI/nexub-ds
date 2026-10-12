/**
 * Liquid-glass material. Apply `glassSurfaceClass` AND set `data-material="glass"`
 * on the same element so the `--glass-*` vars (from `@nexub/themes/glass`) resolve.
 * It overrides bg/border, so place it after a surface's solid classes; the single
 * box-shadow carries both the inset specular highlight and the drop shadow.
 */
export const glassSurfaceClass =
  'bg-[var(--glass-bg)] border-[var(--glass-border)] backdrop-blur-[var(--glass-blur)] [box-shadow:inset_0_1px_0_0_var(--glass-highlight),var(--glass-shadow)]';

export type SurfaceValue = 'solid' | 'glass';

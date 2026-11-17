// Calm Depth surface styling for overlays and floating layers
// (DESIGN_REFRESH_PLAN.md §4.3–4.4, §6). Static strings so Tailwind's JIT sees them.

/** Modal overlays: Dialog, AlertDialog, CommandPalette, Sheet. */
export const overlaySurface =
  'rounded-shape-overlay bg-[var(--color-surface-elevated)] text-[var(--color-on-surface)] shadow-elevation-3';

/** Floating containers: Popover, HoverCard, menus, Select content, Toast. */
export const floatingSurface =
  'rounded-shape-container bg-[var(--color-surface-elevated)] text-[var(--color-on-surface)] shadow-elevation-2';

// 10.4 component tokens. Put one after the shared surface inside cn():
// tailwind-merge keeps the later class, so the shared surfaces stay as they are.
export const dialogSurface =
  'rounded-[var(--dialog-radius,var(--shape-overlay))] bg-[var(--dialog-bg,var(--color-surface-elevated))] text-[var(--dialog-fg,var(--color-on-surface))]';
export const popoverSurface =
  'rounded-[var(--popover-radius,var(--shape-container))] bg-[var(--popover-bg,var(--color-surface-elevated))] text-[var(--popover-fg,var(--color-on-surface))]';
export const menuSurface =
  'rounded-[var(--menu-radius,var(--shape-container))] bg-[var(--menu-bg,var(--color-surface-elevated))] text-[var(--menu-fg,var(--color-on-surface))]';
export const menuItemFg = 'text-[var(--menu-fg,var(--color-on-surface))]';

/** Menu content padding; items use the concentric inner radius (16px − 6px). */
export const menuContent = 'p-1.5';
export const menuItem = [
  'relative flex cursor-default select-none items-center gap-2 rounded-[0.625rem] px-2.5 py-2 text-body-sm text-[var(--color-on-surface)] outline-none',
  // Highlight = the on-surface state layer at hover opacity.
  'focus:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)] data-[highlighted]:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)]',
  'data-[disabled]:pointer-events-none data-[disabled]:text-[var(--color-text-disabled)]',
].join(' ');
export const menuSeparator = '-mx-1.5 my-1.5 h-px bg-[var(--color-outline-variant)]';
export const menuLabel = 'px-2.5 py-1.5 text-label-sm text-[var(--color-on-surface-muted)]';

/** Scrim behind modal overlays. */
export const scrim = 'bg-[color-mix(in_srgb,var(--color-scrim)_40%,transparent)]';

// Calm Depth control styling shared by the core controls
// (DESIGN_REFRESH_PLAN.md §4.2–4.8, §6). Static strings so Tailwind's JIT sees them.

/** Text field chrome: Input wrapper, Textarea, Select trigger. */
export const field = [
  'rounded-shape-field border border-[var(--color-outline)]',
  'bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)]',
  'transition-[border-color,box-shadow] duration-effects-fast ease-effects-fast',
  'hover:border-[var(--color-on-surface-variant)]',
].join(' ');

/** Focus = a 2px primary border (1px border + 1px inset), no offset ring. */
export const fieldFocusWithin =
  'focus-within:border-[var(--color-primary)] focus-within:shadow-[inset_0_0_0_1px_var(--color-primary)] focus-within:hover:border-[var(--color-primary)]';
export const fieldFocusVisible =
  'focus-visible:outline-none focus-visible:border-[var(--color-primary)] focus-visible:shadow-[inset_0_0_0_1px_var(--color-primary)]';

export const fieldInvalid = [
  'border-[var(--color-error)] hover:border-[var(--color-error)]',
  'focus-within:border-[var(--color-error)] focus-within:shadow-[inset_0_0_0_1px_var(--color-error)] focus-within:hover:border-[var(--color-error)]',
  'focus-visible:border-[var(--color-error)] focus-visible:shadow-[inset_0_0_0_1px_var(--color-error)]',
].join(' ');

/** Explicit disabled field (no opacity tricks). */
export const fieldDisabled =
  'cursor-not-allowed border-[var(--color-outline-variant)] hover:border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] text-[var(--color-text-disabled)]';
/** The same, applied by a wrapper when its inner control is :disabled. */
export const fieldDisabledWithin =
  'has-[:disabled]:cursor-not-allowed has-[:disabled]:border-[var(--color-outline-variant)] has-[:disabled]:hover:border-[var(--color-outline-variant)] has-[:disabled]:bg-[var(--color-surface-container-low)] has-[:disabled]:text-[var(--color-text-disabled)]';

/** Pressable control: capsule, state layer (hover/focus/press overlay), press spring. */
export const pressable = 'nx-state-layer nx-press rounded-shape-control select-none';

/** Disabled for controls with a container (filled, tonal, outlined). */
export const disabledContainer =
  'disabled:pointer-events-none disabled:border-transparent disabled:bg-[color-mix(in_srgb,var(--color-on-surface)_12%,transparent)] disabled:text-[var(--color-text-disabled)] aria-disabled:pointer-events-none';
/** Disabled for text-only controls (ghost, link). */
export const disabledText =
  'disabled:pointer-events-none disabled:text-[var(--color-text-disabled)] aria-disabled:pointer-events-none';

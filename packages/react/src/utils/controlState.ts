// 10.4: read-only is its own state: quiet fill and border, text stays readable
// (disabled greys the text out; read-only does not).
/** A wrapper whose inner input is read-only (Input, NumberInput, OTP). */
export const fieldReadOnlyWithin =
  'has-[[readonly]]:border-[var(--color-outline-variant)] has-[[readonly]]:hover:border-[var(--color-outline-variant)] has-[[readonly]]:bg-[var(--color-surface-container-low)]';
/** The field itself: a read-only textarea, a combobox trigger with aria-readonly, or a
 *  plain button trigger with data-readonly (aria-readonly is not allowed on a button). */
export const fieldReadOnly =
  '[&[readonly]]:border-[var(--color-outline-variant)] [&[readonly]]:hover:border-[var(--color-outline-variant)] [&[readonly]]:bg-[var(--color-surface-container-low)] data-[readonly]:cursor-default data-[readonly]:border-[var(--color-outline-variant)] data-[readonly]:hover:border-[var(--color-outline-variant)] data-[readonly]:bg-[var(--color-surface-container-low)] aria-readonly:cursor-default aria-readonly:border-[var(--color-outline-variant)] aria-readonly:hover:border-[var(--color-outline-variant)] aria-readonly:bg-[var(--color-surface-container-low)]';

/** 10.4: invalid look for selection controls (Checkbox, Radio, Switch, cards): an error border. */
export const controlInvalid =
  'aria-invalid:border-[var(--color-error)] aria-invalid:hover:border-[var(--color-error)]';

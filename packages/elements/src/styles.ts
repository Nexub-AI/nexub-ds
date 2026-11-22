/**
 * Shadow styles, built only from the token custom properties `@nexub/react` uses (they inherit
 * into the shadow tree), so `@nexub/themes` with `data-theme` / `data-product` styles the
 * elements unchanged. Sizes are rem or tokens; directions are logical. Motion only under
 * `prefers-reduced-motion: no-preference`; forced colours redraw with system colours.
 */

const ease = 'var(--motion-spring-effects-fast-duration) var(--motion-spring-effects-fast-easing)';
const ring = 'outline: 0.1875rem solid var(--color-ring-default, var(--color-primary)); outline-offset: 0.125rem;';

/** The field: the React Input wrapper (border, 2px primary on focus, invalid, disabled, read-only). */
export const fieldCss = /* css */ `
:host { display: block; font-family: var(--font-family-sans, inherit); color: var(--color-on-surface); }
:host([hidden]) { display: none; }
/* The field draws focus itself; no second ring on the host. */
:host(:focus-within) { outline: none !important; }
* { box-sizing: border-box; }
.field {
  display: flex; align-items: center; gap: 0.5rem; inline-size: 100%;
  block-size: var(--size-control-md, 2.5rem); padding-inline: 0.875rem;
  border: 1px solid var(--field-border, var(--color-outline));
  border-radius: var(--field-radius, var(--shape-field));
  background: var(--field-bg, var(--color-surface-container-lowest));
  color: var(--field-fg, var(--color-on-surface));
  font-size: var(--type-body-md-size, 1rem); line-height: var(--type-body-md-lineHeight, 1.5rem);
}
:host([size='sm']) .field {
  block-size: var(--size-control-sm, 2rem); padding-inline: 0.75rem; gap: 0.375rem;
  font-size: var(--type-body-sm-size, 0.875rem); line-height: var(--type-body-sm-lineHeight, 1.25rem);
}
:host([size='lg']) .field { block-size: var(--size-control-lg, 3rem); padding-inline: 1rem; }
.field:hover { border-color: var(--color-on-surface-variant); }
.field:focus-within, .field:focus-within:hover { border-color: var(--color-primary); box-shadow: inset 0 0 0 1px var(--color-primary); }
.field[data-invalid], .field[data-invalid]:hover { border-color: var(--color-error); }
.field[data-invalid]:focus-within { border-color: var(--color-error); box-shadow: inset 0 0 0 1px var(--color-error); }
.field[data-readonly], .field[data-readonly]:hover { border-color: var(--color-outline-variant); background: var(--color-surface-container-low); }
.field[data-disabled], .field[data-disabled]:hover {
  cursor: not-allowed; border-color: var(--color-outline-variant);
  background: var(--color-surface-container-low); color: var(--color-text-disabled);
}
input {
  flex: 1; min-inline-size: 0; block-size: 100%; margin: 0; padding: 0; border: 0; outline: none;
  background: transparent; color: inherit; font: inherit; font-variant-numeric: tabular-nums;
}
input::placeholder { color: var(--color-on-surface-muted); opacity: 1; }
input:disabled { cursor: not-allowed; color: var(--color-text-disabled); }
@media (prefers-reduced-motion: no-preference) {
  .field { transition: border-color ${ease}, box-shadow ${ease}; }
}
@media (forced-colors: active) {
  .field { border-color: FieldText; }
  .field:focus-within { outline: 0.125rem solid Highlight; outline-offset: 0; }
  .field[data-invalid] { border-style: dashed; }
  .field[data-disabled] { border-color: GrayText; color: GrayText; }
}
`;

/** The date picker: the calendar button, the dialog (a bottom sheet below 48rem) and its grids. */
export const pickerCss = /* css */ `
:host([size='sm']) .field { padding-inline-end: 0.125rem; }
.field { padding-inline-end: 0.25rem; }
:host([size='lg']) .field { padding-inline-end: 0.375rem; }
button {
  position: relative; isolation: isolate; display: inline-flex; align-items: center; justify-content: center;
  margin: 0; padding: 0; border: 1px solid transparent; border-radius: var(--shape-control, 999rem);
  background: transparent; color: inherit; font: inherit; cursor: pointer;
}
/* The state layer (themes' .nx-state-layer): the text colour at the --state-* opacity. */
button::before {
  content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit;
  background: currentColor; opacity: 0; pointer-events: none;
}
button:hover::before { opacity: var(--state-hover, 0.08); }
button:focus-visible::before { opacity: var(--state-focus, 0.1); }
button:active::before { opacity: var(--state-pressed, 0.1); }
button:disabled { cursor: default; pointer-events: none; color: var(--color-text-disabled); }
button:disabled::before { opacity: 0; }
button:focus-visible { ${ring} }
svg { inline-size: 1rem; block-size: 1rem; flex: none; }
.open { flex: none; inline-size: 2rem; block-size: 2rem; border-radius: 999rem; }
:host([size='sm']) .open { inline-size: 1.75rem; block-size: 1.75rem; }
dialog {
  position: fixed; margin: 0; inset: auto;
  inset-block-start: var(--nx-top, 0); inset-inline-start: var(--nx-start, 0);
  inline-size: max-content; max-inline-size: calc(100vw - 1rem); max-block-size: calc(100dvh - 1rem); overflow: auto;
  padding: 0.75rem; border: 0; border-radius: var(--shape-container, 1rem);
  background: var(--color-surface-elevated, var(--color-surface)); color: var(--color-on-surface);
  box-shadow: var(--elevation-2); font-size: var(--type-body-sm-size, 0.875rem);
}
dialog::backdrop { background: transparent; }
.head { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-block-end: 0.5rem; }
.title { font-size: var(--type-label-lg-size, 0.875rem); font-weight: var(--type-label-lg-weight, 600); }
.nav { inline-size: 1.75rem; block-size: 1.75rem; border-radius: 999rem; }
:host(:dir(rtl)) .nav svg { transform: scaleX(-1); }
table { border-collapse: collapse; margin-inline: auto; }
th { block-size: var(--day-cell, 2rem); padding: 0; font-weight: inherit; font-size: var(--type-label-sm-size, 0.75rem); color: var(--color-on-surface-muted); }
td { padding: 0; padding-block-start: 0.25rem; text-align: center; }
.day, .cell { font-variant-numeric: tabular-nums; border-radius: 999rem; }
.day { inline-size: var(--day-cell, 2rem); block-size: var(--day-cell, 2rem); }
.day[data-outside]:not([aria-pressed='true']):not(:disabled) { color: var(--color-on-surface-muted); }
.cells { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.25rem; inline-size: 16.5rem; max-inline-size: 100%; }
.cell { block-size: 2.5rem; }
[aria-current='date'] { border-color: var(--color-primary); }
[aria-pressed='true'], [aria-selected='true'] > button { background: var(--color-primary); color: var(--color-on-primary); }
@media (max-width: 47.99rem) {
  dialog {
    inset-inline: 0; inset-block: auto 0; inline-size: 100%; max-inline-size: none; max-block-size: 85dvh;
    border-start-start-radius: var(--shape-overlay, 1.5rem); border-start-end-radius: var(--shape-overlay, 1.5rem);
    border-end-start-radius: 0; border-end-end-radius: 0;
    padding-block-end: max(0.75rem, env(safe-area-inset-bottom));
  }
  dialog::before {
    content: ''; display: block; inline-size: 2rem; block-size: 0.25rem; margin: 0 auto 0.5rem;
    border-radius: var(--shape-overlay, 1.5rem); background: var(--color-outline-variant);
  }
  dialog::backdrop { background: color-mix(in srgb, var(--color-scrim, CanvasText) 40%, transparent); }
  .cells { inline-size: 100%; }
  .day { inline-size: 2.75rem; block-size: 2.75rem; }
}
@media (prefers-reduced-motion: no-preference) {
  button::before { transition: opacity ${ease}; }
  dialog[open] { animation: nx-pop var(--motion-spring-effects-default-duration) var(--motion-spring-effects-default-easing); }
  @keyframes nx-pop { from { opacity: 0; scale: 0.96; } }
}
@media (forced-colors: active) {
  dialog { outline: 1px solid CanvasText; }
  button:focus-visible { outline-color: Highlight; }
  [aria-current='date'] { border-color: CanvasText; }
  [aria-pressed='true'], [aria-selected='true'] > button { forced-color-adjust: none; background: Highlight; color: HighlightText; }
  button:disabled { color: GrayText; }
}
`;

const sheets = new Map<string, CSSStyleSheet>();

/** One constructable stylesheet per CSS text, shared by every instance (`adoptedStyleSheets`). */
export function sheet(css: string): CSSStyleSheet {
  let s = sheets.get(css);
  if (!s) {
    s = new CSSStyleSheet();
    s.replaceSync(css);
    sheets.set(css, s);
  }
  return s;
}

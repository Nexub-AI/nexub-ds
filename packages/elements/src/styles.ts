/**
 * Shadow styles, built only from the token custom properties `@nexub/react` uses (they inherit
 * into the shadow tree), so `@nexub/themes` with `data-theme` / `data-product` styles the
 * elements unchanged. Sizes are rem or tokens; directions are logical. Motion only under
 * `prefers-reduced-motion: no-preference`; forced colours redraw with system colours.
 */

export const ease = 'var(--motion-spring-effects-fast-duration) var(--motion-spring-effects-fast-easing)';
export const ring = 'outline: 0.1875rem solid var(--color-ring-default, var(--color-primary)); outline-offset: 0.125rem;';

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
/* 11.9: inline-size 100% (not the input's own ~20ch width) so the field's narrowest size is its
   padding and button: at a 20rem viewport (WCAG 1.4.10 reflow) a grid or flex parent no longer overflows. */
input {
  flex: 1; min-inline-size: 0; inline-size: 100%; block-size: 100%; margin: 0; padding: 0; border: 0; outline: none;
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

import { ease } from './styles.js';

/**
 * The list fields (select, combobox, phone): the trigger, the country button, the popup listbox
 * (a bottom sheet below 48rem) and its options, as the React Select content.
 */
export const listCss = /* css */ `
button { margin: 0; padding: 0; border: 0; background: transparent; color: inherit; font: inherit; cursor: pointer; }
button:disabled { cursor: not-allowed; color: var(--color-text-disabled); }
button svg, .option svg { inline-size: 1rem; block-size: 1rem; flex: none; }
.trigger { flex: 1; align-self: stretch; display: flex; align-items: center; gap: 0.5rem; min-inline-size: 0; outline: none; text-align: start; }
/* One line, as the React trigger's line-clamp-1. */
.text { flex: 1; min-inline-size: 0; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; line-clamp: 1; overflow-wrap: anywhere; }
.trigger[data-placeholder] .text { color: var(--color-on-surface-muted); }
.trigger svg, .toggle svg, .country svg { color: var(--color-on-surface-variant); }
.toggle { flex: none; display: inline-flex; align-items: center; justify-content: center; inline-size: 1.75rem; block-size: 1.75rem; margin-inline-end: -0.5rem; border-radius: 999rem; }
.country {
  flex: none; display: inline-flex; align-items: center; gap: 0.25rem; align-self: stretch;
  margin-block: 0.25rem; margin-inline-start: -0.5rem; padding-inline: 0.5rem;
  border-radius: var(--shape-control, 999rem); font-variant-numeric: tabular-nums; outline: none;
}
span.country { color: var(--color-on-surface-variant); }
.country[hidden] { display: none; }
button.country:hover { background: color-mix(in srgb, var(--color-on-surface) 8%, transparent); }
button.country:focus-visible { background: color-mix(in srgb, var(--color-on-surface) 12%, transparent); }
button.country:disabled { background: transparent; }
.popup {
  position: fixed; z-index: var(--z-popover); margin: 0; inset: auto;
  inset-block-start: var(--nx-top, 0); inset-inline-start: var(--nx-start, 0);
  inline-size: max(var(--nx-width, 12rem), 12rem); max-inline-size: calc(100vw - 1rem); max-block-size: min(24rem, calc(100dvh - 1rem));
  display: flex; flex-direction: column; overflow: auto; padding: 0.375rem; border: 0;
  border-radius: var(--shape-container, 1rem); background: var(--color-surface-elevated, var(--color-surface));
  color: var(--color-on-surface); box-shadow: var(--elevation-2);
  font-size: var(--type-body-sm-size, 0.875rem); line-height: var(--type-body-sm-lineHeight, 1.25rem);
}
.popup[hidden] { display: none; }
.status { padding: 0.5rem 0.75rem; color: var(--color-on-surface-muted); }
.status:empty { display: none; }
.heading { padding: 0.5rem 0.5rem 0.25rem; font-size: var(--type-label-sm-size, 0.75rem); font-weight: var(--type-label-lg-weight, 600); color: var(--color-on-surface-muted); }
.option { display: flex; align-items: center; gap: 0.5rem; min-block-size: 2.25rem; padding: 0.375rem 0.5rem; border-radius: 0.625rem; cursor: default; }
.option svg { visibility: hidden; }
.option[aria-selected='true'] svg { visibility: visible; }
.option[data-active] { background: color-mix(in srgb, var(--color-on-surface) 8%, transparent); }
.option[aria-disabled='true'] { color: var(--color-text-disabled); }
.description { display: block; font-size: var(--type-label-sm-size, 0.75rem); color: var(--color-on-surface-muted); }
@media (max-width: 47.99rem) {
  .popup {
    inset-inline: 0; inset-block: auto 0; inline-size: 100%; max-inline-size: none; max-block-size: 50dvh;
    border-start-start-radius: var(--shape-overlay, 1.5rem); border-start-end-radius: var(--shape-overlay, 1.5rem);
    border-end-start-radius: 0; border-end-end-radius: 0;
    padding-block-end: max(0.375rem, env(safe-area-inset-bottom));
  }
  .option { min-block-size: 2.75rem; }
}
@media (prefers-reduced-motion: no-preference) {
  .popup:not([hidden]) { animation: nx-fade var(--motion-spring-effects-default-duration) var(--motion-spring-effects-default-easing); }
  @keyframes nx-fade { from { opacity: 0; } }
  .trigger svg, button.country { transition: rotate ${ease}, background-color ${ease}; }
}
[aria-expanded='true'] > svg { rotate: 180deg; }
@media (forced-colors: active) {
  .popup { outline: 1px solid CanvasText; }
  .option[data-active] { forced-color-adjust: none; background: Highlight; color: HighlightText; }
  .option[aria-disabled='true'], button:disabled { color: GrayText; }
  button.country:focus-visible { outline: 0.125rem solid Highlight; }
}
`;

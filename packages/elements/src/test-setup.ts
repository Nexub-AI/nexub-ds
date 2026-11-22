import '@testing-library/jest-dom/vitest';

/*
 * jsdom 31 has `attachInternals()` (ARIA reflection and `labels` only) but none of the form
 * side of ElementInternals, no `adoptedStyleSheets` and no `<dialog>` methods. This fills in
 * just enough, following the HTML spec, for the elements' own logic to be tested here:
 *
 * - ElementInternals: setFormValue, setValidity (flags, message, anchor), validity,
 *   validationMessage, willValidate, checkValidity (fires `invalid`), reportValidity, form;
 * - FormData(form) includes form-associated custom elements' values;
 * - form.reset() calls formResetCallback; form.checkValidity() / requestSubmit() count them;
 * - ShadowRoot.adoptedStyleSheets stores the sheets;
 * - HTMLDialogElement show / showModal / close (with the `close` event).
 *
 * What this can't show, left to the browser tests (Playwright on demo.html): the real
 * submission and constraint-validation UI, `<label for>` focusing and naming through
 * delegatesFocus, fieldset `disabled` reaching formDisabledCallback, browser state restore,
 * the top layer, positioning and the sheet media query, styles, and forced colours.
 */

type FormState = {
  host: HTMLElement;
  value: FormData | string | File | null;
  flags: ValidityStateFlags;
  message: string;
};

const states = new WeakMap<ElementInternals, FormState>();
const hosts = new Set<HTMLElement>();
const state = (i: ElementInternals): FormState => states.get(i)!;
const internalsOf = new WeakMap<HTMLElement, ElementInternals>();

const attach = HTMLElement.prototype.attachInternals;
HTMLElement.prototype.attachInternals = function (this: HTMLElement) {
  const internals = attach.call(this);
  states.set(internals, { host: this, value: null, flags: {}, message: '' });
  internalsOf.set(this, internals);
  hosts.add(this);
  return internals;
};

const FLAGS = ['valueMissing', 'typeMismatch', 'patternMismatch', 'tooLong', 'tooShort', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput', 'customError'] as const;
const disabledHost = (host: HTMLElement) => host.hasAttribute('disabled') || Boolean(host.closest('fieldset[disabled]'));

const proto = ElementInternals.prototype as unknown as Record<string, unknown>;
Object.assign(proto, {
  setFormValue(this: ElementInternals, value: FormState['value']) {
    state(this).value = value;
  },
  setValidity(this: ElementInternals, flags: ValidityStateFlags = {}, message = '', _anchor?: HTMLElement) {
    const invalid = FLAGS.some((f) => flags[f]);
    if (invalid && !message) throw new TypeError('setValidity: a message is required when a flag is set');
    state(this).flags = { ...flags };
    state(this).message = invalid ? message : '';
  },
  checkValidity(this: ElementInternals) {
    const s = state(this);
    if (!this.willValidate || this.validity.valid) return true;
    s.host.dispatchEvent(new Event('invalid', { cancelable: true }));
    return false;
  },
  reportValidity(this: ElementInternals) {
    return this.checkValidity();
  },
});
Object.defineProperties(proto, {
  validity: {
    get(this: ElementInternals) {
      const flags = state(this).flags;
      const v: Record<string, boolean> = {};
      for (const f of FLAGS) v[f] = Boolean(flags[f]);
      v.valid = !FLAGS.some((f) => v[f]);
      return v;
    },
  },
  validationMessage: {
    get(this: ElementInternals) {
      return this.willValidate ? state(this).message : '';
    },
  },
  willValidate: {
    get(this: ElementInternals) {
      return !disabledHost(state(this).host);
    },
  },
  form: {
    get(this: ElementInternals) {
      return state(this).host.closest('form');
    },
  },
});

/** The form-associated elements of a form, in tree order. */
const faces = (form: HTMLFormElement) => [...hosts].filter((h) => h.isConnected && h.closest('form') === form);

const NativeFormData = globalThis.FormData;
class FaceFormData extends NativeFormData {
  constructor(form?: HTMLFormElement, submitter?: HTMLElement | null) {
    super(form, submitter);
    if (!form) return;
    for (const host of faces(form)) {
      const name = host.getAttribute('name');
      const value = state(internalsOf.get(host)!).value;
      if (!name || disabledHost(host) || value === null) continue;
      if (typeof value === 'string') this.append(name, value);
    }
  }
}
globalThis.FormData = FaceFormData as typeof FormData;
window.FormData = FaceFormData as typeof FormData;

const formProto = HTMLFormElement.prototype;
const reset = formProto.reset;
formProto.reset = function (this: HTMLFormElement) {
  reset.call(this);
  for (const host of faces(this)) (host as HTMLElement & { formResetCallback?: () => void }).formResetCallback?.();
};
const checkValidity = formProto.checkValidity;
formProto.checkValidity = function (this: HTMLFormElement) {
  let valid = checkValidity.call(this);
  for (const host of faces(this)) if (!internalsOf.get(host)!.checkValidity()) valid = false;
  return valid;
};
formProto.reportValidity = formProto.checkValidity;
formProto.requestSubmit = function (this: HTMLFormElement) {
  if (!this.checkValidity()) return;
  this.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
};

const adopted = new WeakMap<ShadowRoot, CSSStyleSheet[]>();
Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
  configurable: true,
  get(this: ShadowRoot) {
    return adopted.get(this) ?? [];
  },
  set(this: ShadowRoot, sheets: CSSStyleSheet[]) {
    adopted.set(this, [...sheets]);
  },
});

const dialogProto = HTMLDialogElement.prototype;
Object.assign(dialogProto, {
  show(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  },
  showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  },
  close(this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  },
});

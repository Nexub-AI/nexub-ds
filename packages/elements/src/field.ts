import { sheet, fieldCss } from './styles.js';
import type { ValidityKind } from './messages.js';

/** `HTMLElement`, or a stand-in where there is none (a server importing the classes), so the import doesn't throw. */
const Base = (typeof HTMLElement === 'undefined' ? class {} : HTMLElement) as typeof HTMLElement;

/** Control sizes, as `@nexub/react`'s `size`. */
export type NxFieldSize = 'sm' | 'md' | 'lg';

/** What a field's current value fails, with the message; `undefined` when valid. */
export type FieldError = { kind: ValidityKind; message: string } | undefined;

/**
 * The form plumbing both elements share: form association through `ElementInternals`
 * (form value, validity, reset, disabled from a fieldset, state restore), the attributes every
 * field has, and naming the inner control from the host's `<label>`.
 *
 * `value` behaves as on a native input: the `value` attribute is the default (`defaultValue`),
 * the `value` property is the current value; `form.reset()` goes back to the attribute.
 *
 * @alpha
 */
export abstract class NxFieldElement extends Base {
  static formAssociated = true;

  /** @internal */
  protected readonly internals: ElementInternals;
  /** @internal */
  protected readonly root: ShadowRoot;
  /** @internal The focusable control: the validation anchor, named from the label. */
  protected abstract readonly control: HTMLInputElement | HTMLButtonElement;
  /** @internal The bordered box around the control. */
  protected readonly box: HTMLDivElement;

  #value = '';
  #dirty = false;
  #formDisabled = false;
  /** Set once the user has edited or the form tried to submit: from then on invalid shows. */
  #touched = false;

  static get observedAttributes(): string[] {
    return ['value', 'required', 'disabled', 'readonly', 'size', 'aria-label', 'invalid'];
  }

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.root.adoptedStyleSheets = [sheet(fieldCss)];
    this.box = document.createElement('div');
    this.box.className = 'field';
    this.box.setAttribute('part', 'field');
    this.root.append(this.box);
    // A failed submit (or checkValidity) shows the invalid state from then on.
    this.addEventListener('invalid', () => {
      this.#touched = true;
      this.render();
    });
  }

  /** @internal Turns any string into a valid value for this field (or `''`). */
  protected abstract sanitize(value: string): string;
  /** @internal What the current value fails, if anything. */
  protected abstract check(): FieldError;
  /** @internal Updates the shadow DOM from the state. */
  protected abstract update(): void;

  connectedCallback(): void {
    if (!this.#dirty) this.#value = this.sanitize(this.initial());
    this.render();
    // Labels later in the document aren't parsed yet: name the control again once they are.
    queueMicrotask(() => this.nameControl());
  }

  attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old === next) return;
    if (name === 'value' && !this.#dirty) this.#value = this.sanitize(next ?? this.initial());
    if (name === 'aria-label') this.nameControl();
    this.render();
  }

  /** The current value: a string, `''` for none. Setting it doesn't fire events. */
  get value(): string {
    return this.#value;
  }
  set value(v: string) {
    this.#dirty = true;
    this.#value = this.sanitize(String(v ?? ''));
    this.render();
  }

  /** The `value` attribute: the value the field starts with and goes back to on `form.reset()`. */
  get defaultValue(): string {
    return this.getAttribute('value') ?? '';
  }
  set defaultValue(v: string) {
    this.setAttribute('value', v);
  }

  get name(): string {
    return this.getAttribute('name') ?? '';
  }
  set name(v: string) {
    this.setAttribute('name', v);
  }
  get required(): boolean {
    return this.hasAttribute('required');
  }
  set required(v: boolean) {
    this.toggleAttribute('required', Boolean(v));
  }
  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(v: boolean) {
    this.toggleAttribute('disabled', Boolean(v));
  }
  get readOnly(): boolean {
    return this.hasAttribute('readonly');
  }
  set readOnly(v: boolean) {
    this.toggleAttribute('readonly', Boolean(v));
  }
  /** Shows the field as invalid (`aria-invalid`, the error border) whatever its validity, as `@nexub/react`'s `invalid`. */
  get invalid(): boolean {
    return this.hasAttribute('invalid');
  }
  set invalid(v: boolean) {
    this.toggleAttribute('invalid', Boolean(v));
  }
  /** `sm`, `md` (default) or `lg`. */
  get size(): NxFieldSize {
    const s = this.getAttribute('size');
    return s === 'sm' || s === 'lg' ? s : 'md';
  }
  set size(v: NxFieldSize) {
    this.setAttribute('size', v);
  }

  get form(): HTMLFormElement | null {
    return this.internals.form;
  }
  get labels(): NodeList {
    return this.internals.labels;
  }
  get validity(): ValidityState {
    return this.internals.validity;
  }
  get validationMessage(): string {
    return this.internals.validationMessage;
  }
  get willValidate(): boolean {
    return this.internals.willValidate;
  }
  checkValidity(): boolean {
    return this.internals.checkValidity();
  }
  reportValidity(): boolean {
    return this.internals.reportValidity();
  }
  /** Focuses the inner field (a `<label for>` click does the same through `delegatesFocus`). */
  override focus(options?: FocusOptions): void {
    this.control.focus(options);
  }
  override blur(): void {
    this.control.blur();
  }

  formResetCallback(): void {
    this.#dirty = false;
    this.#touched = false;
    this.reset();
    this.#value = this.sanitize(this.initial());
    this.render();
  }
  formDisabledCallback(disabled: boolean): void {
    this.#formDisabled = disabled;
    this.render();
  }
  formStateRestoreCallback(state: File | string | FormData | null): void {
    if (typeof state === 'string') this.value = state;
  }

  /** @internal The value the field starts with and resets to: the `value` attribute. */
  protected initial(): string {
    return this.getAttribute('value') ?? '';
  }

  /** @internal A property set on the element before its class was defined goes through the setter. */
  protected upgrade(...names: string[]): void {
    const self = this as unknown as Record<string, unknown>;
    for (const n of names) {
      if (!Object.prototype.hasOwnProperty.call(this, n)) continue;
      const v = self[n];
      delete self[n];
      self[n] = v;
    }
  }

  /** @internal Clears typing state on reset. */
  protected reset(): void {}

  /** @internal Runs `sanitize` again after an attribute it reads changed (the default when untouched). */
  protected resanitize(): void {
    this.#value = this.sanitize(this.#dirty ? this.#value : this.initial());
  }

  /** @internal Disabled by its own attribute or by a disabled fieldset. */
  protected get isDisabled(): boolean {
    return this.disabled || this.#formDisabled;
  }

  /** @internal Sets the value from the user; `true` when it changed. Doesn't render. */
  protected setValue(v: string): boolean {
    const next = this.sanitize(v);
    const changed = next !== this.#value;
    this.#dirty = true;
    this.#value = next;
    return changed;
  }

  /** @internal Marks the field as edited, so an invalid value shows. */
  protected touch(): void {
    this.#touched = true;
  }

  /** @internal Fires `input` / `change` as a native field does (`input` crosses shadow roots). */
  protected emit(type: 'input' | 'change'): void {
    this.dispatchEvent(new Event(type, { bubbles: true, composed: type === 'input' }));
  }

  /** @internal Form value, validity and the shadow DOM, from the state. */
  protected render(): void {
    const error = this.check();
    this.internals.setFormValue(this.#value);
    // Native read-only and disabled fields are barred from constraint validation.
    if (error && !this.readOnly && !this.isDisabled) this.internals.setValidity({ [error.kind]: true }, error.message, this.control);
    else this.internals.setValidity({});
    const showInvalid = (Boolean(error) && this.#touched && !this.readOnly) || this.invalid;
    this.box.toggleAttribute('data-invalid', showInvalid);
    this.box.toggleAttribute('data-disabled', this.isDisabled);
    this.box.toggleAttribute('data-readonly', this.readOnly);
    this.control.disabled = this.isDisabled;
    if ('readOnly' in this.control) this.control.readOnly = this.readOnly;
    else this.control.setAttribute('aria-readonly', String(this.readOnly));
    this.control.setAttribute('aria-required', String(this.required));
    this.control.setAttribute('aria-invalid', String(showInvalid));
    this.update();
  }

  /**
   * @internal The label can't reach into the shadow root, so its text becomes the control's
   * accessible name: the host's `aria-label`, else its `<label>`s.
   */
  protected nameControl(): void {
    const own = this.getAttribute('aria-label');
    let found: Node[] = Array.from((this.internals.labels ?? []) as ArrayLike<Node>);
    if (!found.length) {
      // Engines without ElementInternals.labels: <label for> and a wrapping <label>.
      const rootNode = this.getRootNode() as Document | ShadowRoot;
      const byFor = this.id ? Array.from(rootNode.querySelectorAll<HTMLLabelElement>('label[for]')).filter((l) => l.htmlFor === this.id) : [];
      const wrapping = this.closest('label');
      found = wrapping && !byFor.includes(wrapping) ? [...byFor, wrapping] : byFor;
    }
    const text = own ?? found.map((l) => l.textContent?.trim()).filter(Boolean).join(' ');
    if (text) this.control.setAttribute('aria-label', text);
    else this.control.removeAttribute('aria-label');
  }
}

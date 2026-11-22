import { clampNumber, isNumberDraft, numberKeyTarget, parseNumberDraft, type NumberStep } from '@nexub/core';
import { NxFieldElement, type FieldError } from './field.js';
import { validationMessage } from './messages.js';

const toNumber = (attr: string | null): number | undefined => {
  if (attr === null || attr.trim() === '') return undefined;
  const n = Number(attr);
  return Number.isFinite(n) ? n : undefined;
};

/**
 * `<nx-number-input>`: a form-associated number field with the `@nexub/react` `NumberInput`
 * rules (from `@nexub/core`). It can be empty (`value` is `''`), a half-typed `2.` or `-` stays
 * as typed while focused, and `min` / `max` apply when it loses focus or on a step, never while
 * typing. Arrow Up/Down step, Page Up/Down step ten times, Home/End go to `min`/`max`.
 *
 * Attributes (reflected as properties): `name`, `value` (the default), `min`, `max`, `step`
 * (a number or `any`), `required`, `disabled`, `readonly`, `placeholder`, `size`.
 *
 * Events: `input` on every edit and step, `change` when the value was committed (blur, a step,
 * Enter); `value` is a string, `''` when cleared.
 *
 * @alpha
 */
export class NxNumberInput extends NxFieldElement {
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'min', 'max', 'step', 'placeholder'];
  }

  /** @internal */
  protected readonly control: HTMLInputElement = document.createElement('input');
  /** What is typed while the field has focus; `null` when not editing (the field shows `value`). */
  #draft: string | null = null;
  /** The value when focus came in, to fire `change` once on the way out. */
  #committed = '';

  constructor() {
    super();
    const input = this.control;
    input.type = 'text';
    input.inputMode = 'decimal';
    input.autocomplete = 'off';
    input.setAttribute('role', 'spinbutton');
    input.setAttribute('part', 'input');
    this.box.append(input);
    input.addEventListener('focus', () => {
      this.#draft = this.value;
      this.#committed = this.value;
    });
    input.addEventListener('input', this.#onInput);
    input.addEventListener('blur', this.#onBlur);
    input.addEventListener('keydown', this.#onKeyDown);
  }

  /** Smallest value, applied on blur and steps (a number as a string, `''` for none). */
  get min(): string {
    return this.getAttribute('min') ?? '';
  }
  set min(v: string) {
    this.setAttribute('min', v);
  }
  /** Largest value, applied on blur and steps. */
  get max(): string {
    return this.getAttribute('max') ?? '';
  }
  set max(v: string) {
    this.setAttribute('max', v);
  }
  /** The step for keys: a positive number, or `any` (any decimal; keys move by 1). Default 1. */
  get step(): string {
    return this.getAttribute('step') ?? '';
  }
  set step(v: string) {
    this.setAttribute('step', v);
  }
  get placeholder(): string {
    return this.getAttribute('placeholder') ?? '';
  }
  set placeholder(v: string) {
    this.setAttribute('placeholder', v);
  }
  /** The value as a number, `NaN` when empty. */
  get valueAsNumber(): number {
    return this.value === '' ? NaN : Number(this.value);
  }
  set valueAsNumber(n: number) {
    this.value = Number.isFinite(n) ? String(n) : '';
  }

  get #range() {
    const step = this.getAttribute('step');
    const n = toNumber(step);
    const parsed: NumberStep = step?.trim().toLowerCase() === 'any' ? 'any' : n !== undefined && n > 0 ? n : 1;
    return { min: toNumber(this.getAttribute('min')), max: toNumber(this.getAttribute('max')), step: parsed };
  }

  /** @internal */
  protected sanitize(v: string): string {
    const n = parseNumberDraft(v);
    return n === undefined ? '' : String(n);
  }

  /** @internal */
  protected override reset(): void {
    this.#draft = null;
    this.#committed = this.sanitize(this.getAttribute('value') ?? '');
  }

  /** @internal */
  protected check(): FieldError {
    const { min, max } = this.#range;
    const draft = this.#draft;
    if (draft !== null && draft.trim() !== '' && parseNumberDraft(draft) === undefined)
      return { kind: 'badInput', message: validationMessage('badInput', 'number', '', 'Enter a number.') };
    if (this.value === '')
      return this.required ? { kind: 'valueMissing', message: validationMessage('valueMissing', 'number', '', 'Fill out this field.') } : undefined;
    const n = Number(this.value);
    if (min !== undefined && n < min)
      return { kind: 'rangeUnderflow', message: validationMessage('rangeUnderflow', 'number', String(min), `Value must be ${min} or more.`) };
    if (max !== undefined && n > max)
      return { kind: 'rangeOverflow', message: validationMessage('rangeOverflow', 'number', String(max), `Value must be ${max} or less.`) };
    return undefined;
  }

  /** @internal */
  protected update(): void {
    const input = this.control;
    const { min, max } = this.#range;
    const text = this.#draft ?? this.value;
    if (input.value !== text) input.value = text;
    input.placeholder = this.placeholder;
    const attr = (name: string, v: number | undefined) => (v === undefined ? input.removeAttribute(name) : input.setAttribute(name, String(v)));
    attr('aria-valuenow', this.value === '' ? undefined : Number(this.value));
    attr('aria-valuemin', min);
    attr('aria-valuemax', max);
  }

  #onInput = (e: Event): void => {
    // The inner input's own event stops here; the host fires one when the value changes.
    e.stopPropagation();
    const input = this.control;
    const text = input.value;
    if (!isNumberDraft(text)) {
      // A letter or a second point: keep what was there, caret where it was.
      const keep = this.#draft ?? this.value;
      const caret = Math.max(0, (input.selectionStart ?? keep.length) - (text.length - keep.length));
      input.value = keep;
      input.setSelectionRange?.(caret, caret);
      return;
    }
    this.#draft = text;
    const n = parseNumberDraft(text);
    // Not clamped yet: typing "30" with min 15 must reach the "0".
    const changed = n !== undefined ? this.setValue(String(n)) : text.trim() === '' ? this.setValue('') : false;
    this.render();
    if (changed) this.emit('input');
  };

  /** Blur and Enter: min and max apply, the field shows the value, `change` if it moved. */
  #commit(): void {
    this.#draft = null;
    const { min, max } = this.#range;
    let changed = false;
    if (this.value !== '' && !this.readOnly) changed = this.setValue(String(clampNumber(Number(this.value), min, max)));
    if (this.value !== this.#committed) this.touch();
    this.render();
    if (changed) this.emit('input');
    if (this.value !== this.#committed) {
      this.#committed = this.value;
      this.emit('change');
    }
  }

  #onBlur = (): void => this.#commit();

  #onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.isComposing) {
      // Implicit submission: the inner input has no form of its own.
      this.#commit();
      this.#draft = this.value;
      this.form?.requestSubmit();
      return;
    }
    if (this.readOnly) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
      return;
    }
    if (this.isDisabled) return;
    const current = this.value === '' ? null : Number(this.value);
    const target = numberKeyTarget(e.key, current, this.#range);
    if (target === undefined) return;
    e.preventDefault();
    const changed = this.setValue(String(target));
    if (this.#draft !== null) this.#draft = this.value;
    this.touch();
    this.render();
    if (changed) {
      this.emit('input');
      this.#committed = this.value;
      this.emit('change');
    }
  };
}

/**
 * The NumberInput rules (11.1), shared by `@nexub/react`'s `NumberInput` and `@nexub/elements`'
 * `<nx-number-input>` so the two can't drift:
 *
 * - the field can be empty (`null`, not 0);
 * - a half-typed value (`"2."`, `"-"`, `","`) stays as typed while the field has focus;
 * - `min` and `max` are applied when the field loses focus or on a step, never while typing;
 * - `step` moves the value (arrow keys, Page Up/Down by ten steps, Home/End to min/max);
 *   `step="any"` allows any decimal and steps by 1;
 * - `precision` fixes the number of decimals shown.
 */

/** A step: a positive number, or `'any'` (any decimal; keys and steppers then move by 1). */
export type NumberStep = number | 'any';

/** Digits with an optional sign and one decimal point (`.` or `,`): everything a half-typed number can be. */
const NUMBER_DRAFT = /^[-+]?\d*(?:[.,]\d*)?$/;

/** `true` while `text` can still become a number (`""`, `"-"`, `"2."`, `"1,5"`); a letter or a second point is not. */
export function isNumberDraft(text: string): boolean {
  return NUMBER_DRAFT.test(text);
}

/** The number a draft stands for, or `undefined` while it isn't one yet (`""`, `"-"`, `"."`). A comma reads as a decimal point. */
export function parseNumberDraft(text: string): number | undefined {
  const n = Number(text.trim().replace(',', '.'));
  return text.trim() !== '' && Number.isFinite(n) && /\d/.test(text) ? n : undefined;
}

/** The value as shown in the field: `''` for none, fixed decimals with `precision`, else `String(value)`. */
export function formatNumberValue(value: number | null, precision?: number): string {
  if (value === null) return '';
  if (precision !== undefined) return value.toFixed(precision);
  return String(value);
}

/** `value` inside `min` and `max` (either may be missing). */
export function clampNumber(value: number, min?: number, max?: number): number {
  let result = value;
  if (min !== undefined && result < min) result = min;
  if (max !== undefined && result > max) result = max;
  return result;
}

/** The increment a step stands for: `'any'` steps by 1. */
export function numberStepSize(step: NumberStep = 1): number {
  return step === 'any' ? 1 : step;
}

/**
 * The value after a step of `delta`, inside `min` and `max`. An empty field steps to 0 (or the
 * nearest bound when 0 is outside them) rather than to `delta`.
 */
export function stepNumber(current: number | null, delta: number, min?: number, max?: number): number {
  return clampNumber(current === null ? clampNumber(0, min, max) : current + delta, min, max);
}

export interface NumberKeyOptions {
  min?: number;
  max?: number;
  step?: NumberStep;
}

/**
 * The spinbutton keyboard map: the value a key moves to, or `undefined` when the key isn't a
 * step key. Arrow Up/Down move one step, Page Up/Down ten steps, Home and End go to `min` and
 * `max` (only when set).
 */
export function numberKeyTarget(key: string, current: number | null, { min, max, step }: NumberKeyOptions = {}): number | undefined {
  const size = numberStepSize(step);
  switch (key) {
    case 'ArrowUp':
      return stepNumber(current, size, min, max);
    case 'ArrowDown':
      return stepNumber(current, -size, min, max);
    case 'PageUp':
      return stepNumber(current, size * 10, min, max);
    case 'PageDown':
      return stepNumber(current, -size * 10, min, max);
    case 'Home':
      return min === undefined ? undefined : clampNumber(min, min, max);
    case 'End':
      return max === undefined ? undefined : clampNumber(max, min, max);
    default:
      return undefined;
  }
}

'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { disabledText, type Size } from '../../utils/control.js';
import { inputWrapperVariants } from '../Input/Input.js';

interface NumberInputBaseProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'size' | 'step'> {
  size?: Size;
  /** Applied when the field loses focus (or on a stepper or arrow key), never while typing. */
  min?: number;
  /** Applied when the field loses focus (or on a stepper or arrow key), never while typing. */
  max?: number;
  /** Stepper and arrow-key increment. `'any'` (11.1) allows any decimal; steppers then move by 1. */
  step?: number | 'any';
  precision?: number;
  showSteppers?: boolean;
  invalid?: boolean;
}

/** The default: always a number. A cleared field keeps its last value. */
export interface NumberInputProps extends NumberInputBaseProps {
  nullable?: false;
  value?: number;
  defaultValue?: number;
  /** Called with the new value. */
  onValueChange?: (value: number) => void;
}

/**
 * 11.1: the field can be empty. A cleared field reports `null` (not 0), and a half-typed value
 * (`"2."`, `"-"`) stays as typed while the field has focus. Renders a decimal text input with
 * `role="spinbutton"`, so arrow keys, Page Up/Down, Home and End step the value.
 */
export interface NullableNumberInputProps extends NumberInputBaseProps {
  nullable: true;
  value?: number | null;
  defaultValue?: number | null;
  /** Called with the new value, or `null` when the field is cleared. */
  onValueChange?: (value: number | null) => void;
}

const formatValue = (v: number | null, precision?: number): string => {
  if (v === null) return '';
  if (precision !== undefined) return v.toFixed(precision);
  return String(v);
};

const clampValue = (v: number, min?: number, max?: number): number => {
  let result = v;
  if (min !== undefined && result < min) result = min;
  if (max !== undefined && result > max) result = max;
  return result;
};

/** Digits with an optional sign and one decimal point: everything a half-typed number can be. */
const PARTIAL = /^[-+]?\d*(?:[.,]\d*)?$/;

/** The number a draft stands for, or `undefined` while it isn't one yet (`""`, `"-"`, `"."`). */
const parseDraft = (text: string): number | undefined => {
  const n = Number(text.trim().replace(',', '.'));
  return text.trim() !== '' && Number.isFinite(n) && /\d/.test(text) ? n : undefined;
};

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps | NullableNumberInputProps>(
  (
    {
      className,
      size = 'md',
      min,
      max,
      step = 1,
      precision,
      showSteppers = false,
      value,
      defaultValue,
      onValueChange,
      nullable = false,
      invalid,
      disabled,
      readOnly,
      onKeyDown,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState<number | null>(defaultValue ?? (nullable ? null : 0));
    // What the user is typing, while the field has focus. `null` when not editing: then the
    // field shows the value, formatted.
    const [draft, setDraft] = React.useState<string | null>(null);
    const messages = useNexubMessages();
    const controlled = value !== undefined;
    const currentValue: number | null = controlled ? value : internalValue;
    const stepSize = step === 'any' ? 1 : step;

    const emit = (next: number | null) => {
      if (readOnly) return;
      if (!controlled) setInternalValue(next);
      if (next === null) {
        if (nullable) (onValueChange as ((v: number | null) => void) | undefined)?.(null);
      } else (onValueChange as ((v: number) => void) | undefined)?.(next);
    };

    /** Steppers, arrow keys and blur: the value always lands inside min and max. */
    const commit = (next: number) => {
      const clamped = clampValue(next, min, max);
      emit(clamped);
      if (draft !== null) setDraft(formatValue(clamped, precision));
    };

    const stepBy = (delta: number) => {
      if (readOnly || disabled) return;
      const base = currentValue ?? clampValue(0, min, max);
      commit(currentValue === null ? base : base + delta);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      if (readOnly) return;
      if (nullable) {
        if (!PARTIAL.test(text)) return; // a letter or a second point: keep what was there
        setDraft(text);
        const n = parseDraft(text);
        if (n !== undefined) emit(n);
        else if (text.trim() === '') emit(null);
        return;
      }
      // type="number": the browser reports a half-typed "2." or "-" as "" with badInput. Keep
      // the text the user sees instead of writing "" back over it.
      if (text === '' && e.target.validity?.badInput) return;
      setDraft(text);
      const n = parseDraft(text);
      if (n !== undefined) emit(n); // not clamped yet: typing "30" with min 15 must reach the "0"
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setDraft(null);
      if (currentValue !== null && !readOnly) {
        const clamped = clampValue(currentValue, min, max);
        if (clamped !== currentValue) emit(clamped);
      }
      onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (readOnly && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) e.preventDefault();
      // The text input of `nullable` has no native stepping: do what type="number" does.
      if (nullable && !readOnly && !disabled) {
        const keys: Record<string, () => void> = {
          ArrowUp: () => stepBy(stepSize),
          ArrowDown: () => stepBy(-stepSize),
          PageUp: () => stepBy(stepSize * 10),
          PageDown: () => stepBy(-stepSize * 10),
          ...(min !== undefined ? { Home: () => commit(min) } : {}),
          ...(max !== undefined ? { End: () => commit(max) } : {}),
        };
        const action = keys[e.key];
        if (action) {
          e.preventDefault();
          action();
        }
      }
      onKeyDown?.(e);
    };

    const stepperButtonClass = cn(
      'flex items-center justify-center px-2 self-stretch shrink-0',
      // State layer for hover/press; tabIndex -1, so no focus styling needed.
      'nx-state-layer text-on-surface-muted hover:text-on-surface',
      disabledText,
    );

    const display = draft ?? formatValue(currentValue, precision);

    return (
      <div className={cn(inputWrapperVariants({ size, invalid }), 'pe-0 gap-0 overflow-hidden', className)}>
        <input
          ref={ref}
          {...(nullable
            ? {
                type: 'text',
                inputMode: min !== undefined && min >= 0 && step !== 'any' && Number.isInteger(stepSize) && precision === undefined ? 'numeric' : 'decimal',
                role: 'spinbutton',
                autoComplete: 'off',
                'aria-valuenow': currentValue ?? undefined,
                'aria-valuemin': min,
                'aria-valuemax': max,
              }
            : { type: 'number', min, max, step })}
          value={display}
          onChange={handleChange}
          onFocus={(e) => {
            setDraft(display);
            onFocus?.(e);
          }}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly={readOnly}
          onKeyDown={handleKeyDown}
          aria-invalid={invalid ?? undefined}
          className={cn(
            // Wrapper owns ALL focus styling — strip every indicator from the inner input.
            'flex-1 min-w-0 bg-transparent tabular-nums text-on-surface',
            'border-0 shadow-none',
            'outline-none focus:outline-none focus-visible:outline-none',
            'ring-0 focus:ring-0 focus-visible:ring-0',
            'placeholder:text-on-surface-muted',
            'disabled:cursor-not-allowed disabled:text-[var(--color-text-disabled)]',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            size === 'sm' ? 'text-body-sm' : 'text-body-md',
          )}
          {...props}
        />
        {showSteppers && (
          <div className="flex flex-col border-s border-outline-variant self-stretch">
            <button
              type="button"
              tabIndex={-1}
              onClick={() => stepBy(stepSize)}
              disabled={disabled || readOnly || (max !== undefined && currentValue !== null && currentValue >= max)}
              className={cn(stepperButtonClass, 'border-b border-outline-variant text-label-sm font-normal leading-none flex-1')}
              aria-label={messages.increment}
            >
              ▲
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => stepBy(-stepSize)}
              disabled={disabled || readOnly || (min !== undefined && currentValue !== null && currentValue <= min)}
              className={cn(stepperButtonClass, 'text-label-sm font-normal leading-none flex-1')}
              aria-label={messages.decrement}
            >
              ▼
            </button>
          </div>
        )}
      </div>
    );
  },
);

NumberInput.displayName = 'NumberInput';

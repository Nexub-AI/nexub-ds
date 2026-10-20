import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { disabledText } from '../../utils/control.js';
import { inputWrapperVariants } from '../Input/Input.js';

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  showSteppers?: boolean;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  invalid?: boolean;
}

const formatValue = (v: number, precision?: number): string => {
  if (precision !== undefined) return v.toFixed(precision);
  return String(v);
};

const clampValue = (v: number, min?: number, max?: number): number => {
  let result = v;
  if (min !== undefined && result < min) result = min;
  if (max !== undefined && result > max) result = max;
  return result;
};

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
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
      defaultValue = 0,
      onChange,
      invalid,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState<number>(defaultValue);
    const controlled = value !== undefined;
    const currentValue = controlled ? value : internalValue;

    const commit = (next: number) => {
      const clamped = clampValue(next, min, max);
      if (!controlled) setInternalValue(clamped);
      onChange?.(clamped);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseFloat(e.target.value);
      if (!isNaN(parsed)) commit(parsed);
    };

    const increment = () => commit(currentValue + step);
    const decrement = () => commit(currentValue - step);

    const stepperButtonClass = cn(
      'flex items-center justify-center px-2 self-stretch shrink-0',
      // State layer for hover/press; tabIndex -1, so no focus styling needed.
      'nx-state-layer text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)]',
      disabledText,
    );

    return (
      <div className={cn(inputWrapperVariants({ size, invalid }), 'pr-0 gap-0 overflow-hidden', className)}>
        <input
          ref={ref}
          type="number"
          value={formatValue(currentValue, precision)}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-invalid={invalid ?? undefined}
          className={cn(
            // Wrapper owns ALL focus styling — strip every indicator from the inner input.
            'flex-1 min-w-0 bg-transparent text-[var(--color-on-surface)]',
            'border-0 shadow-none',
            'outline-none focus:outline-none focus-visible:outline-none',
            'ring-0 focus:ring-0 focus-visible:ring-0',
            'placeholder:text-[var(--color-on-surface-muted)]',
            'disabled:cursor-not-allowed disabled:text-[var(--color-text-disabled)]',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            size === 'sm' ? 'text-body-sm' : 'text-body-md',
          )}
          {...props}
        />
        {showSteppers && (
          <div className="flex flex-col border-l border-[var(--color-outline-variant)] self-stretch">
            <button
              type="button"
              tabIndex={-1}
              onClick={increment}
              disabled={disabled || (max !== undefined && currentValue >= max)}
              className={cn(stepperButtonClass, 'border-b border-[var(--color-outline-variant)] text-xs leading-none flex-1')}
              aria-label="Increment"
            >
              ▲
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={decrement}
              disabled={disabled || (min !== undefined && currentValue <= min)}
              className={cn(stepperButtonClass, 'text-xs leading-none flex-1')}
              aria-label="Decrement"
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

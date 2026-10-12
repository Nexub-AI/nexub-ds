import * as React from 'react';
import { cn } from '../../utils/cn.js';
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
      'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
      'hover:bg-[var(--color-bg-subtle)] transition-colors',
      'disabled:opacity-50 disabled:pointer-events-none',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ring-default)]',
    );

    return (
      <div className={cn(inputWrapperVariants({ size, invalid }), 'pr-0 gap-0', className)}>
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
            'flex-1 min-w-0 bg-transparent text-[var(--color-text-primary)]',
            'border-0 shadow-none',
            'outline-none focus:outline-none focus-visible:outline-none',
            'ring-0 focus:ring-0 focus-visible:ring-0',
            'placeholder:text-[var(--color-text-placeholder)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-sm',
          )}
          {...props}
        />
        {showSteppers && (
          <div className="flex flex-col border-l border-[var(--color-border-default)] self-stretch">
            <button
              type="button"
              tabIndex={-1}
              onClick={increment}
              disabled={disabled || (max !== undefined && currentValue >= max)}
              className={cn(stepperButtonClass, 'border-b border-[var(--color-border-default)] text-xs leading-none flex-1')}
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

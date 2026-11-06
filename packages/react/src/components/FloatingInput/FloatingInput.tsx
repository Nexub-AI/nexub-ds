// FloatingInput (4.4): the label sits inside the field and floats up when the
// field has focus or a value. Pure CSS (:placeholder-shown), so it works without
// JavaScript and as a server component; the label stays a real <label>.
import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface FloatingInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  /** Always visible: inside the field when empty, above the value otherwise. */
  label: string;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, id, className, ...props }, ref) => {
    const auto = React.useId();
    const inputId = id ?? auto;
    return (
      <div className={cn('nx-float-field relative', className)}>
        <input
          ref={ref}
          id={inputId}
          placeholder=" "
          className={cn(
            'h-14 w-full rounded-shape-field border border-[var(--color-outline)] bg-[var(--color-surface)] px-4 pt-5 text-body-md text-[var(--color-on-surface)]',
            'outline-none transition-[border-color,box-shadow] focus-visible:border-[var(--color-primary)] focus-visible:shadow-[0_0_0_1px_var(--color-primary)]',
            'aria-[invalid=true]:border-[var(--color-error)] disabled:cursor-not-allowed disabled:border-[var(--color-outline-variant)] disabled:text-[var(--color-text-disabled)]',
          )}
          {...props}
        />
        {/* Position, size and colour come from .nx-float-field in @nexub/themes (sibling selectors). */}
        <label htmlFor={inputId}>{label}</label>
      </div>
    );
  },
);
FloatingInput.displayName = 'FloatingInput';

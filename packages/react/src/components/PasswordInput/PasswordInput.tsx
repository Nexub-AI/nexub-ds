import * as React from 'react';
import { Eye, EyeOff } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { Input, type InputProps } from '../Input/Input.js';

export type PasswordInputProps = Omit<InputProps, 'type' | 'trailingIcon'>;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const toggleButton = (
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className={cn(
          'shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ring-default)] rounded',
        )}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    );

    return (
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        className={className}
        trailingIcon={toggleButton}
        {...props}
      />
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

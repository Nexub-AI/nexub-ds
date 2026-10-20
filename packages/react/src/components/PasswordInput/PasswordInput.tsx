import * as React from 'react';
import { Eye, EyeOff } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Input, type InputProps } from '../Input/Input.js';

export type PasswordInputProps = Omit<InputProps, 'type' | 'trailingIcon'>;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const messages = useNexubMessages();

    const toggleButton = (
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? messages.hidePassword : messages.showPassword}
        className={cn(
          'shrink-0 rounded-full text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] transition-colors',
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

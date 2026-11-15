'use client';

import * as React from 'react';
import { Eye, EyeOff } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Input, type InputProps } from '../Input/Input.js';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'trailingIcon'> {
  /** Whether the password is shown as text. Controlled when set. */
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, visible, defaultVisible = false, onVisibleChange, ...props }, ref) => {
    const [showPassword = false, setShowPassword] = useControllableState({
      value: visible,
      defaultValue: defaultVisible,
      onChange: onVisibleChange,
    });
    const messages = useNexubMessages();

    const autoId = React.useId();
    const inputId = props.id ?? autoId;

    const toggleButton = (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        // One stable name + pressed state (APG toggle button), not a label that flips.
        aria-label={messages.showPassword}
        aria-pressed={showPassword}
        aria-controls={inputId}
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
        id={inputId}
        // Default autofill hint (override with 'new-password' on sign-up).
        autoComplete="current-password"
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={className}
        trailingIcon={toggleButton}
        // Revealed text must not reach cloud spellcheck/autocorrect, so these
        // stay off and can't be overridden.
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

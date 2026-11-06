'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { field, fieldFocusVisible, fieldInvalid } from '../../utils/control.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface OTPInputProps {
  /** Number of characters. Default 6. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called once every box is filled. */
  onComplete?: (value: string) => void;
  /** `numeric` (default) accepts digits only; `alphanumeric` accepts letters too. */
  mode?: 'numeric' | 'alphanumeric';
  disabled?: boolean;
  invalid?: boolean;
  /** Group name; defaults to "Verification code". */
  'aria-label'?: string;
  className?: string;
  /** Submits with a form under this name. */
  name?: string;
}

/**
 * One box per character. Typing moves on, Backspace moves back, paste and
 * the OS's one-time-code suggestion fill every box. The value has no gaps:
 * focusing a box past the end jumps to the first empty one.
 */
export function OTPInput({
  length = 6,
  value: valueProp,
  defaultValue,
  onValueChange,
  onComplete,
  mode = 'numeric',
  disabled,
  invalid,
  'aria-label': ariaLabel,
  className,
  name,
}: OTPInputProps) {
  const t = useNexubMessages();
  const [value = '', setValue] = useControllableState<string>({
    value: valueProp,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  });
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);
  // Length right now: focus moves inside onChange, before the re-render.
  const filled = React.useRef(value.length);
  useIsomorphicLayoutEffect(() => {
    filled.current = value.length;
  });
  const clean = (s: string) => (s.match(mode === 'numeric' ? /\d/g : /[a-z0-9]/gi) ?? []).join('');

  const commit = (next: string) => {
    const v = next.slice(0, length);
    filled.current = v.length;
    setValue(v);
    if (v.length === length) onComplete?.(v);
  };
  const focus = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();
  // Write `chars` from box i on, replacing what was there.
  const writeAt = (i: number, chars: string) => {
    commit(value.slice(0, i) + chars + value.slice(i + chars.length));
    focus(i + chars.length);
  };

  return (
    <div role="group" aria-label={ariaLabel ?? t.verificationCode} className={cn('flex gap-2', className)}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          aria-label={t.codeDigit(i + 1, length)}
          // The first box takes the OS suggestion (the whole code) and spreads it.
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          inputMode={mode === 'numeric' ? 'numeric' : 'text'}
          pattern={mode === 'numeric' ? '[0-9]*' : undefined}
          maxLength={i === 0 ? length : 2}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          value={value[i] ?? ''}
          onFocus={(e) => {
            if (i > filled.current) focus(filled.current);
            else e.target.select();
          }}
          onChange={(e) => {
            // The box may hold its old character plus the new one: keep the new.
            const raw = clean(e.target.value);
            const typed = raw.length === 2 && value[i] && raw.startsWith(value[i]!) ? raw.slice(1) : raw;
            if (typed) writeAt(Math.min(i, value.length), typed);
          }}
          onPaste={(e) => {
            const pasted = clean(e.clipboardData.getData('text'));
            if (!pasted) return;
            e.preventDefault();
            writeAt(Math.min(i, value.length), pasted);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              e.preventDefault();
              if (value[i]) commit(value.slice(0, i) + value.slice(i + 1));
              else if (i > 0) {
                commit(value.slice(0, i - 1) + value.slice(i));
                focus(i - 1);
              }
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
              focus(i - 1);
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              focus(i + 1);
            }
          }}
          className={cn(
            field,
            fieldFocusVisible,
            invalid && fieldInvalid,
            'h-12 w-10 text-center text-title-md tabular-nums',
            'disabled:cursor-not-allowed disabled:border-[var(--color-outline-variant)] disabled:bg-[var(--color-surface-container-low)] disabled:text-[var(--color-text-disabled)]',
          )}
        />
      ))}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}

OTPInput.displayName = 'OTPInput';

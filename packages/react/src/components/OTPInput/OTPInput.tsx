'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { field, fieldFocusVisible, fieldInvalid, fieldReadOnly, type Size } from '../../utils/control.js';
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
  /**
   * `numeric` (default) accepts digits only; `alphanumeric` accepts letters too. 11.2: `backup`
   * is a recovery code: one field of 12 letters and digits (`length` defaults to 12), shown in
   * groups of four (`abcd-efgh-ijkl`); the value has no dashes.
   */
  mode?: 'numeric' | 'alphanumeric' | 'backup';
  /** 11.2: focus the first box (or the backup field) on mount, e.g. on a sign-in step. */
  autoFocus?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  /** Boxes show the value but take no input. */
  readOnly?: boolean;
  /** Box size: `sm` 40px tall, `md` 48px (default), `lg` 56px. */
  size?: Size;
  /** Group name; defaults to "Verification code". */
  'aria-label'?: string;
  className?: string;
  /** Submits with a form under this name. A form `reset` empties it (back to `defaultValue`). */
  name?: string;
}

const group4 = (v: string) => (v.match(/.{1,4}/g) ?? []).join('-');

const slotSize: Record<Size, string> = {
  sm: 'h-10 w-8 text-title-sm',
  md: 'h-[var(--otp-h,3rem)] w-[var(--otp-w,2.5rem)] text-title-md',
  lg: 'h-14 w-12 text-title-lg',
};

/**
 * One box per character. Typing moves on, Backspace moves back, paste and
 * the OS's one-time-code suggestion fill every box. The value has no gaps:
 * focusing a box past the end jumps to the first empty one.
 */
export function OTPInput(props: OTPInputProps) {
  return props.mode === 'backup' ? <BackupCodeInput {...props} /> : <BoxesInput {...props} />;
}

/** Empties an uncontrolled code when its form is reset. */
function useFormReset(ref: React.RefObject<HTMLElement | null>, reset: () => void) {
  const resetRef = React.useRef(reset);
  resetRef.current = reset;
  React.useEffect(() => {
    const form = ref.current?.closest('form');
    if (!form) return;
    const onReset = () => resetRef.current();
    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
  }, [ref]);
}

function BackupCodeInput({
  length = 12,
  value: valueProp,
  defaultValue,
  onValueChange,
  onComplete,
  disabled,
  invalid,
  readOnly,
  size = 'md',
  autoFocus,
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
  const ref = React.useRef<HTMLInputElement>(null);
  useFormReset(ref, () => setValue(defaultValue ?? ''));
  return (
    <>
      <input
        ref={ref}
        aria-label={ariaLabel ?? t.backupCode}
        autoComplete="one-time-code"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        autoFocus={autoFocus}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={invalid || undefined}
        value={group4(value)}
        placeholder={group4('x'.repeat(length))}
        onChange={(e) => {
          if (readOnly) return;
          const v = (e.target.value.match(/[a-z0-9]/gi) ?? []).join('').slice(0, length);
          setValue(v);
          if (v.length === length && v !== value) onComplete?.(v);
        }}
        className={cn(
          field,
          fieldFocusVisible,
          fieldReadOnly,
          invalid && fieldInvalid,
          size === 'sm' ? 'h-control-sm text-body-md' : size === 'lg' ? 'h-control-lg text-title-md' : 'h-control-md text-title-sm',
          'w-full max-w-72 px-3 text-center font-mono tracking-widest placeholder:text-on-surface-muted',
          'disabled:cursor-not-allowed disabled:border-[var(--color-outline-variant)] disabled:bg-[var(--color-surface-container-low)] disabled:text-[var(--color-text-disabled)]',
          className,
        )}
      />
      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
    </>
  );
}

function BoxesInput({
  length = 6,
  value: valueProp,
  defaultValue,
  onValueChange,
  onComplete,
  mode = 'numeric',
  disabled,
  invalid,
  readOnly,
  size = 'md',
  autoFocus,
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
  const groupRef = React.useRef<HTMLDivElement>(null);
  useFormReset(groupRef, () => setValue(defaultValue ?? ''));
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);
  // Length right now: focus moves inside onChange, before the re-render.
  const filled = React.useRef(value.length);
  useIsomorphicLayoutEffect(() => {
    filled.current = value.length;
  });
  const clean = (s: string) => (s.match(mode === 'numeric' ? /\d/g : /[a-z0-9]/gi) ?? []).join('');

  const commit = (next: string) => {
    if (readOnly) return;
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
    <div ref={groupRef} role="group" aria-label={ariaLabel ?? t.verificationCode} className={cn('flex gap-2', className)}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          aria-label={t.codeDigit(i + 1, length)}
          // The first box takes the OS suggestion (the whole code) and spreads it.
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          autoFocus={i === 0 && autoFocus}
          inputMode={mode === 'numeric' ? 'numeric' : 'text'}
          pattern={mode === 'numeric' ? '[0-9]*' : undefined}
          maxLength={i === 0 ? length : 2}
          disabled={disabled}
          readOnly={readOnly}
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
            if (!pasted || readOnly) return;
            e.preventDefault();
            writeAt(Math.min(i, value.length), pasted);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              e.preventDefault();
              if (readOnly) return;
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
            fieldReadOnly,
            invalid && fieldInvalid,
            slotSize[size],
            'text-center tabular-nums',
            'disabled:cursor-not-allowed disabled:border-[var(--color-outline-variant)] disabled:bg-[var(--color-surface-container-low)] disabled:text-[var(--color-text-disabled)]',
          )}
        />
      ))}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}

OTPInput.displayName = 'OTPInput';

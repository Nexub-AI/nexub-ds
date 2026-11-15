'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Input } from '../Input/Input.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface InlineEditProps {
  value: string;
  /**
   * Called with the new text on Enter or blur (only when it changed). Return a
   * promise to keep the field open and busy until it settles; a rejection keeps
   * it open and marks it invalid so the person can retry or press Escape.
   */
  onSave: (value: string) => void | Promise<unknown>;
  /** Names the field: the input's label and "Edit ‹label›" on the button. */
  label: string;
  /** Shown when `value` is empty. */
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Text that turns into an input on click. Enter or blur saves, Escape reverts,
 * and focus returns to the text afterwards.
 */
export function InlineEdit({
  value,
  onSave,
  label,
  placeholder,
  disabled,
  className,
}: InlineEditProps) {
  const t = useNexubMessages();
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const [saving, setSaving] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const returnFocus = React.useRef(false);

  React.useEffect(() => {
    if (!editing && returnFocus.current) {
      returnFocus.current = false;
      buttonRef.current?.focus();
    }
  }, [editing]);

  const close = (refocus: boolean) => {
    returnFocus.current = refocus;
    setFailed(false);
    setEditing(false);
  };

  const save = async (refocus: boolean) => {
    if (saving) return;
    if (draft === value) return close(refocus);
    const result = onSave(draft);
    if (!(result instanceof Promise)) return close(refocus);
    setSaving(true);
    try {
      await result;
      close(refocus);
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <Input
        autoFocus
        aria-label={label}
        value={draft}
        invalid={failed}
        aria-busy={saving || undefined}
        readOnly={saving}
        wrapperClassName={className}
        onChange={(e) => {
          setDraft(e.target.value);
          setFailed(false);
        }}
        onKeyDown={(e) => {
          // Enter confirms and Escape cancels an IME composition first (9.3).
          if ((e.nativeEvent.isComposing || e.keyCode === 229)) return;
          if (e.key === 'Enter') {
            e.preventDefault();
            void save(true);
          } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            close(true);
          }
        }}
        onBlur={() => {
          if (!failed) void save(false);
        }}
      />
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      aria-label={`${t.editField(label)}, ${value || placeholder || ''}`}
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={cn(
        '-mx-2 inline-flex min-h-control-sm max-w-full items-center rounded-shape-control px-2 text-start',
        'text-body-md text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]',
        'disabled:cursor-not-allowed disabled:hover:bg-transparent',
        !value && 'text-[var(--color-on-surface-muted)]',
        className,
      )}
    >
      <span className="truncate">{value || placeholder}</span>
    </button>
  );
}

'use client';

import * as React from 'react';
import { ArrowUp } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { fieldDisabledWithin, fieldFocusWithin } from '../../utils/control.js';
import { glassSurfaceClass } from '../../utils/glass.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { IconButton } from '../IconButton/IconButton.js';

export interface PromptInputMessages {
  promptLabel: string;
  sendMessage: string;
  stopGenerating: string;
  promptHint: string;
}

const fallbackMessages: PromptInputMessages = {
  promptLabel: 'Message',
  sendMessage: 'Send message',
  stopGenerating: 'Stop generating',
  promptHint: 'Press Enter to send, Shift+Enter for a new line',
};

export type PromptInputStatus = 'idle' | 'submitting' | 'streaming';

export interface PromptInputProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'defaultValue' | 'onChange' | 'onSubmit' | 'rows'
  > {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the current text on Enter or Send. Uncontrolled input clears itself after. */
  onSubmit?: (value: string) => void;
  /** Called by Stop (or Escape) while `status="streaming"`. */
  onStop?: () => void;
  /** `streaming` turns Send into Stop; `submitting` holds Send. @default 'idle' */
  status?: PromptInputStatus;
  /** Rows before the field scrolls. @default 8 */
  maxRows?: number;
  /** Rendered above the text, e.g. removable Chips. */
  attachments?: React.ReactNode;
  /** Rendered bottom-start, e.g. an attach IconButton or a model picker. */
  actions?: React.ReactNode;
  surface?: 'solid' | 'glass';
  /** Accessible name of the text field. @default messages.promptLabel ('Message') */
  label?: string;
  /** Local overrides for this component's strings. */
  messages?: Partial<PromptInputMessages>;
  /** Class for the outer container (`className` goes to it too); this one targets the textarea. */
  textareaClassName?: string;
}

const stopIcon = <span aria-hidden="true" className="size-3.5 rounded-shape-min bg-current" />;

export const PromptInput = React.forwardRef<HTMLTextAreaElement, PromptInputProps>(
  (
    {
      value: valueProp,
      defaultValue = '',
      onValueChange,
      onSubmit,
      onStop,
      status = 'idle',
      maxRows = 8,
      attachments,
      actions,
      surface = 'solid',
      label,
      messages: messagesProp,
      className,
      textareaClassName,
      disabled,
      onKeyDown,
      id,
      'aria-describedby': describedBy,
      ...props
    },
    ref,
  ) => {
    const m = {
      ...fallbackMessages,
      ...(useNexubMessages() as unknown as Partial<PromptInputMessages>),
      ...messagesProp,
    };
    const [value = '', setValue] = useControllableState<string>({
      value: valueProp,
      defaultValue,
      onChange: onValueChange,
    });
    const hintId = React.useId();
    const growRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const mergedRef = useMergedRefs(ref, textareaRef);

    // Continuous value → CSS custom property via the CSSOM (strict CSP: no style attribute).
    React.useEffect(() => {
      growRef.current?.style.setProperty('--nx-max-rows', String(maxRows));
    }, [maxRows]);

    const streaming = status === 'streaming';
    const canSubmit = !disabled && status === 'idle' && value.trim() !== '';

    const submit = () => {
      if (!canSubmit) return;
      onSubmit?.(value);
      if (valueProp === undefined) setValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (e.key === 'Enter' && !e.shiftKey) {
        // Enter that confirms an IME composition (CJK input) must not send.
        if (e.nativeEvent.isComposing || e.keyCode === 229) return;
        e.preventDefault();
        submit();
      } else if (e.key === 'Escape' && streaming) {
        e.preventDefault();
        onStop?.();
      }
    };

    // Shared by the mirror and the textarea so both wrap identically.
    const textClass =
      'col-start-1 row-start-1 m-0 px-1 py-1.5 text-body-md max-h-[calc(var(--nx-max-rows,8)*1lh+0.75rem)] whitespace-pre-wrap break-words';

    return (
      <div
        className={cn(
          'flex flex-col gap-2 p-3 rounded-shape-overlay border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)]',
          'transition-[border-color,box-shadow] duration-effects-fast ease-effects-fast',
          fieldFocusWithin,
          fieldDisabledWithin,
          surface === 'glass' && glassSurfaceClass,
          className,
        )}
        data-material={surface === 'glass' ? 'glass' : undefined}
        data-status={status}
      >
        {attachments && <div className="flex flex-wrap gap-2">{attachments}</div>}
        {/* Auto-grow: the mirror and the textarea share one grid cell (see Textarea). */}
        <div ref={growRef} className="grid">
          <span aria-hidden="true" className={cn(textClass, 'invisible overflow-hidden pointer-events-none')}>
            {value + '​'}
          </span>
          <textarea
            ref={mergedRef}
            id={id}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-label={label ?? m.promptLabel}
            aria-describedby={describedBy ? `${hintId} ${describedBy}` : hintId}
            className={cn(
              textClass,
              'w-full resize-none overflow-y-auto bg-transparent border-0 text-inherit',
              'placeholder:text-[var(--color-on-surface-muted)] focus-visible:outline-none disabled:cursor-not-allowed',
              textareaClassName,
            )}
            {...props}
          />
        </div>
        <span id={hintId} hidden>
          {m.promptHint}
        </span>
        <div className="flex items-end gap-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">{actions}</div>
          {streaming ? (
            <IconButton
              type="button"
              label={m.stopGenerating}
              variant="subtle"
              disabled={disabled}
              onClick={onStop}
              className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]"
            >
              {stopIcon}
            </IconButton>
          ) : (
            <IconButton
              type="button"
              label={m.sendMessage}
              variant="solid"
              disabled={disabled}
              aria-disabled={!canSubmit || undefined}
              onClick={submit}
              className="aria-disabled:bg-[color-mix(in_srgb,var(--color-on-surface)_12%,transparent)] aria-disabled:text-[var(--color-text-disabled)]"
            >
              <ArrowUp size="md" />
            </IconButton>
          )}
        </div>
      </div>
    );
  },
);

PromptInput.displayName = 'PromptInput';

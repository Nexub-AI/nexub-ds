'use client';

import * as React from 'react';
import { ArrowUp } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { fieldDisabledWithin, fieldFocusWithin, fieldInvalid } from '../../utils/control.js';
import { glassSurfaceClass } from '../../utils/glass.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { IconButton } from '../IconButton/IconButton.js';
import { Button } from '../Button/Button.js';
import type { CommandListItem } from '../CommandList/CommandList.js';

type CommandsModule = typeof import('./PromptCommands.js');

export interface PromptInputMessages {
  promptLabel: string;
  sendMessage: string;
  stopGenerating: string;
  promptHint: string;
  /** 11.5: the visible hint with `submitOn="mod-enter"`; `mod` is "⌘" or "Ctrl". */
  promptHintModEnter: (mod: string) => string;
  /** 12.2: the accessible name of the `chips` row. */
  promptSuggestions: string;
  /** 12.2: the accessible name of the slash-command list. */
  promptCommands: string;
}

const fallbackMessages: PromptInputMessages = {
  promptLabel: 'Message',
  sendMessage: 'Send message',
  stopGenerating: 'Stop generating',
  promptHint: 'Press Enter to send, Shift+Enter for a new line',
  promptHintModEnter: (mod) => `Press ${mod}+Enter to send, Enter for a new line`,
  promptSuggestions: 'Suggestions',
  promptCommands: 'Commands',
};

/** `/remind tomorrow 9am` → id `remind`, args `tomorrow 9am`; null without a leading slash. */
export function parseSlashCommand(text: string): { id: string; args: string; hasArgs: boolean } | null {
  const m = /^\/(\S*)(\s+)?([\s\S]*)$/.exec(text);
  if (!m) return null;
  return { id: m[1]!, args: (m[3] ?? '').trim(), hasArgs: !!m[2] };
}

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
  /** 11.5: a visible text label on Send (the arrow icon stays). Without it, Send is an icon button. */
  sendLabel?: React.ReactNode;
  /**
   * 11.5: `mod-enter` sends on Cmd/Ctrl+Enter and makes Enter add a line, and shows that hint.
   * @default 'enter'
   */
  submitOn?: 'enter' | 'mod-enter';
  /** 11.5: helper text under the field, linked with `aria-describedby`. */
  hint?: React.ReactNode;
  /** 11.5: an error under the field; marks it invalid. */
  error?: React.ReactNode;
  /**
   * 12.2: slash commands. When the text starts with `/`, a list opens above the field, filtered
   * by what follows the slash (cmdk's scorer, as CommandList). ↑/↓ move, Enter or Tab picks,
   * Esc closes and keeps the text. `shortcut` keys show at the end of a row.
   */
  commands?: CommandListItem[];
  /**
   * 12.2: called when a command is picked, with its `value` and the text after the command's id
   * (`/remind tomorrow 9am` → `('remind', 'tomorrow 9am')`). Uncontrolled input then clears, as
   * after a submit; controlled input leaves that to you. Enter on text with no matching
   * command submits as usual.
   */
  onCommand?: (value: string, args: string) => void;
  /**
   * 12.2: quick replies above the field, e.g. `Button size="sm" variant="tonal"` or Chips. One
   * row that scrolls sideways when narrow (wraps from 480px wide), labelled "Suggestions".
   */
  chips?: React.ReactNode;
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
      sendLabel,
      submitOn = 'enter',
      hint,
      error,
      commands,
      onCommand,
      chips,
      onBlur,
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
    const hintPropId = `${hintId}-hint`;
    const errorId = `${hintId}-error`;
    const modEnter = submitOn === 'mod-enter';
    // "⌘" on Apple devices; decided after mount so the server render matches.
    const [mod, setMod] = React.useState('Ctrl');
    React.useEffect(() => {
      if (modEnter && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) setMod('⌘');
    }, [modEnter]);
    const growRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const mergedRef = useMergedRefs(ref, textareaRef);

    // Continuous value → CSS custom property via the CSSOM (strict CSP: no style attribute).
    React.useEffect(() => {
      growRef.current?.style.setProperty('--nx-max-rows', String(maxRows));
    }, [maxRows]);

    // 12.2 slash commands: the list part loads on the first "/" (apps without commands never load it).
    const slash = commands?.length ? parseSlashCommand(value) : null;
    const [commandsModule, setCommandsModule] = React.useState<CommandsModule | null>(null);
    React.useEffect(() => {
      if (!slash || commandsModule) return;
      let live = true;
      void import('./PromptCommands.js').then((mod) => live && setCommandsModule(mod));
      return () => {
        live = false;
      };
    }, [!!slash, commandsModule]); // eslint-disable-line react-hooks/exhaustive-deps
    // Esc (or blur, or a pick) closes the list for this exact text; typing reopens it.
    const [dismissed, setDismissed] = React.useState<string | null>(null);
    // Any change of text forgets the dismissal (so retyping the same "/" after a pick reopens).
    if (dismissed !== null && dismissed !== value) setDismissed(null);
    // The highlighted command, for the query it was chosen under: a new query starts at the top.
    const [active, setActive] = React.useState<{ query: string; value: string } | null>(null);
    const setActiveValue = (v: string) => setActive({ query: slash?.id ?? '', value: v });
    const activeValue = active && active.query === slash?.id ? active.value : null;
    const commandItems =
      slash && commandsModule && value !== dismissed && !disabled
        ? commandsModule.filterCommands(commands!, slash.id, slash.hasArgs)
        : [];
    const enabledAt = (i: number) => !!commandItems[i] && !commandItems[i]!.disabled;
    let activeIndex = commandItems.findIndex((c) => c.value === activeValue && !c.disabled);
    if (activeIndex < 0) activeIndex = commandItems.findIndex((c) => !c.disabled);
    const listOpen = commandItems.length > 0;
    const listId = `${hintId}-commands`;

    const pickCommand = (item: CommandListItem) => {
      onCommand?.(item.value, slash?.hasArgs ? slash.args : '');
      setDismissed(value);
      if (valueProp === undefined) setValue('');
    };

    const moveActive = (step: 1 | -1) => {
      const n = commandItems.length;
      for (let k = 1; k <= n; k++) {
        const i = (activeIndex + step * k + n) % n;
        if (enabledAt(i)) return setActiveValue(commandItems[i]!.value);
      }
    };

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
      if (listOpen) {
        const composing = e.nativeEvent.isComposing || e.keyCode === 229;
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          moveActive(e.key === 'ArrowDown' ? 1 : -1);
          return;
        }
        if (((e.key === 'Enter' && !e.shiftKey) || (e.key === 'Tab' && !e.shiftKey)) && !composing && activeIndex >= 0) {
          e.preventDefault();
          pickCommand(commandItems[activeIndex]!);
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          setDismissed(value);
          return;
        }
      }
      if (e.key === 'Enter' && !e.shiftKey && (!modEnter || e.metaKey || e.ctrlKey)) {
        // Enter that confirms an IME composition (CJK input) must not send.
        if ((e.nativeEvent.isComposing || e.keyCode === 229)) return;
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

    const invalid = error != null && error !== false;
    const describedByIds = [invalid && errorId, hint && hintPropId, hintId, describedBy].filter(Boolean).join(' ');

    const box = (
      <div
        className={cn(
          'flex flex-col gap-2 p-3 rounded-shape-overlay border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)]',
          'transition-[border-color,box-shadow] duration-effects-fast ease-effects-fast',
          fieldFocusWithin,
          fieldDisabledWithin,
          surface === 'glass' && glassSurfaceClass,
          invalid && fieldInvalid,
          commands && 'relative',
          className,
        )}
        data-material={surface === 'glass' ? 'glass' : undefined}
        data-status={status}
      >
        {listOpen && commandsModule && (
          <commandsModule.CommandListbox
            id={listId}
            label={m.promptCommands}
            items={commandItems}
            active={activeIndex}
            onActive={(i) => setActiveValue(commandItems[i]!.value)}
            onPick={pickCommand}
          />
        )}
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
            onBlur={(e) => {
              onBlur?.(e);
              if (listOpen) setDismissed(value);
            }}
            disabled={disabled}
            aria-label={label ?? m.promptLabel}
            aria-describedby={describedByIds}
            aria-invalid={invalid || undefined}
            {...(listOpen && commandsModule
              ? {
                  role: 'combobox',
                  'aria-expanded': true,
                  'aria-controls': listId,
                  'aria-autocomplete': 'list' as const,
                  'aria-activedescendant':
                    activeIndex >= 0 ? commandsModule.optionId(listId, activeIndex) : undefined,
                }
              : null)}
            className={cn(
              textClass,
              'w-full resize-none overflow-y-auto bg-transparent border-0 text-inherit',
              'placeholder:text-[var(--color-on-surface-muted)] focus-visible:outline-none disabled:cursor-not-allowed',
              textareaClassName,
            )}
            {...props}
          />
        </div>
        {!modEnter && (
          <span id={hintId} hidden>
            {m.promptHint}
          </span>
        )}
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
          ) : sendLabel ? (
            <Button
              type="button"
              size="sm"
              disabled={disabled}
              aria-disabled={!canSubmit || undefined}
              onClick={submit}
              trailingIcon={<ArrowUp size="sm" aria-hidden="true" />}
              className="aria-disabled:bg-[color-mix(in_srgb,var(--color-on-surface)_12%,transparent)] aria-disabled:text-[var(--color-text-disabled)]"
            >
              {sendLabel}
            </Button>
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

    // Without hint, error, the mod-enter hint or chips, the DOM is exactly as before 11.5.
    if (!invalid && !hint && !modEnter && !chips) return box;
    return (
      <div className="flex min-w-0 flex-col gap-1.5">
        {chips && <ChipsRow label={m.promptSuggestions}>{chips}</ChipsRow>}
        {box}
        {invalid && (
          <p id={errorId} className="px-3 text-body-sm text-[var(--color-error)]">
            {error}
          </p>
        )}
        {hint && (
          <p id={hintPropId} className="px-3 text-body-sm text-[var(--color-on-surface-muted)]">
            {hint}
          </p>
        )}
        {modEnter && (
          <p id={hintId} className="px-3 text-label-sm text-[var(--color-on-surface-muted)]">
            {m.promptHintModEnter(mod)}
          </p>
        )}
      </div>
    );
  },
);

PromptInput.displayName = 'PromptInput';

/**
 * 12.2: the quick-reply row. Narrow: one row that scrolls sideways with snap, no scrollbar, and
 * edge fades (nx-scroll-fade) while replies hide past an edge. From 480px wide it wraps.
 */
function ChipsRow({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const row = ref.current;
    if (!row) return;
    const sync = () => {
      // abs(): scrollLeft is negative in RTL.
      const pos = Math.abs(row.scrollLeft);
      const max = row.scrollWidth - row.clientWidth;
      const edges = [pos > 1 && 'start', pos < max - 1 && 'end'].filter(Boolean).join(' ');
      if (edges) row.dataset.nxOverflow = edges;
      else delete row.dataset.nxOverflow;
    };
    sync();
    row.addEventListener('scroll', sync, { passive: true });
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(sync);
    ro?.observe(row);
    return () => {
      row.removeEventListener('scroll', sync);
      ro?.disconnect();
    };
  }, []);
  return (
    <div className="[container-type:inline-size]">
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={cn(
          // p-1 keeps focus rings inside the scroller; -m-1 lines the replies up with the field.
          'nx-scroll-fade -m-1 flex snap-x snap-mandatory scroll-px-1 gap-2 overflow-x-auto p-1',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0 [&>*]:snap-start',
          '[@container(min-width:480px)]:flex-wrap [@container(min-width:480px)]:overflow-x-visible',
        )}
      >
        {children}
      </div>
    </div>
  );
}

'use client';

// The parts EmojiPicker and IconPicker share (11.2): the searchable, keyboard-driven grid panel,
// the field-styled trigger that opens it in a popover (a bottom sheet on phones), and the
// recent-picks store. No data here, so IconPicker doesn't pull in the emoji set.

import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { ChevronDown } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { field, fieldFocusVisible, fieldInvalid, fieldReadOnly, type Size } from '../../utils/control.js';
import { COLLISION_PADDING, type SheetProp } from '../../utils/popper.js';
import { floatingSurface } from '../../utils/surface.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

/* ── Recent picks ─────────────────────────────────────────────────────────── */

const RECENT_MAX = 16;

/** The stored recent picks, newest first; `[]` when storage is unavailable. */
export function readRecent(key: string): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string').slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

/** Puts `value` first in the stored recent picks and returns the new list. */
export function pushRecent(key: string, value: string): string[] {
  const next = [value, ...readRecent(key).filter((v) => v !== value)].slice(0, RECENT_MAX);
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // Private mode or blocked storage: recent picks last until the page closes.
  }
  return next;
}

/** Recent picks from `controlled` when set, else from storage (read after mount, so SSR matches). */
export function useRecent(key: string, controlled: string[] | undefined): [string[], (value: string) => void] {
  const [stored, setStored] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (!controlled) setStored(readRecent(key));
  }, [key, controlled]);
  const add = React.useCallback(
    (value: string) => {
      if (!controlled) setStored(pushRecent(key, value));
    },
    [key, controlled],
  );
  return [controlled ?? stored, add];
}

/* ── Grid panel ───────────────────────────────────────────────────────────── */

export interface PickerItem {
  value: string;
  /** The accessible name and tooltip. */
  label: string;
  content: React.ReactNode;
  /** Lower-case text the search matches (label and keywords). */
  search: string;
}

export interface PickerSection {
  id: string;
  label: string;
  /** Shown on the section's button in the category row. */
  icon?: React.ReactNode;
  items: PickerItem[];
}

export interface PickerGridProps {
  /** Names the listbox. */
  label: string;
  /** `null` while the data loads. */
  sections: PickerSection[] | null;
  value?: string | null;
  onPick: (value: string) => void;
  listId?: string;
  autoFocus?: boolean;
  /** Next to the search box (the skin tone choice). */
  toolbar?: React.ReactNode;
  className?: string;
}

/** Cells per row; `grid-cols-8` below must match. */
const COLS = 8;

const cell =
  'nx-state-layer flex h-9 cursor-default select-none items-center justify-center rounded-shape-control outline-offset-0 aria-selected:bg-secondary-container aria-selected:text-on-secondary-container';

export function PickerGrid({ label, sections, value, onPick, listId, autoFocus, toolbar, className }: PickerGridProps) {
  const messages = useNexubMessages();
  const autoId = React.useId();
  const id = listId ?? `${autoId}list`;
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const shown = React.useMemo<PickerSection[]>(() => {
    if (!sections) return [];
    if (!q) return sections.filter((s) => s.items.length > 0);
    const words = q.split(/\s+/);
    const seen = new Set<string>();
    const items: PickerItem[] = [];
    for (const s of sections) {
      for (const item of s.items) {
        if (!seen.has(item.value) && words.every((w) => item.search.includes(w))) {
          seen.add(item.value);
          items.push(item);
        }
      }
    }
    return items.length ? [{ id: 'results', label: messages.searchResults, items }] : [];
  }, [sections, q, messages.searchResults]);

  // Index of each section's first cell in the flat order.
  const starts: number[] = [];
  let total = 0;
  for (const s of shown) {
    starts.push(total);
    total += s.items.length;
  }
  const current = Math.min(active, Math.max(total - 1, 0));

  React.useEffect(() => setActive(0), [q]);

  const itemAt = (n: number): PickerItem | undefined => {
    for (let s = shown.length - 1; s >= 0; s--) if (n >= starts[s]!) return shown[s]!.items[n - starts[s]!];
    return undefined;
  };

  const focusCell = (n: number, preventScroll = false) => {
    setActive(n);
    listRef.current?.querySelector<HTMLElement>(`[data-i="${n}"]`)?.focus({ preventScroll });
  };

  const onGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let s = 0;
    while (s + 1 < shown.length && current >= starts[s + 1]!) s++;
    const len = shown[s]?.items.length ?? 0;
    const i = current - (starts[s] ?? 0);
    const col = i % COLS;
    const rtl = typeof getComputedStyle === 'function' && getComputedStyle(e.currentTarget).direction === 'rtl';
    let next: number | undefined;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowLeft':
        next = current + ((e.key === 'ArrowRight') !== rtl ? 1 : -1);
        break;
      case 'ArrowDown':
        if (i + COLS < len) next = current + COLS;
        else if (Math.floor(i / COLS) < Math.floor((len - 1) / COLS)) next = starts[s]! + len - 1;
        else if (s + 1 < shown.length) next = starts[s + 1]! + Math.min(col, shown[s + 1]!.items.length - 1);
        break;
      case 'ArrowUp':
        if (i - COLS >= 0) next = current - COLS;
        else if (s > 0) {
          const prevLen = shown[s - 1]!.items.length;
          next = starts[s - 1]! + Math.min(Math.floor((prevLen - 1) / COLS) * COLS + col, prevLen - 1);
        } else {
          e.preventDefault();
          searchRef.current?.focus();
          return;
        }
        break;
      case 'Home':
        next = e.ctrlKey ? 0 : current - col;
        break;
      case 'End':
        next = e.ctrlKey ? total - 1 : Math.min(current - col + COLS - 1, starts[s]! + len - 1);
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const item = itemAt(current);
        if (item) onPick(item.value);
        return;
      }
      default:
        return;
    }
    e.preventDefault();
    if (next !== undefined && next >= 0 && next < total) focusCell(next);
  };

  const jumpTo = (s: number) => {
    const list = listRef.current;
    const group = list?.querySelector<HTMLElement>(`[data-section="${shown[s]!.id}"]`);
    if (list && group) list.scrollTop = group.offsetTop;
    focusCell(starts[s]!, true);
  };

  return (
    <div className={cn('flex w-full flex-col gap-2 p-2', className)}>
      <div className="flex items-center gap-1">
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' && total) {
              e.preventDefault();
              focusCell(current);
            } else if (e.key === 'Enter' && total) {
              e.preventDefault();
              onPick(itemAt(0)!.value);
            }
          }}
          placeholder={messages.searchPlaceholder}
          aria-label={messages.searchPlaceholder}
          aria-controls={total ? id : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          className={cn('h-control-sm min-w-0 flex-1 px-3 text-body-sm placeholder:text-on-surface-muted', field, fieldFocusVisible)}
        />
        {toolbar}
      </div>
      {!q && shown.length > 1 && (
        <div role="group" aria-label={messages.pickerCategories} className="flex gap-0.5 overflow-x-auto">
          {shown.map((s, si) =>
            s.icon ? (
              <button
                key={s.id}
                type="button"
                aria-label={s.label}
                title={s.label}
                onClick={() => jumpTo(si)}
                className="nx-state-layer flex size-8 shrink-0 items-center justify-center rounded-shape-control text-body-md text-on-surface-variant"
              >
                {s.icon}
              </button>
            ) : null,
          )}
        </div>
      )}
      {!sections || !total ? (
        <div role="status" className="py-6 text-center text-body-sm text-on-surface-muted">
          {sections ? messages.noResults : messages.loading}
        </div>
      ) : (
        <div ref={listRef} id={id} role="listbox" aria-label={label} onKeyDown={onGridKeyDown} className="relative -mx-1 max-h-72 overflow-y-auto px-1">
          {shown.map((s, si) => {
            const headingId = `${id}-${s.id}`;
            return (
              <div key={s.id} role="group" aria-labelledby={headingId} data-section={s.id} className="pb-1">
                <div id={headingId} aria-hidden="true" className="px-1 py-1.5 text-label-sm font-medium text-on-surface-muted">
                  {s.label}
                </div>
                <div className="grid grid-cols-8 gap-0.5">
                  {s.items.map((item, ii) => {
                    const n = starts[si]! + ii;
                    return (
                      <div
                        key={item.value}
                        role="option"
                        data-i={n}
                        tabIndex={n === current ? 0 : -1}
                        aria-selected={item.value === value}
                        aria-label={item.label}
                        title={item.label}
                        onClick={() => onPick(item.value)}
                        onFocus={() => setActive(n)}
                        className={cell}
                      >
                        {item.content}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Trigger + popover ────────────────────────────────────────────────────── */

/** Props the EmojiPicker and IconPicker triggers share. */
export interface PickerFieldProps {
  disabled?: boolean;
  /** Shows the value; the panel can't open. Stays focusable. */
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
  /** @default 'md' */
  size?: Size;
  /** @default 'auto' (a bottom sheet below 768px) */
  sheet?: SheetProp;
  /** With `name`, a hidden input carries the value, so a plain `<form>` posts it. */
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-required'?: boolean | 'true' | 'false';
}

interface PickerShellProps extends PickerFieldProps {
  value: string | null;
  /** What the trigger shows: the pick, or the placeholder. */
  display: React.ReactNode;
  /** The trigger's name when neither aria-label nor aria-labelledby is given. */
  fallbackLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The panel; `listId` goes on its listbox for the trigger's aria-controls. */
  children: (listId: string) => React.ReactNode;
}

const triggerSizes: Record<Size, string> = {
  sm: 'h-control-sm px-2.5 gap-1.5 text-body-sm',
  md: 'h-control-md px-3 gap-2 text-body-md',
  lg: 'h-control-lg px-3.5 gap-2 text-body-lg',
};

export const PickerShell = React.forwardRef<HTMLButtonElement, PickerShellProps>(function PickerShell(
  {
    value,
    display,
    fallbackLabel,
    open,
    onOpenChange,
    children,
    disabled,
    readOnly,
    invalid,
    required,
    size = 'md',
    sheet = 'auto',
    name,
    id,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
  },
  ref,
) {
  const listId = React.useId();
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true';
  return (
    <>
      <RadixPopover.Root open={open && !readOnly} onOpenChange={(next) => (readOnly && next ? undefined : onOpenChange(next))}>
        <RadixPopover.Trigger asChild>
          <button
            ref={ref}
            id={id}
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : fallbackLabel)}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-invalid={isInvalid || undefined}
            aria-required={required || ariaRequired || undefined}
            aria-readonly={readOnly || undefined}
            disabled={disabled}
            data-readonly={readOnly ? '' : undefined}
            data-placeholder={value ? undefined : ''}
            onKeyDown={(e) => {
              if (readOnly && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) e.preventDefault();
            }}
            className={cn(
              'inline-flex max-w-full items-center justify-between text-start',
              triggerSizes[size],
              field,
              fieldFocusVisible,
              fieldReadOnly,
              'data-[state=open]:border-primary data-[state=open]:shadow-[inset_0_0_0_1px_var(--color-primary)]',
              'data-[placeholder]:text-on-surface-muted',
              'disabled:cursor-not-allowed disabled:border-outline-variant disabled:bg-surface-container-low disabled:text-[var(--color-text-disabled)]',
              isInvalid && fieldInvalid,
              className,
            )}
          >
            <span className="flex min-w-0 items-center gap-2">{display}</span>
            <ChevronDown size="sm" className="shrink-0 text-on-surface-variant" aria-hidden="true" />
          </button>
        </RadixPopover.Trigger>
        <RadixPopover.Portal>
          <RadixPopover.Content
            align="start"
            sideOffset={4}
            collisionPadding={COLLISION_PADDING}
            data-nx-sheet={sheet || undefined}
            className={cn(
              'z-[var(--z-popover)] w-80 max-w-full overflow-hidden p-0 outline-none',
              floatingSurface,
              'nx-motion nx-pop origin-[var(--radix-popover-content-transform-origin)]',
            )}
          >
            {children(listId)}
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>
      {name && <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />}
    </>
  );
});

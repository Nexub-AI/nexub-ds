'use client';

import * as React from 'react';
import { defaultFilter } from 'cmdk';
import { cn } from '../../utils/cn.js';
import { Kbd } from '../Kbd/Kbd.js';
import type { CommandListItem } from '../CommandList/CommandList.js';

/**
 * 12.2: the slash-command list of PromptInput, loaded on the first "/" so apps without
 * `commands` never load it (or cmdk's scorer).
 *
 * While the id is being typed (`/rem`), items rank with cmdk's scorer (CommandList's), searching
 * the value, label, description and keywords; `/` alone lists them all in order. Once a space
 * follows (`/remind tomorrow`), only the command whose value is exactly that id stays.
 */
export function filterCommands(
  commands: CommandListItem[],
  query: string,
  hasArgs: boolean,
): CommandListItem[] {
  const q = query.toLowerCase();
  if (hasArgs) return commands.filter((c) => !c.disabled && c.value.toLowerCase() === q).slice(0, 1);
  if (!q) return commands;
  return commands
    .map((c, i) => ({
      c,
      i,
      score: defaultFilter(c.value, q, [
        c.label,
        ...(c.description ? [c.description] : []),
        ...(c.keywords ?? []),
      ]),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((r) => r.c);
}

export interface CommandListboxProps {
  id: string;
  label: string;
  items: CommandListItem[];
  /** Index of the active option (aria-activedescendant on the textarea). */
  active: number;
  onActive: (index: number) => void;
  onPick: (item: CommandListItem) => void;
}

export const optionId = (listId: string, index: number) => `${listId}-${index}`;

/** A listbox above the field; focus stays in the textarea, the active option follows ↑/↓. */
export function CommandListbox({ id, label, items, active, onActive, onPick }: CommandListboxProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  // Keep the active option in view, inside the list only (never scroll the page).
  React.useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[id="${optionId(id, active)}"]`);
    if (!list || !el) return;
    const l = list.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.top < l.top) list.scrollTop -= l.top - r.top;
    else if (r.bottom > l.bottom) list.scrollTop += r.bottom - l.bottom;
  }, [id, active]);

  return (
    <div
      ref={listRef}
      id={id}
      role="listbox"
      aria-label={label}
      data-state="open"
      data-side="top"
      className={cn(
        'absolute inset-x-0 bottom-full z-[var(--z-popover)] mb-2 max-h-64 overflow-y-auto p-1.5 shadow-elevation-2',
        // The menu surface (utils/surface menuSurface), inlined to keep this chunk small.
        'rounded-[var(--menu-radius,var(--shape-container))] bg-[var(--menu-bg,var(--color-surface-elevated))] text-[var(--menu-fg,var(--color-on-surface))]',
        'nx-motion nx-pop origin-bottom',
      )}
    >
      {items.map((item, i) => (
        <div
          key={item.value}
          id={optionId(id, i)}
          role="option"
          // Named from its visible text ("/remind Remind me Set a reminder"), so the name holds
          // every word on the row (WCAG 2.5.3); the shortcut keys are hidden from it.
          aria-selected={i === active}
          aria-disabled={item.disabled || undefined}
          data-disabled={item.disabled || undefined}
          // Keep focus (and the caret) in the textarea.
          onMouseDown={(e) => e.preventDefault()}
          onMouseMove={() => !item.disabled && i !== active && onActive(i)}
          onClick={() => !item.disabled && onPick(item)}
          className={cn(
            'relative flex cursor-default select-none items-center gap-2 rounded-[0.625rem] px-2.5 py-2 text-body-sm outline-none',
            'aria-selected:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)]',
            'data-[disabled]:pointer-events-none data-[disabled]:text-[var(--color-text-disabled)]',
          )}
        >
          {item.icon && (
            <span aria-hidden="true" className="flex shrink-0 text-on-surface-variant">
              {item.icon}
            </span>
          )}
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate">
              <span className="text-on-surface-muted">/</span>
              {item.value}
              {item.label !== item.value && (
                <>
                  {' '}
                  <span className="ms-1 text-on-surface-variant">{item.label}</span>
                </>
              )}
            </span>
            {item.description && (
              <>
                {' '}
                <span className="truncate text-label-sm font-normal text-on-surface-muted">{item.description}</span>
              </>
            )}
          </span>
          {item.shortcut?.length ? (
            <span aria-hidden="true" className="flex shrink-0 gap-1">
              {item.shortcut.map((key, k) => (
                <Kbd key={k}>{key}</Kbd>
              ))}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

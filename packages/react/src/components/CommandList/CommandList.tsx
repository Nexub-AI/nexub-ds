'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { Search } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Combobox } from '../Combobox/Combobox.js';
import { Kbd } from '../Kbd/Kbd.js';
import { VIRTUALIZE_ABOVE, useWindowedOptions } from '../Combobox/optionWindow.js';

/** One row in a CommandList. */
export interface CommandListItem {
  value: string;
  label: string;
  /** A second line under the label. Also searched. */
  description?: string;
  /** More text the item is found by. */
  keywords?: string[];
  /** Shown before the label (decorative). */
  icon?: React.ReactNode;
  /** A heading the item is listed under. Groups appear in the order of their first item. */
  group?: string;
  disabled?: boolean;
  /** Keys shown at the end of the row, e.g. `['⌘', 'K']`. Display only. */
  shortcut?: string[];
}

export interface CommandListProps {
  items: CommandListItem[];
  /** Called with the picked item's value (Enter or click). */
  onSelect?: (value: string, item: CommandListItem) => void;
  /** Accessible name of the search box and list. @default messages.search */
  label?: string;
  /** The search box's placeholder. @default messages.searchPlaceholder */
  placeholder?: string;
  /** Shown when the search finds nothing. @default messages.noResults */
  emptyText?: React.ReactNode;
  /** Shows a loading row, sets aria-busy on the list and hides the empty text. */
  loading?: boolean;
  /**
   * Async search: called with the typed text (debounce on your side). While set, the list is
   * not filtered here: show what the server returned in `items`.
   */
  onSearch?: (text: string) => void;
  /** Focus the search box on mount. @default true */
  autoFocus?: boolean;
  /**
   * 12.1: with more items than this, only the rows in view render (search, keys and screen
   * readers still see every item). @default 100
   */
  virtualizeAbove?: number;
  /** The list's maximum height (any CSS length). @default 20rem */
  maxHeight?: string;
  className?: string;
}

/** Items under their group headings, in the order each group first appears. */
function groupItems(items: CommandListItem[]) {
  const groups: { heading?: string; items: CommandListItem[] }[] = [];
  const byHeading = new Map<string | undefined, (typeof groups)[number]>();
  for (const item of items) {
    let group = byHeading.get(item.group);
    if (!group) {
      group = { heading: item.group, items: [] };
      byHeading.set(item.group, group);
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

/**
 * 11.2: the CommandPalette's search box and filtered, grouped list as an inline component with
 * no dialog of its own, for `Dialog.Content`, `Sheet`, `Drawer` or a page. Arrow keys, Home and
 * End move the highlight while focus stays in the search box (aria-activedescendant); Enter picks.
 */
export const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(function CommandList(
  {
    items,
    onSelect,
    label,
    placeholder,
    emptyText,
    loading,
    onSearch,
    autoFocus = true,
    maxHeight,
    virtualizeAbove = VIRTUALIZE_ABOVE,
    className,
  },
  ref,
) {
  const messages = useNexubMessages();
  const [search, setSearch] = React.useState('');

  // 12.1: long lists rank here (cmdk's own scorer) and render only the rows in view.
  const list = useWindowedOptions({
    items,
    threshold: virtualizeAbove,
    search,
    filter: !onSearch,
    text: (item) => ({
      value: item.value,
      keywords: [
        item.label,
        ...(item.description ? [item.description] : []),
        ...(item.keywords ?? []),
      ],
    }),
    valueOf: (item) => item.value,
    groupOf: (item) => item.group,
    disabled: (item) => !!item.disabled,
    loop: true,
    active: !loading,
  });

  const renderItem = (
    item: CommandListItem,
    aria?: { 'aria-setsize': number; 'aria-posinset': number },
  ) => (
    <Combobox.Item
      key={item.value}
      value={item.value}
      keywords={[
        item.label,
        ...(item.description ? [item.description] : []),
        ...(item.keywords ?? []),
      ]}
      disabled={item.disabled}
      onSelect={() => onSelect?.(item.value, item)}
      className="gap-2"
      {...aria}
    >
      {item.icon && (
        <span aria-hidden="true" className="flex shrink-0 text-on-surface-variant">
          {item.icon}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">{item.label}</span>
        {item.description && (
          <span className="truncate text-label-sm font-normal text-on-surface-muted">
            {item.description}
          </span>
        )}
      </span>
      {item.shortcut?.length ? (
        <span aria-hidden="true" className="flex shrink-0 gap-1">
          {item.shortcut.map((key, i) => (
            <Kbd key={i}>{key}</Kbd>
          ))}
        </span>
      ) : null}
    </Combobox.Item>
  );

  return (
    <Combobox.Root
      ref={ref}
      label={label ?? messages.search}
      shouldFilter={!onSearch && !list.windowed}
      loop
      className={cn('bg-transparent', className)}
      {...list.rootProps}
    >
      <div className="flex items-center gap-2 border-b border-outline-variant px-3">
        <Search size="sm" className="shrink-0 opacity-50" aria-hidden="true" />
        <Command.Input
          value={search}
          onValueChange={(text) => {
            setSearch(text);
            onSearch?.(text);
          }}
          onKeyDown={list.onKeyDown}
          placeholder={placeholder ?? messages.searchPlaceholder}
          autoFocus={autoFocus}
          className="flex h-control-lg w-full bg-transparent text-body-md outline-none placeholder:text-on-surface-muted"
        />
      </div>
      <Combobox.List
        ref={list.listRef}
        loading={loading}
        className="max-h-80"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <Combobox.Empty>{emptyText ?? messages.noResults}</Combobox.Empty>
        {list.windowed && !loading && list.render(renderItem)}
        {!list.windowed &&
          groupItems(items).map((group, gi) => {
            const rows = group.items.map((item) => renderItem(item));
            return group.heading ? (
              <Combobox.Group key={group.heading} heading={group.heading}>
                {rows}
              </Combobox.Group>
            ) : (
              <React.Fragment key={`ungrouped-${gi}`}>{rows}</React.Fragment>
            );
          })}
      </Combobox.List>
    </Combobox.Root>
  );
});

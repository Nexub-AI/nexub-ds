'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { useReorder, type ReorderLayout } from './reorder.js';

export interface SortableList<T> {
  /** Matches a `<Sortable list>` inside the group. */
  id: string;
  /** Names the list (its default `aria-label`) and is read when an item moves into it. */
  label: string;
  items: T[];
}

interface ItemOptions<T> {
  /** Stable key. Defaults to `item.id`, else a key kept per object, else the value itself (keep values unique). */
  getId?: (item: T) => string;
  /** Names the item in "Move ‹label›" and the move announcements. */
  getLabel: (item: T) => string;
  /** Locked items show a lock, can't be moved, and keep their index while the others move around them. */
  isLocked?: (item: T) => boolean;
  /** Turns every handle off: nothing moves. */
  disabled?: boolean;
}

export interface SortableGroupProps<T> extends ItemOptions<T> {
  /** The lists, in keyboard order: Alt+ArrowLeft / Alt+ArrowRight move an item to the previous / next one. */
  lists: SortableList<T>[];
  /** Called with every list after a move; store them. */
  onChange: (lists: SortableList<T>[]) => void;
  /** Layout, with a `<Sortable list="…">` for each list. */
  children: React.ReactNode;
}

interface ViewProps<T> {
  /** Inside a `Sortable.Group`: which of its lists this renders (instead of `items` / `onReorder`). */
  list?: string;
  /** `grid` wraps items into cells (cards, images); arrow keys then move by one cell. */
  layout?: ReorderLayout;
  /** `flat` drops the card chrome around items, for dense lists inside a card. */
  variant?: 'default' | 'flat';
  /** The item's content; the drag handle sits before it. */
  children: (item: T) => React.ReactNode;
  'aria-label'?: string;
  className?: string;
}

export interface SortableProps<T> extends ViewProps<T>, Omit<ItemOptions<T>, 'getLabel'> {
  /** The list, in order. Required unless `list` is set. */
  items?: T[];
  /** Called with the reordered items; store them to apply the move. Required unless `list` is set. */
  onReorder?: (items: T[]) => void;
  /** Names the item in "Move ‹label›" and the move announcements. Defaults to `String(item)`: pass it for objects. */
  getLabel?: (item: T) => string;
}

type Reorder = ReturnType<typeof useReorder<unknown>>;
const GroupContext = React.createContext<{ lists: SortableList<unknown>[]; getId: (item: unknown) => string; reorder: Reorder } | null>(
  null,
);

/**
 * Several lists people move items between (drag, or Alt+Arrow on a handle). Owns the data;
 * each `<Sortable list="id">` inside renders one list wherever the layout puts it.
 */
export function SortableGroup<T>({ lists, onChange, getId, getLabel, isLocked, disabled, children }: SortableGroupProps<T>) {
  const auto = React.useRef({ keys: new WeakMap<object, string>(), n: 0 });
  const prefix = React.useId();
  const id =
    getId ??
    ((item: T) => {
      if (item === null || typeof item !== 'object') return String(item);
      const own = (item as { id?: unknown }).id;
      if (typeof own === 'string' || typeof own === 'number') return String(own);
      const { keys } = auto.current;
      let key = keys.get(item);
      if (key === undefined) keys.set(item, (key = `${prefix}${auto.current.n++}`));
      return key;
    });
  const reorder = useReorder({
    lists: lists.map((l) => l.items),
    getId: id,
    getLabel,
    listLabels: lists.map((l) => l.label),
    onMove: (next) => onChange(lists.map((l, i) => ({ ...l, items: next[i]! }))),
    disabled,
    isLocked,
  });
  return (
    <GroupContext.Provider value={{ lists, getId: id, reorder } as React.ContextType<typeof GroupContext>}>
      {children}
      {reorder.live}
    </GroupContext.Provider>
  );
}

// In a grid the drop line stands at the cell's inline edge (core.css draws it across the top).
const gridDrop =
  'data-[nx-drop]:after:inset-y-0! data-[nx-drop]:after:h-auto! data-[nx-drop]:after:w-0.5! data-[nx-drop=before]:after:-start-1.5! data-[nx-drop=before]:after:end-auto! data-[nx-drop=after]:after:-end-1.5! data-[nx-drop=after]:after:start-auto!';

function SortableItems<T>({ list = '', layout = 'list', variant = 'default', children, className, ...aria }: ViewProps<T>) {
  const ctx = React.useContext(GroupContext);
  const c = ctx ? ctx.lists.findIndex((l) => l.id === list) : -1;
  if (!ctx || c < 0) throw new Error(`<Sortable list="${list}"> needs a <Sortable.Group> with that list`);
  const { items, label } = ctx.lists[c] as SortableList<T>;
  const { itemProps, listProps, handle } = ctx.reorder;
  const grid = layout === 'grid';
  return (
    <ul
      aria-label={aria['aria-label'] ?? (label || undefined)}
      {...listProps(c, layout)}
      className={cn(
        'm-0 list-none p-0',
        grid ? 'grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-3' : 'flex flex-col gap-1',
        className,
      )}
    >
      {items.map((item, i) => (
        <li
          key={ctx.getId(item)}
          {...itemProps([c, i])}
          className={cn(
            'flex gap-2 text-body-md',
            grid ? 'items-start p-2' : 'items-center py-1.5 pe-3 ps-1.5',
            variant === 'flat'
              ? 'rounded-shape-control data-[nx-dragging]:bg-[var(--color-surface-container-high)]'
              : 'rounded-shape-control border border-[var(--color-outline-variant)] bg-[var(--color-surface)]',
            variant === 'flat' && !grid && 'py-1 ps-1',
            grid && gridDrop,
          )}
        >
          {handle([c, i])}
          <div className="min-w-0 flex-1">{children(item)}</div>
        </li>
      ))}
    </ul>
  );
}

/**
 * A list people can reorder: drag an item's handle (mouse, pen or touch; Escape
 * cancels), or focus the handle and press Alt+ArrowUp / Alt+ArrowDown (all four arrows
 * in a grid). Each move is announced. Inside a `Sortable.Group`, pass `list` instead of `items`.
 */
export function Sortable<T>(props: SortableProps<T>) {
  const { items = [], onReorder, getId, getLabel = String, isLocked, disabled, ...view } = props;
  if (props.list !== undefined) return <SortableItems {...view} />;
  return (
    <SortableGroup
      lists={[{ id: '', label: '', items }]}
      onChange={(next) => onReorder?.(next[0]!.items)}
      getId={getId}
      getLabel={getLabel}
      isLocked={isLocked}
      disabled={disabled}
    >
      <SortableItems {...view} list="" />
    </SortableGroup>
  );
}
Sortable.Group = SortableGroup;

'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { useReorder } from './reorder.js';

export interface SortableProps<T> {
  items: T[];
  getId: (item: T) => string;
  /** Names the item in "Move ‹label›" and the move announcements. */
  getLabel: (item: T) => string;
  /** Called with the reordered items; store them to apply the move. */
  onReorder: (items: T[]) => void;
  /** The item's content; the drag handle sits before it. */
  children: (item: T) => React.ReactNode;
  'aria-label'?: string;
  className?: string;
}

/**
 * A list people can reorder: drag an item's handle (mouse, pen or touch; Escape
 * cancels), or focus the handle and press Alt+ArrowUp / Alt+ArrowDown. Each move is announced.
 */
export function Sortable<T>({ items, getId, getLabel, onReorder, children, className, ...aria }: SortableProps<T>) {
  const { itemProps, listProps, handle, live } = useReorder({
    lists: [items],
    getId,
    getLabel,
    onMove: (next) => onReorder(next[0]!),
  });
  return (
    <>
      <ul {...aria} {...listProps(0)} className={cn('m-0 flex list-none flex-col gap-1 p-0', className)}>
        {items.map((item, i) => (
          <li
            key={getId(item)}
            {...itemProps([0, i])}
            className="flex items-center gap-2 rounded-shape-control border border-[var(--color-outline-variant)] bg-[var(--color-surface)] py-1.5 pe-3 ps-1.5 text-body-md"
          >
            {handle([0, i])}
            <div className="min-w-0 flex-1">{children(item)}</div>
          </li>
        ))}
      </ul>
      {live}
    </>
  );
}

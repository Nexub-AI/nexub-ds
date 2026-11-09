'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { useReorder } from '../Sortable/reorder.js';

export interface KanbanColumn<T> {
  id: string;
  title: string;
  items: T[];
}

export interface KanbanProps<T> {
  columns: KanbanColumn<T>[];
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  /** Called with the columns after a move; store them to apply it. */
  onChange: (columns: KanbanColumn<T>[]) => void;
  renderCard: (item: T) => React.ReactNode;
  className?: string;
}

/**
 * Columns of cards people can move: drag a card's handle (Escape cancels), or focus it and press
 * Alt+Arrow keys (up/down within a column, left/right across columns).
 */
export function Kanban<T>({ columns, getId, getLabel, onChange, renderCard, className }: KanbanProps<T>) {
  const baseId = React.useId();
  const { itemProps, listProps, handle, live } = useReorder({
    lists: columns.map((c) => c.items),
    getId,
    getLabel,
    listLabels: columns.map((c) => c.title),
    onMove: (next) => onChange(columns.map((c, i) => ({ ...c, items: next[i]! }))),
  });
  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-2', className)}>
      {columns.map((column, c) => {
        const headingId = `${baseId}-${c}`;
        return (
          <section
            key={column.id}
            aria-labelledby={headingId}
            className="flex w-72 shrink-0 flex-col gap-2 rounded-shape-container bg-[var(--color-surface-container-low)] p-3"
          >
            <h3 id={headingId} className="flex items-center justify-between text-title-sm font-semibold text-[var(--color-on-surface)]">
              {column.title}
              <span className="text-label-md font-normal tabular-nums text-[var(--color-on-surface-muted)]">{column.items.length}</span>
            </h3>
            <ul {...listProps(c)} className="m-0 flex min-h-16 list-none flex-col gap-2 p-0">
              {column.items.map((item, i) => (
                <li
                  key={getId(item)}
                  {...itemProps([c, i])}
                  className="flex items-start gap-1 rounded-shape-control bg-[var(--color-surface)] p-2 text-body-md shadow-elevation-1"
                >
                  {handle([c, i])}
                  <div className="min-w-0 flex-1 pt-0.5">{renderCard(item)}</div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {live}
    </div>
  );
}

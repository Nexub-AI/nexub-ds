'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { useReorder } from '../Sortable/reorder.js';
import { Skeleton } from '../Skeleton/Skeleton.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { dataBusy, dataState, type DataStateProps } from '../../utils/dataState.js';

export interface KanbanColumn<T> {
  id: string;
  title: string;
  items: T[];
}

export interface KanbanProps<T> extends DataStateProps {
  columns: KanbanColumn<T>[];
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  /** Called with the columns after a move; store them to apply it. */
  onChange: (columns: KanbanColumn<T>[]) => void;
  renderCard: (item: T) => React.ReactNode;
  /** Shown inside a column that has no cards (while other columns have some). */
  columnEmptyState?: React.ReactNode;
  className?: string;
}

/**
 * Columns of cards people can move: drag a card's handle (Escape cancels), or focus it and press
 * Alt+Arrow keys (up/down within a column, left/right across columns).
 */
export function Kanban<T>({
  columns, getId, getLabel, onChange, renderCard, columnEmptyState, className, loading, emptyState, errorState,
}: KanbanProps<T>) {
  const baseId = React.useId();
  const messages = useNexubMessages();
  const states = { loading, emptyState, errorState };
  const cards = [0, 1, 2].map((i) => <Skeleton key={i} shape="rect" className="h-12 rounded-shape-control" />);
  // The board is empty when no column has a card. Before the columns are known, loading shows three placeholder columns.
  const state = dataState(
    states,
    columns.every((c) => c.items.length === 0),
    columns.length ? null : (
      <div className="flex gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex w-72 shrink-0 flex-col gap-2 rounded-shape-container bg-[var(--color-surface-container-low)] p-3">
            <span className="flex h-[1lh] items-center text-title-sm"><Skeleton className="w-24" /></span>
            {cards}
          </div>
        ))}
      </div>
    ),
    messages.emptyStates.noData.title,
  );
  const busy = dataBusy(states);
  const { itemProps, listProps, handle, live } = useReorder({
    lists: columns.map((c) => c.items),
    getId,
    getLabel,
    listLabels: columns.map((c) => c.title),
    onMove: (next) => onChange(columns.map((c, i) => ({ ...c, items: next[i]! }))),
  });
  if (state != null) {
    return (
      // Focusable while it only holds skeletons, so a keyboard can still scroll it.
      <div aria-busy={busy} tabIndex={busy ? 0 : undefined} className={cn('flex min-h-32 flex-col overflow-x-auto pb-2', className)}>
        {state}
      </div>
    );
  }
  return (
    <div aria-busy={busy} tabIndex={busy ? 0 : undefined} className={cn('flex gap-4 overflow-x-auto pb-2', className)}>
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
              {!busy && <span className="text-label-md font-normal tabular-nums text-[var(--color-on-surface-muted)]">{column.items.length}</span>}
            </h3>
            {busy && <div className="flex flex-col gap-2">{cards}</div>}
            {!busy && column.items.length === 0 && columnEmptyState != null && (
              <div className="text-center text-body-sm text-[var(--color-on-surface-muted)]">{columnEmptyState}</div>
            )}
            {!busy && (
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
            )}
          </section>
        );
      })}
      {live}
    </div>
  );
}

'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { useReorder, type Pos } from '../Sortable/reorder.js';
import { Skeleton } from '../Skeleton/Skeleton.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { dataBusy, dataState, type DataStateProps } from '../../utils/dataState.js';

export interface KanbanColumn<T> {
  id: string;
  title: string;
  items: T[];
}

/** 11.4: a row of the board (a person, a priority); cards are placed in it by `getLane`. */
export interface KanbanLane {
  id: string;
  title: string;
}

/** 11.4: an area outside the columns a card can be dropped on (Archive, Trash). */
export interface KanbanDropTarget<T> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** Called with the card dropped here and the column it came from. The card leaves the board. */
  onDrop: (item: T, from: KanbanPlace) => void;
}

/** 11.4: where a card is: its column, and its lane when the board has lanes. */
export interface KanbanPlace {
  columnId: string;
  laneId?: string;
}

/** 11.4: what `onChange` and `canMove` are told about a move. */
export interface KanbanMove<T> {
  item: T;
  from: KanbanPlace;
  to: KanbanPlace;
}

export type KanbanCardTone = 'default' | 'info' | 'success' | 'warning' | 'danger';

export interface KanbanProps<T> extends DataStateProps {
  columns: KanbanColumn<T>[];
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  /**
   * Called with the columns after a move; store them to apply it. 11.4: the second argument
   * names the card and where it moved (use it to update the card's lane).
   */
  onChange: (columns: KanbanColumn<T>[], move: KanbanMove<T>) => void;
  renderCard: (item: T) => React.ReactNode;
  /** Shown inside a column that has no cards (while other columns have some). */
  columnEmptyState?: React.ReactNode;
  className?: string;
  /** 11.4: cards can't be moved: no drag handles, no keyboard moves. */
  readOnly?: boolean;
  /** 11.4: refuse a move before it lands (a WIP limit, a rule). Return false to block that target. */
  canMove?: (move: KanbanMove<T>) => boolean;
  /** 11.4: areas outside the columns that cards can be dropped on, e.g. Archive. */
  dropTargets?: KanbanDropTarget<T>[];
  /** 11.4: replaces a column's header (title, count, a WIP badge, actions). */
  renderColumnHeader?: (column: KanbanColumn<T>, count: number) => React.ReactNode;
  /** 11.4: a slot at the end of each column, e.g. a quick-add field or button. */
  renderColumnFooter?: (column: KanbanColumn<T>, lane?: KanbanLane) => React.ReactNode;
  /** 11.4: rows of the board. Cards are placed by `getLane`; a card in no lane goes in the first. */
  lanes?: KanbanLane[];
  getLane?: (item: T) => string | undefined;
  /** 11.4: a coloured edge on a card (for priority or status; the card should say it in text too). */
  getTone?: (item: T) => KanbanCardTone | undefined;
  /** 11.4: column width. @default 'md' (18rem) */
  columnWidth?: 'sm' | 'md' | 'lg';
}

const WIDTH = { sm: 'w-60', md: 'w-72', lg: 'w-96' } as const;
const TONE: Record<KanbanCardTone, string> = {
  default: '',
  info: 'border-s-4 border-s-info',
  success: 'border-s-4 border-s-success',
  warning: 'border-s-4 border-s-warning',
  danger: 'border-s-4 border-s-error',
};

/**
 * Columns of cards people can move: drag a card's handle (Escape cancels), or focus it and press
 * Alt+Arrow keys (up/down within a column, left/right across columns).
 */
export function Kanban<T>({
  columns, getId, getLabel, onChange, renderCard, columnEmptyState, className, loading, emptyState, errorState,
  readOnly = false, canMove, dropTargets = [], renderColumnHeader, renderColumnFooter, lanes, getLane, getTone, columnWidth = 'md',
}: KanbanProps<T>) {
  const baseId = React.useId();
  const messages = useNexubMessages();
  const states = { loading, emptyState, errorState };
  const width = WIDTH[columnWidth];
  const cards = [0, 1, 2].map((i) => <Skeleton key={i} shape="rect" className="h-12 rounded-shape-control" />);
  // The board is empty when no column has a card. Before the columns are known, loading shows three placeholder columns.
  const state = dataState(
    states,
    columns.every((c) => c.items.length === 0),
    columns.length ? null : (
      <div className="flex gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn('flex shrink-0 flex-col gap-2 rounded-shape-container bg-[var(--color-surface-container-low)] p-3', width)}>
            <span className="flex h-[1lh] items-center text-title-sm"><Skeleton className="w-24" /></span>
            {cards}
          </div>
        ))}
      </div>
    ),
    messages.emptyStates.noData.title,
  );
  const busy = dataBusy(states);

  // One reorder list per lane × column, then one (always empty) per drop target.
  const laneList = lanes?.length ? lanes : [undefined];
  const n = columns.length;
  const laneIndexOf = (item: T) => {
    if (!lanes?.length) return 0;
    const i = lanes.findIndex((l) => l.id === getLane?.(item));
    return i < 0 ? 0 : i;
  };
  const lists: T[][] = [];
  laneList.forEach((_, l) => columns.forEach((c) => lists.push(c.items.filter((item) => laneIndexOf(item) === l))));
  dropTargets.forEach(() => lists.push([]));
  const gridLists = laneList.length * n;
  const placeOf = (list: number): KanbanPlace => ({ columnId: columns[list % n]!.id, laneId: lanes?.length ? lanes[Math.floor(list / n)]!.id : undefined });

  const { itemProps, listProps, handle, live } = useReorder({
    lists,
    getId,
    getLabel,
    listLabels: [
      ...laneList.flatMap((lane) => columns.map((c) => (lane ? `${lane.title}, ${c.title}` : c.title))),
      ...dropTargets.map((t) => t.label),
    ],
    canMove: canMove
      ? ([fl, fi]: Pos, [tl]: Pos) => tl >= gridLists || canMove({ item: lists[fl]![fi]!, from: placeOf(fl), to: placeOf(tl) })
      : undefined,
    onMove: (next) => {
      // Find the card that moved: the one whose list changed, or the one dropped on a target.
      let moved: { item: T; from: number; to: number } | null = null;
      next.forEach((list, li) =>
        list.forEach((item) => {
          const from = lists.findIndex((l) => l.some((x) => getId(x) === getId(item)));
          if (from !== li && !moved) moved = { item, from, to: li };
        }),
      );
      if (!moved) {
        // A move within one list: the item whose index changed.
        lists.forEach((list, li) =>
          list.forEach((item, i) => {
            if (!moved && getId(next[li]![i] ?? item) !== getId(item)) moved = { item: next[li]![i]!, from: li, to: li };
          }),
        );
      }
      const nextColumns = columns.map((c, ci) => ({
        ...c,
        items: laneList.flatMap((_, l) => next[l * n + ci]!),
      }));
      const m = moved as { item: T; from: number; to: number } | null;
      if (!m) return;
      if (m.to >= gridLists) {
        dropTargets[m.to - gridLists]!.onDrop(m.item, placeOf(m.from));
        onChange(nextColumns, { item: m.item, from: placeOf(m.from), to: placeOf(m.from) });
        return;
      }
      onChange(nextColumns, { item: m.item, from: placeOf(m.from), to: placeOf(m.to) });
    },
  });

  if (state != null) {
    return (
      // Focusable while it only holds skeletons, so a keyboard can still scroll it.
      <div aria-busy={busy} tabIndex={busy ? 0 : undefined} className={cn('flex min-h-32 flex-col overflow-x-auto pb-2', className)}>
        {state}
      </div>
    );
  }

  const renderCards = (list: number) => (
    <ul {...(readOnly ? {} : listProps(list))} className="m-0 flex min-h-16 list-none flex-col gap-2 p-0">
      {lists[list]!.map((item, i) => {
        const tone = getTone?.(item);
        return (
          <li
            key={getId(item)}
            {...(readOnly ? {} : itemProps([list, i]))}
            data-tone={tone && tone !== 'default' ? tone : undefined}
            className={cn('flex items-start gap-1 rounded-shape-control bg-[var(--color-surface)] p-2 text-body-md shadow-elevation-1', tone && TONE[tone])}
          >
            {!readOnly && handle([list, i])}
            <div className="min-w-0 flex-1 pt-0.5">{renderCard(item)}</div>
          </li>
        );
      })}
    </ul>
  );

  const column = (c: number, lane: KanbanLane | undefined, l: number, showHeader: boolean) => {
    const col = columns[c]!;
    const list = l * n + c;
    const headingId = `${baseId}-${l}-${c}`;
    const count = lanes?.length ? lists[list]!.length : col.items.length;
    return (
      <section
        key={col.id}
        aria-labelledby={headingId}
        data-column={col.id}
        className={cn('flex shrink-0 flex-col gap-2 rounded-shape-container bg-[var(--color-surface-container-low)] p-3', width)}
      >
        <h3 id={headingId} className={cn('flex items-center justify-between gap-2 text-title-sm font-semibold text-[var(--color-on-surface)]', !showHeader && 'sr-only')}>
          {renderColumnHeader && showHeader ? (
            renderColumnHeader(col, count)
          ) : (
            <>
              {lane ? <span>{col.title}<span className="sr-only">, {lane.title}</span></span> : col.title}
              {!busy && <span className="text-label-md font-normal tabular-nums text-[var(--color-on-surface-muted)]">{count}</span>}
            </>
          )}
        </h3>
        {busy && <div className="flex flex-col gap-2">{cards}</div>}
        {!busy && lists[list]!.length === 0 && columnEmptyState != null && (
          <div className="text-center text-body-sm text-[var(--color-on-surface-muted)]">{columnEmptyState}</div>
        )}
        {!busy && renderCards(list)}
        {!busy && renderColumnFooter?.(col, lane)}
      </section>
    );
  };

  const targets = dropTargets.length > 0 && !readOnly && !busy && (
    <div className="flex flex-wrap gap-3">
      {dropTargets.map((t, k) => (
        <section
          key={t.id}
          aria-label={t.label}
          data-drop-target={t.id}
          className="flex min-w-48 flex-1 flex-col gap-1 rounded-shape-container border-2 border-dashed border-outline-variant p-3 text-body-sm text-on-surface-variant"
        >
          <span className="flex items-center gap-2 font-medium">
            {t.icon}
            {t.label}
          </span>
          <ul {...listProps(gridLists + k)} className="m-0 flex min-h-10 list-none flex-col gap-2 p-0" />
        </section>
      ))}
    </div>
  );

  if (!lanes?.length) {
    return (
      <div aria-busy={busy} tabIndex={busy ? 0 : undefined} className={cn('flex flex-col gap-3', className)}>
        <div className="flex gap-4 overflow-x-auto pb-2">{columns.map((_, c) => column(c, undefined, 0, true))}</div>
        {targets}
        {live}
      </div>
    );
  }

  // 11.4 swimlanes: one row per lane under a shared row of column titles.
  return (
    <div aria-busy={busy} tabIndex={busy ? 0 : undefined} className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-col gap-4 overflow-x-auto pb-2">
        {lanes.map((lane, l) => (
          <div key={lane.id} role="group" aria-label={lane.title} data-lane={lane.id} className="flex flex-col gap-2">
            <h3 className="text-title-sm font-semibold text-[var(--color-on-surface)]">{lane.title}</h3>
            <div className="flex gap-4">{columns.map((_, c) => column(c, lane, l, true))}</div>
          </div>
        ))}
      </div>
      {targets}
      {live}
    </div>
  );
}

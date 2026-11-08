'use client';

import * as React from 'react';
import { GripVertical } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';

/** Internal: lists of items, moved by drag (native) or Alt+Arrow on a handle. */
export type Pos = [list: number, index: number];

export function moveItem<T>(lists: T[][], [fc, fi]: Pos, [tc, ti]: Pos): T[][] {
  const next = lists.map((l) => [...l]);
  const [item] = next[fc]!.splice(fi, 1);
  if (item === undefined) return lists;
  next[tc]!.splice(Math.min(ti, next[tc]!.length), 0, item);
  return next;
}

interface ReorderOptions<T> {
  lists: T[][];
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  /** List names, for moves across lists. */
  listLabels?: string[];
  onMove: (next: T[][]) => void;
}

/** Shared engine: drag state, keyboard moves, focus after a move, announcements. */
export function useReorder<T>({ lists, getId, getLabel, listLabels, onMove }: ReorderOptions<T>) {
  const t = useNexubMessages();
  const { dir } = useLocale();
  const dragged = React.useRef<Pos | null>(null);
  const handles = React.useRef(new Map<string, HTMLButtonElement>());
  const refocus = React.useRef<string | null>(null);
  const [announcement, setAnnouncement] = React.useState('');
  const hintId = React.useId();

  React.useEffect(() => {
    if (refocus.current) handles.current.get(refocus.current)?.focus();
    refocus.current = null;
  });

  const move = (from: Pos, to: Pos, keepFocus: boolean) => {
    if (from[0] === to[0] && from[1] === to[1]) return;
    const item = lists[from[0]]![from[1]]!;
    const next = moveItem(lists, from, to);
    const [tc] = to;
    const ti = next[tc]!.indexOf(item);
    if (keepFocus) refocus.current = getId(item);
    onMove(next);
    const total = next[tc]!.length;
    setAnnouncement(
      from[0] !== tc && listLabels?.[tc]
        ? t.itemMovedToColumn(getLabel(item), listLabels[tc]!, ti + 1, total)
        : t.itemMoved(getLabel(item), ti + 1, total),
    );
  };

  /** Props for an item's element (drag source and drop target). */
  const itemProps = (pos: Pos) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      dragged.current = pos;
      e.dataTransfer.effectAllowed = 'move';
    },
    onDragOver: (e: React.DragEvent) => {
      if (dragged.current) e.preventDefault();
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (dragged.current) move(dragged.current, pos, false);
      dragged.current = null;
    },
    onDragEnd: () => {
      dragged.current = null;
    },
  });

  /** Props for a list's container: dropping on empty space appends. */
  const listProps = (list: number) => ({
    onDragOver: (e: React.DragEvent) => {
      if (dragged.current) e.preventDefault();
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      if (dragged.current) move(dragged.current, [list, lists[list]!.length], false);
      dragged.current = null;
    },
  });

  /** The grip button for the item at `pos` (a render function, not a component, so focus survives renders). */
  const handle = (pos: Pos, className?: string) => {
    const item = lists[pos[0]]![pos[1]]!;
    const id = getId(item);
    return (
      <button
        type="button"
        ref={(el) => {
          if (el) handles.current.set(id, el);
          else handles.current.delete(id);
        }}
        aria-label={t.moveItem(getLabel(item))}
        aria-describedby={hintId}
        onKeyDown={(e) => {
          if (!e.altKey) return;
          const [c, i] = pos;
          const sideways = lists.length > 1;
          const toNext = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
          const toPrev = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
          let to: Pos | null = null;
          if (e.key === 'ArrowUp' && i > 0) to = [c, i - 1];
          else if (e.key === 'ArrowDown' && i < lists[c]!.length - 1) to = [c, i + 1];
          else if (sideways && e.key === toNext && c < lists.length - 1) to = [c + 1, i];
          else if (sideways && e.key === toPrev && c > 0) to = [c - 1, i];
          if (!to) return;
          e.preventDefault();
          move(pos, to, true);
        }}
        className={cn(
          'inline-flex size-7 shrink-0 cursor-grab items-center justify-center rounded-shape-min text-[var(--color-on-surface-variant)]',
          'hover:bg-[var(--color-surface-container-high)] active:cursor-grabbing',
          className,
        )}
      >
        <GripVertical size="sm" aria-hidden="true" />
      </button>
    );
  };

  const live = (
    <>
      <span id={hintId} hidden>
        {t.reorderHint}
      </span>
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </>
  );

  return { itemProps, listProps, handle, live };
}

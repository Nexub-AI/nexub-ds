'use client';

import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';
import { GripVertical } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';

/** Internal: lists of items, moved by dragging a handle (Pointer Events) or Alt+Arrow on it. */
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

/** Pointer travel (CSS px) before a press on a handle becomes a drag. */
const THRESHOLD = 4;
/** Auto-scroll zone at a scroll container's edges, and the top speed (px per frame) at the very edge. */
const EDGE = 48;
const MAX_SPEED = 16;

/** Where the drop line goes: before/after an item, or inside an empty list. */
type Mark = { id: string; edge: 'before' | 'after' } | { list: number; edge: 'inside' };

interface Drag {
  from: Pos;
  id: string;
  handle: HTMLElement;
  x0: number;
  y0: number;
  x: number;
  y: number;
  active: boolean;
  el?: HTMLElement;
  rect0?: DOMRect;
  tx: number;
  ty: number;
  target: Pos | null;
  mark: Mark | null;
  scrollers: [x: Element | null, y: Element | null];
  raf: number;
  onKey: (e: KeyboardEvent) => void;
}

type ItemProps = {
  'data-nx-reorder-item': '';
  'data-nx-dragging'?: '';
  'data-nx-drop'?: 'before' | 'after';
};

const itemOf = (el: Element) => el.closest<HTMLElement>('[data-nx-reorder-item]');

function scrollParent(el: Element, axis: 'x' | 'y'): Element | null {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const s = getComputedStyle(p);
    const scrolls =
      axis === 'y'
        ? /auto|scroll/.test(s.overflowY) && p.scrollHeight > p.clientHeight
        : /auto|scroll/.test(s.overflowX) && p.scrollWidth > p.clientWidth;
    if (scrolls) return p;
  }
  return document.scrollingElement;
}

/** Signed scroll speed: faster the deeper the pointer sits in an edge zone. */
function edgeSpeed(at: number, start: number, end: number) {
  if (at < start + EDGE) return -MAX_SPEED * Math.min(1, (start + EDGE - at) / EDGE);
  if (at > end - EDGE) return MAX_SPEED * Math.min(1, (at - end + EDGE) / EDGE);
  return 0;
}

const sameMark = (a: Mark | null, b: Mark | null) =>
  a === b || (!!a && !!b && a.edge === b.edge && ('id' in a ? 'id' in b && a.id === b.id : 'list' in b && a.list === b.list));

/** Shared engine: pointer drag, keyboard moves, focus after a move, FLIP settle, announcements. */
export function useReorder<T>({ lists, getId, getLabel, listLabels, onMove }: ReorderOptions<T>) {
  const t = useNexubMessages();
  const { dir } = useLocale();
  const handles = React.useRef(new Map<string, HTMLButtonElement>());
  const listEls = React.useRef(new Map<number, HTMLElement>());
  const refocus = React.useRef<string | null>(null);
  const drag = React.useRef<Drag | null>(null);
  const flipFrom = React.useRef<Map<string, DOMRect> | null>(null);
  const [announcement, setAnnouncement] = React.useState('');
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [mark, setMark] = React.useState<Mark | null>(null);
  const itemCache = React.useRef(new Map<string, ItemProps>());
  const hintId = React.useId();

  React.useEffect(() => {
    if (refocus.current) handles.current.get(refocus.current)?.focus();
    refocus.current = null;
  });

  // FLIP: items that moved slide from their old box to the new one on the spatial spring.
  React.useLayoutEffect(() => {
    const from = flipFrom.current;
    flipFrom.current = null;
    if (!from || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    for (const [id, h] of handles.current) {
      const el = itemOf(h);
      const old = from.get(id);
      if (!el || !old) continue;
      const now = el.getBoundingClientRect();
      const dx = old.left - now.left;
      const dy = old.top - now.top;
      if (!dx && !dy) continue;
      el.style.transition = 'none';
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.getBoundingClientRect(); // commit the inverted position before transitioning back
      el.style.transition =
        'transform var(--motion-spring-spatial-default-duration) var(--motion-spring-spatial-default-easing)';
      el.style.transform = '';
      el.addEventListener('transitionend', () => (el.style.transition = ''), { once: true });
    }
  });

  const snapshot = () => {
    const rects = new Map<string, DOMRect>();
    for (const [id, h] of handles.current) {
      const el = itemOf(h);
      if (el) rects.set(id, el.getBoundingClientRect());
    }
    return rects;
  };

  const move = (from: Pos, to: Pos, keepFocus: boolean) => {
    if (from[0] === to[0] && from[1] === to[1]) return;
    const item = lists[from[0]]![from[1]]!;
    const next = moveItem(lists, from, to);
    const [tc] = to;
    const ti = next[tc]!.indexOf(item);
    if (keepFocus) refocus.current = getId(item);
    flipFrom.current ??= snapshot();
    onMove(next);
    const total = next[tc]!.length;
    setAnnouncement(
      from[0] !== tc && listLabels?.[tc]
        ? t.itemMovedToColumn(getLabel(item), listLabels[tc]!, ti + 1, total)
        : t.itemMoved(getLabel(item), ti + 1, total),
    );
  };

  /** The list under (or nearest to) the pointer, and the index the item would land at. */
  const targetAt = (d: Drag): { to: Pos; mark: Mark | null } => {
    let list = d.from[0];
    if (lists.length > 1) {
      let best = Infinity;
      for (const [l, el] of listEls.current) {
        const r = el.getBoundingClientRect();
        const dist = Math.hypot(Math.max(r.left - d.x, 0, d.x - r.right), Math.max(r.top - d.y, 0, d.y - r.bottom));
        if (dist < best) [best, list] = [dist, l];
      }
    }
    // Index among the list's other items: before the first whose middle is below the pointer.
    const others = lists[list]!.filter((it) => getId(it) !== d.id);
    let k = others.findIndex((it) => {
      const h = handles.current.get(getId(it));
      const r = h && itemOf(h)?.getBoundingClientRect();
      return r && d.y < r.top + r.height / 2;
    });
    if (k < 0) k = others.length;
    const to: Pos = [list, k];
    if (list === d.from[0] && k === d.from[1]) return { to, mark: null };
    const m: Mark =
      k < others.length
        ? { id: getId(others[k]!), edge: 'before' }
        : others.length
          ? { id: getId(others[others.length - 1]!), edge: 'after' }
          : { list, edge: 'inside' };
    return { to, mark: m };
  };

  /** Moves the dragged item under the pointer and recomputes the drop target. */
  const update = (d: Drag) => {
    if (d.el && d.rect0) {
      const r = d.el.getBoundingClientRect();
      // Its layout box moves when a container scrolls; keep it under the pointer anyway.
      d.tx = d.x - d.x0 - (r.left - d.tx - d.rect0.left);
      d.ty = d.y - d.y0 - (r.top - d.ty - d.rect0.top);
      d.el.style.translate = `${d.tx}px ${d.ty}px`;
    }
    const { to, mark: m } = targetAt(d);
    d.target = m ? to : null;
    if (!sameMark(d.mark, m)) setMark((d.mark = m));
  };

  const tick = () => {
    const d = drag.current;
    if (!d?.active) return;
    let scrolled = false;
    d.scrollers.forEach((s, i) => {
      if (!s) return;
      const page = s === document.scrollingElement;
      const r = page ? { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight } : s.getBoundingClientRect();
      const v = i === 0 ? edgeSpeed(d.x, r.left, r.right) : edgeSpeed(d.y, r.top, r.bottom);
      if (!v) return;
      const before = i === 0 ? s.scrollLeft : s.scrollTop;
      if (i === 0) s.scrollLeft += v;
      else s.scrollTop += v;
      scrolled ||= (i === 0 ? s.scrollLeft : s.scrollTop) !== before;
    });
    if (scrolled) update(d);
    d.raf = requestAnimationFrame(tick);
  };

  /** Ends a press or drag; commits the move only when asked and there is a target. */
  const finish = (commit: boolean) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    window.removeEventListener('keydown', d.onKey, true);
    if (!d.active) return;
    cancelAnimationFrame(d.raf);
    flipFrom.current = snapshot(); // includes the dragged item where it was dropped
    if (d.el) d.el.style.translate = '';
    if (commit && d.target) move(d.from, d.target, false);
    setDragging(null);
    setMark(null);
  };

  // Unmounting mid-drag cancels it; the ref holds this render's finish (fresh closures).
  const finishRef = React.useRef(finish);
  useIsomorphicLayoutEffect(() => {
    finishRef.current = finish;
  });
  React.useEffect(() => () => finishRef.current(false), []);

  const begin = (d: Drag) => {
    d.active = true;
    d.el = itemOf(d.handle) ?? d.handle;
    d.rect0 = d.el.getBoundingClientRect();
    d.scrollers = [scrollParent(d.el, 'x'), scrollParent(d.el, 'y')];
    setDragging(d.id);
    d.raf = requestAnimationFrame(tick);
  };

  /**
   * Props for an item's element: marks it for hit-testing, the drop line and the lifted state.
   * The same object comes back while nothing changed for that item, so memoised rows stay memoised.
   */
  const itemProps = (pos: Pos): ItemProps => {
    const id = getId(lists[pos[0]]![pos[1]]!);
    const lifted = dragging === id ? '' : undefined;
    const drop = mark && 'id' in mark && mark.id === id ? mark.edge : undefined;
    const prev = itemCache.current.get(id);
    if (prev && prev['data-nx-dragging'] === lifted && prev['data-nx-drop'] === drop) return prev;
    const next: ItemProps = { 'data-nx-reorder-item': '', 'data-nx-dragging': lifted, 'data-nx-drop': drop };
    itemCache.current.set(id, next);
    return next;
  };

  /** Props for a list's container: lets a drag land in it, even when it is empty. */
  const listProps = (list: number) => ({
    ref: (el: HTMLElement | null) => {
      if (el) listEls.current.set(list, el);
      else listEls.current.delete(list);
    },
    'data-nx-drop': mark && 'list' in mark && mark.list === list ? 'inside' : undefined,
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
        onPointerDown={(e) => {
          if (e.button !== 0 || drag.current) return;
          const { clientX: x, clientY: y } = e;
          const d: Drag = {
            from: pos,
            id,
            handle: e.currentTarget,
            x0: x,
            y0: y,
            x,
            y,
            active: false,
            tx: 0,
            ty: 0,
            target: null,
            mark: null,
            scrollers: [null, null],
            raf: 0,
            onKey: (k) => {
              if (k.key !== 'Escape') return;
              k.preventDefault();
              k.stopPropagation(); // don't also close an enclosing dialog
              finish(false);
            },
          };
          drag.current = d;
          window.addEventListener('keydown', d.onKey, true);
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // Not an active pointer (synthetic events): moves still reach the handle while it is under the pointer.
          }
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || d.id !== id) return;
          d.x = e.clientX;
          d.y = e.clientY;
          if (!d.active) {
            if (Math.hypot(d.x - d.x0, d.y - d.y0) < THRESHOLD) return;
            begin(d);
          }
          update(d);
        }}
        onPointerUp={() => finish(true)}
        onPointerCancel={() => finish(false)}
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
          'inline-flex size-7 shrink-0 cursor-grab touch-none select-none items-center justify-center rounded-shape-min text-[var(--color-on-surface-variant)]',
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

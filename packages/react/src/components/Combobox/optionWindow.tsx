'use client';

import * as React from 'react';
import { defaultFilter } from 'cmdk';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';
import { Combobox } from './Combobox.js';

/** Lists longer than this render only the rows in view (12.1). */
export const VIRTUALIZE_ABOVE = 100;

const OVERSCAN = 8;
/** Before a row has been measured: the md option row (py-2 + one line of body-sm), a group heading. */
const ROW_GUESS = 36;
const HEADING_GUESS = 28;
/** max-h-64 on Combobox.List. */
const VIEWPORT_GUESS = 256;

export interface OptionWindow {
  /** First and one-past-last row to render. */
  start: number;
  end: number;
  /** Spacer heights above and below the rendered rows, in px. */
  before: number;
  after: number;
  /** Put on Combobox.List. */
  listRef: (el: HTMLDivElement | null) => void;
  /** Scrolls the list so row `index` is in view (keyboard moves). */
  scrollToIndex: (index: number) => void;
  /** Back to the top, e.g. when the search changes. */
  reset: () => void;
}

/**
 * 12.1: windowing for the rows of a cmdk list. Only `enabled` lists window; the rest render every
 * row (start 0, end count). Rows are options, or group headings when `isHeading` says so; each
 * kind has one height, measured from the first rendered one. `active` is the active option's
 * cmdk value, for aria-activedescendant.
 */
export function useOptionWindow(
  count: number,
  enabled: boolean,
  active?: string,
  isHeading?: (index: number) => boolean,
): OptionWindow {
  const [scrollTop, setScrollTop] = React.useState(0);
  const [rowHeight, setRowHeight] = React.useState(ROW_GUESS);
  const [headingHeight, setHeadingHeight] = React.useState(HEADING_GUESS);
  const [viewport, setViewport] = React.useState(VIEWPORT_GUESS);
  const list = React.useRef<HTMLDivElement | null>(null);
  // reset() runs during render (when the search changes): the DOM scroll follows in an effect.
  const pendingReset = React.useRef(false);

  const onScroll = React.useCallback(
    (e: Event) => setScrollTop((e.target as HTMLElement).scrollTop),
    [],
  );
  const listRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      list.current?.removeEventListener('scroll', onScroll);
      list.current = el;
      el?.addEventListener('scroll', onScroll, { passive: true });
    },
    [onScroll],
  );

  useIsomorphicLayoutEffect(() => {
    if (pendingReset.current && list.current) list.current.scrollTop = 0;
    pendingReset.current = false;
  });

  // Measure the rows and the viewport once they are on screen (jsdom reports 0: keep the guesses).
  useIsomorphicLayoutEffect(() => {
    if (!enabled || !list.current) return;
    const row = list.current.querySelector<HTMLElement>('[cmdk-item]');
    const heading = list.current.querySelector<HTMLElement>('[cmdk-group-heading]');
    if (row?.offsetHeight) setRowHeight(row.offsetHeight);
    if (heading?.offsetHeight) setHeadingHeight(heading.offsetHeight);
    if (list.current.clientHeight) setViewport(list.current.clientHeight);
  });

  // cmdk fills aria-activedescendant only for a value it picked itself. A windowed list sets the
  // value from outside, so point the input (found by its aria-controls) and the listbox at the
  // active row here, after each render. React leaves the attribute alone: its prop never changes.
  useIsomorphicLayoutEffect(() => {
    const el = list.current;
    if (!enabled || !el?.id) return;
    const row = active
      ? el.querySelector<HTMLElement>(`[cmdk-item][data-value="${CSS.escape(active)}"]`)
      : null;
    for (const target of [el, document.querySelector(`[aria-controls="${CSS.escape(el.id)}"]`)]) {
      if (!target) continue;
      if (row?.id) target.setAttribute('aria-activedescendant', row.id);
      else target.removeAttribute('aria-activedescendant');
    }
  });

  if (!enabled) {
    return {
      start: 0,
      end: count,
      before: 0,
      after: 0,
      listRef,
      scrollToIndex: () => {},
      reset: () => {},
    };
  }
  // Top offset of every row, plus the total at the end.
  const tops = new Array<number>(count + 1);
  tops[0] = 0;
  for (let i = 0; i < count; i++)
    tops[i + 1] = tops[i]! + (isHeading?.(i) ? headingHeight : rowHeight);
  const rowAt = (y: number) => {
    let lo = 0;
    let hi = count;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tops[mid + 1]! <= y) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  const start = Math.max(0, rowAt(scrollTop) - OVERSCAN);
  const end = Math.min(count, rowAt(scrollTop + viewport) + 1 + OVERSCAN);
  return {
    start,
    end,
    before: tops[start]!,
    after: tops[count]! - tops[end]!,
    listRef,
    scrollToIndex: (index) => {
      const el = list.current;
      const top = tops[index]!;
      const bottom = tops[index + 1]!;
      let next = scrollTop;
      if (top < scrollTop) next = top;
      else if (bottom > scrollTop + viewport) next = bottom - viewport;
      if (next === scrollTop) return;
      if (el) el.scrollTop = next;
      setScrollTop(next);
    },
    reset: () => {
      pendingReset.current = true;
      setScrollTop(0);
    },
  };
}

/** cmdk's own fuzzy match and ranking, for lists that filter themselves (shouldFilter={false}). */
export function rankOptions<T>(
  items: readonly T[],
  search: string,
  text: (item: T) => { value: string; keywords?: string[] },
): T[] {
  if (!search.trim()) return [...items];
  return items
    .map((item, i) => {
      const { value, keywords } = text(item);
      return { item, i, score: defaultFilter(value, search, keywords) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((r) => r.item);
}

/** Keys that move the active option of a windowed list. */
const MOVES = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp']);

/**
 * The next active index for a key, skipping disabled rows (and, for a grouped list, headings: pass
 * them as disabled); null when the key is not a move or nothing can be active. PageUp / PageDown
 * move by `page` rows.
 */
export function moveIndex(
  key: string,
  from: number,
  count: number,
  isDisabled: (i: number) => boolean,
  { page = 8, loop = false }: { page?: number; loop?: boolean } = {},
): number | null {
  if (!MOVES.has(key) || count === 0) return null;
  const step = key === 'ArrowUp' || key === 'PageUp' || key === 'End' ? -1 : 1;
  let target =
    key === 'Home'
      ? 0
      : key === 'End'
        ? count - 1
        : key === 'PageDown'
          ? from + page
          : key === 'PageUp'
            ? from - page
            : from + step;
  // `loop` (cmdk's prop): arrows step around the list, past the ends, to the next enabled row.
  if (loop && (key === 'ArrowDown' || key === 'ArrowUp')) {
    for (let k = 1; k <= count; k++) {
      const i = (((from + step * k) % count) + count) % count;
      if (!isDisabled(i)) return i;
    }
    return null;
  }
  target = Math.max(0, Math.min(count - 1, target));
  // From the target, look in the direction of travel for an enabled row, then the other way.
  for (const dir of [step, -step]) {
    for (let i = target; i >= 0 && i < count; i += dir) if (!isDisabled(i)) return i;
  }
  return null;
}

/** A spacer for the rows above or below the window. CSSOM, not a style attribute: strict CSP pages block those. */
export function OptionSpacer({ height }: { height: number }) {
  const ref = React.useCallback(
    (el: HTMLDivElement | null) => {
      if (el) el.style.height = `${height}px`;
    },
    [height],
  );
  return height > 0 ? <div ref={ref} aria-hidden="true" /> : null;
}

type Row<T> = { heading: string } | { item: T; pos: number };

export interface WindowedOptions<T> {
  /** True when the list windows (more items than the threshold). */
  windowed: boolean;
  /** cmdk Root props for a windowed list: its active value comes from here. */
  rootProps: { value: string; onValueChange: (v: string) => void } | Record<string, never>;
  /** Combobox.List ref. */
  listRef: (el: HTMLDivElement | null) => void;
  /** Put on the search input's onKeyDown: moves the active option over the whole list. */
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** The rendered rows: spacers, and each run of one group's items in its Combobox.Group. */
  render: (
    renderItem: (
      item: T,
      aria: { 'aria-setsize': number; 'aria-posinset': number },
    ) => React.ReactNode,
  ) => React.ReactNode;
}

/**
 * 12.1: one windowed, grouped option list over a cmdk Combobox. With `count <= threshold` it does
 * nothing (`windowed` false) and the caller renders its list as before. Above it, the caller
 * passes `shouldFilter={false}` and `rootProps` to Combobox.Root, `listRef` to Combobox.List,
 * `onKeyDown` to the input, and renders `render(renderItem)` inside the list.
 */
export function useWindowedOptions<T>({
  items,
  threshold,
  search,
  filter,
  text,
  valueOf,
  groupOf,
  disabled,
  loop = false,
  active: enabledNow = true,
}: {
  items: readonly T[];
  threshold: number;
  search: string;
  /** Rank by `search` here (cmdk's filter is off for a windowed list). False for async search. */
  filter: boolean;
  text: (item: T) => { value: string; keywords?: string[] };
  /** The cmdk value of an item's row (unique). */
  valueOf: (item: T) => string;
  groupOf?: (item: T) => string | undefined;
  disabled?: (item: T) => boolean;
  loop?: boolean;
  /** False while the list isn't shown (loading, closed): keys pass through to cmdk. */
  active?: boolean;
}): WindowedOptions<T> {
  const windowed = items.length > threshold;
  const rows = React.useMemo(() => {
    if (!windowed) return [] as Row<T>[];
    const ranked = filter ? rankOptions(items, search, text) : [...items];
    const out: Row<T>[] = [];
    // Groups in the order of their best-ranked item, as cmdk orders them.
    const order: (string | undefined)[] = [];
    const byGroup = new Map<string | undefined, T[]>();
    for (const item of ranked) {
      const g = groupOf?.(item);
      if (!byGroup.has(g)) {
        byGroup.set(g, []);
        order.push(g);
      }
      byGroup.get(g)!.push(item);
    }
    let pos = 0;
    for (const g of order) {
      if (g) out.push({ heading: g });
      for (const item of byGroup.get(g)!) out.push({ item, pos: ++pos });
    }
    return out;
    // text, groupOf: read per call; callers pass inline functions of the item only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowed, items, search, filter]);
  const total = rows.reduce((n, r) => n + ('item' in r ? 1 : 0), 0);
  const [current, setCurrent] = React.useState('');
  const win = useOptionWindow(
    rows.length,
    windowed && enabledNow,
    current,
    (i) => 'heading' in rows[i]!,
  );
  const seen = React.useRef<string | null>(null);
  if (windowed && seen.current !== search) {
    seen.current = search;
    const first = rows.find((r) => 'item' in r && !disabled?.(r.item));
    setCurrent(first && 'item' in first ? valueOf(first.item) : '');
    win.reset();
  }

  if (!windowed) {
    return {
      windowed,
      rootProps: {},
      listRef: win.listRef,
      onKeyDown: () => {},
      render: () => null,
    };
  }
  return {
    windowed,
    rootProps: { value: current, onValueChange: setCurrent },
    listRef: win.listRef,
    onKeyDown: (e) => {
      if (!enabledNow) return;
      const from = rows.findIndex((r) => 'item' in r && valueOf(r.item) === current);
      const next = moveIndex(
        e.key,
        from,
        rows.length,
        (i) => {
          const r = rows[i]!;
          return 'heading' in r || !!disabled?.(r.item);
        },
        { loop },
      );
      if (next === null) return;
      e.preventDefault(); // cmdk only moves between the rows it has; this list moves over all of them
      setCurrent(valueOf((rows[next] as { item: T }).item));
      win.scrollToIndex(next);
    },
    render: (renderItem) => {
      const out: React.ReactNode[] = [<OptionSpacer key="before" height={win.before} />];
      let run: { heading?: string; shown: boolean; nodes: React.ReactNode[] } | null = null;
      const flush = () => {
        if (!run) return;
        out.push(
          run.heading ? (
            // A heading whose row scrolled out of the window stays for screen readers (the
            // group keeps its name) but takes no space, so the spacer heights stay right.
            <Combobox.Group
              key={`g-${run.heading}`}
              heading={run.heading}
              className={run.shown ? undefined : '[&_[cmdk-group-heading]]:sr-only'}
            >
              {run.nodes}
            </Combobox.Group>
          ) : (
            <React.Fragment key={`u-${out.length}`}>{run.nodes}</React.Fragment>
          ),
        );
        run = null;
      };
      for (const row of rows.slice(win.start, win.end)) {
        if ('heading' in row) {
          flush();
          run = { heading: row.heading, shown: true, nodes: [] };
          continue;
        }
        const g = groupOf?.(row.item);
        if (!run || run.heading !== g) {
          flush();
          run = { heading: g, shown: false, nodes: [] };
        }
        run.nodes.push(renderItem(row.item, { 'aria-setsize': total, 'aria-posinset': row.pos }));
      }
      flush();
      out.push(<OptionSpacer key="after" height={win.after} />);
      return out;
    },
  };
}

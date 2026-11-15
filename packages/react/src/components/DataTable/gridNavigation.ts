import type * as React from 'react';

// Controls that take a cell's tab stop instead of the cell itself.
const FOCUSABLE =
  'a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[role=separator]';
const TEXT_INPUT = /^(text|search|email|number|tel|url|password|date)$/;

/** Each visible row's stops: a cell's controls, or the cell itself when it has none. */
function stopsByRow(table: HTMLTableElement): HTMLElement[][] {
  return Array.from(table.rows)
    .filter((r) => !r.hasAttribute('aria-hidden'))
    .map((r) =>
      Array.from(r.cells).flatMap((cell) => {
        const inner = Array.from(cell.querySelectorAll<HTMLElement>(FOCUSABLE));
        return inner.length ? inner : [cell];
      }),
    );
}

const cellIndex = (el: HTMLElement) => (el.closest('td,th') as HTMLTableCellElement).cellIndex;

/**
 * ARIA grid keyboard model (WAI-ARIA APG "Data Grid"): one tab stop for the
 * whole table; Arrow keys move between cells (and the controls inside them),
 * Home/End to the row's ends, Ctrl+Home/End to the grid's corners.
 */
export function createGridNavigation(dir: 'ltr' | 'rtl') {
  let active: HTMLElement | null = null;

  /** Roving tabindex: the active stop is 0, every other stop -1. */
  const sync = (table: HTMLTableElement | null) => {
    if (!table) return;
    const stops = stopsByRow(table).flat();
    if (!active || !stops.includes(active)) active = stops[0] ?? null;
    for (const s of stops) s.tabIndex = s === active ? 0 : -1;
  };

  const onFocus = (e: React.FocusEvent<HTMLTableElement>) => {
    active = e.target as HTMLElement;
    sync(e.currentTarget);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
    // Controls that use these keys themselves (resize handle, Alt+Arrow reorder, menus) win.
    if (e.defaultPrevented || e.altKey) return;
    const target = e.target as HTMLElement;
    const typing =
      target.matches('textarea,select,[contenteditable=true]') ||
      (target instanceof HTMLInputElement && TEXT_INPUT.test(target.type));
    if (typing && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

    const rows = stopsByRow(e.currentTarget);
    const r = rows.findIndex((row) => row.includes(target));
    if (r < 0) return;
    const row = rows[r]!;
    const c = row.indexOf(target);
    const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    const sameColumn = (to: HTMLElement[] | undefined) =>
      to && (to.find((s) => cellIndex(s) >= cellIndex(target)) ?? to.at(-1));

    let next: HTMLElement | undefined;
    if (e.key === forward) next = row[c + 1];
    else if (e.key === back) next = row[c - 1];
    else if (e.key === 'ArrowDown') next = sameColumn(rows[r + 1]);
    else if (e.key === 'ArrowUp') next = sameColumn(rows[r - 1]);
    else if (e.key === 'Home') next = e.ctrlKey ? rows[0]![0] : row[0];
    else if (e.key === 'End') next = e.ctrlKey ? rows.at(-1)!.at(-1) : row.at(-1);
    else return;

    e.preventDefault();
    next?.focus();
  };

  return { sync, onFocus, onKeyDown };
}

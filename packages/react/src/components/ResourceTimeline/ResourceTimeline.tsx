'use client';

import * as React from 'react';
import { addDays, isSameDay, startOfDay } from 'date-fns';
import { cn } from '../../utils/cn.js';
import { useIntlLocale, useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';

export type ResourceCellTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';

export interface TimelineResource {
  id: string;
  label: React.ReactNode;
  /** A second line, e.g. a role or team. */
  description?: React.ReactNode;
  /** E.g. an `<Avatar size="sm" />`. */
  avatar?: React.ReactNode;
}

export interface ResourceCell {
  /** What the cell says, e.g. "AL" or "8h". Give it text: the tone alone does not tell. */
  value?: React.ReactNode;
  tone?: ResourceCellTone;
}

export interface ResourceTimelineProps {
  resources: TimelineResource[];
  /** The days shown, both ends included. */
  range: { from: Date; to: Date };
  /** A cell's content for one resource on one day. */
  getCell?: (resourceId: string, date: Date) => ResourceCell | null | undefined;
  /**
   * Makes the cells a grid: arrow keys move between them, and Enter, Space or a click calls this,
   * for example to open your editor anchored to `cell`. The editing UI stays yours.
   */
  onCellActivate?: (resourceId: string, date: Date, cell: HTMLElement) => void;
  /** A footer row: the total for each day. */
  footer?: (date: Date) => React.ReactNode;
  /** A last column: the total for each resource. */
  rowTotal?: (resourceId: string) => React.ReactNode;
  /** The footer cell under the total column. */
  grandTotal?: React.ReactNode;
  /** The first column's header. Defaults to "Name". */
  resourceHeader?: React.ReactNode;
  /** Names the table, e.g. "Team leave, November". */
  label: string;
  /** Days of the week shaded as weekend (0 = Sunday). @default [0, 6] */
  weekend?: number[];
  /** Marks today. Pass a fixed date in tests and screenshots. @default new Date() */
  now?: Date;
  className?: string;
}

const tones: Record<ResourceCellTone, string> = {
  neutral: 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)]',
  primary: 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]',
  success: 'bg-[var(--color-success-container)] text-[var(--color-on-success-container)]',
  warning: 'bg-[var(--color-warning-container)] text-[var(--color-on-warning-container)]',
  error: 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]',
  info: 'bg-[var(--color-info-container)] text-[var(--color-on-info-container)]',
};

const WEEKEND = [0, 6];
const edge = 'border-b border-e border-[var(--color-outline-variant)]';
const sticky = 'sticky start-0 z-10 bg-[var(--color-surface)]';

/**
 * One row per person, days across: rosters, leave, allocation. With `onCellActivate` the cells are a grid
 * (one Tab stop, arrow keys between cells); without it, a plain table. The first column stays put while the days scroll.
 */
export function ResourceTimeline({
  resources,
  range,
  getCell,
  onCellActivate,
  footer,
  rowTotal,
  grandTotal,
  resourceHeader,
  label,
  weekend = WEEKEND,
  now,
  className,
}: ResourceTimelineProps) {
  const t = useNexubMessages();
  const { dir } = useLocale();
  const intlLocale = useIntlLocale();
  const days: Date[] = [];
  for (let d = startOfDay(range.from); d <= range.to; d = addDays(d, 1)) days.push(d);
  const today = now ?? new Date();
  const [active, setActive] = React.useState<[row: number, col: number]>([0, 0]);
  const row = Math.min(active[0], resources.length - 1);
  const col = Math.min(active[1], days.length - 1);
  const tableRef = React.useRef<HTMLTableElement>(null);
  const interactive = !!onCellActivate;
  // jsdom and some screen readers map a td in a role="grid" table to "cell": say it.
  const cellRole = interactive ? 'gridcell' : undefined;
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(intlLocale, o);
  const [weekday, dayNum, full] = [fmt({ weekday: 'short' }), fmt({ day: 'numeric' }), fmt({ weekday: 'long', day: 'numeric', month: 'long' })];

  const focusCell = (r: number, c: number) => {
    setActive([r, c]);
    tableRef.current?.querySelector<HTMLElement>(`[data-nx-cell="${r}-${c}"]`)?.focus();
  };
  const onKeyDown = (ev: React.KeyboardEvent, r: number, c: number) => {
    const last = [resources.length - 1, days.length - 1] as const;
    const back = dir === 'rtl' ? 1 : -1;
    const to: Record<string, [number, number]> = {
      ArrowUp: [r - 1, c],
      ArrowDown: [r + 1, c],
      ArrowLeft: [r, c + back],
      ArrowRight: [r, c - back],
      Home: ev.ctrlKey ? [0, 0] : [r, 0],
      End: ev.ctrlKey ? [last[0], last[1]] : [r, last[1]],
    };
    const next = to[ev.key];
    if (next) {
      ev.preventDefault();
      focusCell(Math.max(0, Math.min(last[0], next[0])), Math.max(0, Math.min(last[1], next[1])));
    } else if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'F2') {
      ev.preventDefault();
      onCellActivate?.(resources[r]!.id, days[c]!, ev.currentTarget as HTMLElement);
    }
  };

  const shade = (d: Date) => weekend.includes(d.getDay()) && 'bg-[var(--color-surface-container-low)]';

  return (
    <div
      // Without focusable cells the scroller itself takes focus, so keyboard users can scroll it.
      {...(interactive ? {} : { tabIndex: 0, role: 'region', 'aria-label': label })}
      className={cn('relative max-w-full overflow-x-auto scroll-ps-48 rounded-shape-min border-s border-t border-[var(--color-outline-variant)]', className)}
    >
      <table
        ref={tableRef}
        role={interactive ? 'grid' : undefined}
        aria-label={label}
        className="w-max min-w-full border-separate border-spacing-0 text-body-sm text-[var(--color-on-surface)]"
      >
        <thead>
          <tr>
            <th scope="col" className={cn(edge, sticky, 'w-48 min-w-48 px-3 py-2 text-start text-label-md font-medium text-[var(--color-on-surface-variant)]')}>
              {resourceHeader ?? t.resourceColumn}
            </th>
            {days.map((d) => {
              const isToday = isSameDay(d, today);
              return (
                <th
                  key={d.getTime()}
                  scope="col"
                  aria-current={isToday ? 'date' : undefined}
                  className={cn(edge, shade(d), 'min-w-12 px-1 py-1.5 text-center text-label-sm font-medium text-[var(--color-on-surface-variant)]')}
                >
                  <span aria-hidden="true" className="block">
                    {weekday.format(d)}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'inline-flex size-6 items-center justify-center rounded-full tabular-nums',
                      isToday && 'bg-[var(--color-primary)] text-[var(--color-on-primary)]',
                    )}
                  >
                    {dayNum.format(d)}
                  </span>
                  <span className="sr-only">{full.format(d)}</span>
                </th>
              );
            })}
            {rowTotal && (
              <th scope="col" className={cn(edge, 'min-w-16 px-2 py-2 text-end text-label-md font-medium text-[var(--color-on-surface-variant)]')}>
                {t.rowTotal}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {resources.map((res, r) => (
            <tr key={res.id}>
              <th scope="row" className={cn(edge, sticky, 'px-3 py-1.5 text-start font-normal')}>
                <span className="flex items-center gap-2">
                  {res.avatar}
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-label-lg font-medium">{res.label}</span>
                    {res.description && <span className="truncate text-body-sm text-[var(--color-on-surface-variant)]">{res.description}</span>}
                  </span>
                </span>
              </th>
              {days.map((d, c) => {
                const cell = getCell?.(res.id, d);
                const focusable = interactive && r === row && c === col;
                return (
                  <td
                    key={d.getTime()}
                    role={cellRole}
                    data-nx-cell={interactive ? `${r}-${c}` : undefined}
                    tabIndex={interactive ? (focusable ? 0 : -1) : undefined}
                    onKeyDown={interactive ? (ev) => onKeyDown(ev, r, c) : undefined}
                    onClick={
                      interactive
                        ? (ev) => {
                            setActive([r, c]);
                            onCellActivate(res.id, d, ev.currentTarget);
                          }
                        : undefined
                    }
                    className={cn(edge, shade(d), 'h-12 p-0.5 text-center', interactive && 'cursor-pointer hover:bg-[var(--color-surface-container-high)]')}
                  >
                    {cell?.value != null && (
                      <span className={cn('flex size-full min-h-10 items-center justify-center rounded-shape-min px-1 text-label-md', tones[cell.tone ?? 'neutral'])}>
                        {cell.value}
                      </span>
                    )}
                  </td>
                );
              })}
              {rowTotal && <td role={cellRole} className={cn(edge, 'px-2 text-end tabular-nums font-medium')}>{rowTotal(res.id)}</td>}
            </tr>
          ))}
        </tbody>
        {(footer || rowTotal) && (
          <tfoot>
            <tr>
              <th scope="row" className={cn(edge, sticky, 'px-3 py-2 text-start text-label-md font-medium')}>
                {t.rowTotal}
              </th>
              {days.map((d) => (
                <td key={d.getTime()} role={cellRole} className={cn(edge, shade(d), 'px-1 py-2 text-center tabular-nums text-label-md')}>
                  {footer?.(d)}
                </td>
              ))}
              {rowTotal && <td role={cellRole} className={cn(edge, 'px-2 py-2 text-end tabular-nums font-semibold')}>{grandTotal}</td>}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

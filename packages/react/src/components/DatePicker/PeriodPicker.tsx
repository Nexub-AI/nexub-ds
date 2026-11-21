'use client';

import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { CalendarDays, ChevronLeft, ChevronRight } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useIntlLocale, useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { field, fieldFocusVisible, fieldInvalid, fieldReadOnly, type Size } from '../../utils/control.js';
import { COLLISION_PADDING, type SheetProp } from '../../utils/popper.js';
import { floatingSurface } from '../../utils/surface.js';
import { formatPeriod, parsePeriod } from './period.js';

/** 11.1: DatePicker `granularity="month"` (value `'YYYY-MM'`) or `"year"` (value `'YYYY'`). */
export type PeriodGranularity = 'month' | 'year';

export interface PeriodPickerProps {
  granularity: PeriodGranularity;
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  size: Size;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  id?: string;
  'aria-label'?: string;
  sheet: SheetProp;
  triggerSize: string;
}

const YEARS_PER_PAGE = 12;
const COLUMNS = 3;
const pad = (n: number) => String(n).padStart(2, '0');

const PeriodPicker = React.forwardRef<HTMLButtonElement, PeriodPickerProps>(function PeriodPicker(
  {
    granularity,
    value,
    onValueChange,
    placeholder: placeholderProp,
    disabled = false,
    readOnly = false,
    invalid,
    minDate,
    maxDate,
    className,
    id,
    'aria-label': ariaLabel,
    sheet,
    triggerSize,
  },
  ref,
) {
  const messages = useNexubMessages();
  const intlLocale = useIntlLocale();
  const { dir } = useLocale();
  const [open, setOpen] = React.useState(false);
  const selected = parsePeriod(value);
  const isMonth = granularity === 'month';
  const now = new Date();

  const monthName = (month: number, style: 'long' | 'short') =>
    new Intl.DateTimeFormat(intlLocale, { month: style, timeZone: 'UTC' }).format(new Date(Date.UTC(2000, month, 1)));
  const formatMonth = (year: number, month: number) => formatPeriod('month', year, month, intlLocale);

  const display = selected ? formatPeriod(granularity, selected.year, selected.month, intlLocale) : (placeholderProp ?? (isMonth ? messages.pickMonth : messages.pickYear));

  // The page on show: a year of months, or a block of twelve years.
  const startYear = selected?.year ?? now.getFullYear();
  const pageOf = (year: number) => (isMonth ? year : year - (((year % YEARS_PER_PAGE) + YEARS_PER_PAGE) % YEARS_PER_PAGE));
  const [page, setPage] = React.useState(pageOf(startYear));
  // The cell with tabIndex 0 (roving focus), as an index 0–11 on the page.
  const [active, setActive] = React.useState(0);
  const cells = React.useRef<(HTMLButtonElement | null)[]>([]);
  // The cell to focus once it is rendered (on open and after a page turn).
  const pendingFocus = React.useRef<number | null>(null);

  const minKey = minDate ? (isMonth ? minDate.getFullYear() * 12 + minDate.getMonth() : minDate.getFullYear()) : -Infinity;
  const maxKey = maxDate ? (isMonth ? maxDate.getFullYear() * 12 + maxDate.getMonth() : maxDate.getFullYear()) : Infinity;
  const keyOf = (i: number, p = page) => (isMonth ? p * 12 + i : p + i);
  const outOfRange = (i: number, p = page) => keyOf(i, p) < minKey || keyOf(i, p) > maxKey;
  const selectedIndex =
    selected && (isMonth ? selected.year === page : selected.year >= page && selected.year < page + YEARS_PER_PAGE)
      ? isMonth
        ? selected.month
        : selected.year - page
      : -1;

  // On open: show the selected period (or today). Set with `open` in one update, so the grid
  // renders on the right page and onOpenAutoFocus can focus the right cell.
  const onOpenChange = (next: boolean) => {
    if (next) {
      const year = selected?.year ?? now.getFullYear();
      const p = pageOf(year);
      setPage(p);
      setActive(isMonth ? (selected?.month ?? now.getMonth()) : year - p);
    }
    setOpen(next);
  };

  // After a page turn: the content is already mounted, so focus once the new page renders.
  React.useEffect(() => {
    const target = pendingFocus.current;
    const cell = target === null ? null : cells.current[target];
    if (!cell) return;
    pendingFocus.current = null;
    cell.focus();
  });

  /** `focus`: from the keyboard, focus follows into the new page; a click keeps it on the nav button. */
  const turn = (delta: number, nextActive = active, focus = true) => {
    setPage((p) => p + delta * (isMonth ? 1 : YEARS_PER_PAGE));
    setActive(nextActive);
    if (focus) pendingFocus.current = nextActive;
  };

  const pick = (i: number) => {
    if (outOfRange(i)) return;
    const year = isMonth ? page : page + i;
    onValueChange?.(isMonth ? `${year}-${pad(i + 1)}` : String(year));
    setOpen(false);
  };

  const onGridKeyDown = (e: React.KeyboardEvent) => {
    const rtl = dir === 'rtl';
    const moves: Record<string, number> = {
      ArrowRight: rtl ? -1 : 1,
      ArrowLeft: rtl ? 1 : -1,
      ArrowDown: COLUMNS,
      ArrowUp: -COLUMNS,
    };
    let next: number | undefined;
    if (e.key in moves) next = active + moves[e.key]!;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 11;
    else if (e.key === 'PageUp') return (e.preventDefault(), turn(-1));
    else if (e.key === 'PageDown') return (e.preventDefault(), turn(1));
    if (next === undefined) return;
    e.preventDefault();
    if (next < 0) turn(-1, next + 12);
    else if (next > 11) turn(1, next - 12);
    else {
      setActive(next);
      cells.current[next]?.focus();
    }
  };

  const heading = isMonth ? String(page) : `${page} – ${page + YEARS_PER_PAGE - 1}`;
  const navButton =
    'nx-state-layer inline-flex h-7 w-7 items-center justify-center rounded-full text-on-surface disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]';
  const Prev = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const Next = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <RadixPopover.Root open={open && !readOnly} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>
        <button
          ref={ref}
          id={id}
          disabled={disabled}
          data-readonly={readOnly ? '' : undefined}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel ? `${ariaLabel}: ${display}` : display}
          className={cn(
            'inline-flex w-full items-center justify-start',
            triggerSize,
            field,
            fieldFocusVisible,
            fieldReadOnly,
            'data-[state=open]:border-primary data-[state=open]:shadow-[inset_0_0_0_1px_var(--color-primary)]',
            'disabled:cursor-not-allowed disabled:border-outline-variant disabled:bg-surface-container-low disabled:text-[var(--color-text-disabled)]',
            invalid && fieldInvalid,
            !selected && 'text-on-surface-muted',
            className,
          )}
        >
          <CalendarDays size="sm" aria-hidden="true" />
          {display}
        </button>
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          align="start"
          collisionPadding={COLLISION_PADDING}
          data-nx-sheet={sheet || undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            cells.current[active]?.focus();
          }}
          className={cn(
            'z-[var(--z-popover)] outline-none',
            'max-h-[var(--radix-popover-content-available-height)] overflow-y-auto',
            floatingSurface,
            'nx-motion nx-pop origin-[var(--radix-popover-content-transform-origin)]',
          )}
        >
          <div className="w-72 max-w-full p-3" data-granularity={granularity}>
            <div className="mb-2 flex h-8 items-center justify-between">
              <button
                type="button"
                className={navButton}
                aria-label={isMonth ? messages.previousYear : messages.previousYears}
                disabled={outOfRange(0, page - (isMonth ? 1 : YEARS_PER_PAGE)) && outOfRange(11, page - (isMonth ? 1 : YEARS_PER_PAGE))}
                onClick={() => turn(-1, active, false)}
              >
                <Prev size="xs" aria-hidden="true" />
              </button>
              <span className="text-label-lg text-on-surface" aria-live="polite">
                {heading}
              </span>
              <button
                type="button"
                className={navButton}
                aria-label={isMonth ? messages.nextYear : messages.nextYears}
                disabled={outOfRange(0, page + (isMonth ? 1 : YEARS_PER_PAGE)) && outOfRange(11, page + (isMonth ? 1 : YEARS_PER_PAGE))}
                onClick={() => turn(1, active, false)}
              >
                <Next size="xs" aria-hidden="true" />
              </button>
            </div>
            <div role="group" aria-label={heading} className="grid grid-cols-3 gap-1" onKeyDown={onGridKeyDown}>
              {Array.from({ length: 12 }, (_, i) => {
                const isSelected = i === selectedIndex;
                const isCurrent = isMonth ? page === now.getFullYear() && i === now.getMonth() : page + i === now.getFullYear();
                const label = isMonth ? formatMonth(page, i) : String(page + i);
                return (
                  <button
                    key={i}
                    ref={(el) => {
                      cells.current[i] = el;
                    }}
                    type="button"
                    tabIndex={i === active ? 0 : -1}
                    disabled={outOfRange(i)}
                    aria-pressed={isSelected}
                    aria-current={isCurrent ? 'date' : undefined}
                    aria-label={label}
                    onClick={() => pick(i)}
                    onFocus={() => setActive(i)}
                    className={cn(
                      'nx-state-layer inline-flex h-10 items-center justify-center rounded-full border border-transparent text-body-sm tabular-nums text-on-surface',
                      'disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]',
                      isCurrent && 'border-primary',
                      isSelected && 'bg-primary text-on-primary',
                    )}
                  >
                    {isMonth ? monthName(i, 'short') : page + i}
                  </button>
                );
              })}
            </div>
          </div>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
});

export default PeriodPicker;

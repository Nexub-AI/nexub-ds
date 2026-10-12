import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { DayPicker, type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from '@nexub/icons';
import { cn } from '../../utils/cn.js';

export type { DateRange };

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  /** Id for the trigger button, e.g. to pair with a `<label htmlFor>`. */
  id?: string;
  /** Field name for screen readers; the current value is appended. */
  'aria-label'?: string;
}

function formatRange(
  range: DateRange | undefined,
  placeholder: string,
): string {
  if (!range) return placeholder;
  if (range.from && range.to) {
    return `${format(range.from, 'PP')} \u2013 ${format(range.to, 'PP')}`;
  }
  if (range.from) return `${format(range.from, 'PP')} \u2013 \u2026`;
  return placeholder;
}

const calendarClassNames = {
  months: 'flex flex-col sm:flex-row gap-4',
  month: 'flex flex-col gap-4',
  month_caption: 'flex justify-center pt-1 relative items-center',
  caption_label: 'text-sm font-medium',
  nav: 'flex items-center gap-1',
  button_previous:
    'absolute left-1 inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border-default)] hover:bg-[var(--color-bg-subtle)] disabled:pointer-events-none disabled:opacity-50',
  button_next:
    'absolute right-1 inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border-default)] hover:bg-[var(--color-bg-subtle)] disabled:pointer-events-none disabled:opacity-50',
  month_grid: 'w-full border-collapse',
  weekdays: 'flex',
  weekday:
    'text-[var(--color-text-muted)] rounded-md w-8 font-normal text-[0.8rem] flex-1 text-center',
  week: 'flex w-full mt-2',
  day: 'relative p-0 text-center text-sm flex-1 focus-within:relative focus-within:z-20',
  day_button:
    'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm hover:bg-[var(--color-bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)]',
  selected:
    'bg-[var(--color-fill-primary)] text-white hover:bg-[var(--color-fill-primary-hover)]',
  range_start: 'rounded-l-md',
  range_end: 'rounded-r-md',
  range_middle:
    'aria-selected:bg-[var(--color-bg-subtle)] aria-selected:text-[var(--color-text-primary)] rounded-none',
  today: 'bg-[var(--color-bg-subtle)]',
  outside: 'opacity-50',
  disabled: 'opacity-50',
  hidden: 'invisible',
} as Record<string, string>;

export const DateRangePicker = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(function DateRangePicker(
  {
    value,
    onChange,
    placeholder = 'Pick a date range',
    disabled = false,
    minDate,
    maxDate,
    className,
    id,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const [open, setOpen] = React.useState(false);
  const display = formatRange(value, placeholder);
  const label = ariaLabel ? `${ariaLabel}: ${display}` : display;

  return (
    <RadixPopover.Root open={open} onOpenChange={setOpen}>
      <RadixPopover.Trigger asChild>
        <button
          ref={ref}
          id={id}
          disabled={disabled}
          aria-label={label}
          className={cn(
            'inline-flex h-9 w-full items-center justify-start gap-2 rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm',
            'hover:bg-[var(--color-bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            !value && 'text-[var(--color-text-muted)]',
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
          className={cn(
            'z-[var(--z-popover)] rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          )}
        >
          <DayPicker
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            startMonth={minDate}
            endMonth={maxDate}
            initialFocus
            showOutsideDays
            className="p-3"
            classNames={calendarClassNames}
            components={{
              Chevron: ({ orientation, ...rest }) =>
                orientation === 'left' ? (
                  <ChevronLeft size="xs" aria-hidden="true" />
                ) : orientation === 'right' ? (
                  <ChevronRight size="xs" aria-hidden="true" />
                ) : (
                  <ChevronRight size="xs" aria-hidden="true" {...rest} />
                ),
            }}
          />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
});

DateRangePicker.displayName = 'DateRangePicker';

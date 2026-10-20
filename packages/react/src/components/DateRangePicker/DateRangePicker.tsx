import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { DayPicker, type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { field, fieldFocusVisible } from '../../utils/control.js';
import { floatingSurface } from '../../utils/surface.js';

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
  caption_label: 'text-label-lg text-[var(--color-on-surface)]',
  nav: 'flex items-center gap-1',
  button_previous:
    'nx-state-layer absolute left-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-on-surface)] disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]',
  button_next:
    'nx-state-layer absolute right-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-on-surface)] disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]',
  month_grid: 'w-full border-collapse',
  weekdays: 'flex',
  weekday:
    'text-[var(--color-on-surface-muted)] w-8 text-label-sm flex-1 text-center',
  week: 'flex w-full mt-2',
  day: 'relative flex flex-1 justify-center p-0 text-center focus-within:z-20',
  day_button: cn(
    // Capsule day with a state layer; focus = the global ring. The transparent
    // border carries today's primary outline.
    'nx-state-layer inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-body-sm text-[var(--color-on-surface)]',
    'disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]',
  ),
  // Ends (and a lone start) are filled primary capsules; the middle is a
  // primary-container band. `nx-range-middle` is a marker so `selected`
  // skips middle days without depending on CSS order.
  selected: '[&:not(.nx-range-middle)>button]:bg-[var(--color-primary)] [&:not(.nx-range-middle)>button]:text-[var(--color-on-primary)]',
  range_start: '',
  range_end: '',
  range_middle: 'nx-range-middle bg-[var(--color-primary-container)] [&>button]:text-[var(--color-on-primary-container)]',
  today: '[&>button]:border-[var(--color-primary)]',
  outside: '[&:not([data-selected]):not([data-disabled])>button]:text-[var(--color-on-surface-muted)]',
  disabled: '',
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
            'inline-flex h-control-md w-full items-center justify-start gap-2 px-3.5 text-body-md',
            field,
            fieldFocusVisible,
            // Open reads like focus: the 2px primary border (as Select).
            'data-[state=open]:border-[var(--color-primary)] data-[state=open]:shadow-[inset_0_0_0_1px_var(--color-primary)]',
            'disabled:cursor-not-allowed disabled:border-[var(--color-outline-variant)] disabled:bg-[var(--color-surface-container-low)] disabled:text-[var(--color-text-disabled)]',
            !value && 'text-[var(--color-on-surface-muted)]',
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
            'z-[var(--z-popover)] outline-none',
            floatingSurface,
            'nx-motion nx-pop origin-[var(--radix-popover-content-transform-origin)]',
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

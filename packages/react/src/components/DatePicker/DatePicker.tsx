import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { field, fieldFocusVisible } from '../../utils/control.js';
import { floatingSurface } from '../../utils/surface.js';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
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

const calendarClassNames = {
  months: 'flex flex-col sm:flex-row gap-4',
  month: 'flex flex-col gap-4',
  month_caption: 'flex h-8 items-center justify-center',
  caption_label: 'text-label-lg text-[var(--color-on-surface)]',
  // v9 renders nav beside the months, not in the caption: pin it to the caption row.
  nav: 'pointer-events-none absolute inset-x-3 top-3 flex h-8 items-center justify-between',
  button_previous:
    'nx-state-layer pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-on-surface)] disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]',
  button_next:
    'nx-state-layer pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-on-surface)] disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]',
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
  selected: '[&>button]:bg-[var(--color-primary)] [&>button]:text-[var(--color-on-primary)]',
  today: '[&>button]:border-[var(--color-primary)]',
  outside: '[&:not([data-selected]):not([data-disabled])>button]:text-[var(--color-on-surface-muted)]',
  disabled: '',
  hidden: 'invisible',
} as Record<string, string>;

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  function DatePicker(
    {
      value,
      onChange,
      placeholder = 'Pick a date',
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
    const display = value ? format(value, 'PP') : placeholder;

    return (
      <RadixPopover.Root open={open} onOpenChange={setOpen}>
        <RadixPopover.Trigger asChild>
          <button
            ref={ref}
            id={id}
            disabled={disabled}
            aria-label={ariaLabel ? `${ariaLabel}: ${display}` : display}
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
            {value ? format(value, 'PP') : placeholder}
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
              mode="single"
              selected={value}
              defaultMonth={value}
              onSelect={(date) => {
                onChange?.(date);
                setOpen(false);
              }}
              startMonth={minDate}
              endMonth={maxDate}
              initialFocus
              showOutsideDays
              className="relative p-3"
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
  },
);

DatePicker.displayName = 'DatePicker';

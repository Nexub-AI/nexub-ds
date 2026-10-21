import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { DayPicker, type ChevronProps, type Labels, type Modifiers } from 'react-day-picker';
import { format, type Locale } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useIntlLocale, useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { field, fieldFocusVisible } from '../../utils/control.js';
import { floatingSurface } from '../../utils/surface.js';

/**
 * A date-fns Locale wins (date-fns 'PP'); else with a NexubProvider locale,
 * Intl's medium date; otherwise date-fns 'PP' as before.
 */
export function formatDate(date: Date, locale: string | undefined, dateLocale?: Locale): string {
  if (dateLocale) return format(date, 'PP', { locale: dateLocale });
  return locale ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date) : format(date, 'PP');
}

/** Nav chevrons point to the inline side they move toward: mirrored in RTL. */
function CalendarChevron({ orientation, ...rest }: ChevronProps) {
  const { dir } = useLocale();
  const flip = dir === 'rtl';
  if (orientation === 'left' || orientation === 'right') {
    const Icon = (orientation === 'left') !== flip ? ChevronLeft : ChevronRight;
    return <Icon size="xs" aria-hidden="true" />;
  }
  return <ChevronRight size="xs" aria-hidden="true" {...rest} />;
}

/** Internal: locale, dir, translated labels and chevrons shared by both pickers. */
export function useCalendarLocale(localeProp?: Locale) {
  const { dir, dateLocale } = useLocale();
  const messages = useNexubMessages();
  const intlLocale = useIntlLocale();
  const locale = localeProp ?? dateLocale;
  const labels = React.useMemo<Partial<Labels>>(() => {
    const day = (date: Date, modifiers: Modifiers | undefined, withSelected: boolean) => {
      let label = format(date, 'PPPP', locale ? { locale } : undefined);
      if (modifiers?.today) label = messages.todayDate(label);
      if (withSelected && modifiers?.selected) label = messages.selectedDate(label);
      return label;
    };
    return {
      labelPrevious: () => messages.previousMonth,
      labelNext: () => messages.nextMonth,
      labelNav: () => messages.calendarNavigation,
      labelDayButton: (date, modifiers) => day(date, modifiers, true),
      labelGridcell: (date, modifiers) => day(date, modifiers, false),
    };
  }, [messages, locale]);
  return {
    dayPickerProps: { locale, dir, labels, components: { Chevron: CalendarChevron } },
    format: (date: Date) => formatDate(date, intlLocale, locale),
  };
}

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
  /** date-fns Locale for the calendar and trigger text; wins over NexubProvider's `dateLocale`. */
  locale?: Locale;
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
      placeholder: placeholderProp,
      disabled = false,
      minDate,
      maxDate,
      className,
      id,
      'aria-label': ariaLabel,
      locale: localeProp,
    },
    ref,
  ) {
    const [open, setOpen] = React.useState(false);
    const messages = useNexubMessages();
    const placeholder = placeholderProp ?? messages.pickDate;
    const calendar = useCalendarLocale(localeProp);
    const display = value ? calendar.format(value) : placeholder;

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
              {...calendar.dayPickerProps}
            />
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>
    );
  },
);

DatePicker.displayName = 'DatePicker';

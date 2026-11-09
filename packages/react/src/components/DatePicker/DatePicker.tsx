'use client';

import * as React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { DayPicker, dateMatchModifiers, type ChevronProps, type Labels, type Matcher, type Modifiers } from 'react-day-picker';
import { format, isValid, parse, type Locale } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useIntlLocale, useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { field, fieldDisabled, fieldFocusVisible, fieldFocusWithin, fieldInvalid } from '../../utils/control.js';
import { floatingSurface } from '../../utils/surface.js';
import { Button } from '../Button/Button.js';

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
      // Intl's full date keeps the day as a plain number ("November 2", not "2nd"), so the
      // visible "2" is in the button's name (WCAG 2.5.3, voice control).
      let label = new Intl.DateTimeFormat(intlLocale, { dateStyle: 'full' }).format(date);
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
  }, [messages, intlLocale]);
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
  /** Days that can't be picked (react-day-picker Matcher), e.g. `{ dayOfWeek: [0, 6] }`. */
  disabledDates?: Matcher | Matcher[];
  /** Quick picks under the calendar (Today, In a week…); choosing one sets the value and closes. */
  presets?: { label: string; date: Date }[];
  /**
   * The trigger is a text input that also accepts a typed date in the locale's
   * short format (date-fns `P`, e.g. 01/15/2024). Enter or blur commits; an
   * invalid or unavailable date stays as typed, marked aria-invalid, and the
   * value is unchanged. `id` and `aria-label` go to the input, `ref` to the
   * calendar button.
   */
  typeable?: boolean;
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
  // Month change (animate): the months crossfade. react-day-picker adds each of
  // these with classList.add, so one class apiece. Keyframes from @nexub/themes
  // core.css; reduced motion collapses them and animationend still cleans up.
  caption_after_enter: 'animate-[nx-fade-in_var(--motion-spring-effects-default-duration)_var(--motion-spring-effects-default-easing)]',
  caption_before_enter: 'animate-[nx-fade-in_var(--motion-spring-effects-default-duration)_var(--motion-spring-effects-default-easing)]',
  weeks_after_enter: 'animate-[nx-fade-in_var(--motion-spring-effects-default-duration)_var(--motion-spring-effects-default-easing)]',
  weeks_before_enter: 'animate-[nx-fade-in_var(--motion-spring-effects-default-duration)_var(--motion-spring-effects-default-easing)]',
  caption_after_exit: 'animate-[nx-fade-out_var(--motion-spring-effects-fast-duration)_var(--motion-spring-effects-fast-easing)_forwards]',
  caption_before_exit: 'animate-[nx-fade-out_var(--motion-spring-effects-fast-duration)_var(--motion-spring-effects-fast-easing)_forwards]',
  weeks_after_exit: 'animate-[nx-fade-out_var(--motion-spring-effects-fast-duration)_var(--motion-spring-effects-fast-easing)_forwards]',
  weeks_before_exit: 'animate-[nx-fade-out_var(--motion-spring-effects-fast-duration)_var(--motion-spring-effects-fast-easing)_forwards]',
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
      disabledDates,
      presets,
      typeable = false,
    },
    ref,
  ) {
    const [open, setOpen] = React.useState(false);
    const messages = useNexubMessages();
    const placeholder = placeholderProp ?? messages.pickDate;
    const calendar = useCalendarLocale(localeProp);
    const display = value ? calendar.format(value) : placeholder;

    // Typed entry: `text` is what was typed since the last commit (null = show the value).
    const [text, setText] = React.useState<string | null>(null);
    const dateLocale = calendar.dayPickerProps.locale;
    const typed = text?.trim() ? parse(text.trim(), 'P', new Date(), { locale: dateLocale }) : undefined;
    const invalid =
      typed !== undefined &&
      (!isValid(typed) ||
        (minDate !== undefined && typed < minDate) ||
        (maxDate !== undefined && typed > maxDate) ||
        (disabledDates !== undefined && dateMatchModifiers(typed, disabledDates)));
    const commit = () => {
      if (text === null || invalid) return;
      onChange?.(typed);
      setText(null);
    };
    const pick = (date: Date | undefined) => {
      onChange?.(date);
      setText(null);
      setOpen(false);
    };

    return (
      <RadixPopover.Root open={open} onOpenChange={setOpen}>
        {typeable ? (
          <RadixPopover.Anchor asChild>
            <div
              className={cn(
                'flex h-control-md w-full items-center gap-1 ps-3.5 pe-1',
                field,
                fieldFocusWithin,
                invalid && fieldInvalid,
                disabled && fieldDisabled,
                className,
              )}
            >
              <input
                id={id}
                type="text"
                disabled={disabled}
                aria-label={ariaLabel}
                aria-invalid={invalid || undefined}
                placeholder={placeholder}
                value={text ?? (value ? format(value, 'P', { locale: dateLocale }) : '')}
                onChange={(e) => setText(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commit();
                }}
                className="min-w-0 flex-1 bg-transparent text-body-md outline-none placeholder:text-[var(--color-on-surface-muted)] disabled:cursor-not-allowed"
              />
              <RadixPopover.Trigger asChild>
                <button
                  ref={ref}
                  type="button"
                  disabled={disabled}
                  aria-label={messages.pickDate}
                  className="nx-state-layer inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full disabled:pointer-events-none"
                >
                  <CalendarDays size="sm" aria-hidden="true" />
                </button>
              </RadixPopover.Trigger>
            </div>
          </RadixPopover.Anchor>
        ) : (
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
        )}
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
              onSelect={pick}
              disabled={disabledDates}
              startMonth={minDate}
              endMonth={maxDate}
              autoFocus
              animate
              showOutsideDays
              className="relative p-3"
              classNames={calendarClassNames}
              {...calendar.dayPickerProps}
            />
            {presets && presets.length > 0 && (
              <div className="flex flex-wrap gap-1 border-t border-[var(--color-outline-variant)] p-2">
                {presets.map((p) => (
                  <Button key={p.label} variant="ghost" size="xs" onClick={() => pick(p.date)}>
                    {p.label}
                  </Button>
                ))}
              </div>
            )}
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>
    );
  },
);

DatePicker.displayName = 'DatePicker';

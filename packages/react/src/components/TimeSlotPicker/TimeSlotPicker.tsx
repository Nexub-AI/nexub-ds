'use client';

import * as React from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { cn } from '../../utils/cn.js';
import type { Size } from '../../utils/control.js';
import { useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { selectableCardClass } from '../RadioCard/selectableCard.js';

export interface TimeSlot {
  /** `HH:mm` or an ISO date-time; anything else needs a `label`. */
  value: string;
  /** Defaults to the time in the provider's locale ("9:00 AM"). */
  label?: string;
  /** Unavailable: shown struck through, cannot be picked. */
  disabled?: boolean;
  /** A short note under the time ("Last one"). */
  hint?: string;
}

type Period = 'morning' | 'afternoon' | 'evening';

export interface TimeSlotPickerProps
  extends Omit<RadixRadioGroup.RadioGroupProps, 'children' | 'orientation' | 'asChild'> {
  slots: TimeSlot[];
  /** `period` adds Morning / Afternoon / Evening headings. @default 'none' */
  groupBy?: 'none' | 'period';
  /** Slots per row; `auto` fits as many as the width allows. @default 'auto' */
  columns?: 2 | 3 | 4 | 'auto';
  /** @default 'md' */
  size?: Size;
  invalid?: boolean;
  /** Focusable but cannot change. */
  readOnly?: boolean;
  /** Shown when `slots` is empty. */
  emptyState?: React.ReactNode;
}

const columnsClass = {
  auto: 'grid-cols-[repeat(auto-fill,minmax(6rem,1fr))]',
  2: 'grid-cols-2',
  3: 'grid-cols-2 @xs:grid-cols-3',
  4: 'grid-cols-2 @xs:grid-cols-3 @md:grid-cols-4',
} as const;

// md and lg are at least 44px tall (touch target).
const slotSize: Record<Size, string> = {
  sm: 'min-h-9 text-label-md',
  md: 'min-h-11 text-label-lg',
  lg: 'min-h-12 text-body-md',
};

const slotClass = [
  'flex-col items-center justify-center gap-0 rounded-shape-field px-2 py-1 text-center tabular-nums',
  'forced-colors:data-[state=checked]:bg-[Highlight] forced-colors:data-[state=checked]:text-[HighlightText] forced-colors:data-[state=checked]:forced-color-adjust-none',
].join(' ');

/** Hours and minutes of an `HH:mm` or ISO value, or null. */
function timeOf(value: string): [number, number] | null {
  const m = /(?:^|T)(\d{1,2}):(\d{2})/.exec(value);
  return m && +m[1]! < 24 && +m[2]! < 60 ? [+m[1]!, +m[2]!] : null;
}

/** Pick one time from a list, for booking flows. A radio group: arrow keys move, unavailable slots are skipped. */
export const TimeSlotPicker = React.forwardRef<HTMLDivElement, TimeSlotPickerProps>(
  ({ slots, groupBy = 'none', columns = 'auto', size = 'md', invalid, readOnly, emptyState, className, ...props }, ref) => {
    const messages = useNexubMessages();
    const { locale } = useLocale();
    const baseId = React.useId();
    // UTC in, UTC out: the server and the browser print the same text whatever their time zones.
    const format = React.useMemo(() => {
      try {
        return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
      } catch {
        return null;
      }
    }, [locale]);

    if (slots.length === 0) {
      return (
        <div ref={ref} id={props.id} className={cn('text-body-sm text-[var(--color-on-surface-variant)]', className)}>
          {emptyState ?? messages.noTimesAvailable}
        </div>
      );
    }

    const renderSlot = (slot: TimeSlot, index: number) => {
      const time = timeOf(slot.value);
      // Newer ICU puts a narrow no-break space before AM/PM; older ones a plain space.
      const label =
        slot.label ?? (time && format ? format.format(new Date(Date.UTC(2000, 0, 1, time[0], time[1]))).replace(/\u202f/g, ' ') : slot.value);
      const hintId = slot.hint ? `${baseId}-hint-${index}` : undefined;
      return (
        <RadixRadioGroup.Item
          key={slot.value}
          value={slot.value}
          disabled={slot.disabled}
          // Named by the time alone; the hint is its description.
          aria-labelledby={`${baseId}-slot-${index}`}
          aria-describedby={hintId}
          aria-invalid={invalid || undefined}
          data-selectable-card=""
          className={cn(selectableCardClass, slotClass, slotSize[size], readOnly && 'cursor-default')}
          onClick={(e) => {
            // Radix skips its select when the click is default-prevented.
            if (readOnly) e.preventDefault();
          }}
        >
          <span id={slot.disabled ? undefined : `${baseId}-slot-${index}`} aria-hidden={slot.disabled || undefined} className="group-data-[disabled]:line-through">
            {label}
          </span>
          {slot.disabled && (
            <span id={`${baseId}-slot-${index}`} className="sr-only">
              {messages.slotUnavailable(label)}
            </span>
          )}
          {slot.hint && (
            <span
              id={hintId}
              className="text-label-sm text-[var(--color-on-surface-variant)] group-data-[disabled]:text-[var(--color-text-disabled)] forced-colors:text-inherit"
            >
              {slot.hint}
            </span>
          )}
        </RadixRadioGroup.Item>
      );
    };

    const grid = cn('grid gap-2', columnsClass[columns]);
    const indexed = slots.map((slot, index) => ({ slot, index }));
    // Values without a readable time go last, under no heading.
    const periodOf = (slot: TimeSlot): Period | 'other' => {
      const hour = timeOf(slot.value)?.[0];
      return hour === undefined ? 'other' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    };

    return (
      <RadixRadioGroup.Root
        ref={ref}
        aria-label={props['aria-labelledby'] ? undefined : messages.chooseTime}
        className={cn('@container flex w-full flex-col gap-4', className)}
        {...props}
        aria-invalid={invalid || props['aria-invalid']}
        aria-readonly={readOnly || undefined}
      >
        {groupBy === 'none' ? (
          <div className={grid}>{indexed.map(({ slot, index }) => renderSlot(slot, index))}</div>
        ) : (
          (['morning', 'afternoon', 'evening', 'other'] as const).map((period) => {
            const members = indexed.filter(({ slot }) => periodOf(slot) === period);
            if (members.length === 0) return null;
            return (
              <div key={period} className="flex flex-col gap-2">
                {period !== 'other' && (
                  <div className="text-label-md text-[var(--color-on-surface-variant)]">{messages.dayPeriods[period]}</div>
                )}
                <div className={grid}>{members.map(({ slot, index }) => renderSlot(slot, index))}</div>
              </div>
            );
          })
        )}
      </RadixRadioGroup.Root>
    );
  },
);
TimeSlotPicker.displayName = 'TimeSlotPicker';

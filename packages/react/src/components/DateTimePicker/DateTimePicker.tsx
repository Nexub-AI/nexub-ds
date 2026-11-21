'use client';

import * as React from 'react';
import type { Locale } from 'date-fns';
import { cn } from '../../utils/cn.js';
import type { Size } from '../../utils/control.js';
import type { SheetProp } from '../../utils/popper.js';
import { DatePicker } from '../DatePicker/DatePicker.js';
import { TimePicker } from '../TimePicker/TimePicker.js';
import { useIntlLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface DateTimePickerProps {
  /** Date and time in the reader's local time. */
  value?: Date;
  /** Called with the new value. */
  onValueChange?: (value: Date | undefined) => void;
  /** Time used when a date is picked first. @default '09:00' */
  defaultTime?: string;
  minuteStep?: number;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  /** Both fields show the value but can't be changed. */
  readOnly?: boolean;
  invalid?: boolean;
  /** @default 'md' */
  size?: Size;
  /** IANA zone to name next to the fields (label only; the value stays local). */
  timeZone?: string;
  'aria-label'?: string;
  className?: string;
  locale?: Locale;
  /** The calendar as a bottom sheet: see DatePicker `sheet`. @default 'auto' (pass `sheet={false}` to keep a popover on small screens) */
  sheet?: SheetProp;
}

const pad = (n: number) => String(n).padStart(2, '0');
const timeOf = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const withTime = (d: Date, time: string) => {
  const [h = 0, m = 0] = time.split(':').map(Number);
  const next = new Date(d);
  next.setHours(h, m, 0, 0);
  return next;
};

/** A DatePicker and a TimePicker that edit one `Date` together. */
export function DateTimePicker({
  value,
  onValueChange,
  defaultTime = '09:00',
  minuteStep,
  minDate,
  maxDate,
  disabled,
  readOnly,
  invalid,
  size,
  timeZone,
  'aria-label': ariaLabel,
  className,
  locale,
  sheet,
}: DateTimePickerProps) {
  const change = (v: Date | undefined) => onValueChange?.(v);
  const messages = useNexubMessages();
  const intlLocale = useIntlLocale();
  // The time typed before a date exists.
  const [pendingTime, setPendingTime] = React.useState(defaultTime);
  const time = value ? timeOf(value) : pendingTime;
  const zoneName = timeZone
    ? (new Intl.DateTimeFormat(intlLocale, { timeZone, timeZoneName: 'shortOffset' })
        .formatToParts(value ?? new Date())
        .find((p) => p.type === 'timeZoneName')?.value ?? timeZone)
    : undefined;

  return (
    <div role="group" aria-label={ariaLabel} className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="min-w-40 flex-1">
        <DatePicker
          aria-label={messages.dateLabel}
          value={value}
          onValueChange={(date) => change(date ? withTime(date, time) : undefined)}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          readOnly={readOnly}
          invalid={invalid}
          size={size}
          locale={locale}
          sheet={sheet}
        />
      </div>
      <TimePicker
        aria-label={messages.timeLabel}
        wrapperClassName="w-36"
        value={time}
        minuteStep={minuteStep}
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
        size={size}
        onValueChange={(next) => {
          if (!next) return;
          if (value) change(withTime(value, next));
          else setPendingTime(next);
        }}
      />
      {zoneName && (
        <span className="text-body-sm text-[var(--color-on-surface-muted)]">
          {messages.timeZoneLabel(`${zoneName} (${timeZone})`)}
        </span>
      )}
    </div>
  );
}

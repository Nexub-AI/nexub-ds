'use client';

import * as React from 'react';
import { Input, type InputProps } from '../Input/Input.js';
import { useControllableState } from '../../hooks/useControllableState.js';

export interface TimePickerProps
  extends Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange' | 'step'> {
  /** 24-hour `"HH:mm"`; the field shows 12 or 24 hours from the reader's locale. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Minutes between steps for the arrow keys and the picker. @default 1 */
  minuteStep?: number;
}

/**
 * A time field built on the native `<input type="time">`: locale-aware 12/24h,
 * keyboard segments, the platform's picker on phones, and form submission.
 */
export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(
  { value: valueProp, defaultValue, onValueChange, minuteStep = 1, ...props },
  ref,
) {
  const [value = '', setValue] = useControllableState<string>({
    value: valueProp,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  });
  return (
    <Input
      ref={ref}
      type="time"
      step={minuteStep * 60}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
});

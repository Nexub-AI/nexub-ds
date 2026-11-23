// 11.8 (native catch-up I: fields): DateTimeField as the twin of web DatePicker
// (granularity, presets, disabledDates…), TimePicker (minuteStep, clearable…) and
// DateTimePicker (datetime, defaultTime, timeZone…), and the OTPInput props web has.
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { ArrowRight } from '@nexub/icons/native';
import { DateTimeField, NexubNativeProvider, OTPInput } from '../index';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));
jest.mock('@react-native-community/datetimepicker', () => {
  /* eslint-disable @typescript-eslint/no-require-imports -- jest.mock factories can't use imports */
  const { View } = require('react-native');
  const { createElement } = require('react');
  /* eslint-enable @typescript-eslint/no-require-imports */
  const Picker = (props: object) => createElement(View, { testID: 'picker', ...props });
  return { __esModule: true, default: Picker, DateTimePickerAndroid: { open: jest.fn() } };
});

// Sheets unmount from the close spring's completion; land springs at once.
// eslint-disable-next-line @typescript-eslint/no-require-imports -- patching the jest.setup stub
const Reanimated = require('react-native-reanimated');
Reanimated.withSpring = (to: number, _c: unknown, done?: (f: boolean) => void) => (done?.(true), to);
Reanimated.runOnJS = (fn: (...a: unknown[]) => void) => fn;

const Provider = ({ children }: { children: React.ReactNode }) => (
  <NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
    {children}
  </NexubNativeProvider>
);
const wrap = (ui: React.ReactElement) => render(ui, { wrapper: Provider });
const style = (el: { props: { style?: unknown } }) => StyleSheet.flatten(el.props.style as never) ?? {};
const withOS = async (os: typeof Platform.OS, fn: () => Promise<void>) => {
  const prev = Platform.OS;
  Platform.OS = os;
  try {
    await fn();
  } finally {
    Platform.OS = prev;
  }
};
const lastAndroid = () => (DateTimePickerAndroid.open as jest.Mock).mock.lastCall[0];

beforeEach(() => (DateTimePickerAndroid.open as jest.Mock).mockClear());

// ─── DateTimeField: DatePicker gaps ──────────────────────────────────────────

describe('DateTimeField granularity', () => {
  it('month: a sheet of twelve full month names, named with the year; picks a YYYY-MM string', async () => {
    const onValueChange = jest.fn();
    await wrap(<DateTimeField label="Billing month" granularity="month" value="2026-03" onValueChange={onValueChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Billing month, March 2026' }));
    expect(screen.getByText('September')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'March 2026' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'April 2026' })).not.toBeSelected();
    await fireEvent.press(screen.getByRole('button', { name: 'Go to next year' }));
    await fireEvent.press(screen.getByRole('button', { name: 'July 2027' }));
    expect(onValueChange).toHaveBeenCalledWith('2027-07');
    expect(screen.queryByRole('button', { name: 'July 2027' })).toBeNull();
  });

  it('month: minDate and maxDate disable the months outside them; empty shows "Pick a month"', async () => {
    await wrap(
      <DateTimeField
        label="Month"
        granularity="month"
        defaultValue={null}
        minDate={new Date(2026, 1, 20)}
        maxDate={new Date(2026, 9, 1)}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Month, Pick a month' }));
    expect(screen.getByRole('button', { name: 'January 2026' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'February 2026' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'October 2026' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'November 2026' })).toBeDisabled();
  });

  it('year: pages of twelve years; uncontrolled value updates the field', async () => {
    const onValueChange = jest.fn();
    await wrap(<DateTimeField label="Year" granularity="year" defaultValue="2026" onValueChange={onValueChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Year, 2026' }));
    expect(screen.getByText('2016 – 2027')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Go to previous years' }));
    expect(screen.getByText('2004 – 2015')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: '2010' }));
    expect(onValueChange).toHaveBeenCalledWith('2010');
    expect(screen.getByRole('button', { name: 'Year, 2010' })).toBeTruthy();
  });

  it('month on Android uses the same Nexub sheet, never the OS dialog', () =>
    withOS('android', async () => {
      await wrap(<DateTimeField label="Month" granularity="month" value="2026-03" />);
      await fireEvent.press(screen.getByRole('button', { name: 'Month, March 2026' }));
      expect(DateTimePickerAndroid.open).not.toHaveBeenCalled();
      expect(screen.getByRole('button', { name: 'December 2026' })).toBeTruthy();
    }));
});

describe('DateTimeField states', () => {
  const value = new Date(2026, 9, 30, 10, 0);

  it('disabled: read as disabled and never opens', async () => {
    await wrap(<DateTimeField label="Date" value={value} disabled />);
    const field = screen.getByRole('button', { name: 'Date, Oct 30, 2026' });
    expect(field).toBeDisabled();
    await fireEvent.press(field);
    expect(screen.queryByTestId('picker')).toBeNull();
  });

  it('readOnly: shows the value as text, never opens, no clear button', async () => {
    await wrap(<DateTimeField label="Date" value={value} readOnly clearable />);
    const field = screen.getByLabelText('Date, Oct 30, 2026');
    expect(field.props.accessibilityRole).toBe('text');
    await fireEvent.press(field);
    expect(screen.queryByTestId('picker')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });

  it('invalid and error: marked invalid; the error is shown and read as the hint', async () => {
    await wrap(<DateTimeField label="Date" value={value} error="Pick a weekday" />);
    const field = screen.getByRole('button', { name: 'Date, Oct 30, 2026' });
    expect(field.props['aria-invalid']).toBe(true);
    expect(field.props.accessibilityHint).toBe('Pick a weekday');
    expect(screen.getByText('Pick a weekday')).toBeTruthy();
    await screen.unmount();
    await wrap(<DateTimeField label="Date" value={value} invalid />);
    expect(screen.getByRole('button', { name: 'Date, Oct 30, 2026' }).props['aria-invalid']).toBe(true);
  });

  it('locale formats the text; size sets the height', async () => {
    await wrap(<DateTimeField label="Datum" value={value} locale="de-DE" size="md" />);
    expect(screen.getByText('30.10.2026')).toBeTruthy();
    const height = () => style(screen.container.queryAll((n) => n.type === 'View' && style(n).minHeight > 0)[0]!).minHeight;
    const md = height();
    await screen.unmount();
    await wrap(<DateTimeField label="Datum" value={value} size="xl" />);
    expect(height()).toBeGreaterThan(md);
  });

  it('presets: chips set the value; a preset on a disabled day is disabled', async () => {
    const onValueChange = jest.fn();
    const tomorrow = new Date(2026, 9, 31);
    const sunday = new Date(2026, 10, 1);
    await wrap(
      <DateTimeField
        label="Date"
        value={null}
        onValueChange={onValueChange}
        disabledDates={{ dayOfWeek: [0] }}
        presets={[
          { label: 'Tomorrow', date: tomorrow },
          { label: 'Sunday', date: sunday },
        ]}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Tomorrow' }));
    expect(onValueChange).toHaveBeenCalledWith(tomorrow);
    expect(screen.getByRole('button', { name: 'Sunday' })).toBeDisabled();
  });

  it('disabledDates: a disabled day from the iOS picker keeps the value and says why', async () => {
    const onValueChange = jest.fn();
    await wrap(
      <DateTimeField
        label="Date"
        value={value}
        onValueChange={onValueChange}
        disabledDates={[new Date(2026, 10, 2), (d: Date) => d.getDate() === 13]}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Date, Oct 30, 2026' }));
    await fireEvent(screen.getByTestId('picker'), 'change', {}, new Date(2026, 10, 2));
    await fireEvent(screen.getByTestId('picker'), 'change', {}, new Date(2026, 10, 13));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByText('Nov 13, 2026, unavailable')).toBeTruthy();
    await fireEvent(screen.getByTestId('picker'), 'change', {}, new Date(2026, 10, 3));
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 10, 3));
  });

  it('disabledDates on Android: before / after rules reject the dialog pick', () =>
    withOS('android', async () => {
      const onValueChange = jest.fn();
      await wrap(
        <DateTimeField
          label="Date"
          value={value}
          onValueChange={onValueChange}
          disabledDates={[{ before: new Date(2026, 9, 1) }, { after: new Date(2026, 11, 31) }]}
        />,
      );
      await fireEvent.press(screen.getByRole('button', { name: 'Date, Oct 30, 2026' }));
      await React.act(() => lastAndroid().onChange({ type: 'set' }, new Date(2027, 0, 1)));
      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.getByText('Jan 1, 2027, unavailable')).toBeTruthy();
    }));

  it('string day values are read as dates', async () => {
    await wrap(<DateTimeField label="Date" value="2026-10-30" />);
    expect(screen.getByRole('button', { name: 'Date, Oct 30, 2026' })).toBeTruthy();
  });
});

// ─── DateTimeField: TimePicker gaps ──────────────────────────────────────────

describe('DateTimeField time', () => {
  it('minuteStep: the iOS wheel steps; Android rounds the picked time', async () => {
    await wrap(<DateTimeField label="At" mode="time" value={new Date(2026, 9, 30, 10, 0)} minuteStep={15} />);
    await fireEvent.press(screen.getByRole('button', { name: /^At, / }));
    expect(screen.getByTestId('picker').props.minuteInterval).toBe(15);
    await screen.unmount();
    await withOS('android', async () => {
      const onValueChange = jest.fn();
      await wrap(<DateTimeField label="At" mode="time" value={null} minuteStep={15} onValueChange={onValueChange} />);
      await fireEvent.press(screen.getByRole('button', { name: 'At, Pick a date' }));
      await React.act(() => lastAndroid().onChange({ type: 'set' }, new Date(2026, 9, 30, 10, 53)));
      expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 9, 30, 11, 0));
    });
  });

  it('defaultValue, clearable, loading, icons and addons', async () => {
    const onValueChange = jest.fn();
    await wrap(
      <DateTimeField
        label="At"
        mode="time"
        defaultValue={new Date(2026, 9, 30, 9, 30)}
        onValueChange={onValueChange}
        clearable
        loading
        trailingIcon={ArrowRight}
        leadingAddon="From"
        trailingAddon="local"
      />,
    );
    const field = screen.getByRole('button', { name: 'At, From 9:30 AM local' });
    expect(field).toBeBusy();
    expect(screen.getByText('From')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Clear' }));
    expect(onValueChange).toHaveBeenCalledWith(null);
    expect(screen.getByRole('button', { name: 'At, From Pick a date local' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });
});

// ─── DateTimeField: DateTimePicker gaps ──────────────────────────────────────

describe('DateTimeField datetime', () => {
  it('iOS: one field and one picker for date and time; the text shows both', async () => {
    const onValueChange = jest.fn();
    await wrap(<DateTimeField label="Starts" mode="datetime" value={new Date(2026, 9, 30, 14, 5)} onValueChange={onValueChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Starts, Oct 30, 2026, 2:05 PM' }));
    expect(screen.getByTestId('picker').props.mode).toBe('datetime');
  });

  it('Android: the date dialog, then the time dialog; an empty field starts at defaultTime', () =>
    withOS('android', async () => {
      const onValueChange = jest.fn();
      await wrap(
        <DateTimeField label="Starts" mode="datetime" value={null} defaultTime="14:30" minuteStep={10} onValueChange={onValueChange} />,
      );
      await fireEvent.press(screen.getByRole('button', { name: 'Starts, Pick a date' }));
      const first = lastAndroid();
      expect(first.mode).toBe('date');
      expect([first.value.getHours(), first.value.getMinutes()]).toEqual([14, 30]);
      await React.act(() => first.onChange({ type: 'set' }, new Date(2026, 9, 30, 14, 30)));
      const second = lastAndroid();
      expect(second.mode).toBe('time');
      await React.act(() => second.onChange({ type: 'set' }, new Date(2026, 9, 30, 16, 4)));
      expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 9, 30, 16, 0));
    }));

  it('timeZone: shown in that zone, named under the field, passed to the picker', async () => {
    // 12:00 UTC is 21:00 in Tokyo.
    await wrap(<DateTimeField label="Call" mode="datetime" value={new Date(Date.UTC(2026, 9, 30, 12, 0))} timeZone="Asia/Tokyo" />);
    await fireEvent.press(screen.getByRole('button', { name: 'Call, Oct 30, 2026, 9:00 PM' }));
    expect(screen.getByText(/^Time zone: /)).toBeTruthy();
    expect(screen.getByTestId('picker').props.timeZoneName).toBe('Asia/Tokyo');
  });

  it('presets in datetime mode keep the time', async () => {
    const onValueChange = jest.fn();
    await wrap(
      <DateTimeField
        label="Starts"
        mode="datetime"
        value={new Date(2026, 9, 30, 14, 5)}
        onValueChange={onValueChange}
        presets={[{ label: 'Next day', date: new Date(2026, 9, 31) }]}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Next day' }));
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 9, 31, 14, 5));
  });
});

// ─── OTPInput ────────────────────────────────────────────────────────────────

describe('OTPInput (11.8)', () => {
  it('defaultValue fills an uncontrolled field; name is the nativeID', async () => {
    await wrap(<OTPInput label="Code" defaultValue="123" name="otp" />);
    const input = screen.getByLabelText('Code');
    expect(input.props.value).toBe('123');
    expect(input.props.nativeID).toBe('otp');
  });

  it('disabled: not editable, read as disabled; readOnly ignores typing', async () => {
    const onValueChange = jest.fn();
    await wrap(<OTPInput label="Code" disabled />);
    expect(screen.getByLabelText('Code').props.editable).toBe(false);
    expect(screen.getByLabelText('Code')).toBeDisabled();
    await screen.unmount();
    await wrap(<OTPInput label="Code" readOnly defaultValue="12" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('Code');
    expect(input.props.readOnly).toBe(true);
    input.props.onChangeText('123');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('invalid marks it for screen readers; size changes the boxes', async () => {
    await wrap(<OTPInput label="Code" invalid size="lg" length={4} />);
    expect(screen.getByLabelText('Code').props['aria-invalid']).toBe(true);
    const boxes = screen.container.queryAll((n) => n.type === 'View' && style(n).width === 48 && style(n).height === 56);
    expect(boxes).toHaveLength(4);
  });

  it('backup: capitals keyboard without suggestions, defaultValue, disabled and invalid', async () => {
    await wrap(<OTPInput label="Backup code" mode="backup" defaultValue="abcd1234" invalid disabled name="backup" />);
    const input = screen.getByLabelText('Backup code');
    expect(input.props.value).toBe('abcd-1234');
    expect(input.props.autoCapitalize).toBe('characters');
    expect(input.props.keyboardType).toBe('ascii-capable');
    expect(input.props['aria-invalid']).toBe(true);
    expect(input.props.editable).toBe(false);
    expect(input.props.nativeID).toBe('backup');
  });
});

import * as React from 'react';
import { Platform, Text as RNText } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Plus } from '@nexub/icons/native';
import {
  ContextMenu,
  ExpressiveMoneyInput,
  FAB,
  NexubNativeProvider,
  OTPInput,
  PageIndicator,
  Select,
  SensitiveValue,
  SwipeableRow,
} from '../index';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

const wrap = (ui: React.ReactElement) =>
  render(
    <NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
      {ui}
    </NexubNativeProvider>,
  );

it('OTPInput: one field with OTP autofill, completes at full length', async () => {
  const onComplete = jest.fn();
  await wrap(<OTPInput label="Verification code" onComplete={onComplete} />);
  const field = screen.getByLabelText('Verification code');
  expect(field.props.textContentType).toBe('oneTimeCode');
  expect(field.props.autoComplete).toBe('sms-otp');
  await fireEvent.changeText(field, '12a34');
  expect(onComplete).not.toHaveBeenCalled();
  await fireEvent.changeText(field, '123456');
  expect(onComplete).toHaveBeenCalledWith('123456');
});

it('ExpressiveMoneyInput: keypad builds an amount, capped at the currency minor units', async () => {
  const onValue = jest.fn();
  await wrap(<ExpressiveMoneyInput label="Amount" currency="USD" onValueChange={onValue} />);
  for (const k of ['4', '2', '.', '5', '0', '9']) await fireEvent.press(screen.getByRole('button', { name: k }));
  expect(onValue).toHaveBeenLastCalledWith(42.5);
  await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
  expect(onValue).toHaveBeenLastCalledWith(42.5);
});

it('SensitiveValue: masked reads "hidden", the toggle reveals', async () => {
  await wrap(<SensitiveValue label="Balance">$12,480.50</SensitiveValue>);
  expect(screen.getByLabelText('Balance, Hidden')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Show Balance' }));
  expect(screen.getByText('$12,480.50')).toBeTruthy();
});

it('SwipeableRow: every swipe action is an accessibility action', async () => {
  const onDelete = jest.fn();
  await wrap(
    <SwipeableRow label="Amazon, $42.50" onPress={() => {}} actions={[{ label: 'Delete', tone: 'danger', onPress: onDelete }]}>
      <RNText>Row</RNText>
    </SwipeableRow>,
  );
  const row = screen.getByRole('button', { name: 'Amazon, $42.50' });
  await fireEvent(row, 'accessibilityAction', { nativeEvent: { actionName: 'Delete' } });
  expect(onDelete).toHaveBeenCalled();
});

it('ContextMenu: long-press actions are reachable as accessibility actions', async () => {
  const onCopy = jest.fn();
  await wrap(
    <ContextMenu accessibilityLabel="IBAN" actions={[{ label: 'Copy', onPress: onCopy }]}>
      <RNText>GB33 BUKB 2020 1555 5555 55</RNText>
    </ContextMenu>,
  );
  await fireEvent(screen.getByRole('button', { name: 'IBAN' }), 'accessibilityAction', { nativeEvent: { actionName: 'Copy' } });
  expect(onCopy).toHaveBeenCalled();
});

it('Select: opens a sheet of radio rows and picks one', async () => {
  const onChange = jest.fn();
  await wrap(
    <Select
      label="Currency"
      placeholder="Choose"
      onValueChange={onChange}
      options={[
        { value: 'USD', label: 'US dollar' },
        { value: 'EUR', label: 'Euro' },
      ]}
    />,
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Currency, Choose' }));
  await fireEvent.press(screen.getByRole('radio', { name: 'Euro' }));
  expect(onChange).toHaveBeenCalledWith('EUR');
});

it('PageIndicator announces the page', async () => {
  await wrap(<PageIndicator count={4} index={1} />);
  expect(screen.getByLabelText('Page 2 of 4')).toBeTruthy();
});

it('FAB renders on Android only by default', async () => {
  const os = Platform.OS;
  await wrap(<FAB icon={Plus} label="New transfer" onPress={() => {}} />);
  expect(screen.queryByRole('button', { name: 'New transfer' })).toBeNull(); // jest-expo default is iOS
  Platform.OS = 'android';
  await wrap(<FAB icon={Plus} label="New transfer" onPress={() => {}} />);
  expect(screen.getByRole('button', { name: 'New transfer' })).toBeTruthy();
  Platform.OS = os;
});

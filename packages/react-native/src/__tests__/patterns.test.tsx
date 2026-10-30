import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { NexubNativeProvider } from '../index';
import { ActivityList, AmountStep, ReviewStep, SignInScreen, VerifyCodeScreen } from '../patterns';

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

it('SignInScreen submits email and password; disabled until both are filled', async () => {
  const onSubmit = jest.fn();
  await wrap(<SignInScreen onSubmit={onSubmit} />);
  expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled();
  await fireEvent.changeText(screen.getByLabelText('Email'), 'asha@example.com');
  await fireEvent.changeText(screen.getByLabelText('Password'), 'correct horse');
  await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
  expect(onSubmit).toHaveBeenCalledWith('asha@example.com', 'correct horse');
});

it('VerifyCodeScreen completes with the code and holds Resend until the countdown ends', async () => {
  const onComplete = jest.fn();
  await wrap(<VerifyCodeScreen destination="+65 •••• 4821" onComplete={onComplete} onResend={() => {}} />);
  expect(screen.getByRole('button', { name: 'Resend code in 30s' })).toBeDisabled();
  await fireEvent.changeText(screen.getByLabelText('Verification code'), '424242');
  expect(onComplete).toHaveBeenCalledWith('424242');
});

it('AmountStep blocks amounts over the balance and shows the quote', async () => {
  const onContinue = jest.fn();
  await wrap(<AmountStep from="USD" to="EUR" balance={100} quote={() => ({ fee: 1, rate: 0.9, arrives: 'In seconds' })} onContinue={onContinue} />);
  for (const k of ['2', '0', '0']) await fireEvent.press(screen.getByRole('button', { name: k }));
  expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
  expect(screen.getByText('In seconds')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
  expect(onContinue).toHaveBeenCalledWith(20);
});

it('ReviewStep shows every row and confirms', async () => {
  const onConfirm = jest.fn();
  await wrap(<ReviewStep rows={[{ label: 'Fee', value: '$1.00' }]} confirmLabel="Confirm and send" onConfirm={onConfirm} />);
  expect(screen.getByLabelText('Fee, $1.00')).toBeTruthy(); // one element per row
  await fireEvent.press(screen.getByRole('button', { name: 'Confirm and send' }));
  expect(onConfirm).toHaveBeenCalled();
});

it('ActivityList groups by day and reads each row as one element', async () => {
  const d = new Date(2026, 9, 29, 12);
  await wrap(<ActivityList transactions={[{ id: '1', title: 'Amazon', amount: -42.5, currency: 'USD', date: d }]} onPress={() => {}} />);
  expect(screen.getByRole('header', { name: 'Oct 29, 2026' })).toBeTruthy();
  expect(screen.getByRole('button', { name: /Amazon/ })).toBeTruthy();
});

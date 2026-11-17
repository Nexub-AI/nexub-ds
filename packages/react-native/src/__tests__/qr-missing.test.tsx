// 10.9: QRScanner when the optional peer expo-camera is not installed.
import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NexubNativeProvider, QRScanner, Text } from '../index';

jest.mock(
  'expo-camera',
  () => {
    throw new Error("Cannot find module 'expo-camera'");
  },
  { virtual: true },
);

const ui = (fallback?: React.ReactNode) => (
  <NexubNativeProvider scheme="light" contrast="standard">
    <QRScanner onScan={() => {}} fallback={fallback} />
  </NexubNativeProvider>
);

it('shows the fallback, or says scanning is not available', async () => {
  await render(ui(<Text>Type the code</Text>));
  expect(screen.getByText('Type the code')).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Allow camera' })).toBeNull();
  await screen.rerender(ui());
  expect(screen.getByText('Scanning isn’t available on this device.')).toBeTruthy();
});

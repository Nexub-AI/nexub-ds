import * as React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { NexubMark, PayubMark } from '@nexub/icons/native';
import { NexubNativeProvider, Skeleton, SkeletonSwap } from '../index';

const wrap = (ui: React.ReactElement) =>
  render(<NexubNativeProvider scheme="light" contrast="standard" fonts="system">{ui}</NexubNativeProvider>);

const swap = (loading: boolean) => (
  <NexubNativeProvider scheme="light" contrast="standard" fonts="system">
    <SkeletonSwap testID="swap" loading={loading} skeleton={<Skeleton height={40} />}>
      <Text>Balance</Text>
    </SkeletonSwap>
  </NexubNativeProvider>
);

describe('SkeletonSwap', () => {
  it('shows the skeleton and is busy while loading, then swaps to the content', async () => {
    const { rerender } = await render(swap(true));
    expect(screen.queryByText('Balance')).toBeNull();
    expect(screen.getByTestId('swap').props.accessibilityState).toMatchObject({ busy: true });

    await rerender(swap(false));
    expect(screen.getByText('Balance')).toBeTruthy();
    expect(screen.getByTestId('swap').props.accessibilityState).toMatchObject({ busy: false });
  });

  it('shows ready content straight away', async () => {
    await render(swap(false));
    expect(screen.getByText('Balance')).toBeTruthy();
  });
});

describe('native marks', () => {
  it('render with an accessible name, mono and colour', async () => {
    await wrap(
      <>
        <NexubMark label="Nexub" variant="color" />
        <NexubMark label="Nexub mono" />
        <PayubMark label="Payub" size="lg" color="#123456" />
      </>,
    );
    expect(screen.getByLabelText('Nexub')).toBeTruthy();
    expect(screen.getByLabelText('Nexub mono')).toBeTruthy();
    expect(screen.getByLabelText('Payub')).toBeTruthy();
  });
});

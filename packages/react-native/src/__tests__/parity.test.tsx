// 7.8: web props from 7.4–7.6 ported to native, one test per prop.
import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { native } from '@nexub/tokens/native';
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  NexubNativeProvider,
  Progress,
  Skeleton,
  SkeletonText,
  Switch,
  TextField,
} from '../index';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

const roles = native.color.roles.standard.light;
const Provider = ({ children }: { children: React.ReactNode }) => (
  <NexubNativeProvider scheme="light" contrast="standard">
    {children}
  </NexubNativeProvider>
);
const wrap = (ui: React.ReactElement) => render(ui, { wrapper: Provider });
type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] | null };
const nodes = (n: unknown = screen.toJSON()): Node[] => {
  if (!n || typeof n !== 'object') return [];
  if (Array.isArray(n)) return n.flatMap((c) => nodes(c));
  const node = n as Node;
  return [node, ...nodes(node.children)];
};
const style = (n: Node) => Object.assign({}, ...[n.props.style].flat(Infinity as 1).filter(Boolean));
const spinners = () => nodes().filter((n) => n.type === 'ActivityIndicator');

describe('Button loading spinner timing', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('waits 150ms to show, then stays at least 400ms; busy at once', async () => {
    await wrap(<Button>Pay</Button>);
    await screen.rerender(<Button loading>Pay</Button>);
    expect(screen.getByRole('button', { name: 'Pay' })).toBeBusy();
    expect(spinners()).toHaveLength(0);
    await act(() => jest.advanceTimersByTime(150));
    expect(spinners()).toHaveLength(1);
    await screen.rerender(<Button>Pay</Button>);
    await act(() => jest.advanceTimersByTime(300));
    expect(spinners()).toHaveLength(1);
    await act(() => jest.advanceTimersByTime(100));
    expect(spinners()).toHaveLength(0);
  });

  it('mounting already loading shows the spinner at once', async () => {
    await wrap(<Button loading>Pay</Button>);
    expect(spinners()).toHaveLength(1);
  });
});

describe('Skeleton', () => {
  it('animation="shimmer" adds the sweep band; pulse (default) does not', async () => {
    await wrap(<Skeleton />);
    expect(screen.queryByTestId('skeleton-shimmer', { includeHiddenElements: true })).toBeNull();
    await screen.rerender(<Skeleton animation="shimmer" />);
    expect(screen.getByTestId('skeleton-shimmer', { includeHiddenElements: true })).toBeTruthy();
  });

  it('SkeletonText draws `lines` rows, the last one shorter', async () => {
    await wrap(<SkeletonText lines={4} />);
    const widths = nodes().map(style).filter((st) => st.height === 12).map((st) => st.width);
    expect(widths).toEqual(['100%', '100%', '100%', '60%']);
  });
});

describe('Avatar status', () => {
  it('adds the presence to the accessible name and colours the dot', async () => {
    await wrap(<Avatar name="Ada Lovelace" status="away" />);
    expect(screen.getByRole('image', { name: 'Ada Lovelace, Away' })).toBeTruthy();
    expect(nodes().some((n) => style(n).backgroundColor === roles.warning)).toBe(true);
  });
});

describe('Progress segments', () => {
  it('splits the bar into steps filled up to the value', async () => {
    await wrap(<Progress value={0.5} label="Upload" segments={4} />);
    expect(screen.getByRole('progressbar', { name: 'Upload' })).toBeTruthy();
    expect(screen.getAllByTestId('progress-segment-filled')).toHaveLength(2);
    expect(screen.getAllByTestId('progress-segment')).toHaveLength(2);
  });
});

describe('TextField', () => {
  it('clearable clears an uncontrolled value and fires onChangeText("")', async () => {
    const onChangeText = jest.fn();
    await wrap(<TextField label="Name" clearable defaultValue="Ada" onChangeText={onChangeText} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Clear' }));
    expect(onChangeText).toHaveBeenLastCalledWith('');
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });

  it('clearable: no button when empty or disabled', async () => {
    await wrap(<TextField label="Name" clearable />);
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
    await screen.rerender(<TextField label="Name" clearable disabled defaultValue="x" />);
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });

  it('showCount shows length/maxLength and tracks typing', async () => {
    await wrap(<TextField label="Bio" showCount maxLength={10} defaultValue="abc" />);
    expect(screen.getByText('3/10')).toBeTruthy();
    expect(screen.getByLabelText('3 of 10 characters')).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Bio'), 'abcdefghij');
    expect(screen.getByText('10/10').props.accessibilityLiveRegion).toBe('polite');
  });

  it('loading shows a spinner and reports busy', async () => {
    await wrap(<TextField label="Handle" loading />);
    expect(spinners()).toHaveLength(1);
    expect(screen.getByLabelText('Handle')).toBeBusy();
  });
});

describe('Switch loading', () => {
  it('shows a spinner, reports busy and does not toggle', async () => {
    const onChange = jest.fn();
    await wrap(<Switch label="Face ID" loading onCheckedChange={onChange} />);
    const sw = screen.getByLabelText('Face ID');
    expect(sw).toBeBusy();
    expect(sw).toBeDisabled();
    expect(spinners()).toHaveLength(1);
  });
});

describe('Badge count', () => {
  it('caps at max with "99+" and keeps the full number for screen readers', async () => {
    await wrap(<Badge count={120} />);
    expect(screen.getByText('99+').props.accessibilityLabel).toBe('120');
    await screen.rerender(<Badge count={7} max={9} />);
    expect(screen.getByText('7')).toBeTruthy();
    await screen.rerender(<Badge count={10} max={9} />);
    expect(screen.getByText('9+')).toBeTruthy();
  });
});

describe('EmptyState size', () => {
  it('scales the icon disc; md stays the default 64', async () => {
    const disc = () =>
      nodes().map(style).find((st) => st.width && st.borderRadius === st.width / 2)?.width;
    await wrap(<EmptyState title="Nothing yet" />);
    expect(disc()).toBe(64);
    await screen.rerender(<EmptyState title="Nothing yet" size="sm" />);
    expect(disc()).toBe(48);
    await screen.rerender(<EmptyState title="Nothing yet" size="lg" />);
    expect(disc()).toBe(80);
  });
});

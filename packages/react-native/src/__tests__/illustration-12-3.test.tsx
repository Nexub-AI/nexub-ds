// 12.3: Illustration, and the opt-in `illustration` art on EmptyState, ErrorState and ResultScreen.
import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import { EmptyState, ErrorState, Illustration, NexubNativeProvider, type IllustrationKind } from '../index';
import { ResultScreen } from '../patterns';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

type Scheme = 'light' | 'dark';
const wrap = (ui: React.ReactElement, scheme: Scheme = 'light') =>
  render(
    <NexubNativeProvider scheme={scheme} contrast="standard">
      {ui}
    </NexubNativeProvider>,
  );
type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] | null };
const nodes = (n: unknown = screen.toJSON()): Node[] => {
  if (!n || typeof n !== 'object') return [];
  if (Array.isArray(n)) return n.flatMap((c) => nodes(c));
  const node = n as Node;
  return [node, ...nodes(node.children)];
};
const flat = (n: Node) => Object.assign({}, ...[n.props.style].flat(Infinity as 1).filter(Boolean)) as Record<string, number>;
// Decorative art is hidden from the accessibility tree, so queries must opt in to see it.
const hidden = { includeHiddenElements: true };
const kinds: IllustrationKind[] = ['noData', 'noResults', 'noAccess', 'serverError', 'offline', 'notFound', 'maintenance', 'success'];
// Every paint any shape uses, as the renderer stores it.
const paints = () =>
  nodes()
    .flatMap((n) => [n.props.fill, n.props.stroke])
    .filter((v) => v !== undefined && v !== null && v !== 'none')
    .map((v) => JSON.stringify(v));

describe('Illustration', () => {
  it.each(kinds)('%s is decorative by default and hidden from screen readers', async (kind) => {
    await wrap(<Illustration kind={kind} testID="art" />);
    const art = screen.getByTestId('art', hidden);
    expect(art.props.accessible).toBe(false);
    expect(art.props.accessibilityElementsHidden).toBe(true);
    expect(art.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(screen.queryByRole('image')).toBeNull();
    expect(screen.queryByTestId('art')).toBeNull();
  });

  it('is an image named by its title (screen readers read the title)', async () => {
    await wrap(<Illustration kind="offline" title="You are offline" />);
    expect(screen.getByRole('image', { name: 'You are offline' })).toBeTruthy();
  });

  it('sizes 80, 120 or 160 pt wide at 5:4; md by default', async () => {
    const box = () => flat(screen.getByTestId('art', hidden) as unknown as Node);
    await wrap(<Illustration kind="noData" testID="art" />);
    expect(box()).toMatchObject({ width: 120, height: 96 });
    await screen.rerender(
      <NexubNativeProvider scheme="light" contrast="standard">
        <Illustration kind="noData" size="sm" testID="art" />
      </NexubNativeProvider>,
    );
    expect(box()).toMatchObject({ width: 80, height: 64 });
    await screen.rerender(
      <NexubNativeProvider scheme="light" contrast="standard">
        <Illustration kind="noData" size="lg" testID="art" />
      </NexubNativeProvider>,
    );
    expect(box()).toMatchObject({ width: 160, height: 128 });
  });

  it('paints with theme roles, so dark mode repaints it', async () => {
    await wrap(<Illustration kind="success" />, 'light');
    const light = paints();
    expect(light.length).toBeGreaterThan(2);
    await screen.unmount();
    await wrap(<Illustration kind="success" />, 'dark');
    expect(paints()).not.toEqual(light);
  });
});

describe('opt-in illustration art', () => {
  const disc = () => nodes().some((n) => {
    const st = flat(n);
    return !!st.width && st.borderRadius === st.width / 2;
  });

  it('EmptyState keeps its icon disc unless given art', async () => {
    await wrap(<EmptyState title="Nothing yet" />);
    expect(disc()).toBe(true);
    await screen.unmount();
    await wrap(<EmptyState title="Nothing yet" illustration={<Illustration kind="noData" testID="art" />} />);
    expect(disc()).toBe(false);
    expect(screen.getByTestId('art', hidden)).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Nothing yet' })).toBeTruthy();
  });

  it('ErrorState passes the art through and keeps Retry', async () => {
    await wrap(<ErrorState title="Couldn’t load" onRetry={() => {}} illustration={<Illustration kind="serverError" testID="art" />} />);
    expect(screen.getByTestId('art', hidden)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
  });

  it('ResultScreen shows the art in place of the disc', async () => {
    await wrap(
      <ResultScreen title="Sent" primary={{ label: 'Done', onPress: () => {} }} illustration={<Illustration kind="success" testID="art" />} />,
    );
    expect(screen.getByTestId('art', hidden)).toBeTruthy();
    expect(disc()).toBe(false);
  });
});

// 11.8: the web props the native twins were missing (ROADMAP_12.x.md § 11.8).
import * as React from 'react';
import { AccessibilityInfo, Linking, Text as RNText } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Plus } from '@nexub/icons/native';
import { native } from '@nexub/tokens/native';
import {
  Avatar,
  AvatarGroup,
  Button,
  ButtonGroup,
  Card,
  Divider,
  IconButton,
  InlineEdit,
  Link,
  NexubNativeProvider,
  PhoneInput,
  Skeleton,
  StatCard,
  StepProgress,
  Table,
  TreeList,
  useTheme,
  type Roles,
  type TreeListNode,
} from '../index';
import { ActivityList } from '../patterns';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

let roles: Roles;
function ReadRoles() {
  roles = useTheme().roles;
  return null;
}
const Provider = ({ children }: { children: React.ReactNode }) => (
  <NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
    <ReadRoles />
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
const flat = (s: unknown) => Object.assign({}, ...[s].flat(Infinity as 1).filter(Boolean));
const styleOf = (n: { props: Record<string, unknown> }) => flat(n.props.style);

afterEach(() => jest.restoreAllMocks());

// ─── TreeList ────────────────────────────────────────────────────────────────

const team: TreeListNode[] = [
  { id: 'eng', title: 'Engineering', children: [{ id: 'ada', title: 'Ada' }, { id: 'bo', title: 'Bo' }] },
  { id: 'ops', title: 'Ops' },
];

describe('TreeList', () => {
  it('checks a whole branch from the parent box, and rolls a child back up as mixed', async () => {
    const onCheckedChange = jest.fn();
    await wrap(<TreeList rootTitle="Teams" nodes={team} checkable onCheckedChange={onCheckedChange} />);
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Engineering' }));
    expect(new Set(onCheckedChange.mock.lastCall[0])).toEqual(new Set(['eng', 'ada', 'bo']));
    expect(screen.getByRole('checkbox', { name: 'Engineering' })).toBeChecked();

    // Into the branch: unchecking one child unchecks the parent, which then reads mixed.
    await fireEvent.press(screen.getByText('Engineering'));
    await fireEvent.press(screen.getByText('Ada'));
    expect(new Set(onCheckedChange.mock.lastCall[0])).toEqual(new Set(['bo']));
    await fireEvent.press(screen.getByText('Back to Teams'));
    expect(screen.getByRole('checkbox', { name: 'Engineering' })).toBePartiallyChecked();
  });

  it('takes defaultChecked and checks leaves at the top level', async () => {
    const onCheckedChange = jest.fn();
    await wrap(<TreeList rootTitle="Teams" nodes={team} checkable defaultChecked={['ops']} onCheckedChange={onCheckedChange} />);
    expect(screen.getByRole('checkbox', { name: 'Ops' })).toBeChecked();
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Ops' }));
    expect(onCheckedChange).toHaveBeenLastCalledWith([]);
  });

  it('starts inside a branch with defaultExpanded and reports each level change', async () => {
    const onExpandedChange = jest.fn();
    await wrap(<TreeList rootTitle="Teams" nodes={team} defaultExpanded={['eng']} onExpandedChange={onExpandedChange} />);
    expect(screen.getByText('Ada')).toBeTruthy();
    await fireEvent.press(screen.getByText('Back to Teams'));
    expect(onExpandedChange).toHaveBeenLastCalledWith([]);
    await fireEvent.press(screen.getByText('Engineering'));
    expect(onExpandedChange).toHaveBeenLastCalledWith(['eng']);
  });

  it('follows a controlled expanded list', async () => {
    const { rerender } = await wrap(<TreeList rootTitle="Teams" nodes={team} expanded={[]} />);
    expect(screen.getByText('Ops')).toBeTruthy();
    await rerender(<TreeList rootTitle="Teams" nodes={team} expanded={['eng']} />);
    expect(screen.getByText('Bo')).toBeTruthy();
    expect(screen.queryByText('Ops')).toBeNull();
  });

  it('selects with defaultSelected / onSelectedChange and activates the tapped leaf', async () => {
    const onSelectedChange = jest.fn();
    const onActivate = jest.fn();
    await wrap(
      <TreeList rootTitle="Teams" nodes={team} defaultSelected="ops" onSelectedChange={onSelectedChange} onActivate={onActivate} />,
    );
    expect(screen.getByRole('radio', { name: 'Ops' })).toBeChecked();
    await fireEvent.press(screen.getByText('Engineering'));
    await fireEvent.press(screen.getByText('Bo'));
    expect(onSelectedChange).toHaveBeenLastCalledWith('bo');
    expect(onActivate).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'bo' }));
    expect(screen.getByRole('radio', { name: 'Bo' })).toBeChecked();
  });

  it('loads children on open, with a loading row until they arrive', async () => {
    let resolve!: () => void;
    const onLoadChildren = jest.fn(() => new Promise<void>((r) => (resolve = r)));
    const lazy: TreeListNode[] = [{ id: 'eng', title: 'Engineering', hasChildren: true }];
    const { rerender } = await wrap(<TreeList rootTitle="Teams" nodes={lazy} onLoadChildren={onLoadChildren} />);
    await fireEvent.press(screen.getByText('Engineering'));
    expect(onLoadChildren).toHaveBeenCalledWith(lazy[0]);
    expect(screen.getByLabelText('Loading…')).toBeBusy();
    await act(async () => resolve());
    await rerender(
      <TreeList rootTitle="Teams" nodes={[{ ...lazy[0]!, children: [{ id: 'ada', title: 'Ada' }] }]} onLoadChildren={onLoadChildren} />,
    );
    expect(screen.queryByLabelText('Loading…')).toBeNull();
    expect(screen.getByText('Ada')).toBeTruthy();
    expect(onLoadChildren).toHaveBeenCalledTimes(1);
  });

  it('keeps the level open when loading fails', async () => {
    const lazy: TreeListNode[] = [{ id: 'eng', title: 'Engineering', hasChildren: true }];
    await wrap(<TreeList rootTitle="Teams" nodes={lazy} onLoadChildren={() => Promise.reject(new Error('offline'))} />);
    await fireEvent.press(screen.getByText('Engineering'));
    await act(async () => {});
    expect(screen.getByText('Back to Teams')).toBeTruthy();
    expect(screen.queryByLabelText('Loading…')).toBeNull();
  });

  it('shows the data states: error over loading over empty', async () => {
    const { rerender } = await wrap(<TreeList rootTitle="Teams" nodes={team} loading />);
    expect(screen.queryByText('Ops')).toBeNull();
    expect(nodes().some((n) => (n.props.accessibilityState as { busy?: boolean } | undefined)?.busy)).toBe(true);
    await rerender(<TreeList rootTitle="Teams" nodes={team} loading errorState={<RNText>Could not load</RNText>} />);
    expect(screen.getByText('Could not load')).toBeTruthy();
    await rerender(<TreeList rootTitle="Teams" nodes={[]} />);
    expect(screen.getByText('Nothing here yet')).toBeTruthy();
    await rerender(<TreeList rootTitle="Teams" nodes={[]} emptyState={<RNText>No teams yet</RNText>} />);
    expect(screen.getByText('No teams yet')).toBeTruthy();
  });

  it('puts renderActions at the end of each row, as their own targets', async () => {
    const onPress = jest.fn();
    await wrap(
      <TreeList
        rootTitle="Teams"
        nodes={team}
        renderActions={(n) => <IconButton icon={Plus} label={`Add to ${n.title}`} onPress={() => onPress(n.id)} />}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Add to Ops' }));
    expect(onPress).toHaveBeenCalledWith('ops');
    expect(screen.getByRole('button', { name: 'Add to Engineering' })).toBeTruthy();
  });
});

// ─── StepProgress ────────────────────────────────────────────────────────────

const steps = [
  { id: 'a', label: 'Account' },
  { id: 'b', label: 'Billing' },
  { id: 'c', label: 'Confirm' },
];

describe('StepProgress', () => {
  it('makes finished steps and the next open one tappable (linear)', async () => {
    const onStepChange = jest.fn();
    await wrap(<StepProgress steps={steps} current={1} onStepChange={onStepChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Step 1 of 3: Account, completed' }));
    expect(onStepChange).toHaveBeenLastCalledWith(0);
    expect(screen.getByRole('button', { name: 'Step 3 of 3: Confirm' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Step 2 of 3: Billing' })).toBeSelected();
  });

  it('reaches any step when nonLinear, and reads `completed` as given', async () => {
    const onStepChange = jest.fn();
    await wrap(<StepProgress steps={steps} current={0} completed={[2]} nonLinear onStepChange={onStepChange} />);
    expect(screen.getByRole('button', { name: 'Step 3 of 3: Confirm, completed' })).not.toBeDisabled();
    await fireEvent.press(screen.getByRole('button', { name: 'Step 2 of 3: Billing' }));
    expect(onStepChange).toHaveBeenLastCalledWith(1);
  });

  it('lists the steps vertically with checks for finished ones', async () => {
    await wrap(<StepProgress steps={steps} current={1} orientation="vertical" />);
    expect(screen.getByLabelText('Step 1 of 3: Account, completed')).toBeTruthy();
    expect(screen.getByLabelText('Step 2 of 3: Billing')).toBeSelected();
    expect(screen.getByText('3')).toBeTruthy();
  });
});

// ─── InlineEdit ──────────────────────────────────────────────────────────────

describe('InlineEdit', () => {
  it('does not open when disabled', async () => {
    await wrap(<InlineEdit label="Name" value="Acme" onSave={jest.fn()} disabled />);
    const text = screen.getByRole('button', { name: 'Edit Name, Acme' });
    expect(text).toBeDisabled();
    await fireEvent.press(text);
    expect(screen.queryByDisplayValue('Acme')).toBeNull();
  });

  it('caps the field with maxLength and sizes the text', async () => {
    await wrap(<InlineEdit label="Name" value="Acme" onSave={jest.fn()} maxLength={10} size="headline" />);
    expect(styleOf(screen.getByText('Acme')).fontSize).toBe(native.type['headline-sm'].size);
    await fireEvent.press(screen.getByRole('button', { name: 'Edit Name, Acme' }));
    expect(screen.getByDisplayValue('Acme').props.maxLength).toBe(10);
    expect(screen.getByText('4/10')).toBeTruthy();
  });
});

// ─── ActivityList ────────────────────────────────────────────────────────────

describe('ActivityList', () => {
  const tx = [{ id: '1', title: 'Coffee Lab', amount: -4.5, currency: 'USD', date: new Date(2026, 9, 30) }];

  it('shows skeleton rows while loading, busy for screen readers', async () => {
    await wrap(<ActivityList transactions={tx} loading loadingRows={2} />);
    expect(screen.queryByText('Coffee Lab')).toBeNull();
    expect(screen.getByTestId('activity-loading', { includeHiddenElements: true }).children).toHaveLength(2);
    expect(nodes().some((n) => (n.props.accessibilityState as { busy?: boolean } | undefined)?.busy)).toBe(true);
  });

  it('puts errorState first, and emptyState when there is nothing', async () => {
    const { rerender } = await wrap(<ActivityList transactions={tx} loading errorState={<RNText>Failed</RNText>} />);
    expect(screen.getByText('Failed')).toBeTruthy();
    expect(screen.queryByTestId('activity-loading', { includeHiddenElements: true })).toBeNull();
    await rerender(<ActivityList transactions={[]} emptyState={<RNText>Nothing here</RNText>} />);
    expect(screen.getByText('Nothing here')).toBeTruthy();
  });
});

// ─── Table ───────────────────────────────────────────────────────────────────

const table = (props: React.ComponentProps<typeof Table.Root>) => (
  <Table.Root {...props}>
    <Table.Header>
      <Table.Row>
        <Table.Head>Team</Table.Head>
        <Table.Head>Pts</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Rovers</Table.Cell>
        <Table.Cell numeric>30</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
);

describe('Table', () => {
  it('scrolls inside maxHeight, named by scrollLabel', async () => {
    await wrap(table({ maxHeight: 200, scrollLabel: 'Standings' }));
    const scroll = screen.getByTestId('table-scroll');
    expect(styleOf(scroll).maxHeight).toBe(200);
    expect(scroll.props.accessibilityLabel).toBe('Standings');
    expect(screen.getByLabelText('Team: Rovers, Pts: 30')).toBeTruthy();
  });

  it('keeps the header row in place with stickyHeader, its sideways scroll following the body', async () => {
    await wrap(table({ maxHeight: 200, stickyHeader: true, stickyFirstColumn: true }));
    expect(screen.getByTestId('table-scroll').props.stickyHeaderIndices).toEqual([0]);
    // Header and body each drawn once per piece (sticky column + the rest), still one label per row.
    expect(screen.getByRole('header', { name: 'Team, Pts' })).toBeTruthy();
    expect(screen.getByLabelText('Team: Rovers, Pts: 30')).toBeTruthy();
    const horizontal = nodes().filter((n) => n.type === 'RCTScrollView' && n.props.horizontal);
    expect(horizontal.map((n) => n.props.scrollEnabled)).toEqual([false, true]);
    await fireEvent.scroll(horizontal[1] as never, { nativeEvent: { contentOffset: { x: 40, y: 0 } } });
  });

  it('labels the sideways scroller when there is no maxHeight', async () => {
    await wrap(table({ scrollLabel: 'Standings' }));
    expect(screen.queryByTestId('table-scroll')).toBeNull();
    expect(nodes().find((n) => n.type === 'RCTScrollView')!.props.accessibilityLabel).toBe('Standings');
  });
});

// ─── Display ─────────────────────────────────────────────────────────────────

describe('display props', () => {
  it('Avatar: badgeColor tints the dot; fallback shows without a name', async () => {
    await wrap(
      <>
        <Avatar name="Ada" badge badgeColor="#123456" />
        <Avatar fallback={<RNText>?</RNText>} />
      </>,
    );
    expect(nodes().some((n) => styleOf(n).backgroundColor === '#123456')).toBe(true);
    expect(screen.getByText('?')).toBeTruthy();
  });

  it('AvatarGroup: spacing sets the overlap', async () => {
    const overlap = async (spacing: 'sm' | 'md' | 'lg') => {
      await wrap(
        <AvatarGroup spacing={spacing}>
          {[<Avatar key="a" name="Ada" />, <Avatar key="b" name="Bo" />]}
        </AvatarGroup>,
      );
      return nodes().map((n) => styleOf(n).marginStart).find((m) => typeof m === 'number') as number;
    };
    const [sm, md, lg] = [await overlap('sm'), await overlap('md'), await overlap('lg')];
    expect(sm).toBeLessThan(md);
    expect(md).toBeLessThan(lg);
    expect(md).toBeCloseTo(-native.size.avatar.sm / 3);
  });

  it('Skeleton: shape="circle" is round and square; animated={false} has no shimmer', async () => {
    await wrap(<Skeleton shape="circle" height={40} animation="shimmer" animated={false} />);
    const s = nodes().map(styleOf).find((st) => st.height === 40)!;
    expect(s).toMatchObject({ width: 40, borderRadius: 20 });
    expect(screen.queryByTestId('skeleton-shimmer', { includeHiddenElements: true })).toBeNull();
  });

  it('Skeleton: line and rect take their corners', async () => {
    await wrap(
      <>
        <Skeleton shape="line" />
        <Skeleton shape="rect" height={80} />
      </>,
    );
    const radii = nodes().map(styleOf).filter((st) => st.borderRadius !== undefined).map((st) => st.borderRadius);
    expect(radii).toEqual([native.shape.min, native.shape.container]);
  });

  it('Divider: tone tints the line at 30%', async () => {
    await wrap(<Divider tone="danger" testID="line" />);
    expect(styleOf(screen.getByTestId('line', { includeHiddenElements: true })).backgroundColor).toBe(`${roles.error}4d`);
  });

  it('Card: a semantic tone is a start edge; variant="surface" lifts; surface="glass" is the glass material', async () => {
    await wrap(
      <>
        <Card tone="danger" testID="toned" />
        <Card variant="surface" testID="raised" />
        <Card surface="glass" testID="glass" />
        <Card tone="surface-container" testID="tier" />
      </>,
    );
    expect(styleOf(screen.getByTestId('toned'))).toMatchObject({ borderStartColor: roles.error, borderStartWidth: native.spacing[1] });
    expect(styleOf(screen.getByTestId('raised')).backgroundColor).toBe(roles['surface-elevated']);
    expect(styleOf(screen.getByTestId('glass')).backgroundColor).not.toBe(roles['surface-container-low']);
    expect(styleOf(screen.getByTestId('tier')).backgroundColor).toBe(roles['surface-container']);
    expect(styleOf(screen.getByTestId('tier')).borderStartWidth).toBeUndefined();
  });
});

// ─── Actions ─────────────────────────────────────────────────────────────────

describe('actions props', () => {
  it('Button status: loading is busy, success swaps the label and announces, error announces', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    const onPress = jest.fn();
    const { rerender } = await wrap(<Button status="idle" successLabel="Saved" onPress={onPress}>Save</Button>);
    expect(announce).not.toHaveBeenCalled();
    await rerender(<Button status="loading" successLabel="Saved" onPress={onPress}>Save</Button>);
    expect(screen.getByRole('button')).toBeBusy();
    expect(announce).toHaveBeenLastCalledWith('Loading…');
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
    await rerender(<Button status="success" successLabel="Saved" onPress={onPress}>Save</Button>);
    expect(screen.getByRole('button', { name: 'Saved' })).toBeTruthy();
    expect(screen.getByTestId('button-success', { includeHiddenElements: true })).toBeTruthy();
    expect(announce).toHaveBeenLastCalledWith('Saved');
    await rerender(<Button status="error" errorLabel="Could not save" onPress={onPress}>Save</Button>);
    expect(announce).toHaveBeenLastCalledWith('Could not save');
    expect(screen.getByRole('button', { name: 'Save' })).not.toBeBusy();
  });

  it('Button status="success" without successLabel keeps the label and says "Done"', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    const { rerender } = await wrap(<Button status="loading">Pay</Button>);
    await rerender(<Button status="success">Pay</Button>);
    expect(screen.getByRole('button', { name: 'Pay' })).toBeTruthy();
    expect(announce).toHaveBeenLastCalledWith('Done');
  });

  it('IconButton loading is busy and blocks presses', async () => {
    const onPress = jest.fn();
    await wrap(<IconButton icon={Plus} label="Add" loading onPress={onPress} />);
    const button = screen.getByRole('button', { name: 'Add' });
    expect(button).toBeBusy();
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('Link external opens href with Linking and says it opens externally', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    await wrap(
      <Link href="https://nexub.ai" external variant="muted">
        Website
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Website' });
    expect(link.props.accessibilityHint).toBe('Opens externally');
    expect(screen.getByTestId('link-external', { includeHiddenElements: true })).toBeTruthy();
    expect(styleOf(screen.getByText('Website')).color).toBe(roles['on-surface-muted']);
    await fireEvent.press(link);
    expect(open).toHaveBeenCalledWith('https://nexub.ai');
  });

  it('ButtonGroup attached joins the buttons with small inner corners', async () => {
    await wrap(
      <ButtonGroup attached>
        <Button testID="b1">Day</Button>
        <Button testID="b2">Week</Button>
        <Button testID="b3">Month</Button>
      </ButtonGroup>,
    );
    const inner = native.radius.md;
    expect(styleOf(screen.getByTestId('b1'))).toMatchObject({ borderTopEndRadius: inner, borderBottomEndRadius: inner });
    expect(styleOf(screen.getByTestId('b1')).borderTopStartRadius).toBeUndefined();
    expect(styleOf(screen.getByTestId('b2'))).toMatchObject({ borderTopStartRadius: inner, borderTopEndRadius: inner });
    expect(styleOf(screen.getByTestId('b3'))).toMatchObject({ borderTopStartRadius: inner, borderBottomStartRadius: inner });
    expect(styleOf(screen.getByTestId('b3')).borderTopEndRadius).toBeUndefined();
  });
});

// ─── StatCard / PhoneInput ───────────────────────────────────────────────────

describe('StatCard', () => {
  it('writes `change` as a signed percent with its label and note', async () => {
    await wrap(<StatCard label="Revenue" value="$12k" change={0.125} changeLabel="vs last month" note="Includes 2 refunds" />);
    expect(screen.getByText('+12.5%')).toBeTruthy();
    expect(styleOf(screen.getByText('+12.5%')).color).toBe(roles.success);
    expect(screen.getByText('vs last month')).toBeTruthy();
    expect(screen.getByText('Includes 2 refunds')).toBeTruthy();
  });

  it('tone="bad-when-high" shows a rise in the danger colour; absolute and custom formats', async () => {
    await wrap(
      <>
        <StatCard label="Churn" value="4%" change={12} changeFormat="absolute" tone="bad-when-high" />
        <StatCard label="Errors" value="9" change={-3} changeFormat={(n) => `${n} today`} />
      </>,
    );
    expect(styleOf(screen.getByText('+12')).color).toBe(roles.error);
    expect(styleOf(screen.getByText('-3 today')).color).toBe(roles.error);
  });

  it('delta wins over change; size="sm" uses the smaller value type', async () => {
    await wrap(<StatCard label="Users" value="1,204" delta="+4" change={0.5} size="sm" onPress={jest.fn()} />);
    expect(screen.getByText('+4')).toBeTruthy();
    expect(screen.queryByText('+50.0%')).toBeNull();
    expect(screen.getByRole('button', { name: 'Users, 1,204, +4' })).toBeTruthy();
  });
});

it('PhoneInput size="md" uses the smaller country code text', async () => {
  await wrap(<PhoneInput label="Phone" defaultCountry="US" size="md" />);
  expect(styleOf(screen.getByText('+1')).fontSize).toBe(native.type['body-md'].size);
});

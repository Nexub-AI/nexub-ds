// 10.9 "Native, next level": expression, spot accent, category colours,
// dynamic colour gating, breakpoints, IconChip, NumberTicker and StatCard.
import * as React from 'react';
import { Platform, StyleSheet, Text as RNText } from 'react-native';
import { fireEvent, render, renderHook, screen } from '@testing-library/react-native';
import { native } from '@nexub/tokens/native';
import { Wallet } from '@nexub/icons/native';
import {
  Avatar,
  Badge,
  Button,
  IconChip,
  NexubNativeProvider,
  NumberTicker,
  PRODUCT_KEYS,
  StatCard,
  autoCategory,
  dynamicPrimary,
  useBreakpoint,
  useResponsive,
  useTheme,
  type NexubNativeProviderProps,
  type NexubTheme,
} from '../index';

const sig = { ...native.color.roles.standard.light, ...native.signature.roles.standard.light };
const cats = native.color.categories.light;

const wrap = (props: Omit<NexubNativeProviderProps, 'children'> = {}) =>
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <NexubNativeProvider scheme="light" contrast="standard" {...props}>
        {children}
      </NexubNativeProvider>
    );
  };
const ui = (node: React.ReactElement, props?: Omit<NexubNativeProviderProps, 'children'>) =>
  render(node, { wrapper: wrap(props) });
const theme = async (props?: Omit<NexubNativeProviderProps, 'children'>): Promise<NexubTheme> =>
  (await renderHook(() => useTheme(), { wrapper: wrap(props) })).result.current;
const flat = (el: { props: { style?: unknown } }) => StyleSheet.flatten(el.props.style as never) as Record<string, unknown>;

const setPlatform = (os: string, version: number) => {
  Object.defineProperty(Platform, 'OS', { configurable: true, get: () => os });
  Object.defineProperty(Platform, 'Version', { configurable: true, get: () => version });
};
afterEach(() => setPlatform('ios', 26));

describe('theme', () => {
  it('defaults: calm, spot = primary, fills are the roles, font scale exposed', async () => {
    const t = await theme();
    expect(t.expression).toBe('calm');
    expect(t.colors).toEqual({
      spot: sig.primary,
      onSpot: sig['on-primary'],
      spotContainer: sig['primary-container'],
      onSpotContainer: sig['on-primary-container'],
      primary: sig.primary,
      primaryContainer: sig['primary-container'],
    });
    expect(typeof t.fontScale).toBe('number');
    expect(t.denseMaxFontScale).toBe(1.5);
    expect((await theme({ expression: 'vivid' })).expression).toBe('vivid');
  });

  it('every product key resolves: the legacy four keep their scale, the rest take their division', async () => {
    for (const key of PRODUCT_KEYS) {
      const t = await theme({ product: key });
      expect(t.roles.tertiary).toBe(native.color.spot[key].standard.light.spot);
      expect(t.colors.spot).toBe(t.roles.tertiary);
      expect(t.colors.onSpotContainer).toBe(t.roles['on-tertiary-container']);
    }
    expect((await theme({ product: 'payub' })).roles).toMatchObject(native.color.products.payub.standard.light);
    expect((await theme({ product: 'money' })).roles.tertiary).toBe(native.color.divisions.fintech.standard.light.tertiary);
    expect((await theme({ product: 'intelligence' })).colors.spot).toBe(native.color.divisions.intelligence.standard.light.tertiary);
  });

  it('dynamicColor is Android 12+ only', async () => {
    expect(dynamicPrimary('light')).toBeNull(); // iOS
    expect((await theme({ dynamicColor: true })).colors.primary).toBe(sig.primary);

    setPlatform('android', 30);
    expect(dynamicPrimary('light')).toBeNull();
    expect((await theme({ dynamicColor: true })).colors.primary).toBe(sig.primary);

    setPlatform('android', 31);
    expect((await theme()).colors.primary).toBe(sig.primary); // prop off
    const t = await theme({ dynamicColor: true });
    expect(typeof t.colors.primary).toBe('object');
    expect(JSON.stringify(dynamicPrimary('light'))).toContain('system_accent1_600');
    expect(JSON.stringify(dynamicPrimary('dark'))).toContain('system_accent1_200');
    // Roles stay hex: contrast maths and alpha suffixes never see a system colour.
    expect(t.roles.primary).toBe(sig.primary);
    expect(t.colors.spot).toBe(sig.primary);
  });
});

describe('layout', () => {
  const at = async (width: number, height: number) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- spying on the module object
    jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width, height, scale: 2, fontScale: 1 });
    const bp = (await renderHook(() => useBreakpoint())).result.current;
    const select = (await renderHook(() => useResponsive())).result.current;
    return { bp, select };
  };
  afterEach(() => jest.restoreAllMocks());

  it('phone portrait and landscape', async () => {
    expect((await at(390, 844)).bp).toEqual({ width: 390, height: 844, isTablet: false, isLandscape: false, columns: 4 });
    const land = await at(844, 390);
    expect(land.bp).toMatchObject({ isTablet: false, isLandscape: true, columns: 12 });
    expect(land.select({ phone: 'a', tablet: 'b' })).toBe('a');
  });

  it('tablet', async () => {
    const t = await at(820, 1180);
    expect(t.bp).toMatchObject({ isTablet: true, isLandscape: false, columns: 8 });
    expect(t.select({ phone: 1, tablet: 2 })).toBe(2);
    expect(t.select({ phone: 1 })).toBe(1);
    expect((await at(1180, 820)).bp).toMatchObject({ isTablet: true, isLandscape: true, columns: 12 });
  });
});

describe('category colours', () => {
  it('autoCategory matches the web hash and skips accent', () => {
    // (h * 31 + code) >>> 0 over the name, then 1 + h % 8 into CATEGORY_COLORS.
    expect(autoCategory('A')).toBe('amber'); // 65 % 8 = 1 → index 2
    expect(autoCategory('Asha Rao')).toBe(autoCategory('Asha Rao'));
    expect(autoCategory(undefined)).toBeUndefined();
    expect(['Ada', 'Leo Tan', 'Mia Chen', 'x'].map(autoCategory)).not.toContain('accent');
  });

  it('Badge: category wins over tone; unset keeps the tone look', async () => {
    await ui(
      <>
        <Badge testID="cat" tone="success" category="violet">Design</Badge>
        <Badge testID="out" variant="outline" category="violet">Design</Badge>
        <Badge testID="tone" tone="success">Paid</Badge>
        <Badge testID="accent" category="accent">Spot</Badge>
      </>,
      { product: 'payub' },
    );
    expect(flat(screen.getByTestId('cat')).backgroundColor).toBe(cats.violet.container);
    expect(flat(screen.getAllByText('Design')[0]!).color).toBe(cats.violet.onContainer);
    expect(flat(screen.getByTestId('out'))).toMatchObject({ backgroundColor: 'transparent', borderColor: cats.violet.color + '80' });
    expect(flat(screen.getAllByText('Design')[1]!).color).toBe(cats.violet.color);
    expect(flat(screen.getByTestId('tone')).backgroundColor).toBe(sig['success-container']);
    expect(flat(screen.getByTestId('accent')).backgroundColor).toBe(native.color.products.payub.standard.light['tertiary-container']);
  });

  it('Avatar: category and auto colour the initials; unset stays neutral', async () => {
    await ui(
      <>
        <Avatar name="Asha Rao" category="auto" />
        <Avatar name="Leo Tan" category="pink" />
        <Avatar name="Mia Chen" />
      </>,
    );
    expect(flat(screen.getByText('AR')).color).toBe(cats[autoCategory('Asha Rao') as 'blue'].onContainer);
    expect(flat(screen.getByText('LT')).color).toBe(cats.pink.onContainer);
    expect(flat(screen.getByText('MC')).color).toBe(sig['on-secondary-container']);
  });

  it('IconChip: sizes, shapes, colours and the accessible name', async () => {
    await ui(
      <>
        <IconChip testID="plain"><Wallet /></IconChip>
        <IconChip testID="cat" category="emerald" size="lg" shape="circle" accessibilityLabel="Savings"><Wallet /></IconChip>
        <IconChip testID="text" size="sm"><RNText>£</RNText></IconChip>
      </>,
    );
    const plain = screen.getByTestId('plain', { includeHiddenElements: true });
    expect(flat(plain)).toMatchObject({ width: 40, height: 40, borderRadius: 10, backgroundColor: sig['surface-container-high'] });
    expect(plain.props.accessibilityElementsHidden).toBe(true);
    const cat = screen.getByLabelText('Savings');
    expect(flat(cat)).toMatchObject({ width: 48, borderRadius: 24, backgroundColor: cats.emerald.container });
    expect(cat.props.accessibilityRole).toBe('image');
    expect(flat(screen.getByTestId('text', { includeHiddenElements: true })).width).toBe(32);
  });
});

describe('Button', () => {
  it('tonal + tone is the container pair; calm hero is a filled button with no gradient', async () => {
    await ui(
      <>
        <Button testID="soft" variant="tonal" tone="success">Approve</Button>
        <Button testID="neutral" variant="tonal" tone="neutral">Later</Button>
        <Button testID="solid" tone="success">Approve now</Button>
        <Button testID="hero" variant="hero">Start</Button>
        <Button testID="filled">Go</Button>
      </>,
    );
    expect(flat(screen.getByTestId('soft')).backgroundColor).toBe(sig['success-container']);
    expect(flat(screen.getByText('Approve')).color).toBe(sig['on-success-container']);
    expect(flat(screen.getByText('Later')).color).toBe(sig['on-surface']);
    expect(flat(screen.getByTestId('solid')).backgroundColor).toBe(sig.success);
    expect(flat(screen.getByTestId('hero')).backgroundColor).toBe(sig.primary);
    expect(flat(screen.getByTestId('filled')).boxShadow).toBeUndefined();
    expect(screen.queryByTestId('button-gradient')).toBeNull();
    expect(screen.getByText('Go').props.maxFontSizeMultiplier).toBe(1.5);
  });

  it('vivid: the untoned main action gets the gradient; toned, disabled and tonal do not', async () => {
    await ui(
      <>
        <Button variant="hero">Start</Button>
        <Button>Go</Button>
        <Button tone="danger">Delete</Button>
        <Button disabled>Off</Button>
        <Button variant="tonal">Soft</Button>
      </>,
      { expression: 'vivid' },
    );
    expect(screen.getAllByTestId('button-gradient')).toHaveLength(2);
  });

  it('vivid at high contrast, or with a system primary, stays flat', async () => {
    const high = await ui(<Button>Go</Button>, { expression: 'vivid', contrast: 'high' });
    expect(screen.queryByTestId('button-gradient')).toBeNull();
    await high.unmount();
    setPlatform('android', 34);
    await ui(<Button testID="b">Go</Button>, { expression: 'vivid', dynamicColor: true });
    expect(screen.queryByTestId('button-gradient')).toBeNull();
    expect(typeof flat(screen.getByTestId('b')).backgroundColor).toBe('object');
  });
});

// An 'ar' currency format: a right-to-left mark, the figure, then the symbol.
const RTL_TEXT = '\u200F7 \u062F.\u0625';

describe('NumberTicker', () => {
  const measure = () =>
    fireEvent(screen.getAllByText('0', { includeHiddenElements: true })[0]!, 'layout', { nativeEvent: { layout: { height: 20 } } });

  it('formats with the locale and is one accessible label', async () => {
    await ui(<NumberTicker value={68420.5} format={{ style: 'currency', currency: 'USD' }} locale="en-US" />);
    expect(screen.getByLabelText('$68,420.50')).toBeTruthy();
    expect(screen.getByText('$68,420.50')).toBeTruthy(); // not measured yet: plain text
    expect(screen.getByLabelText('$68,420.50').props.accessibilityLiveRegion).toBe('none');
  });

  it('rolls digits once measured: one strip per digit, separators static', async () => {
    await ui(<NumberTicker value="1,204" live />);
    await measure();
    expect(screen.queryByText('1,204')).toBeNull();
    expect(screen.getByText(',')).toBeTruthy();
    expect(screen.getAllByText('9')).toHaveLength(4);
    expect(screen.getByLabelText('1,204').props.accessibilityLiveRegion).toBe('polite');
    await screen.rerender(<NumberTicker value="1,205" live />);
    expect(screen.getByLabelText('1,205')).toBeTruthy();
  });

  it('animate={false} and RTL text snap to the value', async () => {
    await ui(
      <>
        <NumberTicker value={42} animate={false} />
        <NumberTicker value={RTL_TEXT} />
      </>,
    );
    for (const el of screen.getAllByText('0', { includeHiddenElements: true }))
      await fireEvent(el, 'layout', { nativeEvent: { layout: { height: 20 } } });
    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.getByText(RTL_TEXT)).toBeTruthy();
  });
});

describe('StatCard', () => {
  it('label, value, delta sentiment, icon chip and trend', async () => {
    await ui(
      <StatCard
        testID="card"
        label="Churn"
        value="2.4%"
        delta="-0.6%"
        deltaType="decrease"
        sentiment="positive"
        description="vs last month"
        icon={<Wallet />}
        category="emerald"
        trend={[5, 4, 4, 3, 2]}
        trendLabel="Last 5 months, falling"
      />,
    );
    expect(screen.getByText('Churn')).toBeTruthy();
    expect(screen.getByLabelText('2.4%')).toBeTruthy();
    expect(flat(screen.getByText('-0.6%')).color).toBe(sig.success);
    expect(screen.getByText('vs last month')).toBeTruthy();
    expect(screen.getByLabelText('Last 5 months, falling').props.accessibilityRole).toBe('image');
    expect(flat(screen.getByTestId('card')).backgroundColor).toBe(sig['surface-elevated']);
  });

  it('defaults: neutral delta, plain icon, node value, flat trend', async () => {
    await ui(
      <>
        <StatCard label="Seats" value={<RNText>12 of 20</RNText>} delta="0%" icon={<Wallet />} trend={[3, 3, 3]} />
        <StatCard label="Up" value={1200} delta="+4%" deltaType="increase" />
        <StatCard label="Down" value={8} delta="-1" deltaType="decrease" />
      </>,
    );
    expect(screen.getByText('12 of 20')).toBeTruthy();
    expect(flat(screen.getByText('0%')).color).toBe(sig['on-surface-muted']);
    expect(flat(screen.getByText('+4%')).color).toBe(sig.success);
    expect(flat(screen.getByText('-1')).color).toBe(sig.error);
    expect(screen.getByLabelText('1,200')).toBeTruthy();
  });

  it('loading hides the value and marks the card busy', async () => {
    await ui(<StatCard testID="card" label="Revenue" value="$4,200" delta="+2%" loading />);
    expect(screen.queryByLabelText('$4,200')).toBeNull();
    expect(screen.getByTestId('card').props.accessibilityState).toEqual({ busy: true });
  });

  it('pressable: one button named from its content; vivid lifts on press', async () => {
    const onPress = jest.fn();
    await ui(<StatCard label="Revenue" value="$4,200" delta="+2%" onPress={onPress} />, { expression: 'vivid' });
    const button = screen.getByRole('button', { name: 'Revenue, $4,200, +2%' });
    await fireEvent(button, 'pressIn');
    await fireEvent(button, 'pressOut');
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('pressable in calm keeps the standard press feedback', async () => {
    const onPress = jest.fn();
    await ui(<StatCard label="Users" value={12} onPress={onPress} accessibilityLabel="Open users" />);
    await fireEvent(screen.getByLabelText('Open users'), 'pressIn');
    await fireEvent.press(screen.getByLabelText('Open users'));
    expect(onPress).toHaveBeenCalled();
  });
});

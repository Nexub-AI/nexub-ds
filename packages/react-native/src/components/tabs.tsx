import * as React from 'react';
import { ScrollView, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable, type PressableProps } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import { nxSpring } from '../theme/motion';
import { MIN_TARGET, controlHeight, disabledOpacity } from './shared';

// ─── Tabs ────────────────────────────────────────────────────────────────────
// Compound like web: Tabs.Root > Tabs.List > Tabs.Trigger, then Tabs.Content.

type TabsSize = 'sm' | 'md' | 'lg';
type TabsVariant = 'line' | 'pill';
type Box = { x: number; width: number };

const RootContext = React.createContext<{ value: string; setValue: (v: string) => void } | null>(null);
const ListContext = React.createContext<{
  variant: TabsVariant;
  size: TabsSize;
  measure: (value: string, box: Box) => void;
}>({ variant: 'line', size: 'md', measure: () => {} });

function useTabs() {
  const ctx = React.useContext(RootContext);
  if (!ctx) throw new Error('Tabs parts must be inside <Tabs.Root>.');
  return ctx;
}

export interface TabsRootProps extends ViewProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

function Root({ value, defaultValue, onValueChange, style, ...rest }: TabsRootProps) {
  const { tokens } = useTheme();
  const [v, setValue] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  });
  const ctx = React.useMemo(() => ({ value: v, setValue }), [v, setValue]);
  return (
    <RootContext.Provider value={ctx}>
      <View style={[{ gap: tokens.spacing[3] }, style]} {...rest} />
    </RootContext.Provider>
  );
}

export interface TabsListProps {
  /** `line` (default): underline. `pill`: a raised thumb slides behind the active tab. */
  variant?: TabsVariant;
  /** Trigger height on the shared control scale. @default 'md' */
  size?: TabsSize;
  /** Accessible name of the tab list. */
  accessibilityLabel?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** The row of tabs. Scrolls sideways when the tabs overflow; the active tab scrolls into view. */
function List({ variant = 'line', size = 'md', accessibilityLabel, children, style }: TabsListProps) {
  const theme = useTheme();
  const { roles, tokens } = theme;
  const { value } = useTabs();
  const pill = variant === 'pill';
  const inset = pill ? tokens.spacing['0-5'] : 0;
  const [boxes, setBoxes] = React.useState<Record<string, Box>>({});
  const [rowWidth, setRowWidth] = React.useState(0);
  const viewport = React.useRef(0);
  const scroller = React.useRef<React.ComponentRef<typeof ScrollView>>(null);
  const measure = React.useCallback(
    (key: string, box: Box) =>
      setBoxes((prev) =>
        prev[key]?.x === box.x && prev[key]?.width === box.width ? prev : { ...prev, [key]: box },
      ),
    [],
  );
  const list = React.useMemo(() => ({ variant, size, measure }), [variant, size, measure]);

  // The indicator sits under (or behind) the active tab. The first measure
  // places it, so there is no slide from zero; later changes ride the spatial spring.
  const active = boxes[value];
  const ready = !!active && rowWidth > 0;
  const x = useSharedValue(0);
  const width = useSharedValue(0);
  const placed = React.useRef(false);
  const ax = active?.x ?? 0;
  const aw = active?.width ?? 0;
  React.useEffect(() => {
    if (!ready) return;
    // Trigger x is measured from the left; the indicator is anchored at `start`.
    const to = theme.dir === 'rtl' ? -(rowWidth - ax - aw) : ax;
    if (placed.current) {
      x.value = withSpring(to, nxSpring('spatial', 'default'));
      width.value = withSpring(aw, nxSpring('spatial', 'default'));
    } else {
      x.value = to;
      width.value = aw;
      placed.current = true;
    }
    // Centre the active tab in the scroller when the list overflows.
    const max = rowWidth - viewport.current;
    if (viewport.current > 0 && max > 0) {
      scroller.current?.scrollTo({
        x: Math.min(max, Math.max(0, ax + aw / 2 - viewport.current / 2)),
        animated: !theme.reducedMotion,
      });
    }
  }, [ready, ax, aw, rowWidth, theme.dir, theme.reducedMotion, x, width]);
  const indicator = useAnimatedStyle(() => ({ width: width.value, transform: [{ translateX: x.value }] }));

  return (
    <ListContext.Provider value={list}>
      <View
        style={[
          pill
            ? {
                alignSelf: 'flex-start',
                maxWidth: '100%',
                borderRadius: tokens.shape.control,
                backgroundColor: roles['surface-container-high'],
                overflow: 'hidden',
              }
            : { borderBottomWidth: tokens.spacing.px, borderBottomColor: roles['outline-variant'] },
          style,
        ]}
      >
        <ScrollView
          ref={scroller}
          horizontal
          showsHorizontalScrollIndicator={false}
          onLayout={(e) => {
            viewport.current = e.nativeEvent.layout.width;
          }}
        >
          <View
            accessibilityRole="tablist"
            accessibilityLabel={accessibilityLabel}
            onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
            style={{ flexDirection: 'row', padding: inset }}
          >
            {ready && (
              <Animated.View
                testID="tabs-indicator"
                pointerEvents="none"
                style={[
                  { position: 'absolute', start: 0 },
                  pill
                    ? {
                        top: inset,
                        bottom: inset,
                        borderRadius: tokens.shape.control,
                        backgroundColor: roles['surface-container-lowest'],
                        boxShadow: theme.elevation(1),
                      }
                    : {
                        bottom: 0,
                        height: tokens.spacing['0-5'] + tokens.spacing.px,
                        borderTopStartRadius: tokens.radius.xs,
                        borderTopEndRadius: tokens.radius.xs,
                        backgroundColor: roles.primary,
                      },
                  indicator,
                ]}
              />
            )}
            {children}
          </View>
        </ScrollView>
      </View>
    </ListContext.Provider>
  );
}

const PAD = { sm: 3, md: 4, lg: 5 } as const;

export interface TabsTriggerProps extends Omit<PressableProps, 'children'> {
  value: string;
  /** A string is set in the tab's type and colour; anything else renders as given. */
  children?: React.ReactNode;
}

function Trigger({ value, children, disabled, style, onPress, onLayout, ...rest }: TabsTriggerProps) {
  const theme = useTheme();
  const { tokens } = theme;
  const root = useTabs();
  const { variant, size, measure } = React.useContext(ListContext);
  const on = root.value === value;
  const height = controlHeight(theme, size);
  // Up and down only: sideways slop would steal the neighbours' taps.
  const slop = Math.max(0, Math.ceil((MIN_TARGET - height) / 2));
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: on, disabled: !!disabled }}
      disabled={disabled}
      haptic={on ? undefined : 'selection'}
      pressScale={false}
      hitSlop={slop ? { top: slop, bottom: slop } : undefined}
      onPress={(e) => {
        root.setValue(value);
        onPress?.(e);
      }}
      onLayout={(e) => {
        measure(value, { x: e.nativeEvent.layout.x, width: e.nativeEvent.layout.width });
        onLayout?.(e);
      }}
      style={[
        {
          height,
          paddingHorizontal: tokens.spacing[PAD[size]],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: tokens.spacing['1-5'],
          borderRadius: variant === 'pill' ? tokens.shape.control : undefined,
          opacity: disabled ? disabledOpacity(theme) : 1,
        },
        style,
      ]}
      {...rest}
    >
      {typeof children === 'string' ? (
        <Text
          variant={size === 'sm' ? 'label-md' : 'label-lg'}
          color={on ? (variant === 'pill' ? 'on-surface' : 'primary') : 'on-surface-variant'}
          numberOfLines={1}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export interface TabsContentProps extends ViewProps {
  value: string;
  /** Keep the panel mounted (hidden) while another tab is active. */
  forceMount?: boolean;
}

function Content({ value, forceMount, style, ...rest }: TabsContentProps) {
  const on = useTabs().value === value;
  if (!on && !forceMount) return null;
  return (
    <View
      accessibilityElementsHidden={!on}
      importantForAccessibility={on ? 'auto' : 'no-hide-descendants'}
      style={[style, !on && { display: 'none' }]}
      {...rest}
    />
  );
}

export const Tabs = { Root, List, Trigger, Content };

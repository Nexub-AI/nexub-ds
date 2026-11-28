import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeIconProps } from '@nexub/icons/native';
import { Pressable, type PressableProps } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { useNexubMessages, useTheme } from '../theme/ThemeProvider';
import { useWindowSizeClass } from '../theme/layout';

// ─── Larger screens (12.5) ───────────────────────────────────────────────────
// NavigationRail and AppShell follow the Material 3 window size classes: a
// bottom bar on compact windows (phones in portrait), a rail at the start edge
// on medium and expanded ones (tablets, unfolded foldables, phones in landscape).

type NavOrientation = 'vertical' | 'bottom';

/** Set by AppShell so the rail and the shell agree on where the navigation sits. */
const ShellContext = React.createContext<NavOrientation | null>(null);
const BottomContext = React.createContext(false);

export interface NavigationRailRootProps extends ViewProps {
  /**
   * `auto`: a rail at the start edge on medium and expanded windows (≥ 600dp),
   * a bottom bar on compact ones. Inside AppShell it follows the shell.
   * `vertical` and `bottom` fix it, as on web.
   * @default 'auto'
   */
  orientation?: 'auto' | NavOrientation;
  /** Slot above the items in the rail, e.g. a FAB. Not shown in the bottom bar. */
  header?: React.ReactNode;
  /** Name of the navigation. @default messages.mainNavigation ('Main') */
  accessibilityLabel?: string;
}

function Root({ orientation = 'auto', header, accessibilityLabel, style, children, ...rest }: NavigationRailRootProps) {
  const { roles, tokens } = useTheme();
  const messages = useNexubMessages();
  const insets = useSafeAreaInsets();
  const shell = React.useContext(ShellContext);
  const size = useWindowSizeClass();
  const bottom = orientation === 'auto' ? (shell ?? (size === 'compact' ? 'bottom' : 'vertical')) === 'bottom' : orientation === 'bottom';
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel ?? messages.mainNavigation}
      style={[
        bottom
          ? {
              flexDirection: 'row',
              alignItems: 'flex-start',
              paddingTop: tokens.spacing['1-5'],
              paddingBottom: Math.max(insets.bottom, tokens.spacing['1-5']),
              paddingStart: insets.left,
              paddingEnd: insets.right,
              borderTopWidth: tokens.spacing.px,
              borderTopColor: roles['outline-variant'],
              backgroundColor: roles['surface-container'],
            }
          : {
              width: tokens.spacing[20] + insets.left,
              height: '100%',
              alignItems: 'center',
              gap: tokens.spacing[1],
              paddingTop: Math.max(insets.top, tokens.spacing[4]),
              paddingBottom: Math.max(insets.bottom, tokens.spacing[4]),
              paddingStart: insets.left,
              backgroundColor: roles.surface,
            },
        style,
      ]}
      {...rest}
    >
      {header && !bottom && <View style={{ alignItems: 'center', marginBottom: tokens.spacing[3] }}>{header}</View>}
      <BottomContext.Provider value={bottom}>{children}</BottomContext.Provider>
    </View>
  );
}

export interface NavigationRailItemProps extends Omit<PressableProps, 'children'> {
  /** An icon component from @nexub/icons/native, drawn in the indicator pill. */
  icon: React.ComponentType<NativeIconProps>;
  label: string;
  /** Marks the current destination (selected for screen readers). */
  active?: boolean;
  /** A count on the icon (99+ above 99, nothing at 0), or `true` for a dot. Read after the label. */
  badge?: number | boolean;
  /** Other wording for the badge, e.g. "2 failed builds". */
  badgeLabel?: string;
}

function Item({
  icon: Glyph,
  label,
  active = false,
  badge,
  badgeLabel,
  disabled,
  style,
  accessibilityLabel,
  onPressIn,
  onPressOut,
  ...rest
}: NavigationRailItemProps) {
  const { roles, tokens } = useTheme();
  // The pressed state layer sits on the pill, not the whole item (M3).
  const [pressed, setPressed] = React.useState(false);
  const messages = useNexubMessages();
  const bottom = React.useContext(BottomContext);
  const count = typeof badge === 'number' && badge > 0 ? badge : 0;
  const showBadge = badge === true || count > 0;
  const pill = tokens.spacing[14];
  const spoken = showBadge ? `${label}, ${badgeLabel ?? (count ? messages.unreadNotifications(count) : messages.newBadge)}` : label;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel ?? spoken}
      accessibilityState={{ selected: active, disabled: !!disabled }}
      disabled={disabled}
      haptic={active ? undefined : 'selection'}
      pressScale={false}
      stateLayer={false}
      onPressIn={(e) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      style={[
        { alignItems: 'center', gap: tokens.spacing[1], minHeight: tokens.spacing[14], paddingVertical: tokens.spacing['0-5'] },
        bottom ? { flex: 1, minWidth: 0 } : { width: tokens.spacing[20] },
        style,
      ]}
      {...rest}
    >
      {/* The M3 indicator pill, 56 × 32. */}
      <View
        style={{
          width: pill,
          height: tokens.spacing[8],
          borderRadius: tokens.spacing[4],
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: active ? roles['secondary-container'] : pressed ? roles['surface-container-high'] : 'transparent',
        }}
      >
        <Glyph size="md" color={roles[active ? 'on-secondary-container' : 'on-surface-variant']} />
        {showBadge && (
          <View
            testID="rail-badge"
            style={[
              { position: 'absolute', backgroundColor: roles.error, alignItems: 'center', justifyContent: 'center' },
              count
                ? {
                    top: 0,
                    start: pill / 2 + tokens.spacing[1],
                    height: tokens.spacing[4],
                    minWidth: tokens.spacing[4],
                    paddingHorizontal: tokens.spacing[1],
                    borderRadius: tokens.spacing[2],
                  }
                : {
                    top: tokens.spacing[1],
                    start: pill / 2 + tokens.spacing[2],
                    width: tokens.spacing['1-5'],
                    height: tokens.spacing['1-5'],
                    borderRadius: tokens.spacing['1-5'] / 2,
                  },
            ]}
          >
            {count > 0 && (
              <Text variant="label-sm" color="on-error" tabular>
                {count > 99 ? '99+' : String(count)}
              </Text>
            )}
          </View>
        )}
      </View>
      <Text variant="label-md" color={active ? 'on-surface' : 'on-surface-variant'} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Primary navigation for 3–7 destinations: a rail at the start edge on medium
 * and expanded windows, a bottom bar on compact ones (`orientation="auto"`).
 *
 * ```tsx
 * <NavigationRail.Root>
 *   <NavigationRail.Item icon={Home} label="Home" active onPress={…} />
 *   <NavigationRail.Item icon={Bell} label="Inbox" badge={3} onPress={…} />
 * </NavigationRail.Root>
 * ```
 */
export const NavigationRail = { Root, Item };

// ─── AppShell ────────────────────────────────────────────────────────────────

export interface AppShellProps extends ViewProps {
  /** The app's NavigationRail.Root. A bottom bar on compact windows, a rail at the start edge from medium up. */
  navigation?: React.ReactNode;
  /** A top bar above the content (e.g. an AppBar). */
  header?: React.ReactNode;
  /**
   * Window size class from which the navigation becomes a rail.
   * `expanded` keeps the bottom bar on medium windows (small tablets, unfolded foldables in portrait).
   * @default 'medium'
   */
  railFrom?: 'medium' | 'expanded';
}

/**
 * The app frame: navigation, an optional header, and the content. On compact
 * windows the navigation is a bottom bar below the content; from `railFrom` up
 * it is a rail at the start edge beside it. Put a ListDetail in the content for
 * the canonical tablet layout.
 */
export function AppShell({ navigation, header, railFrom = 'medium', style, children, ...rest }: AppShellProps) {
  const { roles } = useTheme();
  const size = useWindowSizeClass();
  const rail = size === 'expanded' || (size === 'medium' && railFrom === 'medium');
  return (
    <ShellContext.Provider value={rail ? 'vertical' : 'bottom'}>
      <View style={[{ flex: 1, flexDirection: rail ? 'row' : 'column', backgroundColor: roles.surface }, style]} {...rest}>
        {rail && navigation}
        <View style={{ flex: 1, minWidth: 0 }}>
          {header}
          <View style={{ flex: 1 }}>{children}</View>
        </View>
        {!rail && navigation}
      </View>
    </ShellContext.Provider>
  );
}

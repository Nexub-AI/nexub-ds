import * as React from 'react';
import {
  AccessibilityInfo,
  AppState,
  Platform,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { native, type NativeRoles } from '@nexub/tokens/native';
import { createSeedRoles } from '@nexub/tokens/seed';
import {
  defaultMessages,
  directionOf,
  type ContrastLevel,
  type Direction,
  type GlassMode,
  type NexubMessages,
  type Product,
} from '@nexub/core';
import { playHaptic, type HapticToken } from './haptics';
import type { FontSource } from './fonts';

export type Scheme = 'light' | 'dark';
export type Roles = { -readonly [K in keyof NativeRoles]: string };
export type RoleName = keyof Roles;
export type ElevationLevel = 0 | 1 | 2 | 3;

export interface NexubTheme {
  scheme: Scheme;
  contrast: ContrastLevel;
  product: Product | undefined;
  /** Colour roles, already resolved for scheme, contrast, product and seed. */
  roles: Roles;
  /** Every native token (spacing, shape, size, type, state, motion). */
  tokens: typeof native;
  /** `boxShadow` for an elevation level, undefined for 0. */
  elevation: (level: ElevationLevel) => string | undefined;
  /** Effective glass: 'off' when the user has Reduce Transparency on. */
  glass: GlassMode;
  reducedMotion: boolean;
  haptics: boolean;
  fonts: FontSource;
  locale: string;
  dir: Direction;
  messages: NexubMessages;
}

export interface NexubNativeProviderProps {
  /** @default 'system' */
  scheme?: Scheme | 'system';
  /** 'system' = iOS Increase Contrast / Android high-contrast text → 'high'. @default 'system' */
  contrast?: ContrastLevel | 'system';
  /** Product brand: remaps the tertiary role family. */
  product?: Product;
  /** White-label seed colour (#rgb / #rrggbb); regenerates the `seedTarget` family. */
  seed?: string;
  /** @default 'primary' */
  seedTarget?: 'primary' | 'tertiary';
  /** Glass intensity (the app persists the user's choice). @default 'balanced' */
  glass?: GlassMode;
  /** Haptics on/off (user setting). @default true */
  haptics?: boolean;
  /** 'nexub' needs `nexubFonts` loaded; 'system' uses the platform font. @default 'nexub' */
  fonts?: FontSource;
  /** BCP 47 locale for Intl formatting. @default 'en' */
  locale?: string;
  /** @default derived from `locale` */
  dir?: Direction;
  /** Overrides for the default English strings. */
  messages?: Partial<NexubMessages>;
  children?: React.ReactNode;
}

const ThemeContext = React.createContext<NexubTheme | null>(null);

// AccessibilityInfo reads that fire no change event (contrast): re-read on foreground.
function useForegroundSetting(
  read: (() => Promise<boolean>) | undefined,
  enabled: boolean,
): boolean {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    if (!enabled || !read) return;
    const get = () => read().then(setOn, () => setOn(false));
    get();
    const sub = AppState.addEventListener('change', (s) => s === 'active' && get());
    return () => sub.remove();
  }, [enabled, read]);
  return on;
}

function useSetting(
  read: () => Promise<boolean>,
  event: 'reduceMotionChanged' | 'reduceTransparencyChanged',
): boolean {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    read().then(setOn, () => setOn(false));
    const sub = AccessibilityInfo.addEventListener(event, setOn);
    return () => sub.remove();
  }, [read, event]);
  return on;
}

type A11y = typeof AccessibilityInfo & {
  isDarkerSystemColorsEnabled?: () => Promise<boolean>;
  isHighTextContrastEnabled?: () => Promise<boolean>;
};
const a11y = AccessibilityInfo as A11y;
const readHighContrast =
  Platform.OS === 'ios'
    ? a11y.isDarkerSystemColorsEnabled?.bind(a11y)
    : a11y.isHighTextContrastEnabled?.bind(a11y);
const readReduceMotion = () => AccessibilityInfo.isReduceMotionEnabled();
const readReduceTransparency = () =>
  Platform.OS === 'ios' ? AccessibilityInfo.isReduceTransparencyEnabled() : Promise.resolve(false);

/**
 * Theme, accessibility preferences, locale and strings for every
 * @nexub/react-native component. Wrap the app once, inside the safe-area provider.
 */
export function NexubNativeProvider({
  scheme: schemeProp = 'system',
  contrast: contrastProp = 'system',
  product,
  seed,
  seedTarget = 'primary',
  glass = 'balanced',
  haptics = true,
  fonts = 'nexub',
  locale = 'en',
  dir,
  messages,
  children,
}: NexubNativeProviderProps) {
  const system = useColorScheme();
  const scheme: Scheme =
    schemeProp === 'system' ? (system === 'dark' ? 'dark' : 'light') : schemeProp;
  const systemHigh = useForegroundSetting(readHighContrast, contrastProp === 'system');
  const contrast: ContrastLevel =
    contrastProp === 'system' ? (systemHigh ? 'high' : 'standard') : contrastProp;
  const reducedMotion = useSetting(readReduceMotion, 'reduceMotionChanged');
  const reduceTransparency = useSetting(readReduceTransparency, 'reduceTransparencyChanged');
  const resolvedDir = dir ?? directionOf(locale);

  const theme = React.useMemo<NexubTheme>(() => {
    const roles: Roles = {
      ...native.color.roles[contrast][scheme],
      ...(product ? native.color.products[product][contrast][scheme] : {}),
      ...(seed ? createSeedRoles(seed, { contrast, target: seedTarget })[scheme] : {}),
    };
    return {
      scheme,
      contrast,
      product,
      roles,
      tokens: native,
      elevation: (level) => (level ? native.elevation[level][scheme] : undefined),
      glass: reduceTransparency ? 'off' : glass,
      reducedMotion,
      haptics,
      fonts,
      locale,
      dir: resolvedDir,
      messages: { ...defaultMessages, ...messages },
    };
  }, [
    scheme,
    contrast,
    product,
    seed,
    seedTarget,
    glass,
    reduceTransparency,
    reducedMotion,
    haptics,
    fonts,
    locale,
    resolvedDir,
    messages,
  ]);

  return (
    <ThemeContext.Provider value={theme}>
      <View style={[styles.root, { direction: resolvedDir }]}>{children}</View>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });

/** The active theme. Throws outside NexubNativeProvider. */
export function useTheme(): NexubTheme {
  const theme = React.useContext(ThemeContext);
  if (!theme) throw new Error('@nexub/react-native: wrap your app in <NexubNativeProvider>.');
  return theme;
}

/** Shorthand for `useTheme().roles`. */
export const useRoles = (): Roles => useTheme().roles;

/** The active strings: defaults merged with the provider's overrides. */
export const useNexubMessages = (): NexubMessages => useTheme().messages;

/** Plays a semantic haptic, unless the user turned haptics off. */
export function useHaptics(): (token: HapticToken) => void {
  const { haptics } = useTheme();
  return React.useCallback((token) => haptics && playHaptic(token), [haptics]);
}

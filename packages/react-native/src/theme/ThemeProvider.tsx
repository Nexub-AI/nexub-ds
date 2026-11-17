import * as React from 'react';
import {
  AccessibilityInfo,
  AppState,
  Platform,
  PlatformColor,
  StyleSheet,
  View,
  useColorScheme,
  useWindowDimensions,
  type ColorValue,
} from 'react-native';
import { native, type NativeRoles } from '@nexub/tokens/native';
import { createSeedRoles } from '@nexub/tokens/seed';
import {
  defaultMessages,
  directionOf,
  type ContrastLevel,
  type Direction,
  type DivisionKey,
  type GlassMode,
  type NexubMessages,
  type ProductKey,
} from '@nexub/core';
import { playHaptic, type HapticToken } from './haptics';
import type { FontSource, ResolvedFontSource } from './fonts';

export type Scheme = 'light' | 'dark';
export type Roles = { -readonly [K in keyof NativeRoles]: string };
export type RoleName = keyof Roles;
export type ElevationLevel = 0 | 1 | 2 | 3;
/** 'calm' is the default look; 'vivid' adds the gradient main action and livelier surfaces (web `data-expression`). */
export type Expression = 'calm' | 'vivid';

/** 10.9: colours that are not plain roles. */
export interface ThemeColors {
  /** The product's spot accent (its tertiary family); the primary family without a product. */
  spot: string;
  onSpot: string;
  spotContainer: string;
  onSpotContainer: string;
  /**
   * Primary fills for use straight in a style. Equal to `roles.primary` /
   * `roles['primary-container']`, except under `dynamicColor` on Android 12+,
   * where they are opaque system colours: never concatenate or compute with them.
   */
  primary: ColorValue;
  primaryContainer: ColorValue;
}

/** Text in fixed-height controls (buttons, chips) stops growing here, so it is not clipped. */
export const DENSE_MAX_FONT_SCALE = 1.5;

/**
 * Material You (Android 12+, API 31): the system accent at the tones the
 * primary role uses (40 / 80, containers 90 / 30). Null elsewhere.
 * The on-colours stay Nexub's: they sit at tones 100 / 20 and 10 / 90, and a
 * tone gap that wide clears 4.5:1 whatever the hue. Beyond that, the exact
 * contrast in this mode is the system palette's guarantee, not ours.
 */
export function dynamicPrimary(
  scheme: Scheme,
): Pick<ThemeColors, 'primary' | 'primaryContainer'> | null {
  if (Platform.OS !== 'android' || Number(Platform.Version) < 31) return null;
  const tone = (n: number) => PlatformColor(`@android:color/system_accent1_${n}`);
  return scheme === 'dark'
    ? { primary: tone(200), primaryContainer: tone(700) }
    : { primary: tone(600), primaryContainer: tone(100) };
}

export interface NexubTheme {
  scheme: Scheme;
  contrast: ContrastLevel;
  product: ProductKey | DivisionKey | undefined;
  /** @default 'calm' */
  expression: Expression;
  /** Colour roles, already resolved for scheme, contrast, product and seed. */
  roles: Roles;
  /** The spot accent and the (possibly system-provided) primary fills. */
  colors: ThemeColors;
  /** The OS text-size multiplier (1 = default). Layouts can stack or wrap when it is large. */
  fontScale: number;
  /** `maxFontSizeMultiplier` for text in fixed-height controls. */
  denseMaxFontScale: number;
  /** Every native token (spacing, shape, size, type, state, motion). */
  tokens: typeof native;
  /** `boxShadow` for an elevation level, undefined for 0. */
  elevation: (level: ElevationLevel) => string | undefined;
  /** Effective glass: 'off' when the user has Reduce Transparency on. */
  glass: GlassMode;
  reducedMotion: boolean;
  haptics: boolean;
  /** `fonts`, or 'nexub-bold' while the OS Bold Text setting is on (iOS). */
  fonts: ResolvedFontSource;
  locale: string;
  dir: Direction;
  messages: NexubMessages;
}

export interface NexubNativeProviderProps {
  /** @default 'system' */
  scheme?: Scheme | 'system';
  /** 'system' = iOS Increase Contrast / Android high-contrast text → 'high'. @default 'system' */
  contrast?: ContrastLevel | 'system';
  /**
   * Product (any app key) or division: remaps the tertiary role family and the
   * spot accent. An app without its own scale takes its division's.
   */
  product?: ProductKey | DivisionKey;
  /** 'vivid' turns on the gradient main action and the livelier surfaces. @default 'calm' */
  expression?: Expression;
  /**
   * Android 12+ only: take the primary fills from the system accent (Material You).
   * Ignored on iOS and older Android. @default false
   */
  dynamicColor?: boolean;
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

// Signature (the only style since 9.0) over the base tokens. Same keys, different
// numbers, so it's typed as the base (as-const) shape.
const signatureTokens = {
  ...native,
  shape: { ...native.shape, ...native.signature.shape },
  type: Object.fromEntries(
    Object.entries(native.type).map(([role, v]) => [
      role,
      { ...v, ...(native.signature.type as Record<string, { letterSpacing: number }>)[role] },
    ]),
  ),
} as unknown as typeof native;

type Spot = { spot: string; onSpot: string; spotContainer: string; onSpotContainer: string };
// A product's spot accent is its tertiary family (core.css "10.3").
const tertiaryOf = (s: Spot) => ({
  tertiary: s.spot,
  'on-tertiary': s.onSpot,
  'tertiary-container': s.spotContainer,
  'on-tertiary-container': s.onSpotContainer,
});

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
  event: 'reduceMotionChanged' | 'reduceTransparencyChanged' | 'boldTextChanged',
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
// Bold Text is an iOS setting; Android's bold-text adjustment has no React Native API.
const readBoldText = () =>
  Platform.OS === 'ios' ? AccessibilityInfo.isBoldTextEnabled() : Promise.resolve(false);

/**
 * Theme, accessibility preferences, locale and strings for every
 * @nexub/react-native component. Wrap the app once, inside the safe-area provider.
 */
export function NexubNativeProvider({
  scheme: schemeProp = 'system',
  contrast: contrastProp = 'system',
  product,
  expression = 'calm',
  dynamicColor = false,
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
  const boldText = useSetting(readBoldText, 'boldTextChanged');
  // The system font follows Bold Text by itself; the Nexub files need the heavier weight chosen.
  const resolvedFonts = fonts === 'nexub' && boldText ? 'nexub-bold' : fonts;
  const resolvedDir = dir ?? directionOf(locale);
  const { fontScale } = useWindowDimensions();

  const theme = React.useMemo<NexubTheme>(() => {
    const sig = native.signature;
    // base → signature → product → seed, so a product or seed still wins.
    const roles: Roles = {
      ...native.color.roles[contrast][scheme],
      ...sig.roles[contrast][scheme],
      ...(product ? tertiaryOf(native.color.spot[product][contrast][scheme]) : {}),
      ...(seed ? createSeedRoles(seed, { contrast, target: seedTarget })[scheme] : {}),
    };
    const family = product ? 'tertiary' : 'primary';
    const colors: ThemeColors = {
      spot: roles[family],
      onSpot: roles[`on-${family}`],
      spotContainer: roles[`${family}-container`],
      onSpotContainer: roles[`on-${family}-container`],
      primary: roles.primary,
      primaryContainer: roles['primary-container'],
      ...(dynamicColor ? dynamicPrimary(scheme) : null),
    };
    return {
      scheme,
      contrast,
      product,
      expression,
      roles,
      colors,
      fontScale,
      denseMaxFontScale: DENSE_MAX_FONT_SCALE,
      tokens: signatureTokens,
      elevation: (level) => (level ? sig.elevation[level][scheme] : undefined),
      glass: reduceTransparency ? 'off' : glass,
      reducedMotion,
      haptics,
      fonts: resolvedFonts,
      locale,
      dir: resolvedDir,
      messages: { ...defaultMessages, ...messages },
    };
  }, [
    scheme,
    contrast,
    product,
    expression,
    dynamicColor,
    fontScale,
    seed,
    seedTarget,
    glass,
    reduceTransparency,
    reducedMotion,
    haptics,
    resolvedFonts,
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

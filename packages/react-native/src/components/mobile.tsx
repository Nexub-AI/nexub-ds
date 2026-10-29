import * as React from 'react';
import {
  AppState,
  FlatList,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  RefreshControl as RNRefreshControl,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
  type ListRenderItem,
  type RefreshControlProps as RNRefreshControlProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { currencySymbol, fractionDigits, parseMoney } from '@nexub/core';
import { Calendar, Delete, Eye, EyeOff, type NativeIconProps } from '@nexub/icons/native';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable } from '../primitives/Pressable';
import { Surface } from '../primitives/Surface';
import { Text } from '../primitives/Text';
import { fontStyle } from '../theme/fonts';
import { useHaptics, useTheme, type RoleName } from '../theme/ThemeProvider';
import { Button, IconButton } from './actions';
import { Banner } from './feedback';
import { BottomSheet } from './overlays';

// ─── SwipeableRow ────────────────────────────────────────────────────────────

export interface SwipeAction {
  label: string;
  icon?: React.ComponentType<NativeIconProps>;
  onPress: () => void;
  /** @default 'neutral' */
  tone?: 'neutral' | 'danger' | 'primary';
}

export interface SwipeableRowProps {
  /** Accessible name of the whole row, e.g. "Amazon, minus $42.50, today". */
  label: string;
  /** Tap / double-tap action of the row (open details). */
  onPress?: () => void;
  /** Revealed by swiping toward the start edge. Each one is also an accessibility action. */
  actions: SwipeAction[];
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SWIPE_ACTION_WIDTH = 80;

/**
 * Swipe a row to reveal actions. Never the only way to an action: they are
 * custom accessibility actions too (VoiceOver rotor / TalkBack actions).
 */
export function SwipeableRow({ label, onPress, actions, children, style }: SwipeableRowProps) {
  const { roles, dir } = useTheme();
  const play = useHaptics();
  const width = actions.length * SWIPE_ACTION_WIDTH;
  const sign = dir === 'rtl' ? 1 : -1; // open = content moves toward the start edge
  const x = useSharedValue(0);
  const open = React.useRef(false);
  const spring = useTheme().tokens.motion.spring.spatial.default;
  const settle = (to: boolean) => {
    if (to !== open.current) play('snap');
    open.current = to;
    x.value = withSpring(to ? sign * width : 0, spring);
  };
  const responder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
        onPanResponderMove: (_, g) => {
          const base = open.current ? sign * width : 0;
          const next = base + g.dx;
          x.value =
            sign < 0
              ? Math.min(0, Math.max(-width * 1.2, next))
              : Math.max(0, Math.min(width * 1.2, next));
        },
        onPanResponderRelease: (_, g) =>
          settle(Math.abs((open.current ? sign * width : 0) + g.dx) > width / 2),
        onPanResponderTerminate: () => settle(open.current),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, sign],
  );
  const slide = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const bg: Record<NonNullable<SwipeAction['tone']>, [RoleName, RoleName]> = {
    neutral: ['surface-container-highest', 'on-surface'],
    danger: ['error', 'on-error'],
    primary: ['primary', 'on-primary'],
  };
  return (
    <View
      style={[{ overflow: 'hidden' }, style]}
      // One screen-reader element for the row: its name, its tap, and every swipe action.
      accessible
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label}
      accessibilityActions={[
        ...(onPress ? [{ name: 'activate' }] : []),
        ...actions.map((a) => ({ name: a.label, label: a.label })),
      ]}
      onAccessibilityAction={(e) => {
        const name = e.nativeEvent.actionName;
        if (name === 'activate') onPress?.();
        else actions.find((a) => a.label === name)?.onPress();
      }}
    >
      <View
        style={[StyleSheet.absoluteFill, { flexDirection: 'row', justifyContent: 'flex-end' }]}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {actions.map((a) => {
          const [b, f] = bg[a.tone ?? 'neutral'];
          const Glyph = a.icon;
          return (
            <Pressable
              key={a.label}
              accessibilityLabel={a.label}
              onPress={() => {
                settle(false);
                a.onPress();
              }}
              pressScale={false}
              stateLayer={f}
              style={{
                width: SWIPE_ACTION_WIDTH,
                backgroundColor: roles[b],
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              {Glyph && <Glyph size="md" color={roles[f]} />}
              <Text variant="label-md" color={f}>
                {a.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Animated.View
        style={[{ backgroundColor: roles['surface-container-lowest'] }, slide]}
        {...responder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

// ─── RefreshControl ──────────────────────────────────────────────────────────

/** The platform pull-to-refresh in the primary role. Pass to a ScrollView/FlatList `refreshControl`. */
export function RefreshControl(props: RNRefreshControlProps) {
  const { roles } = useTheme();
  return (
    <RNRefreshControl
      tintColor={roles.primary}
      colors={[roles.primary]}
      progressBackgroundColor={roles['surface-container-high']}
      {...props}
    />
  );
}

// ─── Carousel + PageIndicator ────────────────────────────────────────────────

export interface PageIndicatorProps {
  count: number;
  index: number;
  style?: StyleProp<ViewStyle>;
}

/** Dots for paged content: "Page 2 of 4" to screen readers. */
export function PageIndicator({ count, index, style }: PageIndicatorProps) {
  const { roles, messages } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={messages.page(index + 1, count)}
      style={[{ flexDirection: 'row', gap: 6, alignSelf: 'center' }, style]}
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            width: i === index ? 20 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: roles[i === index ? 'primary' : 'outline-variant'],
          }}
        />
      ))}
    </View>
  );
}

export interface CarouselProps<T> {
  data: readonly T[];
  renderItem: ListRenderItem<T>;
  /** Page width. @default the window width */
  width?: number;
  onIndexChange?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

/** Full-width paging (onboarding, card stacks) with a page indicator. */
export function Carousel<T>({
  data,
  renderItem,
  width: w,
  onIndexChange,
  style,
}: CarouselProps<T>) {
  const { width: window } = useWindowDimensions();
  const width = w ?? window;
  const [index, setIndex] = React.useState(0);
  const { tokens } = useTheme();
  return (
    <View style={[{ gap: tokens.spacing[3] }, style]}>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={(info) => <View style={{ width }}>{renderItem(info)}</View>}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
          onIndexChange?.(i);
        }}
      />
      <PageIndicator count={data.length} index={index} />
    </View>
  );
}

// ─── StickyFooter ────────────────────────────────────────────────────────────

export interface StickyFooterProps {
  /** Scrollable content above the footer. */
  children: React.ReactNode;
  /** The flow's primary action(s), kept above the keyboard and the home indicator. */
  footer: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Screen body + a footer that stays above the keyboard: the primary button of every flow. */
export function StickyFooter({ children, footer, style }: StickyFooterProps) {
  const { roles, tokens } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[{ flex: 1, backgroundColor: roles.surface }, style]}
    >
      <View style={{ flex: 1 }}>{children}</View>
      <View
        style={{
          paddingHorizontal: tokens.spacing[4],
          paddingTop: tokens.spacing[3],
          paddingBottom: Math.max(insets.bottom, tokens.spacing[4]),
          gap: tokens.spacing[2],
          backgroundColor: roles.surface,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: roles['outline-variant'],
        }}
      >
        {footer}
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── OTPInput ────────────────────────────────────────────────────────────────

export interface OTPInputProps {
  /** Accessible name, e.g. "Verification code". */
  label: string;
  /** @default 6 */
  length?: number;
  value?: string;
  onValueChange?: (code: string) => void;
  /** Called once all digits are entered. */
  onComplete?: (code: string) => void;
  /** Dots instead of digits (PIN). Turns off one-time-code autofill. */
  secure?: boolean;
  error?: string;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * One-time code / PIN entry: one hidden field (so paste and SMS autofill work:
 * iOS oneTimeCode, Android sms-otp) drawn as boxes.
 */
export function OTPInput({
  label,
  length = 6,
  value,
  onValueChange,
  onComplete,
  secure,
  error,
  autoFocus,
  style,
}: OTPInputProps) {
  const { roles, tokens, fonts } = useTheme();
  const ref = React.useRef<React.ComponentRef<typeof TextInput>>(null);
  const [focused, setFocused] = React.useState(false);
  const [code, setCode] = useControllableState({
    value,
    defaultValue: '',
    onChange: onValueChange,
  });
  return (
    <View style={[{ gap: tokens.spacing[2] }, style]}>
      <Pressable
        onPress={() => ref.current?.focus()}
        stateLayer={false}
        pressScale={false}
        accessible={false}
        style={{ flexDirection: 'row', gap: tokens.spacing[2], justifyContent: 'center' }}
      >
        {Array.from({ length }, (_, i) => {
          const ch = code[i];
          const active = focused && i === Math.min(code.length, length - 1);
          return (
            <View
              key={i}
              style={{
                width: 44,
                height: 52,
                borderRadius: tokens.shape.field,
                borderWidth: active || error ? 2 : 1,
                borderColor: error ? roles.error : active ? roles.primary : roles.outline,
                backgroundColor: roles['surface-container-lowest'],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text variant="title-lg" tabular>
                {ch ? (secure ? '•' : ch) : ''}
              </Text>
            </View>
          );
        })}
      </Pressable>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        accessibilityHint={error}
        value={code}
        onChangeText={(t) => {
          const next = t.replace(/\D/g, '').slice(0, length);
          setCode(next);
          if (next.length === length) onComplete?.(next);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={length}
        secureTextEntry={secure}
        textContentType={secure ? 'password' : 'oneTimeCode'}
        autoComplete={secure ? 'off' : 'sms-otp'}
        caretHidden
        style={{
          position: 'absolute',
          opacity: 0.011,
          width: 1,
          height: 1,
          ...fontStyle('sans', 400, fonts),
        }}
      />
      {error && (
        <Text
          variant="body-sm"
          color="error"
          style={{ textAlign: 'center' }}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
    </View>
  );
}

// ─── NumericKeypad + ExpressiveMoneyInput ────────────────────────────────────

export interface NumericKeypadProps {
  /** Called with '0'–'9', the decimal key or 'delete'. */
  onKey: (key: string) => void;
  /** Show the decimal key (money). @default false */
  decimal?: boolean;
  locale?: string;
  style?: StyleProp<ViewStyle>;
}

/** On-screen digits for amounts and PINs (no system keyboard covering the screen). */
export function NumericKeypad({ onKey, decimal, locale, style }: NumericKeypadProps) {
  const { roles, messages, locale: loc } = useTheme();
  const sep = new Intl.NumberFormat(locale ?? loc).format(1.5).replace(/\p{Nd}/gu, '') || '.';
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', decimal ? sep : '', '0', 'delete'];
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, style]}>
      {keys.map((k, i) =>
        k === '' ? (
          <View key={i} style={{ width: '33.333%', height: 64 }} />
        ) : (
          <Pressable
            key={i}
            accessibilityLabel={k === 'delete' ? messages.deleteDigit : k}
            haptic="selection"
            onPress={() => onKey(k)}
            style={{
              width: '33.333%',
              height: 64,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
            }}
          >
            {k === 'delete' ? (
              <Delete size="lg" color={roles['on-surface']} />
            ) : (
              <Text variant="headline-md">{k}</Text>
            )}
          </Pressable>
        ),
      )}
    </View>
  );
}

export interface ExpressiveMoneyInputProps {
  currency: string;
  value?: number | null;
  onValueChange?: (value: number | null) => void;
  /** Accessible name, e.g. "Amount to send". */
  label: string;
  locale?: string;
  /** Shown under the amount, e.g. "Balance $1,240.00" or an error. */
  caption?: string;
  error?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Big amount in the brand face + keypad (Wise-style money entry). */
export function ExpressiveMoneyInput({
  currency,
  value,
  onValueChange,
  label,
  locale,
  caption,
  error,
  style,
}: ExpressiveMoneyInputProps) {
  const theme = useTheme();
  const loc = locale ?? theme.locale;
  const digits = fractionDigits(currency, loc);
  const sep = new Intl.NumberFormat(loc).format(1.5).replace(/\p{Nd}/gu, '') || '.';
  const [text, setText] = React.useState(value == null ? '' : String(value).replace('.', sep));
  const press = (k: string) => {
    let next = text;
    if (k === 'delete') next = text.slice(0, -1);
    else if (k === sep) next = digits === 0 || text.includes(sep) ? text : (text || '0') + sep;
    else {
      const [, frac] = text.split(sep);
      if (frac !== undefined && frac.length >= digits) return;
      next = text === '0' ? k : text + k;
    }
    setText(next);
    onValueChange?.(next ? parseMoney(next, currency, loc) : null);
  };
  return (
    <View style={[{ gap: theme.tokens.spacing[4] }, style]}>
      <View
        accessible
        accessibilityLabel={`${label}, ${text || '0'} ${currency}`}
        accessibilityLiveRegion="polite"
        style={{ alignItems: 'center', gap: 4 }}
      >
        <Text
          variant="display-md"
          color={error ? 'error' : 'on-surface'}
          tabular
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          <Text variant="headline-md" color="on-surface-variant">
            {currencySymbol(currency, loc)}
          </Text>
          {text || '0'}
        </Text>
        {caption && (
          <Text variant="body-md" color={error ? 'error' : 'on-surface-variant'}>
            {caption}
          </Text>
        )}
      </View>
      <NumericKeypad onKey={press} decimal={digits > 0} locale={loc} />
    </View>
  );
}

// ─── SensitiveValue ──────────────────────────────────────────────────────────

export interface SensitiveValueProps {
  /** What it is, e.g. "Balance" (used for the toggle and the masked reading). */
  label: string;
  /** The formatted value, e.g. "$12,480.50". */
  children: string;
  /** @default 'title-lg' */
  variant?: React.ComponentProps<typeof Text>['variant'];
  revealed?: boolean;
  defaultRevealed?: boolean;
  onRevealedChange?: (revealed: boolean) => void;
}

/**
 * A value that can be hidden (balances, card numbers). Masked text reads as
 * "Balance, hidden", never as dots, and it re-masks when the app backgrounds.
 */
export function SensitiveValue({
  label,
  children,
  variant = 'title-lg',
  revealed,
  defaultRevealed = false,
  onRevealedChange,
}: SensitiveValueProps) {
  const { messages } = useTheme();
  const [shown, setShown] = useControllableState({
    value: revealed,
    defaultValue: defaultRevealed,
    onChange: onRevealedChange,
  });
  React.useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => s !== 'active' && setShown(false));
    return () => sub.remove();
  }, [setShown]);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Text
        variant={variant}
        tabular
        accessibilityLabel={`${label}, ${shown ? children : messages.hidden}`}
      >
        {shown ? children : '••••••'}
      </Text>
      <IconButton
        icon={shown ? EyeOff : Eye}
        label={shown ? messages.hide(label) : messages.show(label)}
        size="sm"
        onPress={() => setShown(!shown)}
      />
    </View>
  );
}

// ─── PrivacyShield ───────────────────────────────────────────────────────────

let ScreenCapture: typeof import('expo-screen-capture') | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional peer, must not fail when absent
  ScreenCapture = require('expo-screen-capture');
} catch {
  ScreenCapture = undefined;
}

export interface PrivacyShieldProps {
  children: React.ReactNode;
  /** Shown over the app in the app switcher (e.g. your logo). */
  cover?: React.ReactNode;
  /** Block screenshots and recording (Android FLAG_SECURE; iOS hides the content in captures). Needs expo-screen-capture. @default false */
  preventCapture?: boolean;
}

/**
 * Covers the app when it leaves the foreground, so the app-switcher snapshot
 * shows no balances. Wrap screens with sensitive data (or the whole app).
 */
export function PrivacyShield({ children, cover, preventCapture }: PrivacyShieldProps) {
  const { roles } = useTheme();
  const [covered, setCovered] = React.useState(false);
  React.useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => setCovered(s !== 'active'));
    return () => sub.remove();
  }, []);
  React.useEffect(() => {
    if (!preventCapture || !ScreenCapture) return;
    const key = 'nexub-privacy-shield';
    ScreenCapture.preventScreenCaptureAsync(key).catch(() => {});
    return () => {
      ScreenCapture?.allowScreenCaptureAsync(key).catch(() => {});
    };
  }, [preventCapture]);
  return (
    <View style={{ flex: 1 }}>
      {children}
      {covered && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: roles.surface, alignItems: 'center', justifyContent: 'center' },
          ]}
          accessibilityElementsHidden
        >
          {cover}
        </View>
      )}
    </View>
  );
}

// ─── OfflineBanner ───────────────────────────────────────────────────────────

/** Slim notice while the app has no connection. Pass your network state (e.g. NetInfo). */
export function OfflineBanner({
  offline,
  style,
}: {
  offline: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { messages } = useTheme();
  if (!offline) return null;
  return (
    <Banner
      tone="warning"
      style={[{ borderRadius: 0, paddingVertical: 10 }, style]}
      accessibilityLiveRegion="polite"
    >
      {messages.offline}
    </Banner>
  );
}

// ─── Coachmark ───────────────────────────────────────────────────────────────

export interface CoachmarkProps {
  title?: string;
  children: string;
  /** Which side the arrow is on (towards the thing it explains). @default 'top' */
  arrow?: 'top' | 'bottom';
  onDismiss: () => void;
  /** Dismiss label. @default messages.close */
  dismissLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** A one-time hint next to a new feature. Place it in your layout; it doesn't measure targets. */
export function Coachmark({
  title,
  children,
  arrow = 'top',
  onDismiss,
  dismissLabel,
  style,
}: CoachmarkProps) {
  const { roles, tokens, messages } = useTheme();
  const tip = (
    <View
      style={{
        width: 14,
        height: 14,
        marginStart: 24,
        transform: [{ rotate: '45deg' }],
        backgroundColor: roles['inverse-surface'],
        marginVertical: -7,
      }}
    />
  );
  return (
    <View accessibilityRole="alert" style={style}>
      {arrow === 'top' && tip}
      <View
        style={{
          padding: tokens.spacing[4],
          gap: tokens.spacing[2],
          borderRadius: tokens.shape.container,
          backgroundColor: roles['inverse-surface'],
        }}
      >
        {title && (
          <Text variant="title-sm" color="inverse-on-surface">
            {title}
          </Text>
        )}
        <Text variant="body-sm" color="inverse-on-surface">
          {children}
        </Text>
        <Button variant="text" size="sm" onPress={onDismiss} style={{ alignSelf: 'flex-end' }}>
          {dismissLabel ?? messages.close}
        </Button>
      </View>
      {arrow === 'bottom' && tip}
    </View>
  );
}

// ─── FAB ─────────────────────────────────────────────────────────────────────

export interface FABProps {
  icon: React.ComponentType<NativeIconProps>;
  /** Accessible name; also shown when `extended`. */
  label: string;
  onPress: () => void;
  extended?: boolean;
  /** Platforms that render it (a FAB reads as Material; iOS uses a toolbar or nav-bar button). @default ['android'] */
  platforms?: ('ios' | 'android')[];
  /** Extra bottom offset, e.g. the tab bar. @default 0 */
  bottomOffset?: number;
}

/** Floating primary action, bottom end. Android only by default (MOBILE_PLAN.md D7). */
export function FAB({
  icon: Glyph,
  label,
  onPress,
  extended,
  platforms = ['android'],
  bottomOffset = 0,
}: FABProps) {
  const { roles, tokens } = useTheme();
  const insets = useSafeAreaInsets();
  if (!platforms.includes(Platform.OS as 'ios')) return null;
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={onPress}
      stateLayer="on-primary-container"
      style={{
        position: 'absolute',
        end: 16,
        bottom: insets.bottom + 16 + bottomOffset,
        height: 56,
        minWidth: 56,
        paddingHorizontal: extended ? 20 : 0,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: roles['primary-container'],
        boxShadow: tokens.elevation[3].light,
      }}
    >
      <Glyph size="lg" color={roles['on-primary-container']} />
      {extended && (
        <Text variant="label-lg" color="on-primary-container">
          {label}
        </Text>
      )}
    </Pressable>
  );
}

// ─── DateTimeField ───────────────────────────────────────────────────────────

let Picker: typeof import('@react-native-community/datetimepicker') | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional peer, must not fail when absent
  Picker = require('@react-native-community/datetimepicker');
} catch {
  Picker = undefined;
}

export interface DateTimeFieldProps {
  label: string;
  value: Date | null;
  onValueChange: (value: Date) => void;
  /** @default 'date' */
  mode?: 'date' | 'time';
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * A field that opens the platform picker (Android dialog, iOS inline calendar
 * in a sheet). Needs @react-native-community/datetimepicker.
 */
export function DateTimeField({
  label,
  value,
  onValueChange,
  mode = 'date',
  minimumDate,
  maximumDate,
  placeholder,
  style,
}: DateTimeFieldProps) {
  const theme = useTheme();
  const { roles, tokens, messages, locale } = theme;
  const [open, setOpen] = React.useState(false);
  if (!Picker)
    throw new Error(
      '@nexub/react-native: DateTimeField needs @react-native-community/datetimepicker (npx expo install @react-native-community/datetimepicker).',
    );
  const { default: RNDateTimePicker, DateTimePickerAndroid } = Picker;
  const text = value
    ? new Intl.DateTimeFormat(
        locale,
        mode === 'date' ? { dateStyle: 'medium' } : { timeStyle: 'short' },
      ).format(value)
    : (placeholder ?? messages.pickDate);
  const show = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: value ?? new Date(),
        mode,
        minimumDate,
        maximumDate,
        onChange: (e, d) => e.type === 'set' && d && onValueChange(d),
      });
    } else setOpen(true);
  };
  return (
    <View style={[{ gap: 6 }, style]}>
      <Text variant="label-lg" color="on-surface-variant" importantForAccessibility="no">
        {label}
      </Text>
      <Pressable
        accessibilityLabel={`${label}, ${text}`}
        onPress={show}
        pressScale={false}
        style={{
          minHeight: tokens.size.control.lg,
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderRadius: tokens.shape.field,
          borderWidth: 1,
          borderColor: roles.outline,
          backgroundColor: roles['surface-container-lowest'],
        }}
      >
        <Calendar size="sm" color={roles['on-surface-variant']} />
        <Text variant="body-lg" color={value ? 'on-surface' : 'on-surface-muted'}>
          {text}
        </Text>
      </Pressable>
      {Platform.OS === 'ios' && (
        <BottomSheet open={open} onOpenChange={setOpen} title={label}>
          <Surface tone="surface-elevated">
            <RNDateTimePicker
              value={value ?? new Date()}
              mode={mode}
              display={mode === 'date' ? 'inline' : 'spinner'}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              accentColor={roles.primary}
              themeVariant={theme.scheme}
              locale={locale}
              onChange={(_, d) => d && onValueChange(d)}
            />
          </Surface>
          <Button size="lg" fullWidth onPress={() => setOpen(false)}>
            {messages.close}
          </Button>
        </BottomSheet>
      )}
    </View>
  );
}

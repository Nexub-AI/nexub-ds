import * as React from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Modal,
  PanResponder,
  Pressable as RNPressable,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import type { ToneValue } from '@nexub/core';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  type NativeIconProps,
} from '@nexub/icons/native';
import { Surface } from '../primitives/Surface';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import { nxEnter, nxExit, nxLayout, nxSpring } from '../theme/motion';
import { Button, IconButton } from './actions';
import { TONE_CONTAINERS, TONE_TEXT } from './shared';

const TONE_ICON: Partial<Record<ToneValue, React.ComponentType<NativeIconProps>>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
};

// ─── Banner ──────────────────────────────────────────────────────────────────

export interface BannerProps extends ViewProps {
  title?: string;
  children?: React.ReactNode;
  /** @default 'info' */
  tone?: ToneValue;
  /** One action, e.g. <Button variant="text">Review</Button>. */
  action?: React.ReactNode;
  onDismiss?: () => void;
}

/** Persistent in-page message (web Banner / Alert / Callout). */
export function Banner({
  title,
  children,
  tone = 'info',
  action,
  onDismiss,
  style,
  ...rest
}: BannerProps) {
  const { roles, tokens, messages } = useTheme();
  const [bg, fg] = TONE_CONTAINERS[tone];
  const Glyph = TONE_ICON[tone] ?? Info;
  return (
    // Drops in when shown, fades out when dismissed; content below glides up.
    <Animated.View
      entering={nxEnter('down')}
      exiting={nxExit('fade')}
      layout={nxLayout()}
      accessibilityRole={tone === 'danger' || tone === 'warning' ? 'alert' : 'summary'}
      style={[
        {
          flexDirection: 'row',
          gap: tokens.spacing[3],
          padding: tokens.spacing[4],
          borderRadius: tokens.shape.container,
          backgroundColor: roles[bg],
        },
        style,
      ]}
      {...rest}
    >
      <Glyph size="md" color={roles[fg]} />
      <View style={{ flex: 1, gap: 4 }}>
        {title && (
          <Text variant="title-sm" color={fg}>
            {title}
          </Text>
        )}
        {typeof children === 'string' ? (
          <Text variant="body-sm" color={fg}>
            {children}
          </Text>
        ) : (
          children
        )}
        {action && <View style={{ marginTop: 4 }}>{action}</View>}
      </View>
      {onDismiss && (
        <IconButton
          icon={X}
          label={messages.dismissBanner}
          size="xs"
          onPress={onDismiss}
          style={{ marginTop: -8, marginEnd: -8 }}
        />
      )}
    </Animated.View>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────

export interface ToastOptions {
  message: string;
  /** One short action ("Undo"). */
  action?: { label: string; onPress: () => void };
  tone?: ToneValue;
  /** 'short' 4 s, 'long' 10 s (Material snackbar timings). @default 'long' with an action (time to reach it, WCAG 2.2.1), else 'short' */
  duration?: 'short' | 'long';
}

const ToastCtx = React.createContext<(t: ToastOptions) => void>(() => {});

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Extra space above the bottom inset, e.g. the tab bar height. @default 0 */
  bottomOffset?: number;
}

/**
 * Where a released toast goes: -1 / 1 swipes it off toward that side, 0
 * springs it back. `dx` in px, `vx` in px/s; a quick flick wins over distance.
 */
export function toastRelease(dx: number, vx: number): -1 | 0 | 1 {
  if (Math.abs(vx) > 500) return vx < 0 ? -1 : 1;
  if (Math.abs(dx) > 96) return dx < 0 ? -1 : 1;
  return 0;
}

/** How far the toast rises into place (and sinks on its way out). */
const TOAST_RISE = 24;
const TOAST_EXIT = nxSpring('effects', 'fast');

type LiveToast = ToastOptions & { id: number; leaving?: boolean };

/** Hosts one toast at a time above the bottom safe area. Put it inside NexubNativeProvider. */
export function ToastProvider({ children, bottomOffset = 0 }: ToastProviderProps) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = React.useState<LiveToast | null>(null);
  const show = React.useCallback((t: ToastOptions) => {
    setToast({ ...t, id: Date.now() });
    AccessibilityInfo.announceForAccessibility(t.message);
  }, []);
  // Leaving plays the exit spring; the toast unmounts when it lands (onGone).
  const leave = React.useCallback(() => setToast((t) => t && { ...t, leaving: true }), []);
  const gone = React.useCallback(
    (id: number) => setToast((t) => (t && t.id === id ? null : t)),
    [],
  );
  const id = toast?.id;
  const ms =
    toast && ((toast.duration ?? (toast.action ? 'long' : 'short')) === 'long' ? 10_000 : 4_000);
  React.useEffect(() => {
    if (!ms) return;
    const timer = setTimeout(leave, ms);
    return () => clearTimeout(timer);
  }, [id, ms, leave]);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {toast && (
        <ToastSurface
          key={toast.id}
          toast={toast}
          bottom={insets.bottom + 8 + bottomOffset}
          onLeave={leave}
          onGone={gone}
        />
      )}
    </ToastCtx.Provider>
  );
}

function ToastSurface({
  toast,
  bottom,
  onLeave,
  onGone,
}: {
  toast: LiveToast;
  bottom: number;
  onLeave: () => void;
  onGone: (id: number) => void;
}) {
  const { roles, tokens } = useTheme();
  const { width } = useWindowDimensions();
  const { id, leaving } = toast;
  // Shared values, not layout animations: with the nxEnter/nxExit layout
  // presets iOS UI tests never found the toast; this rests at opacity 1.
  const x = useSharedValue(0);
  const y = useSharedValue(TOAST_RISE);
  React.useEffect(() => {
    y.value = leaving
      ? withSpring(TOAST_RISE, TOAST_EXIT, (finished) => {
          if (finished) runOnJS(onGone)(id);
        })
      : withSpring(0, nxSpring('spatial', 'default'));
  }, [leaving, y, id, onGone]);
  // ponytail: PanResponder writes the shared value from the JS thread; a
  // UI-thread swipe needs react-native-gesture-handler as a peer.
  const swipe = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: (_, g) => {
          x.value = g.dx;
        },
        onPanResponderRelease: (_, g) => {
          const velocity = g.vx * 1000; // px/ms → px/s
          const side = toastRelease(g.dx, velocity);
          x.value = side
            ? withSpring(side * width, { ...TOAST_EXIT, velocity }, (finished) => {
                if (finished) runOnJS(onGone)(id);
              })
            : withSpring(0, { ...nxSpring('spatial', 'default'), velocity });
        },
        onPanResponderTerminate: () => {
          x.value = withSpring(0, nxSpring('spatial', 'default'));
        },
      }),
    [width, id, onGone, x],
  );
  const motion = useAnimatedStyle(() => ({
    opacity: Math.max(0, Math.min(1, 1 - Math.abs(x.value) / width - y.value / TOAST_RISE)),
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));
  const Glyph = toast.tone ? TONE_ICON[toast.tone] : undefined;
  return (
    <Animated.View
      pointerEvents="box-none"
      style={[{ position: 'absolute', start: 16, end: 16, bottom }, motion]}
    >
      <View
        {...swipe.panHandlers}
        accessibilityLiveRegion="polite"
        style={{
          minHeight: 48,
          flexDirection: 'row',
          alignItems: 'center',
          gap: tokens.spacing[3],
          paddingStart: tokens.spacing[4],
          paddingEnd: toast.action ? tokens.spacing[1] : tokens.spacing[4],
          paddingVertical: tokens.spacing[2],
          borderRadius: tokens.shape.container,
          backgroundColor: roles['inverse-surface'],
          boxShadow: tokens.elevation[3].light,
        }}
      >
        {Glyph && toast.tone && (
          <Glyph
            size="md"
            color={roles[toast.tone === 'neutral' ? 'inverse-on-surface' : 'inverse-primary']}
          />
        )}
        <Text variant="body-md" color="inverse-on-surface" style={{ flex: 1 }}>
          {toast.message}
        </Text>
        {toast.action && (
          <Button
            variant="text"
            size="sm"
            onPress={() => {
              toast.action!.onPress();
              onLeave();
            }}
            style={{ backgroundColor: 'transparent' }}
          >
            {toast.action.label}
          </Button>
        )}
      </View>
    </Animated.View>
  );
}

/** `const toast = useToast(); toast({ message: 'Saved' })`. Needs ToastProvider. */
export const useToast = () => React.useContext(ToastCtx);

// ─── Dialog ──────────────────────────────────────────────────────────────────

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Extra content between the description and the actions. */
  children?: React.ReactNode;
  /** 1–2 Buttons; put the confirming action last. */
  actions: React.ReactNode;
  /** Tapping the scrim or Android back closes it. @default true */
  dismissible?: boolean;
  /** @deprecated 8.5: use `dismissible` (the web spelling). Removed in 9.0. */
  dismissable?: boolean;
}

/** Modal alert for decisions that block the flow. Prefer a sheet for anything longer. */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
  dismissible,
  dismissable: legacyDismissable,
}: DialogProps) {
  const dismissable = dismissible ?? legacyDismissable ?? true;
  const { roles, tokens } = useTheme();
  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={() => {
        if (dismissable) onOpenChange(false);
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: tokens.spacing[6],
        }}
      >
        <RNPressable
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onPress={() => dismissable && onOpenChange(false)}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            start: 0,
            end: 0,
            backgroundColor: roles.scrim,
            opacity: 0.32,
          }}
        />
        <Surface
          accessibilityViewIsModal
          accessibilityRole="alert"
          tone="surface-elevated"
          elevation={3}
          radius="overlay"
          style={{
            width: '100%',
            maxWidth: 400,
            padding: tokens.spacing[6],
            gap: tokens.spacing[4],
          }}
        >
          <View style={{ gap: tokens.spacing[2] }}>
            <Text variant="headline-sm" accessibilityRole="header">
              {title}
            </Text>
            {description && (
              <Text variant="body-md" color="on-surface-variant">
                {description}
              </Text>
            )}
          </View>
          {children}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: tokens.spacing[2],
            }}
          >
            {actions}
          </View>
        </Surface>
      </View>
    </Modal>
  );
}

// ─── Progress ────────────────────────────────────────────────────────────────

export interface ProgressProps {
  /** 0–1. */
  value: number;
  label: string;
  /** @default 'linear' */
  variant?: 'linear' | 'circular';
  /** Circular diameter. @default 40 */
  size?: number;
  /** Linear only: splits the bar into N equal steps, filled up to the value. */
  segments?: number;
  style?: StyleProp<ViewStyle>;
}

/** Determinate progress. For unknown waits use LoadingIndicator. */
export function Progress({ value, label, variant = 'linear', size = 40, segments, style }: ProgressProps) {
  const { roles } = useTheme();
  const v = Math.min(1, Math.max(0, value));
  const a11y = {
    accessible: true,
    accessibilityRole: 'progressbar' as const,
    accessibilityLabel: label,
    accessibilityValue: { min: 0, max: 100, now: Math.round(v * 100) },
  };
  if (variant === 'circular') {
    const stroke = 4;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return (
      <View {...a11y} style={[{ width: size, height: size }, style]}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={roles['surface-container-highest']}
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={roles.primary}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${c * v} ${c}`}
          />
        </Svg>
      </View>
    );
  }
  if (segments && segments > 0) {
    const filled = Math.round(v * segments);
    return (
      <View {...a11y} style={[{ height: 6, flexDirection: 'row', gap: 4 }, style]}>
        {Array.from({ length: segments }, (_, i) => (
          <View
            key={i}
            testID={i < filled ? 'progress-segment-filled' : 'progress-segment'}
            style={{
              flex: 1,
              borderRadius: 3,
              backgroundColor: roles[i < filled ? 'primary' : 'surface-container-highest'],
            }}
          />
        ))}
      </View>
    );
  }
  return (
    <View
      {...a11y}
      style={[
        {
          height: 6,
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: roles['surface-container-highest'],
        },
        style,
      ]}
    >
      <View
        style={{ width: `${v * 100}%`, height: 6, borderRadius: 3, backgroundColor: roles.primary }}
      />
    </View>
  );
}

/** The platform activity indicator in the primary role. */
export function LoadingIndicator({
  size = 'large',
  label,
}: {
  size?: 'small' | 'large';
  label?: string;
}) {
  const { roles, messages } = useTheme();
  return (
    <ActivityIndicator
      size={size}
      color={roles.primary}
      accessibilityLabel={label ?? messages.loading}
    />
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

export interface SkeletonProps {
  width?: ViewStyle['width'];
  /** @default 16 */
  height?: number;
  /** @default 'field' */
  radius?: 'field' | 'control' | 'container' | number;
  /** `pulse` fades, `shimmer` sweeps a highlight across. Both stop under Reduce Motion. @default 'pulse' */
  animation?: 'pulse' | 'shimmer';
  style?: StyleProp<ViewStyle>;
}

/**
 * Loading placeholder. Breathes between full and half opacity (a slow, calm
 * shimmer); static under Reduce Motion. Hidden from screen readers.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  radius = 'field',
  animation = 'pulse',
  style,
}: SkeletonProps) {
  const { roles, tokens, reducedMotion } = useTheme();
  const shimmer = animation === 'shimmer';
  const pulse = useSharedValue(1);
  // Shimmer: a highlight band crosses the measured width, then pauses off-screen.
  const [w, setW] = React.useState(0);
  const sweep = useSharedValue(0);
  React.useEffect(() => {
    if (reducedMotion || shimmer) return;
    pulse.value = withRepeat(
      withTiming(0.5, { duration: SHIMMER_MS, reduceMotion: ReduceMotion.System }),
      -1,
      true,
    );
  }, [reducedMotion, shimmer, pulse]);
  React.useEffect(() => {
    if (reducedMotion || !shimmer) return;
    sweep.value = withRepeat(
      withTiming(1, { duration: SHIMMER_MS * 2, reduceMotion: ReduceMotion.System }),
      -1,
    );
  }, [reducedMotion, shimmer, sweep]);
  const animated = useAnimatedStyle(() => ({ opacity: pulse.value }));
  const band = useAnimatedStyle(() => ({
    transform: [{ translateX: -w * 0.4 + sweep.value * w * 1.4 }],
  }));
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width,
          height,
          borderRadius: typeof radius === 'number' ? radius : tokens.shape[radius],
          backgroundColor: roles['surface-container-high'],
        },
        shimmer && { overflow: 'hidden' },
        animated,
        style,
      ]}
      onLayout={shimmer ? (e) => setW(e.nativeEvent.layout.width) : undefined}
    >
      {shimmer && !reducedMotion && (
        <Animated.View
          testID="skeleton-shimmer"
          style={[
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '40%',
              backgroundColor: roles['surface-container-highest'],
            },
            band,
          ]}
        />
      )}
    </Animated.View>
  );
}

export interface SkeletonTextProps extends Pick<SkeletonProps, 'animation'> {
  /** Number of lines; the last is shorter. @default 3 */
  lines?: number;
  style?: StyleProp<ViewStyle>;
}

/** Placeholder paragraph. Each line is one body-md line tall, so the real text doesn't shift layout. */
export function SkeletonText({ lines = 3, animation, style }: SkeletonTextProps) {
  const { tokens } = useTheme();
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={style}>
      {Array.from({ length: lines }, (_, i) => (
        <View key={i} style={{ height: tokens.type['body-md'].lineHeight, justifyContent: 'center' }}>
          <Skeleton
            height={12}
            animation={animation}
            width={i === lines - 1 && lines > 1 ? '60%' : '100%'}
          />
        </View>
      ))}
    </View>
  );
}

// Half a skeleton breath, matching web's animate-pulse (2 s per cycle).
const SHIMMER_MS = 1000;

export interface SkeletonSwapProps extends ViewProps {
  /** While true the skeleton shows; flipping to false crossfades to the content. */
  loading: boolean;
  /** Placeholder shown while loading, usually `Skeleton`s shaped like the content. */
  skeleton: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Crossfades from a skeleton to the loaded content in place, instead of popping.
 * The web `SkeletonSwap` twin. Marks itself busy for screen readers while loading.
 * Content that is ready on first render appears without a fade.
 *
 * ```tsx
 * <SkeletonSwap loading={isLoading} skeleton={<Skeleton height={120} radius="container" />}>
 *   <Card>…</Card>
 * </SkeletonSwap>
 * ```
 */
export function SkeletonSwap({ loading, skeleton, children, accessibilityState, ...rest }: SkeletonSwapProps) {
  // Fade the content in only when it replaces a skeleton the user saw.
  const hadSkeleton = React.useRef(loading);
  if (loading) hadSkeleton.current = true;
  return (
    <View accessibilityState={{ ...accessibilityState, busy: loading }} {...rest}>
      {loading ? (
        // Reanimated keeps an exiting view at its last frame, so it fades over the arriving content.
        <Animated.View key="skeleton" exiting={nxExit('fade')}>
          {skeleton}
        </Animated.View>
      ) : (
        <Animated.View key="content" entering={hadSkeleton.current ? nxEnter('fade') : undefined}>
          {children}
        </Animated.View>
      )}
    </View>
  );
}

// ─── EmptyState / ErrorState ─────────────────────────────────────────────────

export interface EmptyStateProps extends ViewProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<NativeIconProps>;
  /** @default 'neutral' */
  tone?: ToneValue;
  /** Primary next step, e.g. <Button>Add money</Button>. */
  action?: React.ReactNode;
  /** Scales spacing, icon and title. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

const EMPTY_SIZE = {
  sm: { pad: 6, gap: 2, disc: 48, icon: 'md', title: 'title-md' },
  md: { pad: 10, gap: 3, disc: 64, icon: 'lg', title: 'title-lg' },
  lg: { pad: 16, gap: 4, disc: 80, icon: 'xl', title: 'headline-sm' },
} as const;

/** Nothing here yet: say why and offer the next step. */
export function EmptyState({
  title,
  description,
  icon: Glyph = Info,
  tone = 'neutral',
  action,
  size = 'md',
  style,
  ...rest
}: EmptyStateProps) {
  const { roles, tokens } = useTheme();
  const [bg] = TONE_CONTAINERS[tone];
  const sz = EMPTY_SIZE[size];
  return (
    <View
      style={[
        {
          alignItems: 'center',
          gap: tokens.spacing[sz.gap],
          paddingVertical: tokens.spacing[sz.pad],
          paddingHorizontal: tokens.spacing[6],
        },
        style,
      ]}
      {...rest}
    >
      <View
        style={{
          width: sz.disc,
          height: sz.disc,
          borderRadius: sz.disc / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: roles[bg],
        }}
      >
        <Glyph size={sz.icon} color={roles[TONE_TEXT[tone]]} />
      </View>
      <Text variant={sz.title} accessibilityRole="header" style={{ textAlign: 'center' }}>
        {title}
      </Text>
      {description && (
        <Text variant="body-md" color="on-surface-variant" style={{ textAlign: 'center' }}>
          {description}
        </Text>
      )}
      {action && <View style={{ marginTop: tokens.spacing[2] }}>{action}</View>}
    </View>
  );
}

export interface ErrorStateProps extends Omit<EmptyStateProps, 'tone' | 'action'> {
  /** Shows a Retry button (messages.retry). */
  onRetry?: () => void;
}

export function ErrorState({ onRetry, icon = AlertTriangle, ...rest }: ErrorStateProps) {
  const { messages } = useTheme();
  return (
    <EmptyState
      tone="danger"
      icon={icon}
      action={
        onRetry && (
          <Button variant="tonal" onPress={onRetry}>
            {messages.retry}
          </Button>
        )
      }
      {...rest}
    />
  );
}

import * as React from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Modal,
  Pressable as RNPressable,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
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
    <View
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
    </View>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────

export interface ToastOptions {
  message: string;
  /** One short action ("Undo"). */
  action?: { label: string; onPress: () => void };
  tone?: ToneValue;
  /** 'short' 4 s, 'long' 10 s (Material snackbar timings). @default 'short' */
  duration?: 'short' | 'long';
}

const ToastCtx = React.createContext<(t: ToastOptions) => void>(() => {});

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Extra space above the bottom inset, e.g. the tab bar height. @default 0 */
  bottomOffset?: number;
}

/** Hosts one toast at a time above the bottom safe area. Put it inside NexubNativeProvider. */
export function ToastProvider({ children, bottomOffset = 0 }: ToastProviderProps) {
  const { roles, tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = React.useState<(ToastOptions & { id: number }) | null>(null);
  const show = React.useCallback((t: ToastOptions) => {
    setToast({ ...t, id: Date.now() });
    AccessibilityInfo.announceForAccessibility(t.message);
  }, []);
  React.useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), toast.duration === 'long' ? 10_000 : 4_000);
    return () => clearTimeout(timer);
  }, [toast]);
  const Glyph = toast?.tone ? TONE_ICON[toast.tone] : undefined;
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {toast && (
        <Animated.View
          key={toast.id}
          entering={FadeInDown}
          exiting={FadeOutDown}
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            start: 16,
            end: 16,
            bottom: insets.bottom + 8 + bottomOffset,
          }}
        >
          <View
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
                  setToast(null);
                }}
                style={{ backgroundColor: 'transparent' }}
              >
                {toast.action.label}
              </Button>
            )}
          </View>
        </Animated.View>
      )}
    </ToastCtx.Provider>
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
  dismissable = true,
}: DialogProps) {
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
  style?: StyleProp<ViewStyle>;
}

/** Determinate progress. For unknown waits use LoadingIndicator. */
export function Progress({ value, label, variant = 'linear', size = 40, style }: ProgressProps) {
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
  style?: StyleProp<ViewStyle>;
}

/** Loading placeholder. Pulses gently; static under Reduce Motion. Hidden from screen readers. */
export function Skeleton({ width = '100%', height = 16, radius = 'field', style }: SkeletonProps) {
  const { roles, tokens, reducedMotion } = useTheme();
  const pulse = useSharedValue(1);
  React.useEffect(() => {
    if (!reducedMotion) pulse.value = withRepeat(withTiming(0.5, { duration: 900 }), -1, true);
  }, [reducedMotion, pulse]);
  const animated = useAnimatedStyle(() => ({ opacity: pulse.value }));
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
        animated,
        style,
      ]}
    />
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
}

/** Nothing here yet: say why and offer the next step. */
export function EmptyState({
  title,
  description,
  icon: Glyph = Info,
  tone = 'neutral',
  action,
  style,
  ...rest
}: EmptyStateProps) {
  const { roles, tokens } = useTheme();
  const [bg] = TONE_CONTAINERS[tone];
  return (
    <View
      style={[
        {
          alignItems: 'center',
          gap: tokens.spacing[3],
          paddingVertical: tokens.spacing[10],
          paddingHorizontal: tokens.spacing[6],
        },
        style,
      ]}
      {...rest}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: roles[bg],
        }}
      >
        <Glyph size="lg" color={roles[TONE_TEXT[tone]]} />
      </View>
      <Text variant="title-lg" accessibilityRole="header" style={{ textAlign: 'center' }}>
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

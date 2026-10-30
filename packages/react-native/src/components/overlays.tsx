import * as React from 'react';
import {
  ActionSheetIOS,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable as RNPressable,
  ScrollView,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronsUpDown } from '@nexub/icons/native';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { useHaptics, useTheme } from '../theme/ThemeProvider';
import { ListItem, ListSection } from './containers';

// ─── BottomSheet ─────────────────────────────────────────────────────────────

export type SheetDetent = 'content' | number;

/** Height of the grabber row above the sheet body. */
const GRABBER = 24;

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Heights the sheet rests at: 'content' (fits its content) or a 0–1 fraction of the screen. @default ['content'] */
  detents?: SheetDetent[];
  title?: string;
  children: React.ReactNode;
  /** Drag down, tap the scrim or Android back closes it. @default true */
  dismissable?: boolean;
  /** Let the content scroll (long lists). @default false */
  scroll?: boolean;
}

/**
 * A modal sheet from the bottom edge (one at a time, per Apple and Material).
 * Drag the grabber to resize or dismiss; tapping it cycles the detents, which
 * also works with VoiceOver/TalkBack.
 */
export function BottomSheet({
  open,
  onOpenChange,
  detents = ['content'],
  title,
  children,
  dismissable = true,
  scroll,
}: BottomSheetProps) {
  const theme = useTheme();
  const { roles, tokens, messages } = theme;
  const play = useHaptics();
  const insets = useSafeAreaInsets();
  const { height: screen } = useWindowDimensions();
  const max = screen - insets.top - 12;
  const [content, setContent] = React.useState(0);
  const heights = detents
    .map((d) =>
      Math.min(max, d === 'content' ? (content ? content + GRABBER : max * 0.5) : d * screen),
    )
    .sort((a, b) => a - b);
  const [index, setIndex] = React.useState(0);
  const [visible, setVisible] = React.useState(open);
  const translate = useSharedValue(screen);
  const scrim = useSharedValue(0);
  const spring = tokens.motion.spring.spatial.default;
  const height = heights[Math.min(index, heights.length - 1)]!;
  const tallest = heights[heights.length - 1]!;

  // Sheet sits at translateY = tallest - height (0 = fully up).
  const snapTo = React.useCallback(
    (i: number) => {
      setIndex(i);
      translate.value = withSpring(tallest - heights[i]!, spring);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tallest, heights.join(), spring],
  );

  React.useEffect(() => {
    if (open) {
      setVisible(true);
      setIndex(0);
      translate.value = screen;
      translate.value = withSpring(tallest - heights[0]!, spring);
      scrim.value = withTiming(1, { duration: tokens.motion.duration.normal });
    } else if (visible) {
      translate.value = withTiming(screen, { duration: tokens.motion.duration.normal });
      scrim.value = withTiming(0, { duration: tokens.motion.duration.normal });
      const t = setTimeout(() => setVisible(false), tokens.motion.duration.normal);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Re-fit when 'content' is measured.
  React.useEffect(() => {
    if (open && content) translate.value = withSpring(tallest - height, spring);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const start = React.useRef(0);
  const responder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
        onPanResponderGrant: () => {
          start.current = translate.value;
        },
        onPanResponderMove: (_, g) => {
          translate.value = Math.max(0, start.current + g.dy);
        },
        onPanResponderRelease: (_, g) => {
          const y = start.current + g.dy;
          const lowest = tallest - heights[0]!;
          if (dismissable && (y > lowest + 80 || g.vy > 1.2)) return onOpenChange(false);
          // Nearest detent, biased by fling direction.
          const target = y - g.vy * 120;
          let best = 0;
          heights.forEach((h, i) => {
            if (Math.abs(tallest - h - target) < Math.abs(tallest - heights[best]! - target))
              best = i;
          });
          if (best !== index) play('snap');
          snapTo(best);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tallest, heights.join(), index, dismissable],
  );

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translate.value }] }));
  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrim.value * 0.32 }));
  const close = () => {
    if (dismissable) onOpenChange(false);
  };

  const body = (
    <View
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height;
        if (detents.includes('content') && Math.abs(h - content) > 1) setContent(h);
      }}
      style={{
        paddingHorizontal: tokens.spacing[4],
        paddingBottom: insets.bottom + tokens.spacing[4],
        gap: tokens.spacing[3],
      }}
    >
      {title && (
        <Text variant="title-lg" accessibilityRole="header" style={{ textAlign: 'center' }}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={close}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            start: 0,
            end: 0,
            backgroundColor: roles.scrim,
          },
          scrimStyle,
        ]}
      >
        <RNPressable
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ flex: 1 }}
          onPress={close}
        />
      </Animated.View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end' }}
        pointerEvents="box-none"
      >
        <Animated.View
          accessibilityViewIsModal
          style={[
            {
              height: tallest,
              borderTopStartRadius: tokens.shape.overlay,
              borderTopEndRadius: tokens.shape.overlay,
              backgroundColor: roles['surface-elevated'],
              boxShadow: tokens.elevation[3][theme.scheme],
              overflow: 'hidden',
            },
            sheetStyle,
          ]}
        >
          <View {...responder.panHandlers}>
            <Pressable
              accessibilityLabel={messages.resize}
              accessibilityHint={title}
              disabled={heights.length < 2}
              onPress={() => snapTo((index + 1) % heights.length)}
              stateLayer={false}
              pressScale={false}
              style={{ height: GRABBER, alignItems: 'center', justifyContent: 'center' }}
            >
              <View
                style={{
                  width: 36,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: roles['outline-variant'],
                }}
              />
            </Pressable>
          </View>
          {scroll ? (
            <ScrollView style={{ maxHeight: height - GRABBER }} keyboardShouldPersistTaps="handled">
              {body}
            </ScrollView>
          ) : (
            body
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── ActionSheet ─────────────────────────────────────────────────────────────

export interface SheetAction {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export interface ActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  actions: SheetAction[];
}

/**
 * Choices about an action the user started. iOS: the system action sheet
 * (destructive in red, Cancel at the bottom). Android: a bottom sheet list.
 */
export function ActionSheet({ open, onOpenChange, title, message, actions }: ActionSheetProps) {
  const { roles, messages, scheme } = useTheme();
  React.useEffect(() => {
    if (!open || Platform.OS !== 'ios') return;
    const enabled = actions.filter((a) => !a.disabled);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        message,
        options: [...enabled.map((a) => a.label), messages.cancel],
        cancelButtonIndex: enabled.length,
        destructiveButtonIndex: enabled.flatMap((a, i) => (a.destructive ? [i] : [])),
        tintColor: roles.primary,
        userInterfaceStyle: scheme,
      },
      (i) => {
        onOpenChange(false);
        enabled[i]?.onPress();
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  if (Platform.OS === 'ios') return null;
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={title}>
      {message && (
        <Text variant="body-sm" color="on-surface-variant" style={{ textAlign: 'center' }}>
          {message}
        </Text>
      )}
      <ListSection>
        {actions.map((a) => (
          <ListItem
            key={a.label}
            variant="button"
            title={a.label}
            destructive={a.destructive}
            disabled={a.disabled}
            onPress={() => {
              onOpenChange(false);
              a.onPress();
            }}
          />
        ))}
      </ListSection>
      <ListSection>
        <ListItem variant="button" title={messages.cancel} onPress={() => onOpenChange(false)} />
      </ListSection>
    </BottomSheet>
  );
}

// ─── ContextMenu ─────────────────────────────────────────────────────────────

export interface ContextMenuProps {
  actions: SheetAction[];
  title?: string;
  children: React.ReactNode;
  /** Tap action of the wrapped content (long-press opens the menu). */
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Long-press menu. The same actions are custom accessibility actions, so
 * VoiceOver/TalkBack users reach them from the actions rotor. Always keep a
 * visible way to every action too (HIG).
 */
export function ContextMenu({
  actions,
  title,
  children,
  onPress,
  accessibilityLabel,
  style,
}: ContextMenuProps) {
  const play = useHaptics();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityActions={actions.map((a) => ({ name: a.label, label: a.label }))}
        onAccessibilityAction={(e) =>
          actions.find((a) => a.label === e.nativeEvent.actionName)?.onPress()
        }
        onPress={onPress}
        onLongPress={() => {
          play('snap');
          setOpen(true);
        }}
        style={style}
      >
        {children}
      </Pressable>
      <ActionSheet open={open} onOpenChange={setOpen} title={title} actions={actions} />
    </>
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export interface SelectProps<T extends string> {
  label: string;
  options: readonly SelectOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** A field that opens a sheet of choices (web Select / Combobox on mobile). */
export function Select<T extends string>({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  helperText,
  error,
  disabled,
  style,
}: SelectProps<T>) {
  const theme = useTheme();
  const { roles, tokens } = theme;
  const [open, setOpen] = React.useState(false);
  const [v, setV] = useControllableState<T | undefined>({
    value,
    defaultValue,
    onChange: onValueChange as (v: T | undefined) => void,
  });
  const current = options.find((o) => o.value === v);
  return (
    <View style={[{ gap: 6 }, style]}>
      <Text
        variant="label-lg"
        color={error ? 'error' : 'on-surface-variant'}
        importantForAccessibility="no"
      >
        {label}
      </Text>
      <Pressable
        accessibilityLabel={`${label}, ${current?.label ?? placeholder ?? ''}`}
        accessibilityHint={error ?? helperText}
        disabled={disabled}
        onPress={() => setOpen(true)}
        pressScale={false}
        style={{
          minHeight: tokens.size.control.lg,
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: tokens.shape.field,
          borderWidth: error ? 2 : 1,
          borderColor: error ? roles.error : roles.outline,
          backgroundColor: roles['surface-container-lowest'],
          opacity: disabled ? tokens.state['disabled-content'] : 1,
        }}
      >
        <Text
          variant="body-lg"
          color={current ? 'on-surface' : 'on-surface-muted'}
          style={{ flex: 1 }}
          numberOfLines={1}
        >
          {current?.label ?? placeholder ?? ''}
        </Text>
        <ChevronsUpDown size="sm" color={roles['on-surface-variant']} />
      </Pressable>
      {(error || helperText) && (
        <Text variant="body-sm" color={error ? 'error' : 'on-surface-variant'}>
          {error ?? helperText}
        </Text>
      )}
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title={label}
        detents={options.length > 6 ? [0.6, 0.92] : ['content']}
        scroll={options.length > 6}
      >
        <ListSection>
          {options.map((o) => (
            <ListItem
              key={o.value}
              variant="radio"
              title={o.label}
              subtitle={o.description}
              checked={o.value === v}
              onCheckedChange={() => {
                setV(o.value);
                setOpen(false);
              }}
            />
          ))}
        </ListSection>
      </BottomSheet>
    </View>
  );
}

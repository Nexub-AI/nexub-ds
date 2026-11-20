import * as React from 'react';
import { Modal, Pressable as RNPressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { Text } from '../primitives/Text';
import { useHaptics, useTheme } from '../theme/ThemeProvider';
import { nxEnter } from '../theme/motion';

// ─── Tooltip ─────────────────────────────────────────────────────────────────

type Rect = { x: number; y: number; width: number; height: number };

interface TriggerProps {
  onLongPress?: (e: unknown) => void;
  delayLongPress?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface TooltipProps {
  /** The tip. Screen readers get it as the child's hint, without the popover. */
  label: string;
  /** @default 'top' */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** How long to hold before the tip shows, in ms. @default 400 */
  delayDuration?: number;
  /** How long the tip stays, in ms. A tap anywhere hides it sooner. @default 2500 */
  duration?: number;
  /** One pressable element (Button, IconButton, Pressable): it gets `onLongPress` and the hint. */
  children: React.ReactElement<TriggerProps>;
}

/**
 * A short label for a control. Touch has no hover, so it shows on long-press
 * (the platform pattern) and goes away on its own.
 */
export function Tooltip({ label, side = 'top', delayDuration = 400, duration = 2500, children }: TooltipProps) {
  const { roles, tokens } = useTheme();
  const play = useHaptics();
  const screen = useWindowDimensions();
  const anchor = React.useRef<React.ComponentRef<typeof View>>(null);
  const [at, setAt] = React.useState<Rect | null>(null);
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const hide = React.useCallback(() => {
    clearTimeout(timer.current);
    setAt(null);
    setSize(null);
  }, []);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const show = () =>
    anchor.current?.measureInWindow((x, y, width, height) => {
      play('selection');
      setAt({ x, y, width, height });
      clearTimeout(timer.current);
      timer.current = setTimeout(hide, duration);
    });

  const child = React.cloneElement(children, {
    delayLongPress: delayDuration,
    onLongPress: (e: unknown) => {
      children.props.onLongPress?.(e);
      show();
    },
    // Not twice: an icon button whose name is already the tip needs no hint.
    accessibilityHint:
      children.props.accessibilityHint ?? (children.props.accessibilityLabel === label ? undefined : label),
  });

  // Placed once the bubble is measured; kept on screen, flipped when a side has no room.
  const gap = tokens.spacing[1];
  const edge = tokens.spacing[2];
  let left = 0;
  let top = 0;
  if (at && size) {
    const vertical = side === 'top' || side === 'bottom';
    if (vertical) {
      const above = at.y - size.height - gap;
      const below = at.y + at.height + gap;
      top = side === 'top' ? (above < edge ? below : above) : below + size.height > screen.height - edge ? above : below;
      left = at.x + at.width / 2 - size.width / 2;
    } else {
      const before = at.x - size.width - gap;
      const after = at.x + at.width + gap;
      left = side === 'left' ? (before < edge ? after : before) : after + size.width > screen.width - edge ? before : after;
      top = at.y + at.height / 2 - size.height / 2;
    }
    left = Math.max(edge, Math.min(left, screen.width - size.width - edge));
    top = Math.max(edge, Math.min(top, screen.height - size.height - edge));
  }

  return (
    <>
      <View ref={anchor} collapsable={false} style={{ alignSelf: 'flex-start' }}>
        {child}
      </View>
      {at && (
        <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={hide}>
          <RNPressable
            testID="tooltip-backdrop"
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden
            onPress={hide}
            style={StyleSheet.absoluteFill}
          >
            <Animated.View
              entering={nxEnter('fade', 'fast')}
              pointerEvents="none"
              onLayout={(e) =>
                setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })
              }
              style={{
                position: 'absolute',
                left,
                top,
                opacity: size ? 1 : 0,
                maxWidth: screen.width - edge * 2,
                paddingHorizontal: tokens.spacing['2-5'],
                paddingVertical: tokens.spacing['1-5'],
                borderRadius: tokens.shape.tooltip,
                backgroundColor: roles['inverse-surface'],
              }}
            >
              <Text variant="label-md" color="inverse-on-surface">
                {label}
              </Text>
            </Animated.View>
          </RNPressable>
        </Modal>
      )}
    </>
  );
}

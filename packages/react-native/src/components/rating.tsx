import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable } from '../primitives/Pressable';
import { useHaptics, useTheme } from '../theme/ThemeProvider';
import { MIN_TARGET } from './shared';

// ─── Rating ──────────────────────────────────────────────────────────────────

export interface RatingProps {
  value?: number;
  /** @default 0 */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** @default 5 */
  max?: number;
  readOnly?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name. @default messages.rating */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

// Same star as web Rating (20 × 20 viewBox).
const STAR =
  'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

/**
 * Star rating. Tap a star to set it; screen readers get one adjustable control
 * (swipe up / down, or the volume keys on Android, to change the value).
 */
export function Rating({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  readOnly = false,
  size = 'md',
  label,
  style,
}: RatingProps) {
  const { roles, tokens, messages } = useTheme();
  const play = useHaptics();
  const [v, setV] = useControllableState<number>({ value, defaultValue, onChange: onValueChange });
  const px = size === 'sm' ? tokens.size.icon.sm : size === 'lg' ? tokens.spacing[7] : tokens.size.icon.md;
  const gap = tokens.spacing['0-5'];
  // 44pt tall; sideways each star owns half the gap, so neighbours never overlap.
  const slopY = Math.max(0, Math.ceil((MIN_TARGET - px) / 2));
  const hitSlop = { top: slopY, bottom: slopY, left: gap / 2, right: gap / 2 };
  const step = (by: number) => {
    const next = Math.min(max, Math.max(0, v + by));
    if (next === v) return;
    play('selection');
    setV(next);
  };
  return (
    <View
      accessible
      accessibilityRole={readOnly ? 'image' : 'adjustable'}
      accessibilityLabel={label ?? messages.rating}
      accessibilityValue={{ min: 0, max, now: v, text: messages.ratingStars(v) }}
      accessibilityActions={readOnly ? undefined : [{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        if (readOnly) return;
        if (e.nativeEvent.actionName === 'increment') step(1);
        if (e.nativeEvent.actionName === 'decrement') step(-1);
      }}
      style={[{ flexDirection: 'row', alignSelf: 'flex-start', gap }, style]}
    >
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        const filled = star <= v;
        return (
          <Pressable
            key={star}
            testID={`rating-star-${star}`}
            accessible={false}
            disabled={readOnly}
            haptic={star === v ? undefined : 'selection'}
            stateLayer={false}
            pressScale={0.9}
            hitSlop={hitSlop}
            onPress={() => setV(star)}
          >
            <Svg width={px} height={px} viewBox="0 0 20 20">
              <Path
                d={STAR}
                fill={filled ? roles.warning : 'none'}
                stroke={filled ? roles.warning : roles['outline-variant']}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        );
      })}
    </View>
  );
}

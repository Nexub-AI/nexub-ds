import * as React from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { ControlSize, ToneValue } from '@nexub/core';
import type { NativeIconProps } from '@nexub/icons/native';
import { Pressable, type PressableProps } from '../primitives/Pressable';
import { Surface } from '../primitives/Surface';
import { Text } from '../primitives/Text';
import { useTheme, type RoleName } from '../theme/ThemeProvider';
import type { HapticToken } from '../theme/haptics';
import { TONE_CONTAINERS, TONE_ROLES, controlHeight, disabledOpacity, hitSlopFor } from './shared';

/** `hero` is the main action: a filled button that takes the gradient under `expression="vivid"` (as web). */
export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'glass' | 'hero';

// variant="tonal" with a tone is the role's container pair (a soft, coloured
// button) instead of the solid fill. Same table as web `tonalToneClasses`.
const TONAL_TONE: typeof TONE_CONTAINERS = {
  ...TONE_CONTAINERS,
  neutral: ['surface-container-high', 'on-surface'],
};

// [container role | undefined, content role]
const VARIANT: Record<ButtonVariant, [RoleName | undefined, RoleName]> = {
  filled: ['primary', 'on-primary'],
  tonal: ['secondary-container', 'on-secondary-container'],
  outlined: [undefined, 'on-surface'],
  text: [undefined, 'primary'],
  glass: [undefined, 'on-surface'],
  hero: ['primary', 'on-primary'],
};

const LABEL: Record<ControlSize, 'label-md' | 'label-lg' | 'title-md'> = {
  xs: 'label-md',
  sm: 'label-md',
  md: 'label-lg',
  lg: 'label-lg',
  xl: 'title-md',
};
const PAD: Record<ControlSize, number> = { xs: 10, sm: 14, md: 20, lg: 24, xl: 28 };
const ICON: Record<ControlSize, NativeIconProps['size']> = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'md',
};

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: React.ReactNode;
  /** @default 'filled' */
  variant?: ButtonVariant;
  /** Solid semantic or product colour (overrides the variant colour). */
  tone?: ToneValue;
  /** The control ladder. Primary actions on mobile use 'lg' (48). @default 'md' */
  size?: ControlSize;
  /** Shows a spinner (after 150ms, for at least 400ms), blocks presses at once and announces `loadingLabel`. */
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  leadingIcon?: React.ComponentType<NativeIconProps>;
  trailingIcon?: React.ComponentType<NativeIconProps>;
}

// Spinner timing (web twin): hidden for loads under 150ms, then shown for at least 400ms (no flicker).
const SPINNER_DELAY = 150;
const SPINNER_MIN = 400;

function useSpinner(busy: boolean): boolean {
  // Mounting already busy shows it at once (nothing to flicker from).
  const [shown, setShown] = React.useState(busy);
  const shownAt = React.useRef(0);
  React.useEffect(() => {
    if (shown) shownAt.current = Date.now();
  }, [shown]);
  React.useEffect(() => {
    if (busy === shown) return;
    const wait = busy ? SPINNER_DELAY : Math.max(0, SPINNER_MIN - (Date.now() - shownAt.current));
    const t = setTimeout(() => setShown(busy), wait);
    return () => clearTimeout(t);
  }, [busy, shown]);
  return shown;
}

/** Capsule button. One `filled` (or toned) action per screen; the rest tonal/outlined/text. */
export function Button({
  children,
  variant = 'filled',
  tone,
  size = 'md',
  loading,
  loadingLabel,
  fullWidth,
  leadingIcon: Leading,
  trailingIcon: Trailing,
  disabled,
  style,
  accessibilityLabel,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const { roles } = theme;
  const [bgRole, fgRole] = tone
    ? (variant === 'tonal' ? TONAL_TONE : TONE_ROLES)[tone]
    : VARIANT[variant];
  const height = controlHeight(theme, size);
  const fg = roles[fgRole];
  const inactive = disabled || loading;
  // Vivid: the untoned main action is a gradient with a soft glow. High contrast
  // keeps the flat fill (the roles already carry the contrast), as does disabled.
  const vivid =
    theme.expression === 'vivid' &&
    theme.contrast !== 'high' &&
    !tone &&
    !disabled &&
    (variant === 'filled' || variant === 'hero');
  // The far stop is generated for the default primary. A seeded primary fades
  // into the tertiary instead; a system colour (dynamicColor) cannot go in a gradient.
  const defaultEnd = theme.tokens.color.vivid[theme.contrast][theme.scheme].accent2;
  const gradientEnd =
    theme.colors.primary !== roles.primary
      ? undefined
      : roles.primary === theme.tokens.signature.roles[theme.contrast][theme.scheme].primary
        ? defaultEnd
        : roles.tertiary;
  const gradientId = React.useId().replace(/\W/g, '');
  const spinner = useSpinner(!!loading);
  const label = typeof children === 'string' ? children : undefined;

  const body = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.tokens.spacing[2],
        opacity: disabled ? disabledOpacity(theme) : 1,
      }}
    >
      {spinner ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        Leading && <Leading size={ICON[size]} color={fg} />
      )}
      {typeof children === 'string' ? (
        <Text
          variant={LABEL[size]}
          style={{ color: fg }}
          numberOfLines={1}
          maxFontSizeMultiplier={theme.denseMaxFontScale}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      {!spinner && Trailing && <Trailing size={ICON[size]} color={fg} />}
    </View>
  );

  const shape: StyleProp<ViewStyle> = [
    {
      height,
      paddingHorizontal: PAD[size],
      borderRadius: theme.tokens.shape.control,
      justifyContent: 'center',
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
      // colors.primary is roles.primary unless dynamicColor swapped in the system accent.
      backgroundColor: bgRole ? (bgRole === 'primary' ? theme.colors.primary : roles[bgRole]) : 'transparent',
    },
    vivid && { boxShadow: `0 6px 18px -6px ${roles.primary}61` }, // glow: primary at 38%
    variant === 'outlined' && !tone && { borderWidth: 1, borderColor: roles['outline-variant'] },
    disabled && bgRole && { backgroundColor: roles['on-surface'] + '1f' }, // disabled-container 12%
    style,
  ];

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? (loading && loadingLabel ? loadingLabel : label)}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      hitSlop={hitSlopFor(height)}
      stateLayer={fgRole}
      style={
        variant === 'glass' && !tone ? { alignSelf: fullWidth ? 'stretch' : 'flex-start' } : shape
      }
      {...rest}
    >
      {variant === 'glass' && !tone ? (
        <Surface
          material="glass"
          radius="control"
          style={[{ height, paddingHorizontal: PAD[size], justifyContent: 'center' }, style]}
        >
          {body}
        </Surface>
      ) : vivid && gradientEnd ? (
        <>
          <View
            pointerEvents="none"
            testID="button-gradient"
            style={[StyleSheet.absoluteFill, { borderRadius: theme.tokens.shape.control, overflow: 'hidden' }]}
          >
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={roles.primary} />
                  <Stop offset="1" stopColor={gradientEnd} />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
            </Svg>
          </View>
          {body}
        </>
      ) : (
        body
      )}
    </Pressable>
  );
}

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: React.ComponentType<NativeIconProps>;
  /** Required: the accessible name (what it does, not "button"). */
  label: string;
  /** @default 'text' */
  variant?: ButtonVariant;
  tone?: ToneValue;
  /** @default 'md' */
  size?: ControlSize;
  /** Toggle state for icon toggles (favourite, mute). */
  selected?: boolean;
  haptic?: HapticToken;
}

/** Circular icon-only button; always 44pt+ to touch. */
export function IconButton({
  icon: Glyph,
  label,
  variant = 'text',
  tone,
  size = 'md',
  selected,
  disabled,
  style,
  ...rest
}: IconButtonProps) {
  const theme = useTheme();
  const [bgRole, fgRole] = tone ? TONE_ROLES[tone] : VARIANT[variant];
  const fgSelected: RoleName = selected
    ? 'primary'
    : variant === 'text' && !tone
      ? 'on-surface-variant'
      : fgRole;
  const height = controlHeight(theme, size);
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled, selected }}
      disabled={disabled}
      hitSlop={hitSlopFor(height)}
      stateLayer={fgRole}
      style={[
        {
          width: height,
          height,
          borderRadius: height / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bgRole ? theme.roles[bgRole] : 'transparent',
          opacity: disabled ? disabledOpacity(theme) : 1,
        },
        variant === 'outlined' && { borderWidth: 1, borderColor: theme.roles['outline-variant'] },
        style,
      ]}
      {...rest}
    >
      <Glyph
        size={ICON[size] === 'xs' ? 'sm' : size === 'xl' ? 'lg' : 'md'}
        color={theme.roles[fgSelected]}
      />
    </Pressable>
  );
}

export interface ButtonGroupProps {
  children: React.ReactNode;
  /** 'vertical' puts actions full-width in a column (bottom of forms). @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
}

/** Related actions together. In a stack, put the primary action first. */
export function ButtonGroup({ children, orientation = 'horizontal', style }: ButtonGroupProps) {
  const { tokens } = useTheme();
  return (
    <View
      style={[
        orientation === 'horizontal'
          ? { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing[2] }
          : { gap: tokens.spacing[3], alignItems: 'stretch' },
        style,
      ]}
    >
      {orientation === 'vertical'
        ? React.Children.map(children, (c) =>
            React.isValidElement<ButtonProps>(c) ? React.cloneElement(c, { fullWidth: true }) : c,
          )
        : children}
    </View>
  );
}

export interface LinkProps extends Omit<PressableProps, 'children'> {
  children: string;
}

/** Inline text action. Opens nothing by itself: pass `onPress` (e.g. router.push / Linking.openURL). */
export function Link({ children, style, ...rest }: LinkProps) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={children}
      stateLayer={false}
      pressScale={false}
      hitSlop={8}
      style={style}
      {...rest}
    >
      <Text variant="label-lg" color="primary" style={{ textDecorationLine: 'underline' }}>
        {children}
      </Text>
    </Pressable>
  );
}

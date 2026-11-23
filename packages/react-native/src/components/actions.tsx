import * as React from 'react';
import { AccessibilityInfo, ActivityIndicator, Linking, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { ControlSize, ToneValue } from '@nexub/core';
import { Check, ExternalLink, type NativeIconProps } from '@nexub/icons/native';
import { Pressable, type PressableProps } from '../primitives/Pressable';
import { Surface } from '../primitives/Surface';
import { Text } from '../primitives/Text';
import { useHaptics, useTheme, type RoleName } from '../theme/ThemeProvider';
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
  /** Shows a spinner (after 150ms, for at least 400ms), blocks presses at once and announces `loadingLabel`. Same as `status="loading"`. */
  loading?: boolean;
  /** Announced while loading. @default 'Loading…' (the provider's `loading` message) */
  loadingLabel?: string;
  /**
   * Async feedback, as on web. `loading` shows a spinner and blocks presses, `success`
   * shows a check, `error` plays the error haptic. Screen readers hear each change.
   * Wins over `loading`. @default 'idle'
   */
  status?: ButtonStatus;
  /** Announced on success. When given, it also replaces the visible label while `status` is `success`. @default 'Done' */
  successLabel?: string;
  /** Announced on error. @default 'Something went wrong' */
  errorLabel?: string;
  fullWidth?: boolean;
  leadingIcon?: React.ComponentType<NativeIconProps>;
  trailingIcon?: React.ComponentType<NativeIconProps>;
}

/** The async state of a Button, as on web. */
export type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

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
  status: statusProp,
  successLabel,
  errorLabel = 'Something went wrong',
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
  const status: ButtonStatus = statusProp ?? (loading ? 'loading' : 'idle');
  const busy = status === 'loading';
  const inactive = disabled || busy;
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
  const spinner = useSpinner(busy);
  const swapLabel = status === 'success' && successLabel !== undefined;
  const label = swapLabel ? successLabel : typeof children === 'string' ? children : undefined;
  const loadingText = loadingLabel ?? theme.messages.loading;
  const play = useHaptics();

  // Each change of status is announced (not the first render), like web's live region.
  const announced = React.useRef(status);
  React.useEffect(() => {
    if (announced.current === status) return;
    announced.current = status;
    const text =
      status === 'loading' ? loadingText
      : status === 'success' ? (successLabel ?? 'Done')
      : status === 'error' ? errorLabel
      : '';
    if (text) AccessibilityInfo.announceForAccessibility(text);
    if (status === 'success') play('confirm');
    else if (status === 'error') play('reject');
  }, [status, loadingText, successLabel, errorLabel, play]);

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
      ) : status === 'success' ? (
        <Check size={ICON[size]} color={fg} testID="button-success" />
      ) : (
        Leading && <Leading size={ICON[size]} color={fg} />
      )}
      {typeof children === 'string' || swapLabel ? (
        <Text
          variant={LABEL[size]}
          style={{ color: fg }}
          numberOfLines={1}
          maxFontSizeMultiplier={theme.denseMaxFontScale}
        >
          {swapLabel ? successLabel : children}
        </Text>
      ) : (
        children
      )}
      {!spinner && status !== 'success' && Trailing && <Trailing size={ICON[size]} color={fg} />}
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
      accessibilityLabel={accessibilityLabel ?? (busy && loadingLabel ? loadingLabel : label)}
      accessibilityState={{ disabled: !!inactive, busy }}
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
  /** A spinner replaces the icon (the size is kept), presses are blocked and screen readers hear it as busy. */
  loading?: boolean;
}

/** Circular icon-only button; always 44pt+ to touch. */
export function IconButton({
  icon: Glyph,
  label,
  variant = 'text',
  tone,
  size = 'md',
  selected,
  loading = false,
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
      accessibilityState={{ disabled: !!disabled || loading, selected, busy: loading }}
      disabled={disabled || loading}
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
      {loading ? (
        <ActivityIndicator size="small" color={theme.roles[fgSelected]} />
      ) : (
        <Glyph
          size={ICON[size] === 'xs' ? 'sm' : size === 'xl' ? 'lg' : 'md'}
          color={theme.roles[fgSelected]}
        />
      )}
    </Pressable>
  );
}

export interface ButtonGroupProps {
  children: React.ReactNode;
  /** 'vertical' puts actions full-width in a column (bottom of forms). @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Joins the buttons into one connected control (M3 Expressive, as on web): capsule
   * outer ends, small inner corners and a 2pt seam, so each keeps its own pressed state.
   */
  attached?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Related actions together. In a stack, put the primary action first. */
export function ButtonGroup({ children, orientation = 'horizontal', attached = false, style }: ButtonGroupProps) {
  const { tokens } = useTheme();
  const vertical = orientation === 'vertical';
  const items = React.Children.toArray(children);
  const inner = tokens.radius.md;
  // Small corners where a button meets its neighbour.
  const corners = (i: number): ViewStyle => {
    const first = i === 0;
    const last = i === items.length - 1;
    return vertical
      ? {
          ...(!first && { borderTopStartRadius: inner, borderTopEndRadius: inner }),
          ...(!last && { borderBottomStartRadius: inner, borderBottomEndRadius: inner }),
        }
      : {
          ...(!first && { borderTopStartRadius: inner, borderBottomStartRadius: inner }),
          ...(!last && { borderTopEndRadius: inner, borderBottomEndRadius: inner }),
        };
  };
  const gap = attached ? tokens.spacing['0-5'] : tokens.spacing[vertical ? 3 : 2];
  return (
    <View
      style={[
        vertical
          ? { gap, alignItems: 'stretch' }
          : { flexDirection: 'row', flexWrap: attached ? 'nowrap' : 'wrap', gap },
        style,
      ]}
    >
      {vertical || attached
        ? items.map((c, i) =>
            React.isValidElement<ButtonProps>(c)
              ? React.cloneElement(c, {
                  ...(vertical && { fullWidth: true }),
                  ...(attached && { style: [c.props.style, corners(i)] }),
                })
              : c,
          )
        : children}
    </View>
  );
}

export interface LinkProps extends Omit<PressableProps, 'children'> {
  children: string;
  /** A URL opened with `Linking.openURL` when the link is pressed. `onPress`, when given, runs instead. */
  href?: string;
  /**
   * The link leaves the app (a website, another app): adds the external-link icon and
   * tells screen readers it opens externally. With `href`, the URL opens through `Linking`.
   */
  external?: boolean;
  /**
   * `default` and `underlined` are the primary colour, `muted` the muted text colour.
   * All stay underlined, since touch screens have no hover to reveal a link. @default 'default'
   */
  variant?: 'default' | 'muted' | 'underlined';
}


/** Inline text action. Pass `onPress` (e.g. router.push), or `href` to open a URL with Linking. */
export function Link({
  children,
  href,
  external = false,
  variant = 'default',
  onPress,
  accessibilityHint,
  style,
  ...rest
}: LinkProps) {
  const { roles, tokens, messages } = useTheme();
  const color = variant === 'muted' ? 'on-surface-muted' : 'primary';
  const open = onPress ?? (href ? () => void Linking.openURL(href).catch(() => {}) : undefined);
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={children}
      accessibilityHint={accessibilityHint ?? (external ? messages.opensExternally : undefined)}
      stateLayer={false}
      pressScale={false}
      hitSlop={8}
      onPress={open}
      style={external ? [{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[1] }, style] : style}
      {...rest}
    >
      <Text variant="label-lg" color={color} style={{ textDecorationLine: 'underline' }}>
        {children}
      </Text>
      {external && <ExternalLink size="xs" color={roles[color]} testID="link-external" />}
    </Pressable>
  );
}

import * as React from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  findNodeHandle,
  Switch as RNSwitch,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import {
  clampNumber,
  currencySymbol,
  formatForEditing,
  formatNumberValue,
  isNumberDraft,
  parseMoney,
  parseNumberDraft,
  stepNumber,
  type ControlSize,
} from '@nexub/core';
import {
  Check,
  Eye,
  EyeOff,
  Minus,
  Plus,
  Search,
  Sparkles,
  X,
  type NativeIconProps,
} from '@nexub/icons/native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  LayoutAnimationConfig,
  runOnJS,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { fontStyle } from '../theme/fonts';
import { useHaptics, useTheme } from '../theme/ThemeProvider';
import { nxEnter, nxExit, nxLayout, nxSpring, useSpringValue } from '../theme/motion';
import { IconButton } from './actions';
import { MIN_TARGET, controlHeight, disabledOpacity, hitSlopFor } from './shared';

// ─── TextField ───────────────────────────────────────────────────────────────

export interface TextFieldProps extends Omit<TextInputProps, 'style' | 'editable'> {
  ref?: React.Ref<React.ComponentRef<typeof TextInput>>;
  /** Visible label above the field (also its accessible name). */
  label: string;
  /** Hint under the field. Replaced by `error` when set. */
  helperText?: string;
  /** Error message: red outline, announced, replaces the helper text. */
  error?: string;
  /** Shows a required marker after the label, like web FormField. Checking the value is up to you. */
  required?: boolean;
  disabled?: boolean;
  /**
   * Field height, the same names as web Input's `size`: `sm` and `md` are the compact desktop
   * heights, `lg` the mobile field height (48), `xl` the large touch height. @default 'lg'
   */
  size?: Extract<ControlSize, 'sm' | 'md' | 'lg' | 'xl'>;
  /** Red outline and announced as invalid, with or without an `error` message. */
  invalid?: boolean;
  /**
   * Shows the value but it can't be changed. The field can still be focused and its text
   * selected and copied; it sits on a quieter surface so it doesn't look editable.
   */
  readOnly?: boolean;
  /** An icon (or any small node) at the start, inside the field. */
  leadingIcon?: React.ReactNode;
  /** An icon (or any small node) at the end, inside the field, after the clear button. */
  trailingIcon?: React.ReactNode;
  /** Text or a node in its own segment before the field, e.g. "https://". */
  leadingAddon?: React.ReactNode;
  /** Text or a node in its own segment after the field, e.g. ".com" or "kg". */
  trailingAddon?: React.ReactNode;
  /** The older name for `leadingIcon`: a node at the start, inside the field. */
  leading?: React.ReactNode;
  /** The older name for `trailingIcon`: a node at the end, inside the field. */
  trailing?: React.ReactNode;
  /** Shows a clear button while there is a value. Clearing fires `onChangeText` with "". */
  clearable?: boolean;
  /** Called when the clear button empties the field, after `onChangeText("")`. */
  onClear?: () => void;
  /** Shows a "12/80" counter; needs `maxLength`. Announced politely near the limit. */
  showCount?: boolean;
  /** Spinner in the trailing slot and busy for screen readers. */
  loading?: boolean;
  /**
   * 12.5: an agent is filling this field. Busy for screen readers, with a calm shimmer on the
   * field (none under Reduce Motion); it stays editable. Pass the value as it arrives.
   */
  streaming?: boolean;
  /**
   * 12.5: the value came from an agent. Shows a "Suggested" mark beside the label, read as part
   * of the field's hint. Typing in the field clears the mark; so do accept and clear.
   */
  generated?: boolean;
  /** 12.5: with `generated`, shows an accept button beside the mark. */
  onAcceptSuggestion?: () => void;
  /** 12.5: with `generated`, shows a clear button beside the mark. Clear the value here. */
  onClearSuggestion?: () => void;
  style?: StyleProp<ViewStyle>;
}

const STREAM_PULSE_MS = 1000;

/** 12.5: the streaming field's calm shimmer: a faint primary wash that breathes. Static under Reduce Motion. */
function StreamingWash({ radius }: { radius: number }) {
  const { roles, reducedMotion } = useTheme();
  const level = useSharedValue(0);
  React.useEffect(() => {
    if (reducedMotion) return;
    level.value = withRepeat(withTiming(1, { duration: STREAM_PULSE_MS, reduceMotion: ReduceMotion.System }), -1, true);
  }, [reducedMotion, level]);
  const wash = useAnimatedStyle(() => ({ opacity: 0.04 + level.value * 0.08 }));
  return (
    <Animated.View
      testID="field-streaming"
      pointerEvents="none"
      style={[
        { position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, borderRadius: radius, backgroundColor: roles.primary },
        wash,
      ]}
    />
  );
}

// Near the limit = the last 10% (at least 1 character).
const nearLimit = (length: number, max: number) => length >= max - Math.max(1, Math.ceil(max * 0.1));

/** Addon segment: a string is set as text, any other node as is. */
function Addon({ children, side }: { children: React.ReactNode; side: 'leading' | 'trailing' }) {
  const { roles, tokens } = useTheme();
  return (
    <View
      style={{
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingHorizontal: tokens.spacing[3],
        backgroundColor: roles['surface-container-high'],
        borderColor: roles['outline-variant'],
        [side === 'leading' ? 'borderEndWidth' : 'borderStartWidth']: 1,
      }}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text variant="body-md" color="on-surface-variant">
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

/**
 * The field behind TextField and SearchField. `chrome="search"` draws the capsule search box: no
 * visible label (it is the accessible name), a search icon and the "Clear search" button.
 */
function Field({
  ref,
  label,
  helperText,
  error,
  disabled,
  size = 'lg',
  invalid,
  readOnly,
  leadingIcon,
  trailingIcon,
  leadingAddon,
  trailingAddon,
  leading,
  trailing,
  clearable,
  onClear,
  showCount,
  loading,
  style,
  multiline,
  onFocus,
  onBlur,
  onChangeText,
  chrome = 'field',
  required,
  streaming,
  generated,
  onAcceptSuggestion,
  onClearSuggestion,
  ...rest
}: TextFieldProps & { chrome?: 'field' | 'search' }) {
  const theme = useTheme();
  const { roles, tokens, fonts, messages } = theme;
  const search = chrome === 'search';
  const [focused, setFocused] = React.useState(false);
  // Track the length for uncontrolled use; controlled reads `value`.
  const [uncontrolledLength, setLength] = React.useState((rest.defaultValue ?? '').length);
  const length = rest.value != null ? rest.value.length : uncontrolledLength;
  const max = rest.maxLength;
  const counting = !!showCount && max !== undefined && max >= 0;
  const bad = !!invalid || !!error;
  const inner = React.useRef<React.ComponentRef<typeof TextInput>>(null);
  const setRefs = (node: React.ComponentRef<typeof TextInput> | null) => {
    inner.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.RefObject<typeof node>).current = node;
  };
  // 12.5: the "Suggested" mark settles when the person acts on the value; a new suggestion
  // (`generated` turning on again) shows it again. The agent's own updates arrive through `value`.
  const [settled, setSettled] = React.useState(false);
  const [prevGenerated, setPrevGenerated] = React.useState(generated);
  if (prevGenerated !== generated) {
    setPrevGenerated(generated);
    if (generated) setSettled(false);
  }
  const suggested = !!generated && !settled && !search;
  const changeText = (text: string) => {
    setLength(text.length);
    if (suggested) setSettled(true);
    onChangeText?.(text);
  };
  // Accept and clear go with the mark, so the screen reader moves on to the field.
  const settle = (then: () => void) => () => {
    setSettled(true);
    then();
    const tag = inner.current && findNodeHandle(inner.current);
    if (tag) AccessibilityInfo.setAccessibilityFocus(tag);
  };
  const clear = () => {
    inner.current?.clear();
    changeText('');
    onClear?.();
    inner.current?.focus();
  };
  const showClear = clearable && length > 0 && !disabled && !readOnly;
  const body = tokens.type[size === 'sm' || search ? 'body-md' : 'body-lg'];
  const restBorder = search ? 'transparent' : readOnly ? roles['outline-variant'] : roles.outline;
  // Focus and error change the outline's colour and weight on the effects spring.
  const borderColor = useSpringValue(bad ? roles.error : focused && !readOnly ? roles.primary : restBorder);
  const borderWidth = useSpringValue(bad || (focused && !readOnly) ? 2 : search ? 0 : 1);
  const outline = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
    borderWidth: borderWidth.value,
  }));
  const lead =
    leadingIcon ?? leading ?? (search ? <Search size="sm" color={roles['on-surface-variant']} /> : null);
  const trail = trailingIcon ?? trailing;
  const busy = !!loading || !!streaming;
  const hint = [error ?? helperText, suggested ? messages.suggested : undefined].filter(Boolean).join('. ') || undefined;
  const radius = search ? tokens.shape.control : tokens.shape.field;
  return (
    <View style={[{ gap: tokens.spacing['1-5'], opacity: disabled ? disabledOpacity(theme) : 1 }, style]}>
      {!search && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[2] }}>
          <Text
            variant="label-lg"
            color={bad ? 'error' : 'on-surface-variant'}
            importantForAccessibility="no"
            style={suggested ? { flexShrink: 1 } : undefined}
          >
            {label}
            {required && <Text color="error">{' *'}</Text>}
          </Text>
          {suggested && (
            <>
              {/* Read as part of the field's hint, so the mark itself is hidden from screen readers. */}
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[1] }}
              >
                <Sparkles size="xs" color={roles['on-surface-variant']} />
                <Text variant="label-sm" color="on-surface-variant">
                  {messages.suggested}
                </Text>
              </View>
              {onAcceptSuggestion && (
                <IconButton icon={Check} label={messages.acceptSuggestion} size="xs" variant="text" onPress={settle(onAcceptSuggestion)} />
              )}
              {onClearSuggestion && (
                <IconButton icon={X} label={messages.clearSuggestion} size="xs" variant="text" onPress={settle(onClearSuggestion)} />
              )}
            </>
          )}
        </View>
      )}
      <Animated.View
        style={[
          {
            minHeight: controlHeight(theme, size),
            flexDirection: 'row',
            overflow: 'hidden',
            borderRadius: radius,
            backgroundColor: search
              ? roles['surface-container-high']
              : readOnly
                ? roles['surface-container-low']
                : roles['surface-container-lowest'],
          },
          outline,
        ]}
      >
        {streaming && <StreamingWash radius={radius} />}
        {leadingAddon != null && <Addon side="leading">{leadingAddon}</Addon>}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: multiline ? 'flex-start' : 'center',
            gap: tokens.spacing[2],
            paddingStart: tokens.spacing['3-5'],
            paddingEnd: search ? tokens.spacing[1] : tokens.spacing['3-5'],
          }}
        >
          {lead}
          <TextInput
            ref={setRefs}
            accessibilityLabel={label}
            accessibilityRole={search ? 'search' : undefined}
            accessibilityState={busy || disabled ? { busy, disabled: !!disabled } : undefined}
            accessibilityHint={hint}
            aria-invalid={bad}
            editable={!disabled && !readOnly}
            readOnly={readOnly}
            multiline={multiline}
            placeholderTextColor={roles['on-surface-muted']}
            selectionColor={roles.primary}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={{
              flex: 1,
              alignSelf: 'stretch',
              ...fontStyle('sans', 400, fonts),
              fontSize: body.size,
              color: roles['on-surface'],
              paddingVertical: multiline ? 12 : 0,
              minHeight: multiline ? 96 : undefined,
              textAlignVertical: multiline ? 'top' : 'center',
            }}
            {...rest}
            onChangeText={changeText}
          />
          {counting && (
            <Text
              variant="label-sm"
              color="on-surface-muted"
              tabular
              accessibilityLabel={messages.characterCount(length, max)}
              accessibilityLiveRegion={nearLimit(length, max) ? 'polite' : 'none'}
            >
              {`${length}/${max}`}
            </Text>
          )}
          {loading && <ActivityIndicator size="small" color={roles['on-surface-variant']} />}
          {showClear && (
            <IconButton
              icon={X}
              label={search ? messages.clearSearch : messages.clear}
              size="xs"
              variant="text"
              onPress={clear}
            />
          )}
          {trail}
        </View>
        {trailingAddon != null && <Addon side="trailing">{trailingAddon}</Addon>}
      </Animated.View>
      {(error || helperText) && (
        <Text
          variant="body-sm"
          color={error ? 'error' : 'on-surface-variant'}
          accessibilityLiveRegion={error ? 'polite' : 'none'}
        >
          {error ?? helperText}
        </Text>
      )}
    </View>
  );
}

/** Labelled text input (web Input + Label + HelperText + FormError in one). */
export function TextField(props: TextFieldProps) {
  return <Field {...props} />;
}

export interface PasswordInputProps extends Omit<TextFieldProps, 'secureTextEntry' | 'trailing'> {
  /** Shows the password as plain text. Controlled: pair it with `onVisibleChange`. */
  visible?: boolean;
  /** Whether the password starts out shown, when `visible` isn't set. @default false */
  defaultVisible?: boolean;
  /** Called with the new state when the show/hide toggle is pressed. */
  onVisibleChange?: (visible: boolean) => void;
}

/** Password field with a show/hide toggle and the platform autofill hints. */
export function PasswordInput({
  visible: visibleProp,
  defaultVisible = false,
  onVisibleChange,
  ...props
}: PasswordInputProps) {
  const { messages } = useTheme();
  const [visible, setVisible] = useControllableState({
    value: visibleProp,
    defaultValue: defaultVisible,
    onChange: onVisibleChange,
  });
  return (
    <TextField
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="current-password"
      textContentType="password"
      trailing={
        <IconButton
          icon={visible ? EyeOff : Eye}
          // One name, like the web toggle (7.2): the state is `selected`, not a second label.
          label={messages.showPassword}
          selected={visible}
          size="sm"
          onPress={() => setVisible(!visible)}
        />
      }
      {...props}
    />
  );
}

export interface SearchFieldProps
  extends Omit<TextFieldProps, 'label' | 'clearable' | 'generated' | 'onAcceptSuggestion' | 'onClearSuggestion'> {
  /** Accessible name. @default messages.search */
  label?: string;
  /** @default 'md' */
  size?: TextFieldProps['size'];
}

/** Capsule search input with a clear button. Takes TextField's props (size, loading, invalid…). */
export function SearchField({
  label,
  value,
  defaultValue,
  onChangeText,
  size = 'md',
  ...rest
}: SearchFieldProps) {
  const { messages } = useTheme();
  const [text, setText] = useControllableState({
    value,
    defaultValue: defaultValue ?? '',
    onChange: onChangeText,
  });
  return (
    <Field
      chrome="search"
      label={label ?? messages.search}
      placeholder={messages.searchPlaceholder}
      returnKeyType="search"
      size={size}
      clearable
      {...rest}
      value={text}
      onChangeText={setText}
    />
  );
}

// ─── MoneyInput ──────────────────────────────────────────────────────────────

export interface MoneyInputProps extends Omit<
  TextFieldProps,
  'value' | 'defaultValue' | 'onChange' | 'leading' | 'keyboardType'
> {
  currency: string;
  value?: number | null;
  defaultValue?: number | null;
  /** Parsed value (rounded to the currency's minor units), or null when empty. */
  onValueChange?: (value: number | null) => void;
  locale?: string;
  /**
   * A node shown before the amount, in the currency's place, so people can change the currency
   * next to it, e.g. `<CurrencySelect label="Currency" value={currency} onValueChange={setCurrency} />`.
   */
  currencySlot?: React.ReactNode;
}

/** Amount entry: decimal keypad, currency symbol, locale-aware parsing (de-DE "1.234,5" → 1234.5). */
export function MoneyInput({
  currency,
  value,
  defaultValue = null,
  onValueChange,
  locale,
  currencySlot,
  leadingIcon,
  style,
  ...rest
}: MoneyInputProps) {
  const theme = useTheme();
  const loc = locale ?? theme.locale;
  const [amount, setAmount] = useControllableState<number | null>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [text, setText] = React.useState(
    amount == null ? '' : formatForEditing(amount, currency, loc),
  );
  React.useEffect(() => {
    // Follow outside changes without fighting the user's typing: runs when the
    // amount changes, not on every keystroke (text is read via the updater).
    setText((t) =>
      amount === parseMoney(t, currency, loc)
        ? t
        : amount == null
          ? ''
          : formatForEditing(amount, currency, loc),
    );
  }, [amount, currency, loc]);
  const field = (
    <TextField
      keyboardType="decimal-pad"
      inputMode="decimal"
      value={text}
      onChangeText={(t) => {
        setText(t);
        setAmount(parseMoney(t, currency, loc));
      }}
      leadingIcon={
        leadingIcon ?? (
          <Text variant="body-lg" color="on-surface-variant">
            {currencySymbol(currency, loc)}
          </Text>
        )
      }
      style={currencySlot ? { flex: 1, minWidth: 0 } : style}
      {...rest}
    />
  );
  if (!currencySlot) return field;
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.tokens.spacing[2] }, style]}>
      <View style={{ width: theme.tokens.spacing[32], flexShrink: 0 }}>{currencySlot}</View>
      {field}
    </View>
  );
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

interface StepperBaseProps {
  /** Accessible name of the value, e.g. "Guests". */
  label: string;
  /** Applied on a step and when typing ends (blur), never while typing. */
  min?: number;
  /** Applied on a step and when typing ends (blur), never while typing. */
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Error colour on the value and announced as invalid. */
  invalid?: boolean;
  /** Size of the buttons and the value. @default 'md' */
  size?: Extract<ControlSize, 'sm' | 'md' | 'lg'>;
  /** Decimals shown and kept after a step, e.g. 2 shows 1.5 as "1.50". */
  precision?: number;
  /**
   * Shows the − and + buttons. Without them the value is a number field typed on the keypad;
   * screen readers can still swipe up and down to step it. @default true
   */
  showSteppers?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** The default: always a number. */
export interface StepperProps extends StepperBaseProps {
  /** Whether the value can be empty (`null`). @default false */
  nullable?: false;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}

/**
 * The value can be empty: it shows "–", the field can be typed in and cleared, and a cleared field
 * reports `null` (not 0). A step from empty goes to 0 (or the nearest bound). Same rules as web
 * NumberInput's `nullable` (11.1).
 */
export interface NullableStepperProps extends StepperBaseProps {
  /** The value can be empty (`null`). */
  nullable: true;
  value?: number | null;
  defaultValue?: number | null;
  /** Called with the new value, or `null` when the field is cleared. */
  onValueChange?: (value: number | null) => void;
}

const STEPPER_BUTTON = { sm: 'xs', md: 'sm', lg: 'md' } as const;
const STEPPER_TEXT = { sm: 'title-sm', md: 'title-md', lg: 'title-lg' } as const;

/**
 * − value + for small counts (the native twin of web NumberInput). Adjustable with
 * VoiceOver/TalkBack swipe up/down. `nullable` or `showSteppers={false}` make the value typeable.
 */
export function Stepper(props: StepperProps | NullableStepperProps) {
  const {
    label,
    value,
    defaultValue,
    onValueChange,
    min: minProp,
    max: maxProp,
    step = 1,
    disabled,
    invalid,
    size = 'md',
    precision,
    showSteppers = true,
    nullable = false,
    style,
  } = props;
  const theme = useTheme();
  const { messages, tokens, roles, fonts } = theme;
  const play = useHaptics();
  const min = minProp !== undefined && Number.isFinite(minProp) ? minProp : undefined;
  const max = maxProp !== undefined && Number.isFinite(maxProp) ? maxProp : undefined;
  const [n, setN] = useControllableState<number | null>({
    value,
    defaultValue: defaultValue ?? (nullable ? null : 0),
    onChange: onValueChange as ((v: number | null) => void) | undefined,
  });
  // What is being typed, while the field has focus; null shows the formatted value.
  const [draft, setDraft] = React.useState<string | null>(null);
  const typeable = nullable || !showSteppers;
  const round = (x: number) => (precision === undefined ? x : Number(x.toFixed(precision)));
  const stepBy = (delta: number) => {
    if (disabled) return;
    const next = round(stepNumber(n, delta, min, max));
    if (next !== n) {
      play('selection');
      setN(next);
    }
    if (draft !== null) setDraft(formatNumberValue(next, precision));
  };
  const onText = (text: string) => {
    if (!isNumberDraft(text)) return; // a letter or a second point: keep what was there
    setDraft(text);
    const parsed = parseNumberDraft(text);
    // Not clamped while typing: "30" with min 15 must get past the "3".
    if (parsed !== undefined) {
      if (parsed !== n) setN(parsed);
    } else if (nullable && text.trim() === '' && n !== null) setN(null);
  };
  const onEndTyping = () => {
    setDraft(null);
    if (n === null) return;
    const clamped = round(clampNumber(n, min, max));
    if (clamped !== n) setN(clamped);
  };
  const shown = formatNumberValue(n, precision);
  const a11yValue = {
    now: n ?? undefined,
    min,
    max,
    text: n === null ? '–' : precision !== undefined ? shown : undefined,
  };
  const a11yActions = [{ name: 'increment' }, { name: 'decrement' }];
  const onA11yAction = (e: { nativeEvent: { actionName: string } }) =>
    stepBy(e.nativeEvent.actionName === 'increment' ? step : -step);
  const valueVariant = STEPPER_TEXT[size];
  const minWidth = tokens.size.control[size === 'lg' ? 'md' : 'sm'];
  return (
    <View
      accessible={!typeable}
      accessibilityRole={typeable ? undefined : 'adjustable'}
      accessibilityLabel={typeable ? undefined : label}
      accessibilityValue={typeable ? undefined : a11yValue}
      accessibilityState={typeable ? undefined : { disabled: !!disabled }}
      accessibilityActions={typeable ? undefined : a11yActions}
      onAccessibilityAction={typeable ? undefined : onA11yAction}
      aria-invalid={typeable ? undefined : !!invalid}
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[3], alignSelf: 'flex-start' },
        style,
      ]}
    >
      {showSteppers && (
        <IconButton
          icon={Minus}
          label={messages.decrement}
          variant="outlined"
          size={STEPPER_BUTTON[size]}
          disabled={disabled || (n !== null && min !== undefined && n <= min)}
          onPress={() => stepBy(-step)}
        />
      )}
      {typeable ? (
        <TextInput
          accessibilityLabel={label}
          accessibilityValue={a11yValue}
          accessibilityState={{ disabled: !!disabled }}
          accessibilityActions={a11yActions}
          onAccessibilityAction={onA11yAction}
          aria-invalid={!!invalid}
          editable={!disabled}
          value={draft ?? shown}
          placeholder="–"
          placeholderTextColor={roles['on-surface-muted']}
          selectionColor={roles.primary}
          keyboardType={
            min !== undefined && min >= 0
              ? Number.isInteger(step) && precision === undefined
                ? 'number-pad'
                : 'decimal-pad'
              : 'numbers-and-punctuation'
          }
          onFocus={() => setDraft(shown)}
          onBlur={onEndTyping}
          onChangeText={onText}
          style={{
            minWidth: minWidth * 1.5,
            height: controlHeight(theme, size === 'lg' ? 'md' : 'sm'),
            paddingHorizontal: tokens.spacing[2],
            borderRadius: tokens.shape.field,
            borderWidth: invalid ? 2 : 1,
            borderColor: invalid ? roles.error : roles.outline,
            backgroundColor: roles['surface-container-lowest'],
            textAlign: 'center',
            ...fontStyle('sans', 500, fonts),
            fontSize: tokens.type[valueVariant].size,
            fontVariant: ['tabular-nums'],
            color: invalid ? roles.error : roles['on-surface'],
            opacity: disabled ? disabledOpacity(theme) : 1,
          }}
        />
      ) : (
        <Text
          variant={valueVariant}
          color={invalid ? 'error' : undefined}
          tabular
          style={{ minWidth, textAlign: 'center' }}
        >
          {shown}
        </Text>
      )}
      {showSteppers && (
        <IconButton
          icon={Plus}
          label={messages.increment}
          variant="outlined"
          size={STEPPER_BUTTON[size]}
          disabled={disabled || (n !== null && max !== undefined && n >= max)}
          onPress={() => stepBy(step)}
        />
      )}
    </View>
  );
}

// ─── Checkbox / Radio ────────────────────────────────────────────────────────

export interface CheckboxProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  description?: string;
  disabled?: boolean;
  /** Box and label size, the same names as web Checkbox: `sm`, `md`, `lg`. @default 'md' */
  size?: Extract<ControlSize, 'sm' | 'md' | 'lg'>;
  /** Red box and announced as invalid. */
  invalid?: boolean;
  /** Can be focused and read but not changed: pressing it does nothing. */
  readOnly?: boolean;
  /** What screen readers say after the label. @default description */
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

const CHOICE_TEXT = { sm: 'body-sm', md: 'body-md', lg: 'body-lg' } as const;

/** Checkbox with its label; the whole row is the target. */
export function Checkbox({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  description,
  disabled,
  size = 'md',
  invalid,
  readOnly,
  accessibilityHint,
  style,
}: CheckboxProps) {
  const theme = useTheme();
  const { roles, tokens } = theme;
  const [on, setOn] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const textVariant = CHOICE_TEXT[size];
  // The box sits on the label's first line, a point clear above and below.
  const box = tokens.type[textVariant].lineHeight - 2;
  const fill = useSpringValue(on ? (invalid ? roles.error : roles.primary) : 'transparent');
  const boxStyle = useAnimatedStyle(() => ({ backgroundColor: fill.value }));
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint ?? description}
      accessibilityState={{ checked: on, disabled: !!disabled }}
      aria-invalid={!!invalid}
      aria-readonly={!!readOnly}
      disabled={disabled}
      haptic={readOnly ? undefined : on ? 'toggleOff' : 'toggleOn'}
      onPress={() => {
        if (!readOnly) setOn(!on);
      }}
      stateLayer={false}
      pressScale={false}
      style={[
        {
          flexDirection: 'row',
          gap: tokens.spacing[3],
          alignItems: 'flex-start',
          minHeight: MIN_TARGET,
          paddingVertical: tokens.spacing['2-5'],
          opacity: disabled ? disabledOpacity(theme) : 1,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            width: box,
            height: box,
            marginTop: 1,
            borderRadius: tokens.shape.min + 2,
            borderWidth: on ? 0 : 2,
            borderColor: invalid ? roles.error : readOnly ? roles['outline-variant'] : roles.outline,
            alignItems: 'center',
            justifyContent: 'center',
          },
          boxStyle,
        ]}
      >
        {/* Checked on first render doesn't animate; toggling scales the check in. */}
        <LayoutAnimationConfig skipEntering>
          {on && (
            <Animated.View entering={nxEnter('scale', 'fast')} exiting={nxExit('scale')}>
              <Check
                size={size === 'md' ? 16 : size === 'sm' ? 14 : 18}
                strokeWidth={3}
                color={invalid ? roles['on-error'] : roles['on-primary']}
              />
            </Animated.View>
          )}
        </LayoutAnimationConfig>
      </Animated.View>
      <View style={{ flex: 1, gap: tokens.spacing['0-5'] }}>
        <Text variant={textVariant}>{label}</Text>
        {description && (
          <Text variant="body-sm" color="on-surface-variant">
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

interface RadioContext {
  value: string | undefined;
  select: (v: string) => void;
  disabled?: boolean;
}
const RadioCtx = React.createContext<RadioContext | null>(null);

export interface RadioGroupProps {
  /** Accessible name of the group. */
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function RadioGroup({
  label,
  value,
  defaultValue,
  onValueChange,
  disabled,
  children,
  style,
}: RadioGroupProps) {
  const [v, setV] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: onValueChange as (v: string | undefined) => void,
  });
  return (
    <RadioCtx.Provider value={{ value: v, select: setV, disabled }}>
      <View accessibilityRole="radiogroup" accessibilityLabel={label} style={style}>
        {children}
      </View>
    </RadioCtx.Provider>
  );
}

export interface RadioProps {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function Radio({ value, label, description, disabled: own }: RadioProps) {
  const theme = useTheme();
  const ctx = React.useContext(RadioCtx);
  if (!ctx) throw new Error('@nexub/react-native: <Radio> must be inside <RadioGroup>.');
  const on = ctx.value === value;
  const disabled = own || ctx.disabled;
  const { roles, tokens } = theme;
  // Same box as Checkbox: centred on the label's first line.
  const box = tokens.type['body-md'].lineHeight - 2;
  const dot = tokens.spacing['2-5'];
  const ring = useSpringValue(on ? roles.primary : roles.outline);
  const ringStyle = useAnimatedStyle(() => ({ borderColor: ring.value }));
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked: on, disabled: !!disabled }}
      disabled={disabled}
      haptic={on ? undefined : 'selection'}
      onPress={() => ctx.select(value)}
      stateLayer={false}
      pressScale={false}
      style={{
        flexDirection: 'row',
        gap: tokens.spacing[3],
        alignItems: 'flex-start',
        minHeight: MIN_TARGET,
        paddingVertical: tokens.spacing['2-5'],
        opacity: disabled ? disabledOpacity(theme) : 1,
      }}
    >
      <Animated.View
        style={[
          {
            width: box,
            height: box,
            marginTop: 1,
            borderRadius: box / 2,
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
          },
          ringStyle,
        ]}
      >
        <LayoutAnimationConfig skipEntering>
          {on && (
            <Animated.View
              entering={nxEnter('scale', 'fast')}
              exiting={nxExit('scale')}
              style={{
                width: dot,
                height: dot,
                borderRadius: dot / 2,
                backgroundColor: roles.primary,
              }}
            />
          )}
        </LayoutAnimationConfig>
      </Animated.View>
      <View style={{ flex: 1, gap: tokens.spacing['0-5'] }}>
        <Text variant="body-md">{label}</Text>
        {description && (
          <Text variant="body-sm" color="on-surface-variant">
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

// ─── Switch ──────────────────────────────────────────────────────────────────

export interface SwitchProps {
  /** Accessible name (visible label lives in the ListItem / row next to it). */
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Spinner beside the switch and busy for screen readers; it can't toggle while loading. */
  loading?: boolean;
  /** Error colour on the track and announced as invalid. */
  invalid?: boolean;
  /** Can be focused and read but not toggled. */
  readOnly?: boolean;
  /** `md` is the platform switch's own size; `sm` and `lg` scale it. @default 'md' */
  size?: Extract<ControlSize, 'sm' | 'md' | 'lg'>;
  /**
   * Small icon inside the thumb while on. With an icon the Nexub-drawn switch is used, since the
   * platform switch has no room for one.
   */
  checkedIcon?: React.ReactNode;
  /** Small icon inside the thumb while off. Uses the Nexub-drawn switch, like `checkedIcon`. */
  uncheckedIcon?: React.ReactNode;
  /** What screen readers say after the label, e.g. the setting's description. */
  accessibilityHint?: string;
}

const SWITCH_SCALE = { sm: 0.8, md: 1, lg: 1.15 } as const;
// Track width × height of the drawn switch (the platform switch is about 51 × 31).
const SWITCH_TRACK = { sm: [40, 24], md: [52, 32], lg: [60, 36] } as const;

/**
 * The platform switch (UISwitch / Material), coloured with Nexub roles. The OS plays its haptic.
 * With `checkedIcon` or `uncheckedIcon` it draws the Nexub switch, icon in the thumb.
 */
export function Switch({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  loading,
  invalid,
  readOnly,
  size = 'md',
  checkedIcon,
  uncheckedIcon,
  accessibilityHint,
}: SwitchProps) {
  const theme = useTheme();
  const { roles } = theme;
  const [on, setOn] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const toggle = (next: boolean) => {
    if (!readOnly) setOn(next);
  };
  const trackOff = invalid ? roles['error-container'] : roles['surface-container-highest'];
  const trackOn = invalid ? roles.error : roles.primary;
  const state =
    loading || readOnly || invalid
      ? { busy: !!loading, disabled: !!(disabled || loading), checked: on }
      : undefined;
  const drawn = checkedIcon != null || uncheckedIcon != null;
  const [w, h] = SWITCH_TRACK[size];
  const thumb = h - 8;
  const travel = w - h;
  const x = useSpringValue(on ? travel * (theme.dir === 'rtl' ? -1 : 1) : 0, 'spatial');
  const fill = useSpringValue(on ? trackOn : trackOff);
  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const trackStyle = useAnimatedStyle(() => ({ backgroundColor: fill.value }));
  const scale = SWITCH_SCALE[size];
  return (
    <>
      {loading && <ActivityIndicator size="small" color={roles.primary} />}
      {drawn ? (
        <Pressable
          accessibilityRole="switch"
          accessibilityLabel={label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ checked: on, disabled: !!(disabled || loading), busy: !!loading }}
          aria-invalid={!!invalid}
          aria-readonly={!!readOnly}
          disabled={disabled || loading}
          haptic={readOnly ? undefined : on ? 'toggleOff' : 'toggleOn'}
          onPress={() => toggle(!on)}
          stateLayer={false}
          pressScale={false}
          hitSlop={hitSlopFor(h)}
          style={{ opacity: disabled ? disabledOpacity(theme) : 1 }}
        >
          <Animated.View
            style={[
              { width: w, height: h, borderRadius: h / 2, padding: theme.tokens.spacing[1], justifyContent: 'center' },
              trackStyle,
            ]}
          >
            <Animated.View
              style={[
                {
                  width: thumb,
                  height: thumb,
                  borderRadius: thumb / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: roles['surface-container-lowest'],
                  boxShadow: theme.elevation(1),
                },
                thumbStyle,
              ]}
            >
              {on ? checkedIcon : uncheckedIcon}
            </Animated.View>
          </Animated.View>
        </Pressable>
      ) : (
        <RNSwitch
          accessibilityLabel={label}
          accessibilityHint={accessibilityHint}
          accessibilityState={state}
          aria-invalid={!!invalid}
          aria-readonly={!!readOnly}
          value={on}
          onValueChange={toggle}
          disabled={disabled || loading}
          trackColor={{ false: trackOff, true: trackOn }}
          ios_backgroundColor={trackOff}
          thumbColor={roles['surface-container-lowest']}
          style={
            scale === 1
              ? undefined
              : {
                  transform: [{ scale }],
                  // The transform doesn't change the layout box: give back (or take) the difference.
                  marginHorizontal: ((scale - 1) * 51) / 2,
                  marginVertical: ((scale - 1) * 31) / 2,
                }
          }
        />
      )}
    </>
  );
}

// ─── SegmentedControl ────────────────────────────────────────────────────────

export interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly { value: T; label: string }[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  /** Segment height: `sm` (the default, 34) or `md` and `lg`, the field heights. */
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}

/** 2–5 mutually exclusive views of the same content. */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  size = 'sm',
  style,
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  const { roles, tokens } = theme;
  const [v, setV] = useControllableState<T>({
    value,
    defaultValue: defaultValue ?? options[0]!.value,
    onChange: onValueChange,
  });
  // The selected pill slides between segments on the spatial spring. Until the
  // track is measured, the selected segment paints its own background.
  const [trackWidth, setTrackWidth] = React.useState(0);
  const index = Math.max(0, options.findIndex((o) => o.value === v));
  const segment = trackWidth > 0 ? (trackWidth - 6) / options.length : 0;
  const offset = useSharedValue(index * segment);
  const measured = React.useRef(false);
  React.useEffect(() => {
    if (segment === 0) return;
    const to = index * segment * (theme.dir === 'rtl' ? -1 : 1);
    // First measure places the pill; later changes slide it.
    offset.value = measured.current ? withSpring(to, nxSpring('spatial', 'default')) : to;
    measured.current = true;
  }, [index, segment, theme.dir, offset]);
  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={label}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      style={[
        {
          flexDirection: 'row',
          padding: 3,
          borderRadius: tokens.shape.control,
          backgroundColor: roles['surface-container-high'],
        },
        style,
      ]}
    >
      {segment > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 3,
              bottom: 3,
              start: 3,
              width: segment,
              borderRadius: tokens.shape.control,
              backgroundColor: roles['surface-container-lowest'],
              boxShadow: theme.elevation(1),
            },
            indicator,
          ]}
        />
      )}
      {options.map((o) => {
        const on = o.value === v;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityLabel={o.label}
            accessibilityState={{ selected: on }}
            haptic={on ? undefined : 'selection'}
            onPress={() => setV(o.value)}
            stateLayer={on ? false : 'on-surface'}
            style={[
              {
                flex: 1,
                height: controlHeight(theme, size) + (size === 'sm' ? 2 : 0),
                borderRadius: tokens.shape.control,
                alignItems: 'center',
                justifyContent: 'center',
              },
              on &&
                segment === 0 && {
                  backgroundColor: roles['surface-container-lowest'],
                  boxShadow: theme.elevation(1),
                },
            ]}
          >
            <Text
              variant="label-lg"
              color={on ? 'on-surface' : 'on-surface-variant'}
              numberOfLines={1}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Slider ──────────────────────────────────────────────────────────────────

export interface SliderProps {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Announced value text, e.g. (v) => `${v}%`. */
  formatValue?: (value: number) => string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Continuous value. Drag anywhere on the track; VoiceOver/TalkBack adjust by `step`.
 *
 * The drag is read on the UI thread through react-native-gesture-handler (a
 * required peer): wrap your app root in `GestureHandlerRootView`.
 */
export function Slider({
  label,
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  formatValue,
  style,
}: SliderProps) {
  const theme = useTheme();
  const { roles, tokens } = theme;
  const track = tokens.spacing['1-5'];
  const thumb = tokens.size.control.xs;
  const [v, setV] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const rtl = theme.dir === 'rtl';
  const width = useSharedValue(1);
  // The value the drag last reported, so a move within one step stays on the UI thread.
  const last = useSharedValue(v);
  const drag = usePanGesture(
    React.useMemo(() => {
      const move = (x: number, force: boolean) => {
        'worklet';
        const ratio = Math.min(1, Math.max(0, x / width.value));
        const raw = min + (rtl ? 1 - ratio : ratio) * (max - min);
        const next = Math.min(max, Math.max(min, Math.round(raw / step) * step));
        if (force || next !== last.value) {
          last.value = next;
          runOnJS(setV)(next);
        }
      };
      return {
        testID: `nx-slider:${label}`,
        enabled: !disabled,
        // Touch down sets the value; any move after that is the drag.
        minDistance: 0,
        shouldCancelWhenOutside: false,
        onBegin: (e: { x: number }) => {
          'worklet';
          move(e.x, true);
        },
        onUpdate: (e: { x: number }) => {
          'worklet';
          move(e.x, false);
        },
      };
    }, [label, disabled, min, max, step, rtl, setV, width, last]),
  );
  const pct = ((v - min) / (max - min)) * 100;
  return (
    <GestureDetector gesture={drag}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: v, text: formatValue?.(v) }}
        accessibilityState={{ disabled: !!disabled }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) =>
          !disabled &&
          setV(
            Math.min(
              max,
              Math.max(min, v + (e.nativeEvent.actionName === 'increment' ? step : -step)),
            ),
          )
        }
        onLayout={(e) => (width.value = e.nativeEvent.layout.width || 1)}
        style={[
          { height: MIN_TARGET, justifyContent: 'center', opacity: disabled ? disabledOpacity(theme) : 1 },
          style,
        ]}
      >
        <View
          pointerEvents="none"
          style={{ height: track, borderRadius: track / 2, backgroundColor: roles['surface-container-highest'] }}
        >
          <View
            style={{ width: `${pct}%`, height: track, borderRadius: track / 2, backgroundColor: roles.primary }}
          />
        </View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            start: `${pct}%`,
            marginStart: -thumb / 2,
            width: thumb,
            height: thumb,
            borderRadius: thumb / 2,
            backgroundColor: roles['surface-container-lowest'],
            boxShadow: theme.elevation(2),
          }}
        />
      </View>
    </GestureDetector>
  );
}

// ─── Chip ────────────────────────────────────────────────────────────────────

export interface ChipProps {
  label: string;
  /** Toggle state (filter chips). */
  selected?: boolean;
  onPress?: () => void;
  /** Shows a remove button (its label is messages.remove). */
  onRemove?: () => void;
  leadingIcon?: React.ComponentType<NativeIconProps>;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Capsule control: a filter, a choice or an input token. */
export function Chip({
  label,
  selected,
  onPress,
  onRemove,
  leadingIcon: Lead,
  disabled,
  style,
}: ChipProps) {
  const theme = useTheme();
  const { roles, tokens, messages } = theme;
  const height = controlHeight(theme, 'sm');
  const fg = selected ? 'on-secondary-container' : 'on-surface-variant';
  return (
    // Selecting grows the chip for its check: the width change glides.
    <Animated.View
      layout={nxLayout('fast')}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          opacity: disabled ? disabledOpacity(theme) : 1,
        },
        style,
      ]}
    >
      <Pressable
        accessibilityRole={selected === undefined ? 'button' : 'checkbox'}
        accessibilityLabel={label}
        accessibilityState={{ checked: selected, disabled: !!disabled }}
        disabled={disabled || !onPress}
        haptic={selected === undefined ? undefined : 'selection'}
        onPress={onPress}
        hitSlop={hitSlopFor(height)}
        stateLayer={fg}
        style={{
          height,
          paddingStart: tokens.spacing[3],
          paddingEnd: onRemove ? 32 : 12,
          borderRadius: tokens.shape.control,
          flexDirection: 'row',
          alignItems: 'center',
          gap: tokens.spacing['1-5'],
          borderWidth: selected ? 0 : 1,
          borderColor: roles['outline-variant'],
          backgroundColor: selected ? roles['secondary-container'] : 'transparent',
        }}
      >
        <LayoutAnimationConfig skipEntering>
          {selected ? (
            <Animated.View key="check" entering={nxEnter('scale', 'fast')} exiting={nxExit('scale')}>
              <Check size="sm" color={roles[fg]} />
            </Animated.View>
          ) : (
            Lead && <Lead size="sm" color={roles[fg]} />
          )}
        </LayoutAnimationConfig>
        <Text variant="label-lg" color={fg}>
          {label}
        </Text>
      </Pressable>
      {onRemove && (
        <IconButton
          icon={X}
          label={`${messages.remove} ${label}`}
          size="xs"
          onPress={onRemove}
          style={{ position: 'absolute', end: tokens.spacing[1], top: (height - controlHeight(theme, 'xs')) / 2 }}
        />
      )}
    </Animated.View>
  );
}

/** A toggleable Chip (selected → check icon). */
export function FilterChip(props: ChipProps & { selected: boolean }) {
  return <Chip {...props} />;
}

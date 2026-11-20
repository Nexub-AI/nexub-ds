import * as React from 'react';
import { AccessibilityInfo, AppState, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useLatest } from '../hooks/useLatest';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import { Badge } from './display';
import { TONE_TEXT } from './shared';

export interface UseCountdownOptions {
  /** The clock, in ms. Defaults to `Date.now`; inject one for tests and static previews. */
  now?: () => number;
  /** Called once when the deadline is reached (also when it has already passed on mount). */
  onExpire?: () => void;
}

export interface CountdownState {
  /** Ms left, never below 0. */
  remainingMs: number;
  /** Whole seconds left, rounded up (what a display shows). */
  seconds: number;
  expired: boolean;
  /** Always true on native (the clock is read on the first render); kept for parity with the web hook. */
  ready: boolean;
}

/**
 * Time left to an absolute deadline. Reads the clock on every tick (never counts down
 * a number) and again when the app returns to the foreground, so it is right after
 * the app was in the background.
 */
export function useCountdown(to: number | Date, { now, onExpire }: UseCountdownOptions = {}): CountdownState {
  const target = +to;
  const latest = useLatest({ now, onExpire });
  const [state, setState] = React.useState(() => ({ target, left: Math.max(0, target - (now?.() ?? Date.now())) }));
  const expiredFor = React.useRef<number | null>(null);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      clearTimeout(timer);
      const left = Math.max(0, target - (latest.current.now?.() ?? Date.now()));
      setState({ target, left });
      if (left > 0) {
        // Next whole-second boundary of the time left; a late timer corrects itself here.
        timer = setTimeout(tick, left % 1000 || 1000);
      } else if (expiredFor.current !== target) {
        expiredFor.current = target;
        latest.current.onExpire?.();
      }
    };
    tick();
    // Timers stop while the app is in the background: read the clock again on return.
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') tick();
    });
    return () => {
      clearTimeout(timer);
      sub.remove();
    };
  }, [target, latest]);

  // A new deadline shows its own time at once, not the old one's last tick.
  const remainingMs = state.target === target ? state.left : Math.max(0, target - (now?.() ?? Date.now()));
  return { remainingMs, seconds: Math.ceil(remainingMs / 1000), expired: remainingMs === 0, ready: true };
}

type CountdownFormat = 'm:ss' | 'h:mm:ss' | 'auto';
type CountdownTone = 'neutral' | 'warning' | 'danger';

const pad = (n: number) => String(n).padStart(2, '0');
function formatTime(seconds: number, format: CountdownFormat): string {
  const s = seconds % 60;
  if (format === 'm:ss' || (format === 'auto' && seconds < 3600)) return `${Math.floor(seconds / 60)}:${pad(s)}`;
  return `${Math.floor(seconds / 3600)}:${pad(Math.floor(seconds / 60) % 60)}:${pad(s)}`;
}

export interface CountdownProps extends UseCountdownOptions {
  /** The deadline: a Date or ms since the epoch. */
  to: number | Date;
  /** `auto` shows hours only from one hour up. @default 'auto' */
  format?: CountdownFormat;
  /** Chip size. @default 'md' */
  size?: 'sm' | 'md';
  /** `chip` is a small badge; `inline` is plain text. @default 'chip' */
  variant?: 'chip' | 'inline';
  /** `auto`: neutral, warning under `warnAt`, danger under `dangerAt`. @default 'auto' */
  tone?: 'auto' | CountdownTone;
  /** Seconds. @default 60 */
  warnAt?: number;
  /** Seconds. @default 10 */
  dangerAt?: number;
  style?: StyleProp<ViewStyle & TextStyle>;
}

/** Time left to a deadline, ticking once a second. Screen readers hear it at intervals, not every second. */
export function Countdown({
  to,
  format = 'auto',
  size = 'md',
  variant = 'chip',
  tone: toneProp = 'auto',
  warnAt = 60,
  dangerAt = 10,
  now,
  onExpire,
  style,
}: CountdownProps) {
  const { messages } = useTheme();
  const { seconds } = useCountdown(to, { now, onExpire });

  // Read out each whole minute, then 30, 10 and 5 seconds, then the end.
  React.useEffect(() => {
    if (seconds === 0) AccessibilityInfo.announceForAccessibility(messages.timeUp);
    else if (seconds % 60 === 0) AccessibilityInfo.announceForAccessibility(messages.timeLeft(seconds / 60, 'minute'));
    else if (seconds === 30 || seconds === 10 || seconds === 5) AccessibilityInfo.announceForAccessibility(messages.timeLeft(seconds, 'second'));
  }, [seconds, messages]);

  const tone: CountdownTone = toneProp !== 'auto' ? toneProp : seconds < dangerAt ? 'danger' : seconds < warnAt ? 'warning' : 'neutral';
  const text = formatTime(seconds, format);
  // The ticking digits are not a live region: the announcements above are what is read out.
  return variant === 'chip' ? (
    <Badge accessible accessibilityRole="timer" accessibilityLabel={text} tone={tone} variant="soft" size={size} style={style}>
      {text}
    </Badge>
  ) : (
    <Text accessibilityRole="timer" tabular color={tone === 'neutral' ? 'on-surface' : TONE_TEXT[tone]} style={style}>
      {text}
    </Text>
  );
}

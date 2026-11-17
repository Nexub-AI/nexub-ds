'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { toneTextClasses, type Size } from '../../utils/control.js';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Badge } from '../Badge/Badge.js';

export interface UseCountdownOptions {
  /** The clock, in ms. Defaults to `Date.now`; inject one for tests and static previews. */
  now?: () => number;
  /** Called once when the deadline is reached (also when it has already passed on mount). */
  onExpire?: () => void;
}

export interface CountdownState {
  /** Ms left, never below 0. 0 until `ready`. */
  remainingMs: number;
  /** Whole seconds left, rounded up (what a display shows). */
  seconds: number;
  expired: boolean;
  /** False on the server and the first client paint: the clock is read only after mount. */
  ready: boolean;
}

/**
 * Time left to an absolute deadline. Reads the clock on every tick (never counts down
 * a number), so it is right again after the tab was in the background.
 */
export function useCountdown(to: number | Date, { now, onExpire }: UseCountdownOptions = {}): CountdownState {
  const target = +to;
  const [remaining, setRemaining] = React.useState<number | null>(null);
  const latest = React.useRef({ now, onExpire });
  useIsomorphicLayoutEffect(() => {
    latest.current = { now, onExpire };
  });
  const expiredFor = React.useRef<number | null>(null);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      clearTimeout(timer);
      const left = Math.max(0, target - (latest.current.now?.() ?? Date.now()));
      setRemaining(left);
      if (left > 0) {
        // Next whole-second boundary of the time left; a late timer corrects itself here.
        timer = setTimeout(tick, left % 1000 || 1000);
      } else if (expiredFor.current !== target) {
        expiredFor.current = target;
        latest.current.onExpire?.();
      }
    };
    tick();
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [target]);

  const remainingMs = remaining ?? 0;
  return { remainingMs, seconds: Math.ceil(remainingMs / 1000), expired: remaining === 0, ready: remaining !== null };
}

type CountdownFormat = 'm:ss' | 'h:mm:ss' | 'auto';
type CountdownTone = 'neutral' | 'warning' | 'danger';

const pad = (n: number) => String(n).padStart(2, '0');
function formatTime(seconds: number, format: CountdownFormat): string {
  const s = seconds % 60;
  if (format === 'm:ss' || (format === 'auto' && seconds < 3600)) return `${Math.floor(seconds / 60)}:${pad(s)}`;
  return `${Math.floor(seconds / 3600)}:${pad(Math.floor(seconds / 60) % 60)}:${pad(s)}`;
}

export interface CountdownProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>, UseCountdownOptions {
  /** The deadline: a Date or ms since the epoch. */
  to: number | Date;
  /** `auto` shows hours only from one hour up. @default 'auto' */
  format?: CountdownFormat;
  /** Chip size. @default 'md' */
  size?: Size;
  /** `chip` is a small badge; `inline` is plain text in the surrounding font. @default 'chip' */
  variant?: 'chip' | 'inline';
  /** `auto`: neutral, warning under `warnAt`, danger under `dangerAt`. @default 'auto' */
  tone?: 'auto' | CountdownTone;
  /** Seconds. @default 60 */
  warnAt?: number;
  /** Seconds. @default 10 */
  dangerAt?: number;
}

/** Time left to a deadline, ticking once a second. Screen readers hear it at intervals, not every second. */
export const Countdown = React.forwardRef<HTMLSpanElement, CountdownProps>(
  ({ to, format = 'auto', size = 'md', variant = 'chip', tone: toneProp = 'auto', warnAt = 60, dangerAt = 10, now, onExpire, className, ...props }, ref) => {
    const messages = useNexubMessages();
    const { seconds, ready } = useCountdown(to, { now, onExpire });

    // Read out each whole minute, then 30, 10 and 5 seconds, then the end.
    const [announcement, setAnnouncement] = React.useState('');
    React.useEffect(() => {
      if (!ready) return;
      if (seconds === 0) setAnnouncement(messages.timeUp);
      else if (seconds % 60 === 0) setAnnouncement(messages.timeLeft(seconds / 60, 'minute'));
      else if (seconds === 30 || seconds === 10 || seconds === 5) setAnnouncement(messages.timeLeft(seconds, 'second'));
    }, [seconds, ready, messages]);

    const tone: CountdownTone =
      toneProp !== 'auto' ? toneProp : !ready ? 'neutral' : seconds < dangerAt ? 'danger' : seconds < warnAt ? 'warning' : 'neutral';
    // Same on the server and the first client paint; digits swap in after mount at the same width.
    const text = ready ? formatTime(seconds, format) : format === 'h:mm:ss' ? '–:––:––' : '–:––';
    const timer = { role: 'timer', 'aria-live': 'off', 'data-tone': tone } as const;

    return (
      <span ref={ref} className="inline-flex max-w-full" {...props}>
        {variant === 'chip' ? (
          <Badge {...timer} tone={tone} variant="soft" size={size} className={cn('tabular-nums', className)}>
            {text}
          </Badge>
        ) : (
          <span {...timer} className={cn('tabular-nums', tone !== 'neutral' && toneTextClasses[tone], className)}>
            {text}
          </span>
        )}
        <span className="sr-only" aria-live="polite">
          {announcement}
        </span>
      </span>
    );
  },
);
Countdown.displayName = 'Countdown';

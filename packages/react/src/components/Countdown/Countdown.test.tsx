import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Countdown, useCountdown } from './Countdown.js';

const BASE = Date.UTC(2026, 0, 15, 9, 0, 0);
let clock = BASE;
const now = () => clock;
/** Moves the injected clock and the timers together. */
const advance = (ms: number) =>
  act(() => {
    clock += ms;
    vi.advanceTimersByTime(ms);
  });
const timer = () => screen.getByRole('timer');
const spoken = () => document.querySelector('[aria-live="polite"]')!.textContent;

beforeEach(() => {
  clock = BASE;
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('Countdown', () => {
  it('renders a placeholder on the server, then the time left', () => {
    const html = renderToString(<Countdown to={BASE + 299_000} now={now} />);
    expect(html).toContain('invisible');
    expect(html).toContain('0:00');
    expect(html).not.toContain('4:59');
    render(<Countdown to={BASE + 299_000} now={now} />);
    expect(timer()).toHaveTextContent('4:59');
    expect(timer()).toHaveAttribute('aria-live', 'off');
    expect(timer()).toHaveClass('tabular-nums');
  });

  it('ticks once a second from the clock and realigns to the second', () => {
    render(<Countdown to={BASE + 5_400} now={now} />);
    expect(timer()).toHaveTextContent('0:06');
    advance(400);
    expect(timer()).toHaveTextContent('0:05');
    advance(1000);
    expect(timer()).toHaveTextContent('0:04');
  });

  it('stops at zero and expires once', () => {
    const onExpire = vi.fn();
    render(<Countdown to={BASE + 2_000} now={now} onExpire={onExpire} />);
    advance(1000);
    expect(onExpire).not.toHaveBeenCalled();
    advance(1000);
    expect(timer()).toHaveTextContent('0:00');
    advance(5000);
    expect(timer()).toHaveTextContent('0:00');
    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(spoken()).toBe('Time is up');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('resyncs when the tab comes back', () => {
    render(<Countdown to={new Date(BASE + 120_000)} now={now} />);
    // Background: the clock moved on, the timers did not fire.
    clock += 45_500;
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(timer()).toHaveTextContent('1:15');
    advance(500);
    expect(timer()).toHaveTextContent('1:14');
  });

  it('announces minutes, then 30, 10 and 5 seconds', () => {
    render(<Countdown to={BASE + 121_000} now={now} />);
    expect(spoken()).toBe('');
    advance(1000);
    expect(spoken()).toBe('2 minutes left');
    advance(30_000);
    expect(spoken()).toBe('2 minutes left');
    advance(30_000);
    expect(spoken()).toBe('1 minute left');
    advance(30_000);
    expect(spoken()).toBe('30 seconds left');
    advance(20_000);
    expect(spoken()).toBe('10 seconds left');
    advance(4_000);
    expect(spoken()).toBe('10 seconds left');
    advance(1_000);
    expect(spoken()).toBe('5 seconds left');
  });

  it('tone follows the thresholds, or the prop', () => {
    const { rerender } = render(<Countdown to={BASE + 60_000} now={now} />);
    expect(timer()).toHaveAttribute('data-tone', 'neutral');
    advance(1000);
    expect(timer()).toHaveAttribute('data-tone', 'warning');
    advance(49_000);
    expect(timer()).toHaveAttribute('data-tone', 'warning');
    advance(1000);
    expect(timer()).toHaveAttribute('data-tone', 'danger');
    rerender(<Countdown to={BASE + 60_000} now={now} dangerAt={5} />);
    expect(timer()).toHaveAttribute('data-tone', 'warning');
    rerender(<Countdown to={BASE + 60_000} now={now} tone="neutral" />);
    expect(timer()).toHaveAttribute('data-tone', 'neutral');
  });

  it('formats hours, and inline is plain text', () => {
    const { rerender } = render(<Countdown to={BASE + 3_725_000} now={now} variant="inline" />);
    expect(timer()).toHaveTextContent('1:02:05');
    expect(timer().className).toBe('tabular-nums');
    rerender(<Countdown to={BASE + 3_725_000} now={now} format="m:ss" />);
    expect(timer()).toHaveTextContent('62:05');
    rerender(<Countdown to={BASE + 65_000} now={now} format="h:mm:ss" />);
    expect(timer()).toHaveTextContent('0:01:05');
  });

  it('useCountdown reports the time left', () => {
    const onExpire = vi.fn();
    const { result } = renderHook(() => useCountdown(BASE + 1_500, { now, onExpire }));
    expect(result.current).toEqual({ remainingMs: 1500, seconds: 2, expired: false, ready: true });
    advance(1500);
    expect(result.current).toEqual({ remainingMs: 0, seconds: 0, expired: true, ready: true });
    expect(onExpire).toHaveBeenCalledTimes(1);
  });
});

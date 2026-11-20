import * as React from 'react';
import { Button, Countdown } from '@nexub/react';

export interface ResendProps {
  /** The button once the wait is over: "Resend code". */
  label: string;
  /** Before the time left: "Resend code in". */
  waitLabel: string;
  /** Seconds to wait after each send. */
  after: number;
  now?: () => number;
  onResend: () => void | Promise<unknown>;
}

const mss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/**
 * Internal: a resend action behind a cooldown (VerifyCodePage, ForgotPasswordPage).
 * The deadline is set after mount, never during render, so server HTML and the
 * first client paint both show the full wait.
 */
export function Resend({ label, waitLabel, after, now, onResend }: ResendProps) {
  const [until, setUntil] = React.useState<number>();
  const [ready, setReady] = React.useState(after <= 0);
  const [busy, setBusy] = React.useState(false);
  const start = () => {
    setReady(after <= 0);
    setUntil((now ?? Date.now)() + after * 1000);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(start, []);

  if (!ready) {
    return (
      <p className="text-body-sm tabular-nums text-[var(--color-on-surface-muted)]">
        {waitLabel}{' '}
        {until === undefined ? (
          mss(after)
        ) : (
          <Countdown to={until} format="m:ss" variant="inline" now={now} onExpire={() => setReady(true)} />
        )}
      </p>
    );
  }
  return (
    <Button
      type="button"
      variant="link"
      loading={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await onResend();
          start();
        } catch {
          // The page's `error` says why; the button stays ready for another try.
        } finally {
          setBusy(false);
        }
      }}
    >
      {label}
    </Button>
  );
}

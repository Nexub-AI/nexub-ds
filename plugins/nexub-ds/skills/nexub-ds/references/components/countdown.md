# Countdown

Time left to a deadline, as a chip or inline text. Stays right after the tab was in the background.

- Package: `@nexub/react` · Category: Feedback · Status: alpha
- Import: `import { Countdown } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/countdown

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `to` (required) | `number \| Date` |  | The deadline: a Date or milliseconds since the epoch. Not a duration. |
| `format` | `'m:ss' \| 'h:mm:ss' \| 'auto'` | `'auto'` | `auto` shows hours only from one hour up. |
| `variant` | `'chip' \| 'inline'` | `'chip'` | A small badge, or plain text in the surrounding font. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the chip. |
| `tone` | `'auto' \| 'neutral' \| 'warning' \| 'danger'` | `'auto'` | `auto` turns warning under `warnAt` and danger under `dangerAt`. |
| `warnAt / dangerAt` | `number` | `60 / 10` | Thresholds for `tone="auto"`, in seconds. |
| `onExpire` | `() => void` |  | Called once when the deadline is reached. |
| `now` | `() => number` | `Date.now` | The clock. Inject one for tests and static previews. |

## Example: Hold timer

```tsx
import * as React from 'react';
import { Button, Countdown } from '@nexub/react';

export default function Example() {
  // The deadline is set after mount, so the server and the first paint agree. The chip is
  // always rendered (0 until then), so nothing moves when the time arrives.
  const [deadline, setDeadline] = React.useState(0);
  const [expired, setExpired] = React.useState(false);
  const start = () => {
    setExpired(false);
    setDeadline(Date.now() + 75_000);
  };
  React.useEffect(start, []);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-body-md text-[var(--color-on-surface)]">{expired ? 'The hold has ended' : 'Held for you'}</span>
      <Countdown to={deadline} onExpire={() => deadline > 0 && setExpired(true)} />
      <Button size="sm" variant="outlined" onClick={start}>
        Restart
      </Button>
    </div>
  );
}
```

## Example: Resend button with useCountdown

```tsx
import * as React from 'react';
import { Button, useCountdown } from '@nexub/react';

export default function Example() {
  // 0 until the first click: nothing reads the clock while rendering.
  const [deadline, setDeadline] = React.useState(0);
  const { seconds, expired } = useCountdown(deadline);
  const waiting = deadline > 0 && !expired;
  return (
    <Button variant="outlined" disabled={waiting} onClick={() => setDeadline(Date.now() + 30_000)}>
      {waiting ? <span className="tabular-nums">Resend code in 0:{String(seconds).padStart(2, '0')}</span> : 'Send code'}
    </Button>
  );
}
```

## Accessibility

- The digits are a `timer` that is not read on every tick. A separate polite region speaks each whole minute, then at 30, 10 and 5 seconds, and when time is up.
- The server and the first paint show a placeholder of the same width; the time appears after mount, so there is no hydration mismatch.
- `useCountdown(to, { now, onExpire })` returns `{ remainingMs, seconds, expired, ready }` for custom displays.

Related: [badge](badge.md), [otp-input](otp-input.md), [progress](progress.md)

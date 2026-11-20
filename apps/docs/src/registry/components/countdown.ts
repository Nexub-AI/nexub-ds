import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'countdown',
    title: 'Countdown',
    description: 'Time left to a deadline, as a chip or inline text. Stays right after the tab was in the background.',
    category: 'Feedback',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '10.8.0',
    related: ['badge', 'otp-input', 'progress'],
  },
  props: [
    { name: 'to', type: 'number | Date', required: true, description: 'The deadline: a Date or milliseconds since the epoch. Not a duration.' },
    { name: 'format', type: "'m:ss' | 'h:mm:ss' | 'auto'", default: "'auto'", description: '`auto` shows hours only from one hour up.' },
    { name: 'variant', type: "'chip' | 'inline'", default: "'chip'", description: 'A small badge, or plain text in the surrounding font.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the chip.' },
    { name: 'tone', type: "'auto' | 'neutral' | 'warning' | 'danger'", default: "'auto'", description: '`auto` turns warning under `warnAt` and danger under `dangerAt`.' },
    { name: 'warnAt / dangerAt', type: 'number', default: '60 / 10', description: 'Thresholds for `tone="auto"`, in seconds.' },
    { name: 'onExpire', type: '() => void', description: 'Called once when the deadline is reached.' },
    { name: 'now', type: '() => number', default: 'Date.now', description: 'The clock. Inject one for tests and static previews.' },
  ],
  examples: [{ title: 'Hold timer' }, { title: 'Resend button with useCountdown' }],
  a11y: {
    notes: [
      'The digits are a `timer` that is not read on every tick. A separate polite region speaks each whole minute, then at 30, 10 and 5 seconds, and when time is up.',
      'The server and the first paint show a placeholder of the same width; the time appears after mount, so there is no hydration mismatch.',
      '`useCountdown(to, { now, onExpire })` returns `{ remainingMs, seconds, expired, ready }` for custom displays.',
    ],
  },
};

export default entry;

import type { Meta } from '@storybook/react';
import * as React from 'react';
import { Textarea, ThinkingIndicator } from '@nexub/react';
import { Conversation } from './Conversation.js';
import { DateSeparator } from './DateSeparator.js';

const meta: Meta = { title: 'Patterns/Conversation' };
export default meta;

const script = [
  { from: 'user', text: 'What makes the Transformer different from an RNN?' },
  {
    from: 'assistant',
    text: 'An RNN reads a sequence one token at a time, carrying a hidden state forward. A Transformer drops recurrence and uses self-attention, so every token can look at every other token in one step.',
  },
  { from: 'user', text: 'Why does that matter for training?' },
  {
    from: 'assistant',
    text: 'Because attention has no step-by-step dependency, the whole sequence can be processed in parallel. That makes training on GPUs far faster and lets models scale to much larger datasets.',
  },
  { from: 'user', text: 'Any downsides?' },
  {
    from: 'assistant',
    text: 'Attention cost grows with the square of the sequence length, so very long contexts get expensive. Many recent variants — sparse, linear and sliding-window attention — exist to soften that.',
  },
] as const;

function Bubble({ from, text }: (typeof script)[number]) {
  return from === 'user' ? (
    <p className="max-w-[80%] self-end rounded-shape-container bg-[var(--color-secondary-container)] px-4 py-2.5 text-body-md text-[var(--color-on-secondary-container)]">
      {text}
    </p>
  ) : (
    <p className="text-body-md text-[var(--color-on-surface)]">{text}</p>
  );
}

function Demo() {
  const [count, setCount] = React.useState(2);
  React.useEffect(() => {
    if (count >= script.length * 3) return;
    const t = setTimeout(() => setCount((c) => c + 1), 1500);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <div
      style={{
        height: 480,
        border: '1px solid var(--color-outline-variant)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <Conversation
        composer={<Textarea aria-label="Message" placeholder="Ask anything…" rows={2} />}
      >
        {Array.from({ length: count }, (_, i) => (
          <Bubble key={i} {...script[i % script.length]!} />
        ))}
      </Conversation>
    </div>
  );
}

export const Scripted = { render: () => <Demo /> };

/** 11.5: in normal flow, no fixed-height parent. It grows with its messages up to `maxHeight`, then scrolls. */
function InFlow() {
  const [count, setCount] = React.useState(1);
  return (
    <div className="flex flex-col gap-4">
      <button type="button" className="self-start text-body-md underline" onClick={() => setCount((c) => c + 1)}>
        Add a message
      </button>
      <Conversation maxHeight="24rem" composer={<Textarea aria-label="Message" placeholder="Ask anything…" rows={2} />}>
        {Array.from({ length: count }, (_, i) => (
          <Bubble key={i} {...script[i % script.length]!} />
        ))}
      </Conversation>
    </div>
  );
}

export const MaxHeightInFlow = { render: () => <InFlow /> };

const frame = {
  height: 480,
  border: '1px solid var(--color-outline-variant)',
  borderRadius: 16,
  overflow: 'hidden',
} as const;

// A fixed "now" so the Today / Yesterday labels don't depend on the day the story runs.
const NOW = new Date(2026, 10, 27, 12, 0);
const day = (offset: number, h: number) => new Date(2026, 10, 27 + offset, h, 0);

/** 12.2: messages grouped by day with `DateSeparator` ("Today", "Yesterday" or a medium date). */
function DayGrouped() {
  const days = [
    { date: day(-5, 9), lines: script.slice(0, 2) },
    { date: day(-1, 18), lines: script.slice(2, 4) },
    { date: day(0, 8), lines: script.slice(4, 6) },
  ];
  return (
    <div style={frame}>
      <Conversation composer={<Textarea aria-label="Message" placeholder="Ask anything…" rows={2} />}>
        {days.map(({ date, lines }) => (
          <React.Fragment key={date.toISOString()}>
            <DateSeparator date={date} now={NOW} />
            {lines.map((l, i) => (
              <Bubble key={i} {...l} />
            ))}
          </React.Fragment>
        ))}
      </Conversation>
    </div>
  );
}

export const DayGroupedWithDateSeparators = { render: () => <DayGrouped /> };

/** 12.2: the `thinking` slot at the end of the list, announced politely; it never moves the scroll. */
function ThinkingSlot() {
  const [busy, setBusy] = React.useState(true);
  return (
    <div className="flex flex-col gap-4">
      <button type="button" className="self-start text-body-md underline" onClick={() => setBusy((b) => !b)}>
        {busy ? 'Stop thinking' : 'Start thinking'}
      </button>
      <div style={frame}>
        <Conversation thinking={busy ? <ThinkingIndicator /> : null}>
          {script.map((l, i) => (
            <Bubble key={i} {...l} />
          ))}
        </Conversation>
      </div>
    </div>
  );
}

export const Thinking = { render: () => <ThinkingSlot /> };

/**
 * 12.2: start the timer, then scroll up. Each new message while you're scrolled up turns
 * "Jump to latest" into "Jump to newest" and announces "New messages" once per batch.
 */
function JumpToNewestDemo() {
  const [count, setCount] = React.useState(10);
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setCount((c) => c + 1), 2000);
    return () => clearInterval(t);
  }, [running]);
  return (
    <div className="flex flex-col gap-4">
      <button type="button" className="self-start text-body-md underline" onClick={() => setRunning((r) => !r)}>
        {running ? 'Stop new messages' : 'Start new messages (one every 2 s)'}
      </button>
      <div style={frame}>
        <Conversation composer={<Textarea aria-label="Message" placeholder="Ask anything…" rows={2} />}>
          {Array.from({ length: count }, (_, i) => (
            <Bubble key={i} {...script[i % script.length]!} />
          ))}
        </Conversation>
      </div>
    </div>
  );
}

export const JumpToNewest = { render: () => <JumpToNewestDemo /> };

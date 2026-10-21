import type { Meta } from '@storybook/react';
import * as React from 'react';
import { Textarea } from '@nexub/react';
import { Conversation } from './Conversation.js';

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

import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { StreamingText } from './StreamingText.js';
import { Button } from '../Button/Button.js';

const meta: Meta<typeof StreamingText> = {
  title: 'AI/StreamingText',
  component: StreamingText,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof StreamingText>;

const ANSWER =
  'Streaming text keeps what you have already read perfectly still. Only the newest words fade in, and the caret blinks while more is on the way. When the answer is complete, the caret disappears.';

function SimulatedStream() {
  const [length, setLength] = React.useState(0);
  const [run, setRun] = React.useState(0);
  React.useEffect(() => {
    setLength(0);
    const id = setInterval(() => {
      setLength((n) => {
        if (n >= ANSWER.length) {
          clearInterval(id);
          return n;
        }
        // Tokens arrive in uneven bursts, like a real model.
        return Math.min(ANSWER.length, n + 2 + Math.floor(Math.random() * 8));
      });
    }, 60);
    return () => clearInterval(id);
  }, [run]);
  const streaming = length < ANSWER.length;
  return (
    <div className="flex max-w-prose flex-col items-start gap-4">
      <StreamingText as="p" text={ANSWER.slice(0, length)} streaming={streaming} className="text-body-lg text-[var(--color-on-surface)]" />
      <Button variant="outline" size="sm" onClick={() => setRun((r) => r + 1)}>
        Restart
      </Button>
    </div>
  );
}

export const Simulated: Story = { render: () => <SimulatedStream /> };

export const Done: Story = { args: { text: ANSWER, streaming: false } };

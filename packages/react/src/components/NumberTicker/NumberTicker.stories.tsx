import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NumberTicker } from './NumberTicker.js';
import { Amount } from '../Amount/Amount.js';
import { Button } from '../Button/Button.js';

const meta: Meta<typeof NumberTicker> = {
  title: 'Components/NumberTicker',
  component: NumberTicker,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof NumberTicker>;

export const Default: Story = {
  args: { value: 1234567, locale: 'en-US', 'aria-live': 'polite' },
};

function TickingBalance() {
  const [balance, setBalance] = React.useState(9840.25);
  return (
    <div className="flex flex-col items-start gap-4">
      <NumberTicker
        className="font-display text-display-sm"
        value={balance}
        locale="en-US"
        format={{ style: 'currency', currency: 'USD' }}
        aria-live="polite"
      />
      <div className="flex gap-2">
        <Button variant="outlined" onClick={() => setBalance((b) => b - 187.5)}>
          − $187.50
        </Button>
        <Button onClick={() => setBalance((b) => b + 312.75)}>+ $312.75</Button>
      </div>
    </div>
  );
}

export const TickingBalanceStory: Story = { name: 'Ticking balance', render: () => <TickingBalance /> };

function AnimatedAmount() {
  const [value, setValue] = React.useState(128450.75);
  return (
    <div className="flex flex-col items-start gap-4">
      <Amount value={value} currency="USD" locale="en-US" size="display" animate />
      <Amount value={value - 128000} currency="USD" locale="en-US" tone="auto" signDisplay="exceptZero" animate />
      <Button variant="outlined" onClick={() => setValue((v) => v + Math.round(Math.random() * 2000 - 1000) / 4)}>
        Market tick
      </Button>
    </div>
  );
}

export const AmountAnimate: Story = { name: 'Amount (animate)', render: () => <AnimatedAmount /> };

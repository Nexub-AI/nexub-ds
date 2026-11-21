import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NumberInput } from './NumberInput.js';

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  args: {
    'aria-label': 'Quantity',
    defaultValue: 0,
    step: 1,
    showSteppers: true,
    size: 'md',
  },
};

/** 10.4: the shared size scale and the read-only state. */
export const ConsistentControls: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 280 }}>
      <NumberInput size="sm" aria-label="Small" defaultValue={12} showSteppers />
      <NumberInput size="md" aria-label="Medium" defaultValue={12} showSteppers />
      <NumberInput size="lg" aria-label="Large" defaultValue={12} showSteppers />
      <NumberInput readOnly aria-label="Read-only" defaultValue={12} showSteppers />
    </div>
  ),
};

/** 11.1: can be empty (`null`), keeps a half-typed "2." while focused, limits apply on blur, `step="any"`. */
export const Nullable: Story = {
  render: () => {
    const [value, setValue] = React.useState<number | null>(null);
    return (
      <div style={{ display: 'grid', gap: 12, maxWidth: 280 }}>
        <NumberInput nullable aria-label="Target" placeholder="No target" min={15} max={100} step="any" value={value} onValueChange={setValue} showSteppers />
        <span>{value === null ? 'null' : value}</span>
      </div>
    );
  },
};

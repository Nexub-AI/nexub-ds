import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ComparisonBar } from './ComparisonBar.js';

const meta: Meta<typeof ComparisonBar> = { title: 'Components/ComparisonBar', component: ComparisonBar, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ComparisonBar>;

export const Default: Story = {
  args: { label: 'Goals', left: { label: 'Team A', value: 3 }, right: { label: 'Team B', value: 1 } },
  decorators: [(Story) => <div className="w-80 max-w-full"><Story /></div>],
};

const stats: [string, number, number, ((n: number) => string)?][] = [
  ['Possession', 58, 42, (n) => `${n}%`],
  ['Shots', 14, 9],
  ['Shots on target', 6, 6],
  ['Corners', 3, 7],
  ['Fouls', 0, 4],
];

/** Several stats stacked, like a comparison table. The side labels show once. */
export const Group: Story = {
  render: () => (
    <div className="flex w-80 max-w-full flex-col gap-4">
      {stats.map(([label, a, b, format], i) => (
        <ComparisonBar
          key={label}
          label={label}
          left={{ label: 'Team A', value: a, color: 'blue' }}
          right={{ label: 'Team B', value: b, color: 'amber' }}
          valueFormat={format}
          showLabels={i === stats.length - 1}
        />
      ))}
    </div>
  ),
};

export const Equal: Story = {
  args: { label: 'Monthly price', left: { label: 'Plan A', value: 20 }, right: { label: 'Plan B', value: 20 }, valueFormat: (n) => `$${n}` },
  decorators: [(Story) => <div className="w-80 max-w-full"><Story /></div>],
};

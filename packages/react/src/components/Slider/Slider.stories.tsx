import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider.js';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    'aria-label': 'Volume',
  },
};

export const MarksAndValue: Story = {
  args: {
    defaultValue: [50],
    step: 25,
    'aria-label': 'Volume',
    marks: [0, { value: 25, label: '25%' }, { value: 50, label: '50%' }, { value: 75, label: '75%' }, 100],
    showValue: 'hover',
    formatValue: (v: number) => `${v}%`,
  },
};

/** 10.4: sizes, invalid and read-only side by side. */
export const ConsistentControls: Story = {
  render: () => (
    <div className="flex max-w-xs flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Slider key={size} size={size} defaultValue={[40]} aria-label={`${size} volume`} />
      ))}
      <Slider invalid defaultValue={[60]} aria-label="Invalid volume" />
      <Slider readOnly defaultValue={[25]} aria-label="Read-only volume" />
    </div>
  ),
};

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

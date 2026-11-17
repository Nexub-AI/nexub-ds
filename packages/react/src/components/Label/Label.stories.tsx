import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label.js';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Email address',
    size: 'md',
    required: false,
  },
};

/** 10.4: sizes on type roles; disabled is a colour, not opacity. */
export const ConsistentControls: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Label size="sm">Small</Label>
      <Label size="md">Medium</Label>
      <Label size="lg">Large</Label>
      {/* Paired with disabled inputs: a disabled label on its own fails contrast on purpose. */}
      <Label disabled htmlFor="cc-a">Disabled</Label>
      <input id="cc-a" disabled className="w-24" />
      <Label disabled required htmlFor="cc-b">Disabled required</Label>
      <input id="cc-b" disabled className="w-24" />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox.js';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    'aria-label': 'Accept terms',
  },
};

/** 7.9: classic beside Signature (`data-style="signature"`). Click to see the spring check-draw. */
export const Signature: Story = {
  render: () => (
    <div className="flex gap-8">
      {(['classic', 'signature'] as const).map((style) => (
        <div key={style} data-style={style} className="flex items-center gap-3">
          <span className="text-label-md">{style}</span>
          <Checkbox aria-label={`${style} off`} />
          <Checkbox aria-label={`${style} on`} defaultChecked />
          <Checkbox aria-label={`${style} mixed`} checked="indeterminate" />
          <Checkbox aria-label={`${style} disabled`} disabled defaultChecked />
        </div>
      ))}
    </div>
  ),
};

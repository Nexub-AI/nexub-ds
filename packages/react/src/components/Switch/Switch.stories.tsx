import type { Meta, StoryObj } from '@storybook/react';
import { Check, X } from '@nexub/icons';
import { Switch } from './Switch.js';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    'aria-label': 'Toggle setting',
  },
};

export const Loading: Story = {
  args: { 'aria-label': 'Toggle setting', loading: true, defaultChecked: true },
};

export const ThumbIcons: Story = {
  args: { 'aria-label': 'Toggle setting', checkedIcon: <Check />, uncheckedIcon: <X /> },
};

/** The Signature controls (the only style since 9.0): every state side by side. */
export const Signature: Story = {
  render: () => (
    <div className="flex gap-8">
      {(['signature'] as const).map((style) => (
        <div key={style} data-style={style} className="flex flex-col gap-3">
          <span className="text-label-md">{style}</span>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} className="flex gap-2">
              <Switch size={size} aria-label={`${style} ${size} off`} />
              <Switch size={size} aria-label={`${style} ${size} on`} defaultChecked />
            </div>
          ))}
          <div className="flex gap-2">
            <Switch aria-label={`${style} icons`} checkedIcon={<Check />} uncheckedIcon={<X />} defaultChecked />
            <Switch aria-label={`${style} loading`} loading />
            <Switch aria-label={`${style} disabled`} disabled defaultChecked />
          </div>
        </div>
      ))}
    </div>
  ),
};

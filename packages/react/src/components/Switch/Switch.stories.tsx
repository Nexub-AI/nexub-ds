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

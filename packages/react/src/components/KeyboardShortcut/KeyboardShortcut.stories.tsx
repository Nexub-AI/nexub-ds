import type { Meta, StoryObj } from '@storybook/react';
import { KeyboardShortcut } from './KeyboardShortcut.js';

const meta: Meta<typeof KeyboardShortcut> = {
  title: 'Components/KeyboardShortcut',
  component: KeyboardShortcut,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof KeyboardShortcut>;

export const Default: Story = {
  args: {
    keys: ['Ctrl', 'K'],
  },
};

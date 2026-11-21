import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { EmojiPicker } from './EmojiPicker.js';

const meta: Meta<typeof EmojiPicker> = {
  title: 'Forms/EmojiPicker',
  component: EmojiPicker,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof EmojiPicker>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>('🚀');
    return <EmojiPicker aria-label="Space icon" value={value} onValueChange={setValue} />;
  },
};

/** The grid alone, e.g. inside your own popover or a reaction bar. */
export const Panel: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div style={{ maxWidth: 320 }}>
        <EmojiPicker.Panel aria-label="React with an emoji" value={value} onValueChange={setValue} />
        <p>Picked: {value ?? 'none'}</p>
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <EmojiPicker aria-label="Placeholder" />
      <EmojiPicker aria-label="Invalid" invalid />
      <EmojiPicker aria-label="Read-only" readOnly defaultValue="📚" />
      <EmojiPicker aria-label="Disabled" disabled defaultValue="📚" />
      <EmojiPicker aria-label="Small" size="sm" defaultValue="🎉" />
    </div>
  ),
};

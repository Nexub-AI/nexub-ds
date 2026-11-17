import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea.js';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Write something...',
    size: 'md',
  },
};

/** 10.4: the shared size scale and the read-only state. */
export const ConsistentControls: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 280 }}>
      <Textarea aria-label="Editable" defaultValue="Editable" />
      <Textarea readOnly aria-label="Read-only" defaultValue="Read-only" />
    </div>
  ),
};

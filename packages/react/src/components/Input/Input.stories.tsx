import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input.js';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    size: 'md',
  },
};

export const Clearable: Story = {
  args: { 'aria-label': 'Name', defaultValue: 'Ada Lovelace', clearable: true },
};

export const WithCount: Story = {
  args: { 'aria-label': 'Bio', defaultValue: 'Mathematician', maxLength: 80, showCount: true },
};

export const Loading: Story = {
  args: { 'aria-label': 'Username', defaultValue: 'ada', loading: true },
};

/** 10.4: the shared size scale and the read-only state. */
export const ConsistentControls: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 280 }}>
      <Input size="sm" aria-label="Small" defaultValue="Small" />
      <Input size="md" aria-label="Medium" defaultValue="Medium" />
      <Input size="lg" aria-label="Large" defaultValue="Large" />
      <Input readOnly clearable aria-label="Read-only" defaultValue="Read-only" />
      <Input readOnly aria-label="Read-only site" leadingAddon="https://" defaultValue="nexub.app" />
    </div>
  ),
};

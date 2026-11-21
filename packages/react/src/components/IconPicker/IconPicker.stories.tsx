import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { IconPicker } from './IconPicker.js';

const meta: Meta<typeof IconPicker> = {
  title: 'Forms/IconPicker',
  component: IconPicker,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof IconPicker>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>('FileText');
    return <IconPicker aria-label="Doc icon" value={value} onValueChange={setValue} />;
  },
};

/** Headings with a category row; names `@nexub/icons` doesn't export are skipped. */
export const Categories: Story = {
  render: () => (
    <IconPicker
      aria-label="Category icon"
      categories={[
        { label: 'Finance', icons: ['Wallet', 'Receipt', 'CreditCard', 'DollarSign', 'PieChart', 'TrendingUp'] },
        { label: 'People', icons: ['User', 'Users', 'UserPlus', 'Building2', 'Briefcase'] },
        { label: 'Files', icons: ['FileText', 'Folder', 'Paperclip', 'Image', 'Video'] },
      ]}
    />
  ),
};

/** The grid alone, for your own popover or a settings page. */
export const Panel: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <div style={{ maxWidth: 320 }}>
        <IconPicker.Panel value={value} onValueChange={setValue} />
        <p>Picked: {value ?? 'none'}</p>
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <IconPicker aria-label="Placeholder" />
      <IconPicker aria-label="Invalid" invalid />
      <IconPicker aria-label="Read-only" readOnly defaultValue="Star" />
      <IconPicker aria-label="Disabled" disabled defaultValue="Star" />
      <IconPicker aria-label="Small" size="sm" defaultValue="Heart" />
    </div>
  ),
};

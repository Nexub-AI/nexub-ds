import type { Meta, StoryObj } from '@storybook/react';
import { MoneyInput } from './MoneyInput.js';

const meta: Meta<typeof MoneyInput> = {
  title: 'Components/MoneyInput',
  component: MoneyInput,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof MoneyInput>;

export const Default: Story = {
  args: { 'aria-label': 'Amount', currency: 'USD', locale: 'en-US', placeholder: '0.00' },
};

/** A value, grouped for display. */
export const WithValue: Story = {
  args: { 'aria-label': 'Amount', currency: 'EUR', locale: 'de-DE', defaultValue: 1234.5 },
};

/** 10.4: the shared size scale and the read-only state. */
export const ConsistentControls: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 280 }}>
      <MoneyInput size="sm" aria-label="Small" currency="USD" locale="en-US" defaultValue={1234.5} />
      <MoneyInput size="lg" aria-label="Large" currency="USD" locale="en-US" defaultValue={1234.5} />
      <MoneyInput readOnly aria-label="Read-only" currency="USD" locale="en-US" defaultValue={1234.5} />
    </div>
  ),
};

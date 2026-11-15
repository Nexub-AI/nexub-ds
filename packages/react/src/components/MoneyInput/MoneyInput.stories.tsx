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

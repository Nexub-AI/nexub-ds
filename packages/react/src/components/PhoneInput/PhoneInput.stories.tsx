import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { PhoneInput } from './PhoneInput.js';

const meta: Meta<typeof PhoneInput> = {
  title: 'Components/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-80 max-w-full"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = {
  args: { 'aria-label': 'Phone number', defaultCountry: 'IN', defaultValue: '+919847012345' },
};

/** A short list keeps its order; a single country is shown as text. */
export const Countries: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <PhoneInput aria-label="Mobile number" countries={['IN', 'AE', 'SA', 'QA']} placeholder="Mobile number" sheet="auto" />
      <PhoneInput aria-label="Office number" countries={['SG']} defaultValue="+6561234567" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <PhoneInput aria-label="Small" size="sm" defaultCountry="US" defaultValue="+14155550132" />
      <PhoneInput aria-label="Medium" size="md" defaultCountry="US" defaultValue="+14155550132" />
      <PhoneInput aria-label="Large" size="lg" defaultCountry="US" defaultValue="+14155550132" />
      <PhoneInput aria-label="Invalid" invalid defaultCountry="GB" defaultValue="+44791" />
      <PhoneInput aria-label="Disabled" disabled defaultCountry="DE" defaultValue="+4915123456789" />
      <PhoneInput aria-label="Read-only" readOnly defaultCountry="AU" defaultValue="+61412345678" />
    </div>
  ),
};

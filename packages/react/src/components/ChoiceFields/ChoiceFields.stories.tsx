import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SwitchField, CheckboxField, CheckboxGroupField } from './ChoiceFields.js';

const meta: Meta = { title: 'Forms/Choice fields', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

export const Switches: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <SwitchField label="Online store" description="Buyers can see and order from the shop" defaultChecked />
      <SwitchField label="Email me a summary" layout="start" size="sm" />
      <SwitchField label="Two-step sign-in" error="Required by your organisation" />
      <SwitchField label="Archived" disabled />
    </div>
  ),
};

export const Checkboxes: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>(['email']);
    return (
      <div style={{ display: 'grid', gap: 20, maxWidth: 420 }}>
        <CheckboxField label="Gift wrap" description="Paper and ribbon" aside="$4.00" />
        <CheckboxField label="All invoices" checked="indeterminate" />
        <CheckboxField label="I accept the terms" error="Accept the terms to continue" />
        <CheckboxGroupField
          label="Notify me by"
          description="Pick one or more"
          required
          options={[
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS', description: 'Carrier rates apply' },
            { value: 'push', label: 'Push', disabled: true },
          ]}
          value={value}
          onValueChange={setValue}
          error={value.length ? undefined : 'Pick at least one'}
        />
      </div>
    );
  },
};

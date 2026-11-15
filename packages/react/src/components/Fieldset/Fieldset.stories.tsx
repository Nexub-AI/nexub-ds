import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Fieldset } from './Fieldset.js';
import { Input } from '../Input/Input.js';
import { Label } from '../Label/Label.js';

const meta: Meta<typeof Fieldset> = {
  title: 'Components/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Fieldset>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Fieldset {...args}>
        <div style={{ display: 'grid', gap: 6 }}>
          <Label htmlFor="fs-street">Street</Label>
          <Input id="fs-street" defaultValue="1 Market St" />
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <Label htmlFor="fs-city">City</Label>
          <Input id="fs-city" defaultValue="San Francisco" />
        </div>
      </Fieldset>
    </div>
  ),
  args: { legend: 'Billing address', description: 'Where we send invoices.' },
};

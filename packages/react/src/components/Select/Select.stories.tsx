import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Select } from './Select.js';

const meta: Meta = {
  title: 'Components/Select',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select.Root>
      <Select.Trigger style={{ width: '220px' }}>
        <Select.Value placeholder="Select a country" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Americas</Select.Label>
          <Select.Item value="us">United States</Select.Item>
          <Select.Item value="ca">Canada</Select.Item>
          <Select.Item value="mx">Mexico</Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>Europe</Select.Label>
          <Select.Item value="gb">United Kingdom</Select.Item>
          <Select.Item value="de">Germany</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  ),
};

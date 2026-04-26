import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Combobox } from './Combobox.js';

const meta: Meta = {
  title: 'Components/Combobox',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const fruits = [
  'Apple',
  'Banana',
  'Blueberry',
  'Grapes',
  'Mango',
  'Strawberry',
];

export const Default: Story = {
  render: () => (
    <div style={{ width: '280px', border: '1px solid var(--color-border-default, #e2e8f0)', borderRadius: '8px', overflow: 'hidden' }}>
      <Combobox.Root>
        <Combobox.Input placeholder="Search fruits..." />
        <Combobox.List>
          <Combobox.Empty>No fruit found.</Combobox.Empty>
          <Combobox.Group heading="Fruits">
            {fruits.map((fruit) => (
              <Combobox.Item key={fruit} value={fruit}>
                {fruit}
              </Combobox.Item>
            ))}
          </Combobox.Group>
        </Combobox.List>
      </Combobox.Root>
    </div>
  ),
};

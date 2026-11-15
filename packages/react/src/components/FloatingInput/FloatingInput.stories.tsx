import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { FloatingInput } from './FloatingInput.js';

const meta: Meta<typeof FloatingInput> = {
  title: 'Components/FloatingInput',
  component: FloatingInput,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof FloatingInput>;

/** Empty (label inside) and filled (label floated). */
export const Default: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
      <FloatingInput label="Email" type="email" />
      <FloatingInput label="Full name" defaultValue="Ada Lovelace" />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SuccessCheck } from './SuccessCheck.js';

const meta: Meta<typeof SuccessCheck> = { title: 'Components/SuccessCheck', component: SuccessCheck, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof SuccessCheck>;

export const Default: Story = { args: { label: 'Payment sent' } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SuccessCheck size="sm" />
      <SuccessCheck size="md" />
      <SuccessCheck size="lg" />
    </div>
  ),
};

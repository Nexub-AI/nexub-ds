import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField.js';
import { Input } from '../Input/index.js';

const meta: Meta<typeof FormField.Root> = {
  title: 'Components/FormField',
  component: FormField.Root,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FormField.Root>;

export const Default: Story = {
  render: () => (
    <FormField.Root id="email" name="email">
      <FormField.Label>Email address</FormField.Label>
      <FormField.Control>
        <Input placeholder="you@example.com" />
      </FormField.Control>
      <FormField.Description>We will never share your email.</FormField.Description>
    </FormField.Root>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { OTPInput } from './OTPInput.js';

const meta: Meta = {
  title: 'Components/OTPInput',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <OTPInput defaultValue="482" /> };
export const Invalid: Story = { render: () => <OTPInput defaultValue="482913" invalid /> };

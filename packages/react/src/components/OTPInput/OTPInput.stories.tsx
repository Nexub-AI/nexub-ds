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

/** 10.4: sizes, invalid and read-only side by side. */
export const ConsistentControls: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <OTPInput length={4} size="sm" defaultValue="48" aria-label="Small code" />
      <OTPInput length={4} size="md" defaultValue="48" aria-label="Medium code" />
      <OTPInput length={4} size="lg" defaultValue="48" aria-label="Large code" />
      <OTPInput length={4} invalid defaultValue="4829" aria-label="Invalid code" />
      <OTPInput length={4} readOnly defaultValue="4829" aria-label="Read-only code" />
    </div>
  ),
};

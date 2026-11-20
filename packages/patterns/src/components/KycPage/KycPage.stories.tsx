import type { Meta, StoryObj } from '@storybook/react';
import { KycPage } from './KycPage.js';

const meta: Meta<typeof KycPage> = {
  title: 'Patterns/Pages/KycPage',
  component: KycPage,
  parameters: { layout: 'fullscreen' },
  args: {
    as: 'div',
    onSubmit: () => {},
    defaultCountry: 'SG',
    defaultValues: { legalName: 'Mei Tan', dateOfBirth: new Date(1990, 0, 15), phone: '+6591234567', country: 'SG' },
  },
};
export default meta;
type Story = StoryObj<typeof KycPage>;

export const Default: Story = {};

export const UnderReview: Story = { args: { status: 'review' } };

export const Rejected: Story = {
  args: { status: 'rejected', rejectionReason: 'The photo of your document is blurred. Take it again in good light.' },
};

export const Approved: Story = { args: { status: 'approved' } };

import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DescriptionList } from './DescriptionList.js';

const meta: Meta = { title: 'Components/DescriptionList', tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof meta>;

/** An order receipt with a total. */
export const Default: Story = {
  render: () => (
    <div className="w-80">
      <DescriptionList.Root divided aria-label="Order summary">
        <DescriptionList.Item label="Subtotal" helpText="2 items">$40.00</DescriptionList.Item>
        <DescriptionList.Item label="Shipping">$5.00</DescriptionList.Item>
        <DescriptionList.Item label="Service fee">$1.50</DescriptionList.Item>
        <DescriptionList.Item label="Total" emphasis>$46.50</DescriptionList.Item>
      </DescriptionList.Root>
    </div>
  ),
};

export const Stacked: Story = {
  render: () => (
    <div className="w-80">
      <DescriptionList.Root layout="stacked" size="sm">
        <DescriptionList.Item label="Order number">A-10293</DescriptionList.Item>
        <DescriptionList.Item label="Delivery address">12 Example Street, Level 4, Springfield</DescriptionList.Item>
        <DescriptionList.Item label="Paid with">Card ending 4242</DescriptionList.Item>
      </DescriptionList.Root>
    </div>
  ),
};

/** Three pairs per row; fewer when the list itself is narrow. */
export const Columns: Story = {
  render: () => (
    <DescriptionList.Root layout="stacked" columns={3}>
      <DescriptionList.Item label="Applicant">Ada Lovelace</DescriptionList.Item>
      <DescriptionList.Item label="Submitted">12 March 2026</DescriptionList.Item>
      <DescriptionList.Item label="Reference">APP-2041</DescriptionList.Item>
      <DescriptionList.Item label="Plan">Standard</DescriptionList.Item>
      <DescriptionList.Item label="Reviewer">Not assigned</DescriptionList.Item>
      <DescriptionList.Item label="Status">Under review</DescriptionList.Item>
    </DescriptionList.Root>
  ),
};

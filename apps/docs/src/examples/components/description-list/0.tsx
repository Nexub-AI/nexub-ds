'use client'; // docs preview: server pages import every example

import { DescriptionList } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <DescriptionList.Root divided aria-label="Order summary">
        <DescriptionList.Item label="Subtotal" helpText="2 items">$40.00</DescriptionList.Item>
        <DescriptionList.Item label="Shipping">$5.00</DescriptionList.Item>
        <DescriptionList.Item label="Service fee">$1.50</DescriptionList.Item>
        <DescriptionList.Item label="Total" emphasis>$46.50</DescriptionList.Item>
      </DescriptionList.Root>
    </div>
  );
}

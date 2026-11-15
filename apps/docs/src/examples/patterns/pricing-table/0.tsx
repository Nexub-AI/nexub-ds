'use client'; // docs preview: server pages import every example

import { PricingTable, SectionHeader } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <PricingTable
        header={<SectionHeader title="Simple pricing" description="Save two months with yearly billing." />}
        currency="SGD"
        locale="en-SG"
        plans={[
          { name: 'Starter', price: { monthly: 29, yearly: 24 }, features: ['Up to 10 people', 'Payroll', 'Email support'], cta: 'Start free', href: '#starter' },
          { name: 'Growth', price: { monthly: 79, yearly: 66 }, features: ['Up to 100 people', 'Payroll and HR', 'Bookkeeping'], cta: 'Start free', href: '#growth', highlighted: true, badge: 'Most popular' },
          { name: 'Scale', price: { monthly: 199, yearly: 166 }, features: ['Unlimited people', 'All products', 'Dedicated manager'], cta: 'Talk to sales', href: '#scale' },
        ]}
      />
    </div>
  );
}

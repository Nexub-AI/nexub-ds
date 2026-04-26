import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { PlanCard } from './PlanCard.js';

const meta: Meta = {
  title: 'Patterns/PlanCard',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start', padding: '24px' }}>
      <div style={{ width: '240px' }}>
        <PlanCard
          name="Starter"
          price="$0"
          period="/ month"
          description="Perfect for individuals and small teams getting started."
          features={[
            'Up to 3 projects',
            '5 GB storage',
            'Basic analytics',
            'Email support',
          ]}
          cta="Get started free"
          onSelect={() => {}}
        />
      </div>

      <div style={{ width: '240px' }}>
        <PlanCard
          name="Pro"
          price="$29"
          period="/ month"
          description="For growing teams that need more power and flexibility."
          features={[
            'Unlimited projects',
            '50 GB storage',
            'Advanced analytics',
            'Priority support',
            'Custom integrations',
          ]}
          cta="Start Pro trial"
          highlighted
          badge="Most popular"
          onSelect={() => {}}
        />
      </div>

      <div style={{ width: '240px' }}>
        <PlanCard
          name="Enterprise"
          price="Custom"
          description="For large organisations with advanced security and compliance needs."
          features={[
            'Unlimited everything',
            'SSO & SAML',
            'Audit logs',
            'Dedicated support',
            'SLA guarantee',
          ]}
          cta="Contact sales"
          onSelect={() => {}}
        />
      </div>
    </div>
  ),
};

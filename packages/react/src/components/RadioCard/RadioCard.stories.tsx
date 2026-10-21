import * as React from 'react';
import type { Meta } from '@storybook/react';
import { Building2, User, Users } from '@nexub/icons';
import { RadioCardGroup, RadioCard } from './RadioCard.js';

const meta: Meta = {
  title: 'Components/RadioCard',
};

export default meta;

export const PlanPicker = () => {
  const [plan, setPlan] = React.useState('team');
  return (
    <RadioCardGroup aria-label="Plan" columns={3} value={plan} onValueChange={setPlan}>
      <RadioCard value="solo" icon={<User />} title="Solo" description="One seat, core features.">
        <span className="text-sm font-medium">$0 / month</span>
      </RadioCard>
      <RadioCard value="team" icon={<Users />} title="Team" description="Up to 20 seats, shared workspaces.">
        <span className="text-sm font-medium">$12 / seat</span>
      </RadioCard>
      <RadioCard value="enterprise" icon={<Building2 />} title="Enterprise" description="SSO, audit logs, priority support.">
        <span className="text-sm font-medium">Contact sales</span>
      </RadioCard>
    </RadioCardGroup>
  );
};

export const Disabled = () => (
  <RadioCardGroup aria-label="Region" columns={2} defaultValue="eu">
    <RadioCard value="eu" title="Europe" description="Frankfurt" />
    <RadioCard value="us" title="United States" description="Virginia" />
    <RadioCard value="ap" title="Asia Pacific" description="Coming soon" disabled />
    <RadioCard value="sa" title="South America" description="Unavailable on this plan" disabled />
  </RadioCardGroup>
);

export const DisabledGroup = () => (
  <RadioCardGroup aria-label="Billing" columns={2} defaultValue="yearly" disabled>
    <RadioCard value="monthly" title="Monthly" />
    <RadioCard value="yearly" title="Yearly" description="Two months free" />
  </RadioCardGroup>
);

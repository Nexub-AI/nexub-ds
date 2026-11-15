'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { RadioCardGroup, RadioCard } from '@nexub/react';
import { User, Users, Building2 } from '@nexub/icons';

export default function Example() {
  const [plan, setPlan] = React.useState('team');
  return (
    <RadioCardGroup aria-label="Plan" columns={3} value={plan} onValueChange={setPlan} className="w-full">
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
}

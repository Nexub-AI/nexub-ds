import * as React from 'react';
import type { Meta } from '@storybook/react';
import { BarChart3, Bell, Shield } from '@nexub/icons';
import { CheckboxCard } from './CheckboxCard.js';

const meta: Meta = {
  title: 'Components/CheckboxCard',
};

export default meta;

const features = [
  { id: 'analytics', icon: <BarChart3 />, title: 'Analytics', description: 'Usage dashboards and exports.' },
  { id: 'alerts', icon: <Bell />, title: 'Alerts', description: 'Email and push notifications.' },
  { id: 'security', icon: <Shield />, title: 'Security pack', description: 'SSO and audit logs.' },
];

export const FeaturesMultiSelect = () => {
  const [selected, setSelected] = React.useState<string[]>(['alerts']);
  return (
    <fieldset className="grid gap-3 sm:grid-cols-3">
      <legend className="mb-2 text-sm font-medium">Add-ons</legend>
      {features.map((f) => (
        <CheckboxCard
          key={f.id}
          icon={f.icon}
          title={f.title}
          description={f.description}
          checked={selected.includes(f.id)}
          onCheckedChange={(on) =>
            setSelected((s) => (on ? [...s, f.id] : s.filter((x) => x !== f.id)))
          }
        />
      ))}
    </fieldset>
  );
};

export const Disabled = () => (
  <div className="grid gap-3 sm:grid-cols-2">
    <CheckboxCard title="Backups" description="Included in every plan" checked disabled />
    <CheckboxCard title="Dedicated region" description="Enterprise only" disabled />
  </div>
);

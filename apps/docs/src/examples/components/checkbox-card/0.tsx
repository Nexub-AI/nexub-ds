import { CheckboxCard } from '@nexub/react';
import { Bell, Shield, Zap } from '@nexub/icons';

export default function Example() {
  return (
    <fieldset className="grid gap-3 sm:grid-cols-3 w-full border-0 p-0 m-0">
      <legend className="sr-only">Add-ons</legend>
      <CheckboxCard icon={<Bell />} title="Alerts" description="Email and push notifications." defaultChecked />
      <CheckboxCard icon={<Shield />} title="Audit log" description="Keep a year of activity." />
      <CheckboxCard icon={<Zap />} title="Automations" description="Run rules on new records." />
    </fieldset>
  );
}

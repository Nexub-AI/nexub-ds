import { CheckboxCard } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-3 items-stretch w-[320px]">
      <CheckboxCard title="SSO" description="Available on Enterprise." disabled />
      <CheckboxCard title="Data residency" description="Included in your plan." defaultChecked disabled />
    </div>
  );
}

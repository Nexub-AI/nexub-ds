import { RadioCardGroup, RadioCard } from '@nexub/react';

export default function Example() {
  return (
    <RadioCardGroup aria-label="Region" columns={2} defaultValue="eu" className="w-full">
      <RadioCard value="eu" title="Europe" description="Frankfurt" />
      <RadioCard value="us" title="United States" description="Virginia" />
      <RadioCard value="ap" title="Asia Pacific" description="Coming soon" disabled />
    </RadioCardGroup>
  );
}

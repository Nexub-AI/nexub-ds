import { EyebrowChip } from '@nexub/react';

export default function Example() {
  return (
    <div data-mode="marketing" className="flex flex-wrap items-center gap-3">
      <EyebrowChip variant="gradient" tone="info">Now in Vietnam</EyebrowChip>
      <EyebrowChip variant="gradient" tone="success" live>Live</EyebrowChip>
    </div>
  );
}

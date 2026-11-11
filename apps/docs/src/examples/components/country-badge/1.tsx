import { CountryBadge } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CountryBadge code="JP" size="sm" />
      <CountryBadge code="JP" size="md" />
      <CountryBadge code="JP" size="lg" />
    </div>
  );
}

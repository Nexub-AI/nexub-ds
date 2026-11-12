'use client'; // docs preview: server pages import every example

import { CountryBadge } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <CountryBadge code="SG" label="Singapore" />
      <CountryBadge code="DE" label="Germany" />
      <CountryBadge code="BR" label="Brazil" />
    </div>
  );
}

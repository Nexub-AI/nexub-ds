'use client'; // docs preview: server pages import every example

import { Funnel } from '@nexub/react';

export default function Example() {
  return (
    <Funnel
      className="w-full"
      title="Signup funnel, October"
      data={[{ label: 'Visited', value: 12400 }, { label: 'Started signup', value: 4100 }, { label: 'Verified email', value: 2900 }, { label: 'First payment', value: 1240 }]}
    />
  );
}

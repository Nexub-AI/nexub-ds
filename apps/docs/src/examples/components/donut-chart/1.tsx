'use client'; // docs preview: server pages import every example

import { DonutChart } from '@nexub/react';

const plans = [
  { label: 'Enterprise', value: 42, href: '#enterprise' },
  { label: 'Team', value: 31, href: '#team' },
  { label: 'Starter', value: 15 },
  { label: 'Education', value: 6 },
  { label: 'Nonprofit', value: 4 },
  { label: 'Trial', value: 2 },
];

export default function Example() {
  return <DonutChart title="Plans" size="lg" legendValues maxSlices={4} data={plans} center="100" tableView />;
}

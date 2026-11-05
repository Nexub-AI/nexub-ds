import { LineChart } from '@nexub/react';

const data = [
  { week: 'W1', active: 820, trial: 310 },
  { week: 'W2', active: 870, trial: 290 },
  { week: 'W3', active: 905, trial: 340 },
  { week: 'W4', active: 960, trial: 330 },
  { week: 'W5', active: 1010, trial: 360 },
  { week: 'W6', active: 1080, trial: 355 },
];

export default function Example() {
  return (
    <LineChart
      className="w-full"
      title="Weekly users"
      data={data}
      index="week"
      series={[{ key: 'active', label: 'Active' }, { key: 'trial', label: 'Trial' }]}
    />
  );
}

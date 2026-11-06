import { Heatmap } from '@nexub/react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const data = days.map((_, d) => Array.from({ length: 16 }, (_, w) => ((d * 7 + w * 3) % 11) + (w > 10 ? 4 : 0)));

export default function Example() {
  return <Heatmap className="w-full" title="Payments sent per day, last 16 weeks" rowLabels={days} data={data} />;
}

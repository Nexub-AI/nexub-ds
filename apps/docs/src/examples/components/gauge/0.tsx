import { Gauge } from '@nexub/react';

export default function Example() {
  return <Gauge title="Storage used" value={68} max={100} label="68 GB" color={2} />;
}

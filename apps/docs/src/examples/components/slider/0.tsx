'use client'; // docs preview: server pages import every example

import { Slider } from '@nexub/react';

export default function Example() {
  return <div className="w-60"><Slider defaultValue={[50]} min={0} max={100} /></div>;
}

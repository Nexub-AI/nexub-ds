'use client'; // docs preview: server pages import every example

import { NumberInput } from '@nexub/react';

export default function Example() {
  return <div className="w-45"><NumberInput defaultValue={5} min={0} max={10} /></div>;
}

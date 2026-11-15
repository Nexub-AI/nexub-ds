'use client'; // docs preview: server pages import every example

import { Toggle } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Toggle variant="outline">Italic</Toggle>
      <Toggle variant="outline" defaultPressed>Bold</Toggle>
    </div>
  );
}

'use client'; // docs preview: server pages import every example

import { Badge } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Badge variant="solid" tone="success">Solid</Badge>
      <Badge variant="soft" tone="info">Soft</Badge>
      <Badge variant="outline" tone="warning">Outline</Badge>
    </div>
  );
}

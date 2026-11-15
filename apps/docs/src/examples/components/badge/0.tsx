'use client'; // docs preview: server pages import every example

import { Badge } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Badge tone="success">Active</Badge>
      <Badge tone="danger">Error</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="info">Info</Badge>
      <Badge tone="neutral">Draft</Badge>
    </div>
  );
}

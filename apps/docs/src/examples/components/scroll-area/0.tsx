'use client'; // docs preview: server pages import every example

import { ScrollArea } from '@nexub/react';

export default function Example() {
  return (
    <ScrollArea className="h-50 w-70 border border-outline-variant rounded-shape-field p-3">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="py-1 px-0 text-body-sm text-on-surface-variant">
          List item {i + 1}
        </div>
      ))}
    </ScrollArea>
  );
}

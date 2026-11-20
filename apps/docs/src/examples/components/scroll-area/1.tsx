'use client'; // docs preview: server pages import every example

import { ScrollArea } from '@nexub/react';

export default function Example() {
  return (
    <ScrollArea orientation="horizontal" className="w-80 border border-outline-variant rounded-shape-field p-3">
      <div className="flex gap-2 w-max">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="w-20 h-20 bg-surface-container-low rounded-shape-tooltip flex items-center justify-center text-label-sm text-on-surface-variant shrink-0"
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

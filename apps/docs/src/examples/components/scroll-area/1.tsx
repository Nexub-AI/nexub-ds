import { ScrollArea } from '@nexub/react';

export default function Example() {
  return (
    <ScrollArea orientation="horizontal" className="w-[320px] border border-[var(--color-outline-variant)] rounded-shape-field p-3">
      <div className="flex gap-2 w-max">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="w-[80px] h-[80px] bg-[var(--color-surface-container-low)] rounded-shape-tooltip flex items-center justify-center text-label-sm text-[var(--color-on-surface-variant)] shrink-0"
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

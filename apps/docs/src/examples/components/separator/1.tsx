import { Separator } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex h-[32px] items-center gap-4">
      <span className="text-[var(--color-on-surface-variant)] text-body-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-[var(--color-on-surface-variant)] text-body-sm">Right</span>
    </div>
  );
}

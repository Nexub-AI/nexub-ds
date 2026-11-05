import { NumberTicker } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex h-48 w-full flex-col overflow-y-auto">
      <p className="m-0 shrink-0 pb-64 text-body-md text-[var(--color-on-surface-variant)]">Scroll down</p>
      <NumberTicker value={2000} countOnView className="shrink-0 text-display-sm" />
    </div>
  );
}

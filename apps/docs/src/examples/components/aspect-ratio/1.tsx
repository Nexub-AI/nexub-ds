import { AspectRatio } from '@nexub/react';

const ratios = [
  { ratio: 1, label: '1 : 1' },
  { ratio: 4 / 3, label: '4 : 3' },
  { ratio: 3 / 4, label: '3 : 4' },
];

export default function Example() {
  return (
    <div className="grid w-full max-w-[480px] grid-cols-3 items-start gap-3">
      {ratios.map(({ ratio, label }) => (
        <AspectRatio key={label} ratio={ratio} className="rounded-shape-container">
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface-container-high)] text-label-md text-[var(--color-on-surface-variant)]">
            {label}
          </div>
        </AspectRatio>
      ))}
    </div>
  );
}

'use client'; // docs preview: server pages import every example

import { AspectRatio } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-[400px]">
      <AspectRatio ratio={16 / 9} className="rounded-shape-container">
        <div className="flex h-full w-full items-center justify-center bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] text-label-lg">
          16 : 9
        </div>
      </AspectRatio>
    </div>
  );
}

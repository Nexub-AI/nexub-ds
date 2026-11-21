'use client';

import * as React from 'react';
import { Sortable } from '@nexub/react';

type Photo = { name: string; hue: string };

export default function Example() {
  // No ids: objects get a stable key of their own.
  const [photos, setPhotos] = React.useState<Photo[]>([
    { name: 'Harbour', hue: 'bg-primary-container' },
    { name: 'Dunes', hue: 'bg-tertiary-container' },
    { name: 'Forest', hue: 'bg-secondary-container' },
    { name: 'Glacier', hue: 'bg-surface-container-high' },
    { name: 'Canyon', hue: 'bg-primary-container' },
    { name: 'Meadow', hue: 'bg-secondary-container' },
  ]);
  return (
    <Sortable aria-label="Gallery order" layout="grid" items={photos} getLabel={(p) => p.name} onReorder={setPhotos} className="w-full">
      {(p) => (
        <figure className="m-0 flex flex-col gap-2">
          <div className={`aspect-video rounded-shape-control ${p.hue}`} />
          <figcaption className="text-body-sm text-on-surface-variant">{p.name}</figcaption>
        </figure>
      )}
    </Sortable>
  );
}

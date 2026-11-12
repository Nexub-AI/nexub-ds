'use client';

import type * as React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@nexub/react';

function PreviewSkeleton() {
  return <Skeleton className="h-[120px] w-full rounded-shape-container" />;
}

// The mini cards on the index pages (MiniPreviewCard, a client component): each
// example (src/examples/<kind>/<slug>/<idx>.tsx) is its own chunk, server-rendered.
// Component and pattern pages use the server LivePreview instead (no Suspense swap).
// Cached so a re-render keeps the same component.
const cache = new Map<string, React.ComponentType>();

function example(key: string) {
  let Example = cache.get(key);
  if (!Example) {
    Example = dynamic(() => import(`../../examples/${key}.tsx`), { loading: PreviewSkeleton });
    cache.set(key, Example);
  }
  return Example;
}

export interface ComponentLivePreviewProps {
  slug: string;
  idx: number;
  isPattern?: boolean;
}

export function ComponentLivePreview({ slug, idx, isPattern = false }: ComponentLivePreviewProps) {
  const Example = example(`${isPattern ? 'patterns' : 'components'}/${slug}/${idx}`);
  return <Example />;
}

'use client';

import type * as React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@nexub/react';

function PreviewSkeleton() {
  return <Skeleton className="h-[120px] w-full rounded-shape-container" />;
}

// Each example (src/examples/<kind>/<slug>/<idx>.tsx) is its own chunk, loaded
// only when its preview mounts on the client. ssr:false: Radix and event
// handlers need the browser. Cached so a re-render keeps the same component.
const cache = new Map<string, React.ComponentType>();

function example(key: string) {
  let Example = cache.get(key);
  if (!Example) {
    Example = dynamic(() => import(`../../examples/${key}.tsx`), { ssr: false, loading: PreviewSkeleton });
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

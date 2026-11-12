import type * as React from 'react';

// 9.2: the example is resolved on the server before the page renders, so its HTML is in
// place in the first paint. next/dynamic wrapped it in Suspense, and the streamed segment
// could land after a paint of the placeholder (a layout shift). Examples are client
// modules ('use client'), so they still hydrate and stay interactive.
export async function LivePreview({ slug, idx, isPattern = false }: { slug: string; idx: number; isPattern?: boolean }) {
  const kind = isPattern ? 'patterns' : 'components';
  const { default: Example } = (await import(`../../examples/${kind}/${slug}/${idx}.tsx`)) as {
    default: React.ComponentType;
  };
  return <Example />;
}

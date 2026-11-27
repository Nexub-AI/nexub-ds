import * as React from 'react';

// 9.2: the example is resolved on the server before the page renders, so its HTML is in
// place in the first paint. next/dynamic wrapped it in Suspense, and the streamed segment
// could land after a paint of the placeholder (a layout shift). Examples are client
// modules ('use client'), so they still hydrate and stay interactive.
export async function LivePreview({
  slug,
  idx,
  isPattern = false,
}: {
  slug: string;
  idx: number;
  isPattern?: boolean;
}) {
  const kind = isPattern ? 'patterns' : 'components';
  const { default: Example } = (await import(`../../examples/${kind}/${slug}/${idx}.tsx`)) as {
    default: React.ComponentType;
  };
  // 12.1: its own hydration boundary, so React hydrates each example as a separate task and
  // yields between them, instead of one long task for the whole page (mobile Lighthouse TBT).
  // 12.2 (#815): an Activity, not a Suspense. The client module suspends while the server
  // renders, so a Suspense boundary was exported out of order: an empty placeholder in the
  // page, the example near the end of the file, and a script that swapped it in. When the
  // browser painted before the swap, everything below moved. An Activity hydrates the same
  // deferred way, but the server never streams it: its HTML stays in place.
  return (
    <React.Activity>
      <Example />
    </React.Activity>
  );
}

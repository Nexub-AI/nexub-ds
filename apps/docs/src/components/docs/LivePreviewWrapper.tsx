'use client';

import dynamic from 'next/dynamic';

function PreviewSkeleton() {
  return (
    <div
      style={{
        minHeight: '120px',
        borderRadius: 'var(--shape-container)',
        background: 'linear-gradient(90deg, var(--color-surface-container-low) 25%, var(--color-surface-container-high) 50%, var(--color-surface-container-low) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.4s ease infinite',
      }}
    />
  );
}

// Code-split the entire ComponentLivePreview (1965-line file, 88 component imports)
// so it is NEVER included in the initial page bundle. It loads only when the
// preview panel actually mounts on the client — not server-rendered, not blocking.
//
// This drops the per-page critical JS from ~6.6 MB to ~200 KB.
// ssr:false ensures the component only executes in the browser where Radix UI
// and event handlers are available.
export const ComponentLivePreview = dynamic(
  () =>
    import('./ComponentLivePreview').then((m) => m.ComponentLivePreview),
  { ssr: false, loading: PreviewSkeleton },
);

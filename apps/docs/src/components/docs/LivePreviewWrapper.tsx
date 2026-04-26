'use client';

import dynamic from 'next/dynamic';

function PreviewSkeleton() {
  return (
    <div
      style={{
        minHeight: '120px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(90deg, var(--color-bg-subtle) 25%, var(--color-bg-muted) 50%, var(--color-bg-subtle) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.4s ease infinite',
      }}
    />
  );
}

// dynamic with ssr:false must live in a Client Component (Next.js 15 rule)
export const ComponentLivePreview = dynamic(
  () =>
    import('./ComponentLivePreview').then((m) => m.ComponentLivePreview),
  { ssr: false, loading: PreviewSkeleton },
);

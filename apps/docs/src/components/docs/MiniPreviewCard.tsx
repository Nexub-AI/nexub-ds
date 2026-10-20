'use client';

import * as React from 'react';
import { ComponentLivePreview } from './LivePreviewWrapper';

interface MiniPreviewCardProps {
  slug: string;
}

class PreviewErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_error: unknown) {
    return { hasError: true };
  }
  override render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const PreviewFallback = () => (
  <div
    style={{
      width: '28px',
      height: '28px',
      borderRadius: 'var(--shape-field)',
      background: 'var(--color-surface-container-high)',
      border: '1px solid var(--color-outline-variant)',
    }}
  />
);

const PreviewSkeleton = () => (
  <div
    style={{
      width: '80px',
      height: '22px',
      borderRadius: 'var(--shape-field)',
      background: 'var(--color-outline-variant)',
      opacity: 0.5,
    }}
  />
);

export function MiniPreviewCard({ slug }: MiniPreviewCardProps) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        transform: 'scale(0.8)',
        transformOrigin: 'center center',
      }}
    >
      <PreviewErrorBoundary fallback={<PreviewFallback />}>
        <React.Suspense fallback={<PreviewSkeleton />}>
          <ComponentLivePreview slug={slug} idx={0} />
        </React.Suspense>
      </PreviewErrorBoundary>
    </div>
  );
}

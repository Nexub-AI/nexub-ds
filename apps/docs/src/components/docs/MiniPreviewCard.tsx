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
    className="w-[28px] h-[28px] rounded-shape-field bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]"
  />
);

const PreviewSkeleton = () => (
  <div
    className="w-[80px] h-[22px] rounded-shape-field bg-[var(--color-outline-variant)] opacity-50"
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

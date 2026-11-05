'use client';

import * as React from 'react';
import { Input, Skeleton } from '@nexub/react';
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

const PreviewSkeleton = () => <Skeleton shape="rect" className="h-[22px] w-[80px] rounded-shape-field" />;

// Static stand-ins for previews that can't mount in a grid. Combobox is cmdk,
// which calls scrollIntoView on its highlighted item at mount and scrolls the
// whole window to it (the /components page jumped to the Interactive section).
const staticPreviews: Record<string, React.ReactNode> = {
  combobox: <Input placeholder="Search…" className="w-[200px]" tabIndex={-1} readOnly />,
};

export function MiniPreviewCard({ slug }: MiniPreviewCardProps) {
  const staticPreview = staticPreviews[slug];
  if (staticPreview) {
    return (
      <div className="pointer-events-none relative flex h-full origin-center scale-[0.8] select-none items-center justify-center">
        {staticPreview}
      </div>
    );
  }
  return (
    <div className="pointer-events-none relative flex h-full origin-center scale-[0.8] select-none items-center justify-center">
      <PreviewErrorBoundary fallback={<PreviewFallback />}>
        <React.Suspense fallback={<PreviewSkeleton />}>
          <ComponentLivePreview slug={slug} idx={0} />
        </React.Suspense>
      </PreviewErrorBoundary>
    </div>
  );
}

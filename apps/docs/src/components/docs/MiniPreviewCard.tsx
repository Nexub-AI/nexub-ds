'use client';

import * as React from 'react';
import { Skeleton } from '@nexub/react';
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

const MAX_SCALE = 0.8;
// Below this a preview is unreadable; crop it from the top with a fade instead.
const MIN_SCALE = 0.45;
const PAD = 12;

/**
 * Scales its child down until it fits the thumbnail box, centred. Previews are
 * full-size examples (a button, a data table, a chart), so one fixed scale
 * either clips the big ones or shrinks the small ones to nothing.
 */
function FitToBox({ children }: { children: React.ReactNode }) {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [cropped, setCropped] = React.useState(false);

  React.useLayoutEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;
    const measure = () => {
      // offsetWidth/Height ignore the transform, so this is the natural size.
      // Width comes from the widest child: the wrapper's min-width is only
      // there so `w-full` previews (Heatmap) have something to fill.
      const w = Math.max(0, ...Array.from(inner.children, (c) => (c as HTMLElement).offsetWidth));
      const h = inner.offsetHeight;
      if (!w || !h) return;
      const ideal = Math.min(MAX_SCALE, (box.clientWidth - PAD * 2) / w, (box.clientHeight - PAD * 2) / h);
      // Set through the CSSOM, not a style prop: strict CSP (no inline styles).
      inner.style.transform = `scale(${Math.max(MIN_SCALE, ideal)})`;
      setCropped(ideal < MIN_SCALE);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      className={`pointer-events-none absolute inset-0 flex select-none justify-center overflow-hidden ${
        cropped ? 'items-start pt-3 [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]' : 'items-center'
      }`}
    >
      <div
        ref={innerRef}
        // scale-[0.8] until measured; measure() then sets the fitted scale.
        className={`flex w-max min-w-[280px] max-w-[360px] shrink-0 scale-[0.8] flex-col items-center ${cropped ? 'origin-top' : 'origin-center'}`}
      >
        {children}
      </div>
    </div>
  );
}

export function MiniPreviewCard({ slug }: MiniPreviewCardProps) {
  return (
    <FitToBox>
      <PreviewErrorBoundary fallback={<PreviewFallback />}>
        <React.Suspense fallback={<PreviewSkeleton />}>
          <ComponentLivePreview slug={slug} idx={0} />
        </React.Suspense>
      </PreviewErrorBoundary>
    </FitToBox>
  );
}

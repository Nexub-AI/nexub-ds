'use client';

import * as React from 'react';
import { SegmentedControl } from '@nexub/react';

const WIDTHS = { desktop: 1280, tablet: 820, phone: 390 } as const;
type Width = keyof typeof WIDTHS;

/**
 * A docs page rendered in an iframe at a real viewport width (so its
 * breakpoints respond), scaled to fit, following the docs theme and brand.
 */
export function BrowserFrame({ src, title, height = 720 }: { src: string; title: string; height?: number }) {
  const [width, setWidth] = React.useState<Width>('desktop');
  const box = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef<HTMLIFrameElement>(null);
  const [avail, setAvail] = React.useState(0);

  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setAvail(e?.contentRect.width ?? 0));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const post = React.useCallback(() => {
    const root = document.documentElement;
    frame.current?.contentWindow?.postMessage(
      { type: 'nexub-theme', scheme: root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', brand: root.getAttribute('data-product') ?? 'nexub' },
      window.location.origin,
    );
  }, []);
  React.useEffect(() => {
    const mo = new MutationObserver(post);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-product'] });
    return () => mo.disconnect();
  }, [post]);

  const w = WIDTHS[width];
  const scale = avail ? Math.min(1, avail / w) : 1;

  return (
    <div className="flex flex-col gap-3">
      <SegmentedControl.Root size="sm" aria-label="Viewport width" value={width} onValueChange={(v) => v && setWidth(v as Width)} className="self-start">
        <SegmentedControl.Item value="desktop">Desktop</SegmentedControl.Item>
        <SegmentedControl.Item value="tablet">Tablet</SegmentedControl.Item>
        <SegmentedControl.Item value="phone">Phone</SegmentedControl.Item>
      </SegmentedControl.Root>
      <div ref={box} className="w-full">
        <div
          className="mx-auto overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface)] shadow-elevation-2"
          style={{ width: w * scale, height: height * scale + 32 }}
        >
          <div className="flex h-8 items-center gap-1.5 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] px-3" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-outline-variant)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-outline-variant)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-outline-variant)]" />
          </div>
          <iframe
            ref={frame}
            src={src}
            title={`${title}: live preview at ${w}px`}
            loading="lazy"
            onLoad={post}
            className="origin-top-left border-0"
            style={{ width: w, height, transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </div>
  );
}

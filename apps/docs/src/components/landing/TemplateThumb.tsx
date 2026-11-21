'use client';

import * as React from 'react';
import { Skeleton } from '@nexub/react';

/**
 * A live, non-interactive preview of one page template (/frame/<slug>) in a fixed
 * 16:10 box. The iframe is only added once the box nears the viewport: `loading="lazy"`
 * alone starts loading well over a screen ahead, which would put every preview in the
 * landing page's first load. Visitors who asked for less data keep the placeholder.
 */
export function TemplateThumb({ slug, title }: { slug: string; title: string }) {
  const box = React.useRef<HTMLDivElement>(null);
  const [load, setLoad] = React.useState(false);

  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || window.matchMedia('(prefers-reduced-data: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setLoad(true);
        io.disconnect();
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="docs-template-thumb">
      <Skeleton shape="rect" animated={false} className="absolute inset-0 h-full rounded-none" />
      {load && (
        // Decoration for the card's link: never focusable, never clickable.
        <iframe src={`/frame/${slug}`} title={`${title} template preview`} loading="lazy" tabIndex={-1} inert />
      )}
    </div>
  );
}

'use client';

import * as React from 'react';

export interface TocItem {
  id: string;
  label: string;
  level: 2 | 3;
}

/** The section headings on the page right now (visible h2/h3 with an id inside the content). */
export function readHeadings(): TocItem[] {
  return Array.from(document.querySelectorAll<HTMLElement>('#main-content :is(h2, h3)[id]'))
    // Hidden platform panels and headings inside live previews are not sections of the page.
    .filter((h) => h.getClientRects().length > 0 && !h.closest('[data-live-preview], .docs-preview-pane'))
    .map((h) => ({ id: h.id, label: h.textContent?.trim() ?? h.id, level: h.tagName === 'H3' ? 3 : 2 }));
}

/** The id of the heading the reader is at: the most visible one under the header. */
export function useActiveHeading(items: TocItem[]): string {
  const [active, setActive] = React.useState('');

  React.useEffect(() => {
    if (!items.length) return;
    const seen = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.intersectionRatio));
        let best: { id: string; ratio: number } | null = null;
        seen.forEach((ratio, id) => {
          if (ratio > 0 && (!best || ratio > best.ratio)) best = { id, ratio };
        });
        if (best) setActive((best as { id: string; ratio: number }).id);
      },
      { rootMargin: '-72px 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return active;
}

/** Shared by the desktop rail and the phone sheet, so both lists read the same. */
export const tocLinkClass = (level: 2 | 3, active: boolean) =>
  'block border-s-2 py-1 pe-2 text-label-md leading-normal no-underline transition-colors duration-effects-fast ease-effects-fast ' +
  (level === 3 ? 'ps-5 ' : 'ps-2 ') +
  (active
    ? 'border-[var(--color-primary)] font-semibold text-[var(--color-on-surface)]'
    : 'border-transparent text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)]');

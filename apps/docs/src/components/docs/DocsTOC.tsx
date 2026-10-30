'use client';

import * as React from 'react';
import { Text } from '@nexub/react';

export interface TocItem {
  id: string;
  label: string;
  level: 2 | 3;
}

interface Props {
  items: TocItem[];
}

export function DocsTOC({ items }: Props) {
  const [active, setActive] = React.useState<string>('');

  React.useEffect(() => {
    if (!items.length) return;
    const seen = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          seen.set(e.target.id, e.intersectionRatio);
        });
        // Pick the heading with the highest visible ratio.
        let best: { id: string; ratio: number } | null = null;
        seen.forEach((ratio, id) => {
          if (ratio > 0 && (!best || ratio > best.ratio)) {
            best = { id, ratio };
          }
        });
        if (best) setActive((best as { id: string; ratio: number }).id);
      },
      { rootMargin: '-72px 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav className="docs-toc" aria-label="On this page">
      <Text size="label" weight="semibold" tone="muted" className="mb-2 uppercase tracking-wider">
        On this page
      </Text>
      <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={
                  'block border-s-2 py-1 pe-2 text-label-md leading-normal no-underline transition-colors duration-effects-fast ease-effects-fast ' +
                  (it.level === 3 ? 'ps-5 ' : 'ps-2 ') +
                  (isActive
                    ? 'border-[var(--color-primary)] font-semibold text-[var(--color-on-surface)]'
                    : 'border-transparent text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)]')
                }
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

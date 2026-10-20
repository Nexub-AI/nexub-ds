'use client';

import * as React from 'react';

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
      <p
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--color-outline)',
          margin: '0 0 0.5rem',
        }}
      >
        On this page
      </p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                style={{
                  display: 'block',
                  padding: '4px 8px',
                  paddingLeft: it.level === 3 ? '1.25rem' : '0.5rem',
                  borderLeft: '2px solid',
                  borderColor: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? 'var(--color-on-surface)' : 'var(--color-on-surface-muted)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.78rem',
                  lineHeight: 1.5,
                  textDecoration: 'none',
                  transition: 'color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)',
                }}
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

import * as React from 'react';
import Link from 'next/link';
import { getComponentEntry } from '@/registry/index';

interface Props {
  slugs: string[];
}

export function RelatedComponents({ slugs }: Props) {
  const items = slugs
    .map((slug) => getComponentEntry(slug))
    .filter((e): e is NonNullable<ReturnType<typeof getComponentEntry>> => Boolean(e));

  if (!items.length) return null;

  return (
    <div className="docs-related-grid">
      {items.map((e) => (
        <Link
          key={e.meta.slug}
          href={`/components/${e.meta.slug}`}
          className="docs-related-card"
          style={{
            display: 'block',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-default)',
            background: 'var(--color-bg-default)',
            color: 'inherit',
            textDecoration: 'none',
            transition: 'border-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{e.meta.title}</span>
            <span
              style={{
                fontSize: '0.65rem',
                color: 'var(--color-text-subtle)',
                fontFamily: 'var(--font-family-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {e.meta.category}
            </span>
          </div>
          <p
            style={{
              margin: '0.25rem 0 0',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.5,
            }}
          >
            {e.meta.description}
          </p>
        </Link>
      ))}
    </div>
  );
}

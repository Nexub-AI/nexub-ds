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
            borderRadius: 'var(--shape-container)',
            border: '1px solid var(--color-outline-variant)',
            background: 'var(--color-surface)',
            color: 'inherit',
            textDecoration: 'none',
            transition: 'border-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)',
          }}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-semibold text-[var(--color-on-surface)]">{e.meta.title}</span>
            <span
              className="text-[0.65rem] text-[var(--color-outline)] font-mono uppercase tracking-wide"
            >
              {e.meta.category}
            </span>
          </div>
          <p
            style={{
              margin: '0.25rem 0 0',
              fontSize: '0.8rem',
              color: 'var(--color-on-surface-muted)',
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

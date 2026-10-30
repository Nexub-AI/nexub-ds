import * as React from 'react';
import { Card, CardLink, Text } from '@nexub/react';
import { DocsLink } from '@/components/layout/DocsLink';
import { getComponentEntry } from '@/registry/index';

export function RelatedComponents({ slugs }: { slugs: string[] }) {
  const items = slugs
    .map((slug) => getComponentEntry(slug))
    .filter((e): e is NonNullable<ReturnType<typeof getComponentEntry>> => Boolean(e));

  if (!items.length) return null;

  return (
    <div className="docs-related-grid">
      {items.map((e) => (
        <Card key={e.meta.slug} variant="interactive" className="flex flex-col gap-1 px-4 py-3.5">
          <div className="flex items-baseline justify-between gap-2">
            <CardLink asChild>
              <DocsLink href={`/components/${e.meta.slug}`} className="font-semibold text-[var(--color-on-surface)] no-underline">
                {e.meta.title}
              </DocsLink>
            </CardLink>
            <Text size="caption" tone="muted" className="shrink-0 uppercase tracking-wide">
              {e.meta.category}
            </Text>
          </div>
          <Text size="body-sm" tone="muted">
            {e.meta.description}
          </Text>
        </Card>
      ))}
    </div>
  );
}

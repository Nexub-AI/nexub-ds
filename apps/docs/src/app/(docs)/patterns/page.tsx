import type { Metadata } from 'next';
import { Card, CardLink, Text } from '@nexub/react';
import { DocsLink } from '@/components/layout/DocsLink';
import { patternEntries } from '@/registry/index';
import { CardGrid, PageIntro, Section } from '@/components/kit';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Patterns' };

const categories = Array.from(new Set(patternEntries.map((e) => e.meta.category)));
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function PatternsPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Library"
        title="Patterns"
        lead={
          <>
            Patterns are higher-level, brand-agnostic composites built from <code>@nexub/react</code> primitives. They
            solve common SaaS UI problems (auth flows, stat dashboards, settings pages) out of the box. Available from{' '}
            <code>@nexub/patterns</code>; full mobile screens live in <code>@nexub/react-native/patterns</code>.
          </>
        }
      />

      {categories.map((cat) => {
        const entries = patternEntries.filter((e) => e.meta.category === cat);
        return (
          <Section key={cat} id={slugify(cat)} title={cat}>
            <CardGrid min={220}>
              {entries.map((e) => (
                <Card key={e.meta.slug} variant="interactive" className="flex flex-col gap-1.5 px-5 py-4">
                  <CardLink asChild>
                    <DocsLink href={`/patterns/${e.meta.slug}`} className="text-title-sm font-semibold text-[var(--color-on-surface)] no-underline">
                      {e.meta.title}
                    </DocsLink>
                  </CardLink>
                  <Text size="caption" tone="muted">
                    {e.meta.description}
                  </Text>
                </Card>
              ))}
            </CardGrid>
          </Section>
        );
      })}
    </div>
  );
}

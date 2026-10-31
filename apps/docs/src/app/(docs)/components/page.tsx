import type { Metadata } from 'next';
import { Card, CardLink, Text } from '@nexub/react';
import { DocsLink } from '@/components/layout/DocsLink';
import { componentEntries } from '@/registry/index';
import { MiniPreviewCard } from '@/components/docs/MiniPreviewCard';
import { StatusBadge } from '@/components/docs/StatusBadge';
import { CardGrid, PageIntro, Section } from '@/components/kit';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Components' };

const categories = Array.from(new Set(componentEntries.map((e) => e.meta.category)));
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function ComponentsPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Library"
        title="Components"
        lead={
          <>
            {componentEntries.length}+ accessible, token-driven React components built on Radix UI primitives, fully
            typed and themeable. Most have a React Native twin in <code>@nexub/react-native</code> with the same name and
            props.
          </>
        }
      />

      {categories.map((cat) => {
        const entries = componentEntries.filter((e) => e.meta.category === cat);
        return (
          <Section key={cat} id={slugify(cat)} title={cat}>
            <CardGrid min={200}>
              {entries.map((e) => (
                <Card key={e.meta.slug} variant="interactive" className="flex h-full flex-col overflow-hidden p-0">
                  {/* Live preview: decorative, never interactive inside the link card. */}
                  <div
                    aria-hidden="true"
                    className="docs-dot-grid pointer-events-none relative flex h-[100px] items-center justify-center overflow-hidden border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]"
                  >
                    <MiniPreviewCard slug={e.meta.slug} />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 px-3.5 py-3">
                    <CardLink asChild>
                      <DocsLink href={`/components/${e.meta.slug}`} className="text-title-sm font-semibold text-[var(--color-on-surface)] no-underline">
                        {e.meta.title}
                      </DocsLink>
                    </CardLink>
                    <Text size="caption" tone="muted" lineClamp={2}>
                      {e.meta.description}
                    </Text>
                    {e.meta.status && e.meta.status !== 'stable' && (
                      <StatusBadge status={e.meta.status} size="sm" className="mt-1 self-start" />
                    )}
                  </div>
                </Card>
              ))}
            </CardGrid>
          </Section>
        );
      })}
    </div>
  );
}

import { Badge, Card, CardLink, Container, EyebrowChip, Grid, Heading, Section, Text } from '@nexub/react';
import { templateEntries, type TemplateEntry } from '@/registry/templates';
import { DocsLink } from '@/components/layout/DocsLink';
import { TemplateThumb } from './TemplateThumb';

// Live previews for these; the rest are text cards (each preview is a page load).
const FEATURED: TemplateEntry['slug'][] = ['dashboard', 'sign-up', 'table-page', 'booking', 'invoice', 'notifications'];

const featured = FEATURED.flatMap((slug) => templateEntries.filter((t) => t.slug === slug));
const others = templateEntries.filter((t) => !FEATURED.includes(t.slug));

function Platforms({ t }: { t: TemplateEntry }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      <Badge variant="soft" size="sm">Web</Badge>
      {t.native && <Badge variant="soft" size="sm" tone="info">iOS &amp; Android</Badge>}
    </span>
  );
}

function TemplateCard({ t, preview }: { t: TemplateEntry; preview?: boolean }) {
  return (
    <Card variant="interactive" className="flex flex-col overflow-hidden text-start">
      {preview && <TemplateThumb slug={t.slug} title={t.title} />}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <Heading level={3} size="h6">
          <CardLink asChild>
            <DocsLink href={`/patterns/pages/${t.slug}`}>{t.title}</DocsLink>
          </CardLink>
        </Heading>
        <Text size="body-sm" tone="muted" lineClamp={2} className="flex-1">
          {t.description}
        </Text>
        <Platforms t={t} />
      </div>
    </Card>
  );
}

/** The page templates in @nexub/patterns: a few shown live, all of them linked. */
export function LandingTemplates() {
  return (
    <Section paddingY="md" className="border-b border-[var(--color-outline-variant)]">
      <Container size="lg" className="text-center">
        <EyebrowChip tone="info" className="mb-3">
          Templates
        </EyebrowChip>
        <Heading level={2} size="h2" className="mb-3">
          {templateEntries.length} page templates
        </Heading>
        <Text size="body-lg" tone="secondary" className="mx-auto mb-12 max-w-[60ch]">
          Whole pages from <code>@nexub/patterns</code>, built from the same components and tokens. Pass your data, keep the layout.
        </Text>
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" gap="20px">
          {featured.map((t) => (
            <TemplateCard key={t.slug} t={t} preview />
          ))}
        </Grid>
        <Grid className="mt-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" gap="20px">
          {others.map((t) => (
            <TemplateCard key={t.slug} t={t} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

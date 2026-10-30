import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge, Card, CardLink, Text } from '@nexub/react';
import { CardGrid, PageIntro, Section } from '@/components/kit';
import { templateEntries } from '@/registry/templates';

export const dynamic = 'force-static';
export const metadata: Metadata = { title: 'Examples', description: 'Web and mobile dashboards and full-page references.' };

export default function ExamplesPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Examples"
        title="Examples"
        lead="Whole screens built only from public Nexub exports, on the web and on phones. Use them as references for layout, density and behaviour."
      />

      <Section id="dashboards" title="Dashboards" className="!mt-0">
        <CardGrid min={300}>
          <ExampleCard href="/examples/dashboard" title="Web dashboard" badge="@nexub/react" body="AppHeader, NavigationRail, StatCards, a chart, a DataTable, a plan picker and an assistant panel." />
          <ExampleCard href="/examples/mobile" title="Mobile dashboard" badge="@nexub/react-native" body="HomeScreen: balance, quick actions, activity and insights, live in a phone frame." />
        </CardGrid>
      </Section>

      <Section id="pages" title="Page references" description="Each page template, live on the web and as its native screen.">
        <CardGrid min={240}>
          {templateEntries.map((t) => (
            <ExampleCard key={t.slug} href={`/patterns/pages/${t.slug}`} title={t.title} badge={`${t.web} · ${t.native.name.split(' ')[0]}`} body={t.description} />
          ))}
        </CardGrid>
      </Section>
    </div>
  );
}

function ExampleCard({ href, title, badge, body }: { href: string; title: string; badge: string; body: string }) {
  return (
    <Card variant="interactive" className="flex flex-col gap-2 p-5">
      <Badge variant="soft" tone="info" className="self-start">{badge}</Badge>
      <CardLink asChild>
        <Link href={href} className="text-title-md text-[var(--color-on-surface)] no-underline">{title}</Link>
      </CardLink>
      <Text size="body-sm" tone="secondary">{body}</Text>
    </Card>
  );
}

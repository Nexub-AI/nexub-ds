import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge } from '@nexub/react';
import { templateEntries, getTemplateEntry } from '@/registry/templates';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PageIntro, Section } from '@/components/kit';
import { PlatformPanel, PlatformSwitch } from '@/components/platform/PlatformTabs';
import { MobilePanel } from '@/components/platform/MobilePanel';
import { BrowserFrame } from '@/components/platform/BrowserFrame';

export const dynamic = 'force-static';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return templateEntries.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplateEntry(slug);
  return { title: t ? `${t.title} page` : 'Page template', description: t?.description };
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;
  const t = getTemplateEntry(slug);
  if (!t) notFound();

  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Patterns · Pages"
        title={t.title}
        lead={t.description}
        badges={
          <>
            <Badge tone="info" variant="soft">{t.web}</Badge>
            <Badge variant="outline">{t.native.name}</Badge>
          </>
        }
      >
        <PlatformSwitch />
      </PageIntro>

      <PlatformPanel platform="web">
        <Section id="preview" title="Web" description="Live, at a real viewport width. Switch to Phone to see the responsive layout.">
          <BrowserFrame src={`/frame/${t.slug}`} title={t.title} />
        </Section>
        <Section id="usage" title="Usage">
          <CodeBlock lang="tsx" code={`import { ${t.web} } from '@nexub/patterns';\n\n${t.code}`} />
        </Section>
      </PlatformPanel>

      <PlatformPanel platform="mobile">
        <Section id="mobile-heading" title={`On iOS & Android: ${t.native.name}`}>
          <MobilePanel
            name={t.native.name}
            title={t.title}
            preview={`preview/${t.native.preview}`}
            code={t.native.code}
            differences={t.native.differences}
            pkg="@nexub/react-native/patterns"
          />
        </Section>
      </PlatformPanel>
    </div>
  );
}

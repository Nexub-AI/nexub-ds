import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge } from '@nexub/react';
import { patternEntries, getPatternEntry } from '@/registry/index';
import { nativePatternTwins } from '@/registry/native';
import { ComponentPreview } from '@/components/docs/ComponentPreview';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/PropsTable';
import { LivePreview } from '@/components/docs/LivePreview';
import { UsageGrid } from '@/components/docs/UsageGrid';
import { CopyButton } from '@/components/docs/CopyButton';
import { MarkdownActions } from '@/components/docs/MarkdownActions';
import { PageIntro, Section } from '@/components/kit';
import { PlatformPanel, PlatformSwitch } from '@/components/platform/PlatformTabs';
import { MobilePanel, NoMobileTwin } from '@/components/platform/MobilePanel';
import { exampleCode } from '@/examples/code';
import { join } from 'node:path';

const EXAMPLES_DIR = join(process.cwd(), 'src/examples');

// Pre-render every pattern page at build time — same strategy as component pages.
export const dynamic = 'force-static';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return patternEntries.map((e) => ({ slug: e.meta.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getPatternEntry(slug);
  return { title: entry?.meta.title ?? 'Pattern', description: entry?.meta.description };
}

export default async function PatternPage({ params }: Props) {
  const { slug } = await params;
  const entry = getPatternEntry(slug);
  if (!entry) notFound();

  const { meta, props, examples, usage } = entry;
  const twin = nativePatternTwins[slug];
  const importLine = `import { ${meta.title.replace(/\s+/g, '')} } from '${meta.package}';`;

  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow={`Patterns · ${meta.category}`}
        title={meta.title}
        lead={meta.description}
        badges={meta.addedIn && <Badge variant="outline">Since v{meta.addedIn}</Badge>}
      >
        <div className="docs-code-strip">
          <code className="truncate">{importLine}</code>
          <CopyButton text={importLine} />
        </div>
        <MarkdownActions href={`/patterns/${slug}.md`} />
        <PlatformSwitch available={twin ? ['web', 'mobile'] : ['web']} />
      </PageIntro>

      {usage && (
        <Section id="usage" title="Usage">
          <UsageGrid usage={usage} />
        </Section>
      )}

      <PlatformPanel platform="web">
        <Section id="examples" title="Examples">
          {examples.map((ex, i) => (
            <Section key={ex.title} title={ex.title} description={ex.description} level={3}>
              <ComponentPreview code={exampleCode(EXAMPLES_DIR, 'patterns', slug, i)} codeSlot={<CodeBlock code={exampleCode(EXAMPLES_DIR, 'patterns', slug, i)} />} minHeight="180px">
                <LivePreview slug={slug} idx={i} isPattern />
              </ComponentPreview>
            </Section>
          ))}
        </Section>

        {props.length > 0 && (
          <Section id="props" title="Props">
            <PropsTable props={props} />
          </Section>
        )}
      </PlatformPanel>

      {twin ? (
        <PlatformPanel platform="mobile">
          <Section id="mobile-heading" title={`On iOS & Android: ${twin.name}`}>
            <MobilePanel
              name={twin.name}
              title={meta.title}
              preview={`preview/${twin.preview}`}
              code={twin.code}
              differences={twin.differences}
              status={twin.status}
              pkg="@nexub/react-native/patterns"
            />
          </Section>
        </PlatformPanel>
      ) : (
        <Section id="mobile" title="On iOS & Android">
          <NoMobileTwin title={meta.title} />
        </Section>
      )}
    </div>
  );
}

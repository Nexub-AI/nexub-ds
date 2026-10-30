import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge } from '@nexub/react';
import { patternEntries, getPatternEntry } from '@/registry/index';
import { nativePatternTwins } from '@/registry/native';
import { ComponentPreview } from '@/components/docs/ComponentPreview';
import { PropsTable } from '@/components/docs/PropsTable';
import { ComponentLivePreview } from '@/components/docs/LivePreviewWrapper';
import { UsageGrid } from '@/components/docs/UsageGrid';
import { CopyButton } from '@/components/docs/CopyButton';
import { PageIntro, Section } from '@/components/kit';
import { PlatformPanel, PlatformSwitch } from '@/components/platform/PlatformTabs';
import { MobilePanel, NoMobileTwin } from '@/components/platform/MobilePanel';

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
  const importLine = `import { ${meta.title.replace(/\s+/g, '')} } from '@nexub/patterns';`;

  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow={`Patterns · ${meta.category}`}
        title={meta.title}
        lead={meta.description}
        badges={meta.addedIn && <Badge variant="outline">Since v{meta.addedIn}</Badge>}
      >
        <div className="docs-snippet inline-flex max-w-full items-center gap-2 self-start rounded-shape-field bg-[var(--docs-snippet-bg)] py-1.5 pe-2 ps-3 font-mono text-body-sm text-[var(--docs-snippet-fg)]">
          <code className="truncate">{importLine}</code>
          <CopyButton text={importLine} />
        </div>
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
              <ComponentPreview code={ex.code} minHeight="180px">
                <ComponentLivePreview slug={slug} idx={i} isPattern />
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

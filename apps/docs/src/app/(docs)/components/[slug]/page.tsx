import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { componentEntries, getComponentEntry } from '@/registry/index';
import { nativeTwins } from '@/registry/native';
import { ComponentPreview } from '@/components/docs/ComponentPreview';
import { PropsTable } from '@/components/docs/PropsTable';
import { ComponentLivePreview } from '@/components/docs/LivePreviewWrapper';
import { ComponentHero } from '@/components/docs/ComponentHero';
import { UsageGrid } from '@/components/docs/UsageGrid';
import { Playground } from '@/components/docs/Playground';
import { VariantMatrix } from '@/components/docs/VariantMatrix';
import { A11yPanel } from '@/components/docs/A11yPanel';
import { DocsTOC, type TocItem } from '@/components/docs/DocsTOC';
import { RelatedComponents } from '@/components/docs/RelatedComponents';
import { Section } from '@/components/kit';
import { PlatformPanel, PlatformSwitch } from '@/components/platform/PlatformTabs';
import { MobilePanel, NoMobileTwin } from '@/components/platform/MobilePanel';

// All component pages are fully static — pre-render every slug at build time
// and serve from CDN. No per-request server work after the initial build.
export const dynamic = 'force-static';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return componentEntries.map((e) => ({ slug: e.meta.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getComponentEntry(slug);
  return { title: entry?.meta.title ?? 'Component', description: entry?.meta.description };
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params;
  const entry = getComponentEntry(slug);
  if (!entry) notFound();

  const { meta, props, examples, usage, playground, matrix, a11y } = entry;
  const twin = nativeTwins[slug];

  // Build TOC from the sections actually rendered on this page.
  // Import is intentionally not in the TOC — the hero copy-import strip
  // already exposes it right under the title.
  const toc: TocItem[] = [];
  if (usage) toc.push({ id: 'usage', label: 'Usage', level: 2 });
  if (playground) toc.push({ id: 'playground', label: 'Playground', level: 2 });
  if (examples.length) {
    toc.push({ id: 'examples', label: 'Examples', level: 2 });
    examples.forEach((ex, i) => toc.push({ id: exampleId(ex.title, i), label: ex.title, level: 3 }));
  }
  if (matrix) toc.push({ id: 'matrix', label: 'Variant matrix', level: 2 });
  if (props.length) toc.push({ id: 'props', label: 'Props', level: 2 });
  if (a11y) toc.push({ id: 'accessibility', label: 'Accessibility', level: 2 });
  toc.push({ id: 'mobile', label: twin ? `Mobile: ${twin.name}` : 'Mobile', level: 2 });
  if (meta.related?.length) toc.push({ id: 'related', label: 'Related', level: 2 });

  return (
    <div className="docs-layout-with-toc">
      <div className="docs-prose">
        <ComponentHero entry={entry}>
          <PlatformSwitch available={twin ? ['web', 'mobile'] : ['web']} />
        </ComponentHero>

        {usage && (
          <Section id="usage" title="Usage">
            <UsageGrid usage={usage} />
          </Section>
        )}

        <PlatformPanel platform="web">
          {playground && (
            <Section id="playground" title="Playground">
              <Playground slug={slug} componentName={meta.title} def={playground} />
            </Section>
          )}

          {examples.length > 0 && (
            <Section id="examples" title="Examples">
              {examples.map((ex, i) => {
                const a11ySlot = a11y && i === 0 ? <A11yPanel a11y={a11y} /> : undefined;
                return (
                  <Section key={ex.title} id={exampleId(ex.title, i)} title={ex.title} description={ex.description} level={3}>
                    <ComponentPreview code={ex.code} a11ySlot={a11ySlot}>
                      <ComponentLivePreview slug={slug} idx={i} />
                    </ComponentPreview>
                  </Section>
                );
              })}
            </Section>
          )}

          {matrix && (
            <Section id="matrix" title="Variant matrix">
              <VariantMatrix slug={slug} def={matrix} />
            </Section>
          )}

          {props.length > 0 && (
            <Section id="props" title="Props">
              <PropsTable props={props} />
            </Section>
          )}

          {a11y && (
            <Section id="accessibility" title="Accessibility">
              <A11yPanel a11y={a11y} />
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
              />
            </Section>
          </PlatformPanel>
        ) : (
          <Section id="mobile" title="On iOS & Android">
            <NoMobileTwin title={meta.title} />
          </Section>
        )}

        {meta.related?.length ? (
          <Section id="related" title="Related components">
            <RelatedComponents slugs={meta.related} />
          </Section>
        ) : null}
      </div>

      <DocsTOC items={toc} />
    </div>
  );
}

function exampleId(title: string, idx: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `example-${slug || idx}`;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { componentEntries, getComponentEntry } from '@/registry/index';
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
  return { title: entry?.meta.title ?? 'Component' };
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params;
  const entry = getComponentEntry(slug);
  if (!entry) notFound();

  const { meta, props, examples, usage, playground, matrix, a11y } = entry;

  // Build TOC from the sections actually rendered on this page.
  // Import is intentionally not in the TOC — the hero copy-import strip
  // already exposes it right under the title.
  const toc: TocItem[] = [];
  if (usage) toc.push({ id: 'usage', label: 'Usage', level: 2 });
  if (playground) toc.push({ id: 'playground', label: 'Playground', level: 2 });
  if (examples.length) {
    toc.push({ id: 'examples', label: 'Examples', level: 2 });
    examples.forEach((ex, i) =>
      toc.push({ id: exampleId(ex.title, i), label: ex.title, level: 3 })
    );
  }
  if (matrix) toc.push({ id: 'matrix', label: 'Variant matrix', level: 2 });
  if (props.length) toc.push({ id: 'props', label: 'Props', level: 2 });
  if (a11y) toc.push({ id: 'accessibility', label: 'Accessibility', level: 2 });
  if (meta.related?.length) toc.push({ id: 'related', label: 'Related', level: 2 });

  return (
    <div className="docs-layout-with-toc">
      <div className="docs-prose">
        <ComponentHero entry={entry} />

        {usage && (
          <section data-reveal>
            <h2 id="usage">Usage</h2>
            <UsageGrid usage={usage} />
          </section>
        )}

        {playground && (
          <section data-reveal>
            <h2 id="playground">Playground</h2>
            <Playground slug={slug} componentName={meta.title} def={playground} />
          </section>
        )}

        {examples.length > 0 && (
          <section data-reveal>
            <h2 id="examples">Examples</h2>
            {examples.map((ex, i) => {
              const a11ySlot = a11y && i === 0 ? <A11yPanel a11y={a11y} /> : undefined;
              return (
                <div key={ex.title} style={{ marginBottom: '2rem' }}>
                  <h3 id={exampleId(ex.title, i)}>{ex.title}</h3>
                  {ex.description && <p>{ex.description}</p>}
                  <ComponentPreview code={ex.code} a11ySlot={a11ySlot}>
                    <ComponentLivePreview slug={slug} idx={i} />
                  </ComponentPreview>
                </div>
              );
            })}
          </section>
        )}

        {matrix && (
          <section data-reveal>
            <h2 id="matrix">Variant matrix</h2>
            <VariantMatrix slug={slug} def={matrix} />
          </section>
        )}

        {props.length > 0 && (
          <section data-reveal>
            <h2 id="props">Props</h2>
            <PropsTable props={props} />
          </section>
        )}

        {a11y && (
          <section data-reveal>
            <h2 id="accessibility">Accessibility</h2>
            <A11yPanel a11y={a11y} />
          </section>
        )}

        {meta.related?.length ? (
          <section data-reveal>
            <h2 id="related">Related components</h2>
            <RelatedComponents slugs={meta.related} />
          </section>
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


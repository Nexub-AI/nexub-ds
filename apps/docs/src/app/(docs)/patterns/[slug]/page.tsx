import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { patternEntries, getPatternEntry } from '@/registry/index';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentPreview } from '@/components/docs/ComponentPreview';
import { PropsTable } from '@/components/docs/PropsTable';
import { ComponentLivePreview } from '@/components/docs/LivePreviewWrapper';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return patternEntries.map((e) => ({ slug: e.meta.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getPatternEntry(slug);
  return { title: entry?.meta.title ?? 'Pattern' };
}

export default async function PatternPage({ params }: Props) {
  const { slug } = await params;
  const entry = getPatternEntry(slug);
  if (!entry) notFound();

  const { meta, props, examples } = entry;

  return (
    <div className="docs-prose">
      <p
        style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--color-brand-primary-500)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
        }}
      >
        Patterns · {meta.category}
      </p>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '0.75rem' }}>
        <h1 style={{ margin: 0 }}>{meta.title}</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '6px', flexShrink: 0 }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-semantic-info-bg)',
              color: 'var(--color-semantic-info-default)',
              fontSize: '0.7rem',
              fontWeight: 600,
              border: '1px solid var(--color-semantic-info-border)',
              fontFamily: 'var(--font-family-mono)',
            }}
          >
            @nexub/patterns
          </span>
        </div>
      </div>
      <p>{meta.description}</p>

      <h2>Import</h2>
      {/* @ts-ignore */}
      <CodeBlock code={`import { ${meta.title} } from '@nexub/patterns';`} />

      <h2>Examples</h2>
      {examples.map((ex, i) => (
        <div key={ex.title} style={{ marginBottom: '2rem' }}>
          <h3>{ex.title}</h3>
          {ex.description && <p>{ex.description}</p>}
          <ComponentPreview
            code={ex.code}
            minHeight="180px"
            /* @ts-ignore — async RSC passed via composition pattern */
            codeSlot={<CodeBlock code={ex.code} />}
          >
            <ComponentLivePreview slug={slug} idx={i} isPattern />
          </ComponentPreview>
        </div>
      ))}

      {props.length > 0 && (
        <>
          <h2>Props</h2>
          <PropsTable props={props} />
        </>
      )}
    </div>
  );
}

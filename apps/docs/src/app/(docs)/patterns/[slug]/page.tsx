import type { Metadata } from 'next';
import { Suspense } from 'react'; // kept for Import CodeBlock Suspense
import { notFound } from 'next/navigation';
import { patternEntries, getPatternEntry } from '@/registry/index';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentPreview } from '@/components/docs/ComponentPreview';
import { PropsTable } from '@/components/docs/PropsTable';
import { ComponentLivePreview } from '@/components/docs/LivePreviewWrapper';

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
  return { title: entry?.meta.title ?? 'Pattern' };
}

export default async function PatternPage({ params }: Props) {
  const { slug } = await params;
  const entry = getPatternEntry(slug);
  if (!entry) notFound();

  const { meta, props, examples, usage } = entry;

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

      <div className="docs-page-header">
        <h1 style={{ margin: 0 }}>{meta.title}</h1>
        <div className="docs-page-header-badges">
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
          {meta.addedIn && (
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-bg-muted)',
                color: 'var(--color-text-muted)',
                fontSize: '0.7rem',
                fontWeight: 600,
                border: '1px solid var(--color-border-default)',
                fontFamily: 'var(--font-family-mono)',
              }}
            >
              Added in v{meta.addedIn}
            </span>
          )}
        </div>
      </div>
      <p>{meta.description}</p>

      {usage && (
        <div className="docs-usage-grid">
          <div className="docs-usage-col docs-usage-do">
            <h4>✅ When to use</h4>
            <ul>
              {usage.whenToUse.map((u) => <li key={u}>{u}</li>)}
            </ul>
          </div>
          <div className="docs-usage-col docs-usage-dont">
            <h4>❌ When not to use</h4>
            <ul>
              {usage.whenNotToUse.map((u) => <li key={u}>{u}</li>)}
            </ul>
          </div>
        </div>
      )}

      <h2>Import</h2>
      <Suspense fallback={<CodeBlockSkeleton />}>
        <CodeBlock code={`import { ${meta.title} } from '@nexub/patterns';`} />
      </Suspense>

      {/* No codeSlot on examples — keeps Shiki out of the navigation render path.
          See components/[slug]/page.tsx for the rationale. */}
      <h2>Examples</h2>
      {examples.map((ex, i) => (
        <div key={ex.title} style={{ marginBottom: '2rem' }}>
          <h3>{ex.title}</h3>
          {ex.description && <p>{ex.description}</p>}
          <ComponentPreview code={ex.code} minHeight="180px">
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

function CodeBlockSkeleton() {
  return (
    <div
      style={{
        height: '52px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--docs-code-bg, #0d1117)',
        opacity: 0.6,
      }}
    />
  );
}

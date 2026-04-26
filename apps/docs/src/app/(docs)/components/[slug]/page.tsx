import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { componentEntries, getComponentEntry } from '@/registry/index';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentPreview } from '@/components/docs/ComponentPreview';
import { PropsTable } from '@/components/docs/PropsTable';
import { ComponentLivePreview } from '@/components/docs/LivePreviewWrapper';

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

  const { meta, props, examples } = entry;

  return (
    <div className="docs-prose">
      {/* Breadcrumb */}
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
        Components · {meta.category}
      </p>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '0.75rem' }}>
        <h1 style={{ margin: 0 }}>{meta.title}</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '6px', flexShrink: 0 }}>
          {meta.status === 'stable' && (
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-semantic-success-bg)',
                color: 'var(--color-semantic-success-default)',
                fontSize: '0.7rem',
                fontWeight: 700,
                border: '1px solid var(--color-semantic-success-border)',
              }}
            >
              Stable
            </span>
          )}
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
            {meta.package}
          </span>
        </div>
      </div>
      <p>{meta.description}</p>

      {/* Import */}
      <h2>Import</h2>
      <Suspense fallback={<CodeBlockSkeleton />}>
        {/* @ts-ignore */}
        <CodeBlock code={`import { ${meta.title} } from '${meta.package}';`} />
      </Suspense>

      {/* Examples with live preview */}
      <h2>Examples</h2>
      {examples.map((ex, i) => (
        <div key={ex.title} style={{ marginBottom: '2rem' }}>
          <h3>{ex.title}</h3>
          {ex.description && <p>{ex.description}</p>}
          <Suspense fallback={<PreviewSkeleton />}>
            <ComponentPreview
              code={ex.code}
              /* @ts-ignore — async RSC passed via composition pattern */
              codeSlot={<CodeBlock code={ex.code} />}
            >
              <ComponentLivePreview slug={slug} idx={i} />
            </ComponentPreview>
          </Suspense>
        </div>
      ))}

      {/* Props */}
      {props.length > 0 && (
        <>
          <h2>Props</h2>
          <PropsTable props={props} />
        </>
      )}
    </div>
  );
}

/* ── Skeleton fallbacks for Suspense boundaries ─────────────────────────── */

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

function PreviewSkeleton() {
  return (
    <div
      style={{
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          height: '40px',
          background: 'var(--color-bg-subtle)',
          borderBottom: '1px solid var(--color-border-default)',
        }}
      />
      {/* Preview area */}
      <div
        style={{
          height: '120px',
          background: 'var(--color-bg-default)',
        }}
      />
    </div>
  );
}

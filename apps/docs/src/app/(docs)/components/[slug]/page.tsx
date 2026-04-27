import type { Metadata } from 'next';
import { Suspense } from 'react'; // kept for Import CodeBlock Suspense
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
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '0.75rem' }}>
        <h1 style={{ margin: 0 }}>{meta.title}</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
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
        <CodeBlock code={`import { ${meta.title} } from '${meta.package}';`} />
      </Suspense>

      {/* Examples with live preview.
          No codeSlot here — omitting it keeps Shiki out of the RSC render path
          for example blocks. In dev mode, force-static caching is invalidated on
          every HMR cycle, so passing codeSlot={<CodeBlock />} per example would
          re-run Shiki 3-5× on every navigation after a file change.
          ComponentPreview falls back to a plain <pre> on the Code tab — instant,
          no server round-trip. The Import block above is the only place that needs
          syntax-highlighted output, and it's a single short line. */}
      <h2>Examples</h2>
      {examples.map((ex, i) => (
        <div key={ex.title} style={{ marginBottom: '2rem' }}>
          <h3>{ex.title}</h3>
          {ex.description && <p>{ex.description}</p>}
          {/* No Suspense needed here: ComponentPreview is a pure client component
              and ComponentLivePreview manages its own loading state (shimmer skeleton
              while the dynamic chunk loads). */}
          <ComponentPreview code={ex.code}>
            <ComponentLivePreview slug={slug} idx={i} />
          </ComponentPreview>
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


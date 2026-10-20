import type { Metadata } from 'next';
import Link from 'next/link';
import { componentEntries } from '@/registry/index';
import { MiniPreviewCard } from '@/components/docs/MiniPreviewCard';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Components' };

const categories = Array.from(new Set(componentEntries.map((e) => e.meta.category)));

export default function ComponentsPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Library</p>
      <h1>Components</h1>
      <p>
        Nexub DS ships with {componentEntries.length}+ accessible, token-driven React components built on Radix UI primitives.
        Each component is fully typed and supports theming.
      </p>

      {categories.map((cat) => {
        const entries = componentEntries.filter((e) => e.meta.category === cat);
        return (
          <div key={cat} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>{cat}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {entries.map((e) => (
                <div
                  key={e.meta.slug}
                  style={{
                    position: 'relative',
                    border: '1px solid var(--color-outline-variant)',
                    borderRadius: 'var(--shape-container)',
                    background: 'var(--color-surface-elevated)',
                    overflow: 'hidden',
                    transition: 'border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
                    height: '100%',
                  }}
                >
                  {/* Full-card hit target without wrapping previews (avoids invalid <a> inside <a> from demos that use Link/Breadcrumb). */}
                  <Link
                    href={`/components/${e.meta.slug}`}
                    prefetch
                    aria-label={`${e.meta.title}: view documentation`}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 0,
                      textDecoration: 'none',
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
                    {/* Mini live preview area */}
                    <div
                      style={{
                        height: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--color-surface-container-low)',
                        borderBottom: '1px solid var(--color-outline-variant)',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {/* Dot-grid background */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: 'radial-gradient(var(--color-outline-variant) 1px, transparent 1px)',
                          backgroundSize: '16px 16px',
                          opacity: 0.5,
                        }}
                      />
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <MiniPreviewCard slug={e.meta.slug} />
                      </div>
                      {/* Bottom fade */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '32px',
                          background: 'linear-gradient(to bottom, transparent, var(--color-surface-container-low))',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>

                    {/* Card info */}
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '3px', fontSize: '0.875rem' }}>
                        {e.meta.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-muted)', lineHeight: 1.5 }}>
                        {e.meta.description}
                      </div>
                      {e.meta.status === 'stable' && (
                        <div style={{ marginTop: '8px', display: 'inline-flex', padding: '2px 7px', borderRadius: 'var(--shape-control)', background: 'var(--color-success-container)', color: 'var(--color-success)', fontSize: '0.62rem', fontWeight: 700, border: '1px solid color-mix(in srgb, var(--color-success) 35%, transparent)', letterSpacing: '0.03em' }}>
                          Stable
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

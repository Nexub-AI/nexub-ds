import type { Metadata } from 'next';
import Link from 'next/link';
import { componentEntries } from '@/registry/index';

export const metadata: Metadata = { title: 'Components' };

const categories = Array.from(new Set(componentEntries.map((e) => e.meta.category)));

export default function ComponentsPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-primary-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Library</p>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {entries.map((e) => (
                <Link
                  key={e.meta.slug}
                  href={`/components/${e.meta.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      padding: '16px 20px',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-xl)',
                      background: 'var(--color-bg-raised)',
                      transition: 'border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px', fontSize: '0.9rem' }}>
                      {e.meta.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                      {e.meta.description}
                    </div>
                    {e.meta.status === 'stable' && (
                      <div style={{ marginTop: '10px', display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--color-semantic-success-bg)', color: 'var(--color-semantic-success-default)', fontSize: '0.65rem', fontWeight: 700, border: '1px solid var(--color-semantic-success-border)', letterSpacing: '0.03em' }}>
                        Stable
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

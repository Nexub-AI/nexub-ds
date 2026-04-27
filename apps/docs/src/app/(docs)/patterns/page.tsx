import type { Metadata } from 'next';
import Link from 'next/link';
import { patternEntries } from '@/registry/index';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Patterns' };

const categories = Array.from(new Set(patternEntries.map((e) => e.meta.category)));

export default function PatternsPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-primary-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Library</p>
      <h1>Patterns</h1>
      <p>
        Patterns are higher-level, brand-agnostic composites built from <code>@nexub/react</code> primitives.
        They solve common SaaS UI problems — auth flows, stat dashboards, settings pages — out of the box.
        Available from <code>@nexub/patterns</code>.
      </p>

      {categories.map((cat) => {
        const entries = patternEntries.filter((e) => e.meta.category === cat);
        return (
          <div key={cat} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>{cat}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {entries.map((e) => (
                <Link key={e.meta.slug} href={`/patterns/${e.meta.slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      padding: '16px 20px',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-xl)',
                      background: 'var(--color-bg-raised)',
                      cursor: 'pointer',
                      transition: 'border-color var(--duration-fast) var(--ease-out)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{e.meta.title}</div>
                      <span style={{ padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'var(--color-semantic-info-bg)', color: 'var(--color-semantic-info-default)', fontSize: '0.6rem', fontWeight: 700, border: '1px solid var(--color-semantic-info-border)' }}>Pattern</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{e.meta.description}</div>
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

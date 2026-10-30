import type { Metadata } from 'next';
import Link from 'next/link';
import { patternEntries } from '@/registry/index';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Patterns' };

const categories = Array.from(new Set(patternEntries.map((e) => e.meta.category)));

export default function PatternsPage() {
  return (
    <div className="docs-prose">
      <p className="text-[0.8rem] font-semibold text-[var(--color-primary)] tracking-wider uppercase mb-2">Library</p>
      <h1>Patterns</h1>
      <p>
        Patterns are higher-level, brand-agnostic composites built from <code>@nexub/react</code> primitives.
        They solve common SaaS UI problems — auth flows, stat dashboards, settings pages — out of the box.
        Available from <code>@nexub/patterns</code>.
      </p>

      {categories.map((cat) => {
        const entries = patternEntries.filter((e) => e.meta.category === cat);
        return (
          <div key={cat} className="mb-10">
            <h2 className="mb-4">{cat}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {entries.map((e) => (
                <Link key={e.meta.slug} href={`/patterns/${e.meta.slug}`} className="no-underline">
                  <div
                    style={{
                      padding: '16px 20px',
                      border: '1px solid var(--color-outline-variant)',
                      borderRadius: 'var(--shape-container)',
                      background: 'var(--color-surface-elevated)',
                      cursor: 'pointer',
                      transition: 'border-color var(--duration-fast) var(--ease-out)',
                    }}
                  >
                    <div className="flex gap-2 mb-1.5 items-center">
                      <div className="font-bold text-[var(--color-on-surface)] text-[0.9rem]">{e.meta.title}</div>
                      <span style={{ padding: '1px 6px', borderRadius: 'var(--shape-control)', background: 'var(--color-info-container)', color: 'var(--color-info)', fontSize: '0.6rem', fontWeight: 700, border: '1px solid color-mix(in srgb, var(--color-info) 35%, transparent)' }}>Pattern</span>
                    </div>
                    <div className="text-[0.78rem] text-[var(--color-on-surface-muted)] leading-normal">{e.meta.description}</div>
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

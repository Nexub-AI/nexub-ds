import type { Metadata } from 'next';
import { ColorSwatch } from '@/components/docs/ColorSwatch';

export const metadata: Metadata = { title: 'Colors' };

const brandShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const semanticTokens = [
  { name: '--color-semantic-success-default', value: 'var(--color-semantic-success-default)' },
  { name: '--color-semantic-success-bg',      value: 'var(--color-semantic-success-bg)' },
  { name: '--color-semantic-error-default',   value: 'var(--color-semantic-error-default)' },
  { name: '--color-semantic-error-bg',        value: 'var(--color-semantic-error-bg)' },
  { name: '--color-semantic-warning-default', value: 'var(--color-semantic-warning-default)' },
  { name: '--color-semantic-warning-bg',      value: 'var(--color-semantic-warning-bg)' },
  { name: '--color-semantic-info-default',    value: 'var(--color-semantic-info-default)' },
  { name: '--color-semantic-info-bg',         value: 'var(--color-semantic-info-bg)' },
];

export default function ColorsPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-primary-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Foundations</p>
      <h1>Colors</h1>
      <p>
        The Nexub color system is built on CSS custom properties. All colors adapt to light/dark mode and brand theme overrides automatically.
      </p>

      <h2>Brand Primary</h2>
      <p>The main product color. Responds to brand theme overrides via <code>data-product</code>.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', marginBottom: '2rem' }}>
        {brandShades.map((shade) => (
          <ColorSwatch
            key={shade}
            name={`primary-${shade}`}
            value={`var(--color-brand-primary-${shade})`}
            textColor={shade < 500 ? 'var(--color-text-primary)' : 'var(--color-text-inverse)'}
          />
        ))}
      </div>

      <h2>Semantic Colors</h2>
      <p>Semantic colors communicate state: success, error, warning, and info.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px', marginBottom: '2rem' }}>
        {semanticTokens.map((t) => (
          <ColorSwatch
              key={t.name}
              name={t.name.replace('--color-semantic-', '')}
              value={t.value}
              textColor={t.name.endsWith('-bg') ? 'var(--color-text-primary)' : 'var(--color-text-inverse)'}
            />
        ))}
      </div>

      <h2>Backgrounds & Surfaces</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px', marginBottom: '2rem' }}>
        {['--color-bg-default', '--color-bg-subtle', '--color-bg-muted', '--color-bg-raised', '--color-bg-inverse'].map((t) => (
          <div key={t} style={{ border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ height: '48px', background: `var(${t})`, borderBottom: '1px solid var(--color-border-subtle)' }} />
            <div style={{ padding: '6px 10px', fontSize: '0.7rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-secondary)', background: 'var(--color-bg-subtle)' }}>{t}</div>
          </div>
        ))}
      </div>

      <h2>Text</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '2rem' }}>
        {['primary', 'secondary', 'muted', 'subtle', 'disabled', 'link'].map((t) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0' }}>
            <span style={{ color: `var(--color-text-${t})`, fontWeight: t === 'primary' ? 700 : 400, fontSize: '0.9rem', minWidth: '120px' }}>
              {t.charAt(0).toUpperCase() + t.slice(1)} text
            </span>
            <code style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-family-mono)' }}>--color-text-{t}</code>
          </div>
        ))}
      </div>

      <h2>Brand Accent Palettes</h2>
      <p>Each product brand has its own accent palette used when <code>data-product</code> is applied.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {[
          { name: 'leap', color: '#6366f1' },
          { name: 'bookub', color: '#10b981' },
          { name: 'payub', color: '#8b5cf6' },
          { name: 'founderub', color: '#f59e0b' },
        ].map((b) => (
          <div key={b.name} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border-default)' }}>
            <div style={{ height: '40px', background: b.color }} />
            <div style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', background: 'var(--color-bg-subtle)' }}>{b.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

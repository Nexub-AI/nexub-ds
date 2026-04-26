import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Typography' };

const typeScale = [
  { name: 'display', size: '72px', weight: 800, tracking: '-0.02em', lineHeight: '1.1' },
  { name: 'h1', size: '56px', weight: 700, tracking: '-0.02em', lineHeight: '1.15' },
  { name: 'h2', size: '40px', weight: 700, tracking: '-0.015em', lineHeight: '1.2' },
  { name: 'h3', size: '32px', weight: 600, tracking: '-0.01em', lineHeight: '1.25' },
  { name: 'h4', size: '24px', weight: 600, tracking: '-0.005em', lineHeight: '1.3' },
  { name: 'h5', size: '20px', weight: 600, tracking: '0', lineHeight: '1.35' },
  { name: 'h6', size: '16px', weight: 600, tracking: '0', lineHeight: '1.4' },
  { name: 'body-lg', size: '18px', weight: 400, tracking: '0', lineHeight: '1.7' },
  { name: 'body', size: '16px', weight: 400, tracking: '0', lineHeight: '1.6' },
  { name: 'body-sm', size: '14px', weight: 400, tracking: '0', lineHeight: '1.5' },
  { name: 'caption', size: '12px', weight: 400, tracking: '0.01em', lineHeight: '1.5' },
  { name: 'label', size: '12px', weight: 600, tracking: '0.05em', lineHeight: '1.4' },
];

export default function TypographyPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-primary-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Foundations</p>
      <h1>Typography</h1>
      <p>
        Nexub DS uses <strong>Geist</strong> as the primary typeface and <strong>Geist Mono</strong> for code.
        Both are loaded via the token system's CSS custom properties.
      </p>

      <h2>Type Scale</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {typeScale.map((t) => (
          <div
            key={t.name}
            style={{
              display: 'grid', gridTemplateColumns: '120px 1fr 200px',
              alignItems: 'center', gap: '16px',
              padding: '12px 0',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <code style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-brand-primary-500)' }}>
              {t.name}
            </code>
            <span style={{ fontSize: t.size, fontWeight: t.weight, letterSpacing: t.tracking, lineHeight: t.lineHeight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              The quick brown fox
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-family-mono)' }}>
              {t.size} / {t.weight} / lh {t.lineHeight}
            </span>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '2rem' }}>Font Families</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { name: '--font-family-sans', sample: 'Geist — the primary interface typeface', family: 'var(--font-family-sans)' },
          { name: '--font-family-mono', sample: 'Geist Mono — for code and data', family: 'var(--font-family-mono)' },
        ].map((f) => (
          <div key={f.name} style={{ padding: '16px', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-lg)' }}>
            <code style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-family-mono)', display: 'block', marginBottom: '6px' }}>{f.name}</code>
            <span style={{ fontSize: '1.25rem', fontFamily: f.family }}>{f.sample}</span>
          </div>
        ))}
      </div>

      <h2>Font Weights</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          { name: 'regular', value: 400 },
          { name: 'medium', value: 500 },
          { name: 'semibold', value: 600 },
          { name: 'bold', value: 700 },
          { name: 'extrabold', value: 800 },
        ].map((w) => (
          <div key={w.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <code style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-family-mono)', width: '140px' }}>--font-weight-{w.name}</code>
            <span style={{ fontWeight: w.value, fontSize: '1rem' }}>{w.value} — {w.name.charAt(0).toUpperCase() + w.name.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

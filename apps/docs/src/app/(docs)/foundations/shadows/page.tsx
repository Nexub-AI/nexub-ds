import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Shadows' };

const shadows = [
  { name: 'xs', desc: 'Minimal lift — chips, tags' },
  { name: 'sm', desc: 'Subtle elevation — buttons' },
  { name: 'md', desc: 'Moderate — dropdowns, popovers' },
  { name: 'lg', desc: 'Prominent — modals, drawers' },
  { name: 'xl', desc: 'Strong — command palette' },
  { name: '2xl', desc: 'Maximum — full-page overlays' },
  { name: 'card', desc: 'Card surface' },
  { name: 'glow', desc: 'Brand glow effect' },
  { name: 'focus', desc: 'Focus ring (used internally)' },
];

export default function ShadowsPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-primary-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Foundations</p>
      <h1>Shadows</h1>
      <p>
        Shadow tokens create a consistent elevation system. They're exposed as <code>--shadow-*</code> CSS custom properties
        and adapt to light/dark mode automatically.
      </p>

      <h2>Elevation Scale</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
        {shadows.map((s) => (
          <div key={s.name} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                height: '80px',
                background: 'var(--color-bg-raised)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: `var(--shadow-${s.name})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <code style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-brand-primary-500)' }}>
                --shadow-{s.name}
              </code>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <h2>Border Radius</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
        {['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].map((r) => (
          <div key={r} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                background: 'var(--color-brand-primary-500)',
                borderRadius: `var(--radius-${r})`,
                opacity: 0.8,
              }}
            />
            <code style={{ fontSize: '0.7rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)' }}>
              --radius-{r}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

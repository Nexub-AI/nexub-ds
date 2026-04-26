import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Spacing' };

const scale = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64];

export default function SpacingPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-primary-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Foundations</p>
      <h1>Spacing</h1>
      <p>
        Nexub DS uses a 4px base unit spacing scale exposed as <code>--spacing-{'{n}'}</code> CSS custom properties.
        1 unit = 4px.
      </p>

      <h2>Scale</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {scale.map((n) => {
          const px = n * 4;
          return (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '4px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <code style={{ fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-brand-primary-500)', width: '120px' }}>
                --spacing-{n}
              </code>
              <code style={{ fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)', width: '60px' }}>
                {px}px
              </code>
              <div
                style={{
                  height: '16px',
                  width: `${Math.min(px, 320)}px`,
                  background: 'var(--color-brand-primary-500)',
                  borderRadius: '2px',
                  opacity: 0.7,
                  minWidth: px > 0 ? '2px' : 0,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

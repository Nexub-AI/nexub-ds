import { componentEntries, patternEntries } from '@/registry/index';

const features = [
  {
    icon: '◈',
    stat: `${componentEntries.length}`,
    title: 'Components',
    desc: 'Accessible, token-driven React components built on Radix UI primitives. Every edge case handled.',
  },
  {
    icon: '⬡',
    stat: '100%',
    title: 'TypeScript',
    desc: 'Fully typed from props to theme tokens. Autocomplete, type safety, zero any-casting.',
  },
  {
    icon: '◐',
    stat: '5',
    title: 'Brand themes',
    desc: 'Light, dark, and 4 product brands (Leap, Bookub, Payub, Founderub) — all CSS, zero runtime.',
  },
  {
    icon: '⊞',
    stat: `${patternEntries.length}`,
    title: 'Patterns',
    desc: 'Composable UI patterns for real SaaS flows: stat cards, auth, settings, activity feeds.',
  },
];

export function LandingFeatures() {
  return (
    <section
      style={{
        background: 'var(--color-surface-container-low)',
        borderTop: '1px solid var(--color-outline-variant)',
        borderBottom: '1px solid var(--color-outline-variant)',
        padding: '5rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* Section label */}
        <p data-reveal-scroll
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            textAlign: 'center',
          }}
        >
          What&apos;s inside
        </p>

        <h2 data-reveal-scroll
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800,
            textAlign: 'center',
            letterSpacing: '-0.02em',
            marginBottom: '3rem',
            color: 'var(--color-on-surface)',
          }}
        >
          Everything you need to ship faster
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '20px',
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="landing-card"
              data-reveal-scroll
              style={{
                background: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: 'var(--shape-container)',
                padding: '1.75rem',
                boxShadow: 'var(--elevation-1)',
                cursor: 'default',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-info-container)',
                  border: '1px solid color-mix(in srgb, var(--color-info) 35%, transparent)',
                  borderRadius: 'var(--shape-container)',
                  color: 'var(--color-primary)',
                }}
              >
                {f.icon}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '0.25rem' }}>
                {f.stat}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>
                {f.title}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--color-on-surface-muted)', lineHeight: 1.6 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

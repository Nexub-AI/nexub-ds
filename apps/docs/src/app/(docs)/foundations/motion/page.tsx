import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Motion' };

const durations = [
  { name: 'instant', value: '0ms' },
  { name: 'fast', value: '150ms' },
  { name: 'normal', value: '200ms' },
  { name: 'slow', value: '300ms' },
  { name: 'slower', value: '500ms' },
];

const easings = [
  { name: 'linear', value: 'cubic-bezier(0, 0, 1, 1)' },
  { name: 'in', value: 'cubic-bezier(0.4, 0, 1, 1)' },
  { name: 'out', value: 'cubic-bezier(0, 0, 0.2, 1)' },
  { name: 'in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  { name: 'out-expo', value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  { name: 'spring', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
];

export default function MotionPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-primary-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Foundations</p>
      <h1>Motion</h1>
      <p>
        Motion tokens define the duration and easing curves used across all transition animations.
        They're exposed as <code>--duration-*</code> and <code>--ease-*</code> CSS custom properties,
        and used by the <code>Fade</code>, <code>Slide</code>, <code>Scale</code>, and <code>Collapse</code> motion components.
      </p>

      <h2>Duration</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
        {durations.map((d) => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <code style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-brand-primary-500)', width: '160px' }}>--duration-{d.name}</code>
            <code style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)', width: '60px' }}>{d.value}</code>
            <div style={{ flex: 1, height: '8px', background: 'var(--color-bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: '24px',
                  background: 'var(--color-brand-primary-500)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <h2>Easing</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {easings.map((e) => (
          <div key={e.name} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <code style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-brand-primary-500)', width: '160px' }}>--ease-{e.name}</code>
              <code style={{ fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)' }}>{e.value}</code>
            </div>
          </div>
        ))}
      </div>

      <h2>Motion Components</h2>
      <p>Use the built-in motion primitives from <code>@nexub/react</code> for consistent animations:</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '2rem' }}>
        {[
          { name: 'Fade', desc: 'Opacity 0 → 1 transition' },
          { name: 'Slide', desc: 'Translate + fade from a direction' },
          { name: 'Scale', desc: 'Scale + fade from initialScale' },
          { name: 'Collapse', desc: 'Max-height accordion reveal' },
        ].map((c) => (
          <div key={c.name} style={{ padding: '16px', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontWeight: 700, fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-primary)', marginBottom: '4px' }}>{c.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

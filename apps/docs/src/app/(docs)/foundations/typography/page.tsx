import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Typography' };

// The 15 type roles (--type-<role>-*, Tailwind text-<role>). Display and
// headline use the brand face; the rest use Inter. Tracking tightens with size.
const typeScale = ['display', 'headline', 'title', 'body', 'label'].flatMap((role) =>
  ['lg', 'md', 'sm'].map((s) => {
    const name = `${role}-${s}`;
    return {
      name,
      size: `var(--type-${name}-size)`,
      weight: `var(--type-${name}-weight)`,
      tracking: `var(--type-${name}-letterSpacing)`,
      lineHeight: `var(--type-${name}-lineHeight)`,
      family: role === 'display' || role === 'headline' ? 'var(--font-family-display)' : 'var(--font-family-sans)',
    };
  }),
);

export default function TypographyPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-primary-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Foundations</p>
      <h1>Typography</h1>
      <p>
        Nexub DS uses <strong>Inter</strong> for interface text and <strong>Plus Jakarta Sans</strong> for
        display and headline text (<code>--font-family-display</code>; headings use it by default). Both ship
        with <code>@nexub/themes</code>: importing <code>@nexub/themes/base</code> self-hosts the variable fonts
        (Inter with its optical-size axis; both normal and italic), so every app gets them with no extra setup.
        Code uses the monospace stack in <code>--font-family-mono</code>.
      </p>

      <h2>Type roles</h2>
      <p>
        Use roles, not sizes: <code>className=&quot;text-title-md&quot;</code> sets size, line height,
        tracking and weight together. Headings (<code>h1</code>–<code>h6</code>) default to the display face
        with <code>text-wrap: balance</code>; numbers in data use <code>tabular-nums</code>.
      </p>
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
            <code style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-primary)' }}>
              {t.name}
            </code>
            <span style={{ fontFamily: t.family, fontSize: t.size, fontWeight: t.weight as unknown as number, letterSpacing: t.tracking, lineHeight: t.lineHeight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              The quick brown fox
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-family-mono)' }}>
              text-{t.name}
            </span>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '2rem' }}>Font Families</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { name: '--font-family-sans', sample: 'Inter — the interface typeface', family: 'var(--font-family-sans)' },
          { name: '--font-family-display', sample: 'Plus Jakarta Sans — display and headlines', family: 'var(--font-family-display)' },
          { name: '--font-family-mono', sample: 'Monospace — for code and data', family: 'var(--font-family-mono)' },
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

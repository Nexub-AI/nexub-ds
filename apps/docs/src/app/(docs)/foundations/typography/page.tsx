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
      <p className="text-[0.8rem] font-semibold text-[var(--color-brand-primary-500)] tracking-wider uppercase mb-2">Foundations</p>
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
      <div className="flex flex-col gap-0">
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
            <code className="text-label-sm font-mono text-[var(--color-primary)]">
              {t.name}
            </code>
            <span style={{ fontFamily: t.family, fontSize: t.size, fontWeight: t.weight as unknown as number, letterSpacing: t.tracking, lineHeight: t.lineHeight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              The quick brown fox
            </span>
            <span className="text-[0.72rem] text-[var(--color-text-muted)] font-mono">
              text-{t.name}
            </span>
          </div>
        ))}
      </div>

      <h2 className="mt-8">Font Families</h2>
      <div className="flex flex-col gap-3">
        {[
          { name: '--font-family-sans', sample: 'Inter — the interface typeface', family: 'var(--font-family-sans)' },
          { name: '--font-family-display', sample: 'Plus Jakarta Sans — display and headlines', family: 'var(--font-family-display)' },
          { name: '--font-family-mono', sample: 'Monospace — for code and data', family: 'var(--font-family-mono)' },
        ].map((f) => (
          <div key={f.name} style={{ padding: '16px', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-lg)' }}>
            <code className="text-[0.72rem] text-[var(--color-text-muted)] font-mono block mb-1.5">{f.name}</code>
            <span style={{ fontSize: '1.25rem', fontFamily: f.family }}>{f.sample}</span>
          </div>
        ))}
      </div>

      <h2>Font Weights</h2>
      <div className="flex flex-col gap-2">
        {[
          { name: 'regular', value: 400 },
          { name: 'medium', value: 500 },
          { name: 'semibold', value: 600 },
          { name: 'bold', value: 700 },
          { name: 'extrabold', value: 800 },
        ].map((w) => (
          <div key={w.name} className="flex items-center gap-4">
            <code className="text-[0.72rem] text-[var(--color-text-muted)] font-mono w-[140px]">--font-weight-{w.name}</code>
            <span style={{ fontWeight: w.value, fontSize: '1rem' }}>{w.value} — {w.name.charAt(0).toUpperCase() + w.name.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

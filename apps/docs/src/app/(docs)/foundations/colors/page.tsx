import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Colors',
  description: 'Color roles generated from tonal palettes, light-dark aware, with contrast levels.',
};

const eyebrow = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '0.5rem' };
const mono = { fontFamily: 'var(--font-family-mono)', fontSize: '0.72rem' };
const grid = (min: number) => ({ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 8, marginBottom: '2rem' });

const surfaces = [
  'surface-dim',
  'surface',
  'surface-bright',
  'surface-container-lowest',
  'surface-container-low',
  'surface-container',
  'surface-container-high',
  'surface-container-highest',
  'surface-elevated',
  'inverse-surface',
];
const accents = ['primary', 'secondary', 'tertiary', 'error', 'success', 'warning', 'info'];
const palettes = ['primary', 'secondary', 'neutral', 'neutral-variant', 'error', 'success', 'warning', 'leap', 'bookub', 'payub', 'founderub'];
const tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];

/** A role with its on-role text, so the swatch shows the real pairing. */
function Pair({ bg, fg, label }: { bg: string; fg: string; label: string }) {
  return (
    <div style={{ borderRadius: 12, padding: '12px 14px', background: `var(--color-${bg})`, color: `var(--color-${fg})`, border: '1px solid var(--color-outline-variant)' }}>
      <div style={{ fontWeight: 600 }}>{label}</div>
      <div style={{ ...mono, opacity: 0.9 }}>--color-{bg}</div>
    </div>
  );
}

export default function ColorsPage() {
  return (
    <div className="docs-prose">
      <p style={eyebrow}>Foundations</p>
      <h1>Colors</h1>
      <p>
        Colors are <strong>roles</strong>, not swatches. Each role is a tone of a tonal palette generated
        (in HCT) from a seed color, so contrast is arithmetic: a tone gap of 50 guarantees 4.5:1. Every role
        is a <code>light-dark()</code> value, so it follows <code>data-theme</code> at any depth with no
        separate dark stylesheet. A build-time test checks every role pair against WCAG 2.2 AA in light,
        dark and high contrast, for every brand.
      </p>
      <pre><code>{`background: var(--color-surface-container-low);
color: var(--color-on-surface);
/* Tailwind: bg-surface-container-low text-on-surface */`}</code></pre>

      <h2>Surfaces</h2>
      <p>
        In-flow content steps through the container tiers; floating layers (menus, dialogs) use{' '}
        <code>surface-elevated</code>, which is lighter than the page in dark mode.
      </p>
      <div style={grid(180)}>
        {surfaces.map((s) => (
          <Pair key={s} bg={s} fg={s === 'inverse-surface' ? 'inverse-on-surface' : 'on-surface'} label={s.replace('surface-', '').replace('-', ' ')} />
        ))}
      </div>

      <h2>Accents</h2>
      <p>
        Each accent comes as four roles: the color, its <code>on-</code> text, a quieter{' '}
        <code>-container</code>, and <code>on-…-container</code>. Brands (<code>data-product</code>)
        remap <strong>tertiary</strong>.
      </p>
      {accents.map((a) => (
        <div key={a} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <Pair bg={a} fg={`on-${a}`} label={a} />
          <Pair bg={`${a}-container`} fg={`on-${a}-container`} label={`${a} container`} />
        </div>
      ))}

      <h2>Text and outlines</h2>
      <div style={{ display: 'grid', gap: 6, marginBottom: '2rem' }}>
        {[
          ['on-surface', 'Primary text'],
          ['on-surface-variant', 'Secondary text'],
          ['on-surface-muted', 'Tertiary text (still ≥ 4.5:1 on every container)'],
          ['primary', 'Links'],
        ].map(([role, label]) => (
          <div key={role} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span style={{ color: `var(--color-${role})`, minWidth: 320 }}>{label}</span>
            <code style={mono}>--color-{role}</code>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ width: 120, height: 32, borderRadius: 8, border: '1px solid var(--color-outline)' }} />
          <code style={mono}>--color-outline (≥ 3:1, field borders, focus)</code>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ width: 120, height: 32, borderRadius: 8, border: '1px solid var(--color-outline-variant)' }} />
          <code style={mono}>--color-outline-variant (hairlines, dividers)</code>
        </div>
      </div>

      <h2>Contrast levels</h2>
      <p>
        Set <code>data-contrast=&quot;high&quot;</code> (or let <code>prefers-contrast: more</code> do it)
        and accents, secondary text and outlines move further from their surfaces. Nothing else changes.
      </p>
      <div data-contrast="high" style={{ ...grid(180), padding: 12, borderRadius: 16, background: 'var(--color-surface)' }}>
        <Pair bg="primary" fg="on-primary" label="primary (high)" />
        <Pair bg="surface-container" fg="on-surface-variant" label="variant text (high)" />
      </div>

      <h2>Tonal palettes</h2>
      <p>
        The raw tones behind the roles, <code>--color-palette-&lt;name&gt;-&lt;tone&gt;</code>. Prefer roles;
        reach for a tone only for illustration or data visualisation.
      </p>
      {palettes.map((p) => (
        <div key={p} style={{ marginBottom: 6 }}>
          <code style={mono}>{p}</code>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${tones.length}, 1fr)`, borderRadius: 8, overflow: 'hidden' }}>
            {tones.map((t) => (
              <div key={t} title={`--color-palette-${p}-${t}`} style={{ height: 28, background: `var(--color-palette-${p}-${t})` }} />
            ))}
          </div>
        </div>
      ))}

      <h2>Legacy names</h2>
      <p>
        <code>--color-bg-*</code>, <code>--color-text-*</code>, <code>--color-border-*</code>,{' '}
        <code>--color-semantic-*</code> and <code>--color-fill-*</code> still work. They alias the roles
        (e.g. <code>--color-text-primary</code> → <code>--color-on-surface</code>). New code should use the roles.
      </p>
    </div>
  );
}

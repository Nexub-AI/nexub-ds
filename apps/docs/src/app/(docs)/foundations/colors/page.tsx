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
const series = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`);

/** A strip of chart colours, read straight from the CSS vars. */
function Ramp({ keys }: { keys: string[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${keys.length}, 1fr)`, gap: 4, marginBottom: '1rem' }}>
      {keys.map((k) => (
        <div key={k} title={`--color-chart-${k}`}>
          <div style={{ height: 36, borderRadius: 8, background: `var(--color-chart-${k})` }} />
          <div style={{ ...mono, textAlign: 'center', marginTop: 4 }}>{k}</div>
        </div>
      ))}
    </div>
  );
}

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
        dark, medium and high contrast, for every brand.
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
        Three levels: <strong>standard</strong> (the default), <strong>medium</strong> and{' '}
        <strong>high</strong>. Set <code>data-contrast</code> on <code>&lt;html&gt;</code> or on any
        subtree; without it, <code>prefers-contrast: more</code> selects high. Accents, secondary text and
        outlines move further from their surfaces; surfaces stay put. Medium takes the tone halfway
        between the other two, for users who want more separation without the starkness of high.
      </p>
      <pre><code>{`<html data-contrast="medium">   <!-- standard | medium | high -->`}</code></pre>
      <div style={grid(180)}>
        {(['standard', 'medium', 'high'] as const).map((level) => (
          <div key={level} data-contrast={level} style={{ display: 'grid', gap: 8, padding: 12, borderRadius: 16, background: 'var(--color-surface)' }}>
            <Pair bg="primary" fg="on-primary" label={`primary (${level})`} />
            <Pair bg="surface-container" fg="on-surface-variant" label="variant text" />
          </div>
        ))}
      </div>

      <h2>Data visualisation</h2>
      <p>
        Chart palettes are roles too: light-dark aware, generated in HCT. Use{' '}
        <code>--color-chart-*</code> (Tailwind: <code>fill-chart-1</code>, <code>bg-chart-seq-4</code>,{' '}
        <code>stroke-chart-div-7</code>).
      </p>
      <h3>Categorical</h3>
      <p>
        Eight series for unordered categories. Each clears 3:1 against <code>surface</code> and{' '}
        <code>surface-container</code> in both schemes (WCAG 1.4.11), and a build-time test simulates
        protanopia, deuteranopia and tritanopia to keep the first six apart. Past six series, label
        directly or group the rest as &ldquo;Other&rdquo;; never rely on colour alone.
      </p>
      <Ramp keys={series('', 8)} />
      <h3>Sequential</h3>
      <p>
        Seven steps of primary for ordered values (low → high). Step 1 is closest to the surface in
        either scheme.
      </p>
      <Ramp keys={series('seq-', 7)} />
      <h3>Diverging</h3>
      <p>
        Error → neutral → primary, for values either side of a midpoint (step 4). Swap the ends if
        &ldquo;negative&rdquo; is not bad news in your data.
      </p>
      <Ramp keys={series('div-', 7)} />

      <h2>Wide gamut</h2>
      <p>
        On P3 displays (<code>color-gamut: p3</code>, with relative colour support) the accent fills
        &mdash; primary, tertiary, the product accents, success, warning, error and info &mdash; gain 18%
        OKLCH chroma. Lightness is unchanged, so every contrast pair holds. Containers, text and surfaces
        stay in sRGB. Nothing to opt into.
      </p>

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

      <h2>Brand theming from a seed colour</h2>
      <p>
        For white-label products, pass one hex colour and the accent roles are regenerated from it with the same
        HCT tone table as the built-in themes, so every pair still meets WCAG AA in light, dark and every contrast
        level. Like Material 3, the seed is a starting hue, not a fixed swatch: a light yellow becomes a readable olive.
      </p>
      <pre><code>{`<ThemeProvider seed="#e4572e">…</ThemeProvider>
// a product brand instead of the primary accent:
<ThemeProvider seed="#e4572e" seedTarget="tertiary">…</ThemeProvider>`}</code></pre>
      <p>
        <code>ThemeProvider</code> loads the colour maths only when <code>seed</code> is set and applies the roles
        through the CSSOM, so it works under a strict CSP. Because that happens after hydration, server-rendered apps
        should also ship the static CSS to avoid a flash:{' '}
        <code>createSeedThemeCss(&apos;#e4572e&apos;)</code> from <code>@nexub/tokens/seed</code>. Seeding covers the
        primary (or tertiary) family; secondary, the chart palettes and P3 wide-gamut boosts stay on the Nexub brand.
      </p>

      <h2>Legacy names</h2>
      <p>
        <code>--color-bg-*</code>, <code>--color-text-*</code>, <code>--color-border-*</code>,{' '}
        <code>--color-semantic-*</code> and <code>--color-fill-*</code> still work. They alias the roles
        (e.g. <code>--color-text-primary</code> → <code>--color-on-surface</code>). New code should use the roles.
      </p>
    </div>
  );
}

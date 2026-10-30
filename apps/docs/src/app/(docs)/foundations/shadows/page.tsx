import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Elevation & shape',
  description: 'Tonal elevation, three shadow levels for floating layers, semantic shapes and concentric radii.',
};

const eyebrow = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '0.5rem' };
const mono = { fontFamily: 'var(--font-family-mono)', fontSize: '0.72rem', color: 'var(--color-on-surface-muted)' };

const levels = [
  ['0', 'In-flow content. Use tone, not shadow.'],
  ['1', 'Menus, interactive cards on hover, the Switch thumb.'],
  ['2', 'Popovers, toasts, floating toolbars.'],
  ['3', 'Dialogs, sheets, the command palette.'],
];

const shapes = [
  ['control', '9999px', 'Capsule: Button, IconButton, Chip, SegmentedControl, Switch, Badge'],
  ['field', '12px', 'Input, Select, Textarea'],
  ['container', '16px', 'Card, Popover, Menu, Toast'],
  ['overlay', '24px', 'Dialog, Sheet, CommandPalette'],
  ['tooltip', '8px', 'Tooltip, Kbd'],
];

export default function ElevationShapePage() {
  return (
    <div className="docs-prose">
      <p style={eyebrow}>Foundations</p>
      <h1>Elevation &amp; shape</h1>

      <h2>Elevation</h2>
      <p>
        Content that sits in the page uses <strong>tone</strong>: it steps up through the surface-container
        roles. <strong>Shadows are only for things that float.</strong> Each level is a 1px alpha ring plus two
        soft layers, defined with <code>light-dark()</code> so dark mode gets deeper, quieter shadows.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 20, padding: 24, borderRadius: 24, background: 'var(--color-surface-container-low)', marginBottom: '2rem' }}>
        {levels.map(([n, use]) => (
          <div key={n} style={{ borderRadius: 16, padding: 16, minHeight: 96, background: 'var(--color-surface-elevated)', boxShadow: `var(--elevation-${n})` }}>
            <code className="font-mono text-[0.8rem]">elevation-{n}</code>
            <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--color-on-surface-variant)' }}>{use}</p>
          </div>
        ))}
      </div>

      <h2>Shape</h2>
      <p>
        Components use <strong>semantic shapes</strong>, not raw radii, so one decision changes every control.
        Tailwind: <code>rounded-shape-control</code> and so on. The primitive radius scale is unchanged.
      </p>
      <div className="grid gap-3 mb-8">
        {shapes.map(([name, value, use]) => (
          <div key={name} style={{ display: 'grid', gridTemplateColumns: '120px 160px 1fr', gap: 16, alignItems: 'center' }}>
            <div style={{ height: 44, borderRadius: `var(--shape-${name})`, background: 'var(--color-secondary-container)' }} />
            <code style={mono}>
              --shape-{name} ({value})
            </code>
            <span className="text-[0.88rem]">{use}</span>
          </div>
        ))}
      </div>

      <h2>Concentric radii</h2>
      <p>
        A shape inside a shape keeps the same centre of curvature: <em>inner radius = outer radius − padding</em>,
        floored at <code>--shape-min</code> (4px). Menus (16px with 6px padding) use 10px items; the command
        palette (24px with 8px padding) uses 16px items.
      </p>
      <div className="inline-block p-2 rounded-[24px] bg-[var(--color-surface-container-high)] mb-8">
        <div className="w-[240px] h-[64px] rounded-[16px] bg-[var(--color-surface-elevated)]" />
      </div>
    </div>
  );
}

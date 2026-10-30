import type { Metadata } from 'next';
import { Card, Text } from '@nexub/react';
import { PageIntro, Prose, Section } from '@/components/kit';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Elevation & shape',
  description: 'Tonal elevation, three shadow levels for floating layers, semantic shapes and concentric radii.',
};


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

// Static class names so Tailwind generates them.
const shadow: Record<string, string> = {
  '0': 'shadow-elevation-0',
  '1': 'shadow-elevation-1',
  '2': 'shadow-elevation-2',
  '3': 'shadow-elevation-3',
};
const radius: Record<string, string> = {
  control: 'rounded-shape-control',
  field: 'rounded-shape-field',
  container: 'rounded-shape-container',
  overlay: 'rounded-shape-overlay',
  tooltip: 'rounded-shape-tooltip',
};

export default function ElevationShapePage() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Foundations" title="Elevation & shape" />

      <Section id="elevation" title="Elevation">
        <Prose>
          Content that sits in the page uses <strong>tone</strong>: it steps up through the surface-container roles.{' '}
          <strong>Shadows are only for things that float.</strong> Each level is a 1px alpha ring plus two soft layers,
          defined with <code>light-dark()</code> so dark mode gets deeper, quieter shadows. On React Native the same levels
          ship as per-scheme <code>boxShadow</code> values.
        </Prose>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-5 rounded-shape-overlay bg-[var(--color-surface-container-low)] p-6">
          {levels.map(([n, use]) => (
            <div key={n} className={'min-h-24 rounded-shape-container bg-[var(--color-surface-elevated)] p-4 ' + shadow[String(n)]}>
              <code className="font-mono text-label-md">elevation-{n}</code>
              <Text size="body-sm" tone="secondary" className="mt-1.5">{use}</Text>
            </div>
          ))}
        </div>
      </Section>

      <Section id="shape" title="Shape">
        <Prose>
          Components use <strong>semantic shapes</strong>, not raw radii, so one decision changes every control. Tailwind:{' '}
          <code>rounded-shape-control</code> and so on. The primitive radius scale is unchanged.
        </Prose>
        <div className="grid gap-3">
          {shapes.map(([name, value, use]) => (
            <Card key={name} className="grid items-center gap-3 p-3 sm:grid-cols-[120px_180px_1fr] sm:gap-4">
              <div className={'h-11 bg-[var(--color-secondary-container)] ' + radius[String(name)]} />
              <code className="font-mono text-label-sm text-[var(--color-on-surface-muted)]">
                --shape-{name} ({value})
              </code>
              <Text size="body-sm">{use}</Text>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="concentric-radii" title="Concentric radii">
        <Prose>
          A shape inside a shape keeps the same centre of curvature: <em>inner radius = outer radius − padding</em>,
          floored at <code>--shape-min</code> (4px). Menus (16px with 6px padding) use 10px items; the command palette
          (24px with 8px padding) uses 16px items.
        </Prose>
        <div className="inline-block self-start rounded-shape-overlay bg-[var(--color-surface-container-high)] p-2">
          <div className="h-16 w-[240px] max-w-full rounded-shape-container bg-[var(--color-surface-elevated)]" />
        </div>
      </Section>
    </div>
  );
}

import type { Metadata } from 'next';
import { GlassDemo } from './GlassDemo';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Materials' };

export default function MaterialsPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-primary-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Foundations</p>
      <h1>Materials</h1>
      <p>
        Materials are surface treatments that sit <em>on top of</em> the light or dark theme rather than
        replacing it. <strong>Liquid Glass</strong> is the first: a translucent surface with a backdrop
        blur, a hairline border, a specular top highlight, and a soft shadow. One definition works in
        both light and dark.
      </p>

      <h2>Live demo</h2>
      <p>Two cards over a gradient — one solid, one glass. The gradient refracts through the glass panel.</p>
      <GlassDemo />

      <h2>Usage</h2>
      <p>
        Opt in per surface with <code>surface=&quot;glass&quot;</code>. It is supported on the surface
        components where translucency reads well — Card, Dialog, Popover, Drawer, and TopNav. The prop
        stamps <code>data-material=&quot;glass&quot;</code> on the element so the <code>--glass-*</code>{' '}
        variables resolve locally; nothing else in the tree is affected.
      </p>
      <pre><code>{`import { Card, Dialog } from '@nexub/react';
import '@nexub/themes/glass';   // once, after base/light/dark

<Card surface="glass">Frosted card</Card>

<Dialog.Content surface="glass">…</Dialog.Content>`}</code></pre>

      <h2>When to use it</h2>
      <ul>
        <li>Overlays and navigation over content — dialogs, popovers, drawers, a sticky top nav.</li>
        <li>Hero or feature surfaces where depth adds polish.</li>
        <li>Not as a global default — stacked blurred surfaces are GPU-costly, and glass over a flat
          background just looks like a tinted panel.</li>
      </ul>

      <h2>Accessibility</h2>
      <p>
        Translucency reduces contrast, so glass automatically falls back to a solid surface under{' '}
        <code>prefers-reduced-transparency: reduce</code> and <code>prefers-contrast: more</code> — the
        blur is dropped and the solid <code>--color-bg-default</code> is used. Keep text on glass to
        high-contrast colours; don&apos;t place body copy directly over a busy backdrop.
      </p>
    </div>
  );
}

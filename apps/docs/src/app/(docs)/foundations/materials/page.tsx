import type { Metadata } from 'next';
import { GlassDemo } from './GlassDemo';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Materials',
  description: 'Glass 2.0: the translucent material for the floating control layer, with a user intensity dial.',
};

const eyebrow = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '0.5rem' };

export default function MaterialsPage() {
  return (
    <div className="docs-prose">
      <p style={eyebrow}>Foundations</p>
      <h1>Materials</h1>
      <p>
        <strong>Glass</strong> is a material, not a theme: a translucent surface (the surface role at the
        dial’s opacity), <code>blur + saturate</code> on what’s behind it, a hairline with a bright top edge,
        and a soft shadow. Because the fill is a role, one definition works in light and dark.
      </p>

      <h2>Live demo</h2>
      <p>The dial is the real setting. It changes every glass surface on this site and is remembered.</p>
      <GlassDemo />

      <h2>Where glass belongs</h2>
      <ul>
        <li>
          <strong>The floating control layer only</strong>: top bars, floating toolbars, popovers, menus,
          sheets and dialogs. Card glass is for surfaces over imagery or media.
        </li>
        <li>Never glass on glass. Inside glass, use fills and secondary text.</li>
        <li>At most three glass layers in view (they stay at 120 fps while scrolling).</li>
        <li>
          Tint only the one primary action (<code>data-glass-tint=&quot;primary&quot;</code>).
        </li>
      </ul>
      <pre><code>{`import '@nexub/themes/glass';   // once, after base/light

<TopNav.Root surface="glass" scrollEdge="soft">…</TopNav.Root>
<Toolbar.Root floating>…</Toolbar.Root>
<Dialog.Content surface="glass">…</Dialog.Content>
<Button variant="glass">Play</Button>`}</code></pre>

      <h2>Thickness</h2>
      <p>
        Larger glass is thicker: more blur and a deeper shadow. Components pick it for you: buttons are{' '}
        <code>thin</code> (8px blur), bars and popovers <code>regular</code> (16px), dialogs and drawers{' '}
        <code>thick</code> (28px). Override with <code>data-glass-thickness</code>.
      </p>

      <h2>Scroll edge</h2>
      <p>
        Sticky bars take <code>scrollEdge=&quot;soft&quot;</code> to let content dissolve under the bar instead
        of meeting a divider, or <code>&quot;hard&quot;</code> for an opaque band over pinned headers.
      </p>

      <h2>The intensity dial</h2>
      <p>
        Apple’s answer to glass legibility was a user setting from clear to tinted. Ours is{' '}
        <code>useTheme().setGlass(&apos;clear&apos; | &apos;balanced&apos; | &apos;tinted&apos; | &apos;off&apos;)</code>, applied before paint by{' '}
        <code>ThemeScript</code> and offered in the account menu of a glass <code>AppHeader</code>.
      </p>

      <h2>Accessibility</h2>
      <p>
        Glass becomes a solid surface with no blur under <code>prefers-reduced-transparency</code>,{' '}
        <code>prefers-contrast: more</code> (plus a 2px outline), forced colours, the <code>off</code> dial
        setting, and in browsers without <code>backdrop-filter</code>. Keep text on glass to the
        on-surface roles; never body copy over a busy backdrop with the clear variant.
      </p>
    </div>
  );
}

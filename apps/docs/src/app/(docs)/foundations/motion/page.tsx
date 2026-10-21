import type { Metadata } from 'next';
import { SpringDemo, StateDemo } from './MotionDemo';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Motion & interaction',
  description: 'Spring motion tokens, state layers, press feedback and the focus ring.',
};

const eyebrow = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '0.5rem' };

const springs = [
  ['spatial', 'Position and size: panels, sheets, indicators. Damping 0.9, a hair of settle.', '1400 / 700 / 300'],
  ['effects', 'Opacity and color. Critically damped: never overshoots.', '3800 / 1600 / 800'],
  ['expressive', 'Key moments only: toggles, success, drag release. Damping 0.7–0.8.', '800 / 380 / 200'],
];

export default function MotionPage() {
  return (
    <div className="docs-prose">
      <p style={eyebrow}>Foundations</p>
      <h1>Motion &amp; interaction</h1>
      <p>
        Motion is <strong>springs, not durations</strong> (Apple’s fluid interfaces, Material 3’s motion
        scheme). Each spring is precomputed into a CSS <code>linear()</code> easing plus the time it takes to
        settle, so transitions stay in CSS and are interruptible: a new target retargets from where the
        element is.
      </p>

      <h2>Springs</h2>
      <table>
        <thead>
          <tr>
            <th>Family</th>
            <th>Use</th>
            <th>Stiffness (fast / default / slow)</th>
          </tr>
        </thead>
        <tbody>
          {springs.map(([k, use, stiff]) => (
            <tr key={k}>
              <td>
                <code>{k}</code>
              </td>
              <td>{use}</td>
              <td>{stiff}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <pre><code>{`transition: transform var(--motion-spring-spatial-default-duration)
                      var(--motion-spring-spatial-default-easing);
/* Tailwind: duration-spatial-default ease-spatial-default */`}</code></pre>
      <p>Click a row to run it:</p>
      <SpringDemo />
      <p>
        Exits use the next-faster token. Never animate <code>backdrop-filter</code>, and don’t use{' '}
        <code>transition-all</code>.
      </p>

      <h2>State layers</h2>
      <p>
        Hover, focus and press are an overlay of the control’s own text color at a fixed opacity, so they
        read correctly on any fill, theme, brand or glass: <code>--state-hover</code> 0.08,{' '}
        <code>--state-focus</code> 0.10, <code>--state-pressed</code> 0.12, <code>--state-dragged</code> 0.16.
        Add <code>nx-state-layer</code> to any custom control. Pressables also scale to 0.97 on a fast spring
        (<code>nx-press</code>). There is no ripple.
      </p>
      <StateDemo />

      <h2>Enter and exit</h2>
      <p>
        Overlays, menus, tooltips and toasts share one set of keyframes. Add <code>nx-motion</code> and the
        element fades in on the effects spring while it moves and scales in on the spatial spring. It runs
        on Radix’s <code>data-state</code> (<code>open</code> / <code>closed</code>), or on{' '}
        <code>data-motion=&quot;from-…&quot;</code> / <code>&quot;to-…&quot;</code> for anything else. Exits
        are faster and never overshoot. Keyframes rather than transitions, because Radix keeps closing
        content mounted until its exit animation ends.
      </p>
      <ul>
        <li>
          <code>nx-pop</code>: floating layers. Scales from 0.96 with a 4px nudge away from the side they open
          on (<code>data-side</code>).
        </li>
        <li>
          <code>nx-dialog</code>: modal dialogs. Scales from 0.96 and rises 8px.
        </li>
      </ul>
      <pre><code>{`<div className="nx-motion nx-pop" data-state={open ? 'open' : 'closed'} data-side="bottom">…</div>`}</code></pre>
      <p>Under reduced motion the travel and scale drop out and the crossfade stays.</p>

      <h2>Cards</h2>
      <p>
        <code>Card variant=&quot;interactive&quot;</code> lifts 2px on hover on the spatial spring and moves
        from elevation 1 to 2; leaving settles faster on the effects spring. Press sinks it to 0.99. The lift
        only applies where a real pointer hovers, so touch never gets stuck in the hover state, and reduced
        motion keeps the shadow change without the movement. The class is <code>nx-lift</code>.
      </p>
      <p>
        <code>effect=&quot;sheen&quot;</code> is opt-in: a soft light follows the pointer, with a brighter rim
        near the edge. It is off for touch, reduced motion and reduced transparency. Keep it to one or two
        hero cards per page.
      </p>

      <h2>Scroll</h2>
      <p>
        <code>AppHeader condense</code> shrinks the header from 64 to 52px and lifts it onto elevation 1 over
        the first 64px of page scroll. It is a CSS scroll timeline with no JavaScript; browsers without
        scroll timelines keep the static header.
      </p>

      <h2>Page transitions</h2>
      <p>
        Opt in with one import. The old page fades out fast; the new one fades in and rises 8px on the
        spatial spring. Multi-page sites get it on navigation with no other code. Give an element a{' '}
        <code>view-transition-name</code> to morph it between pages instead.
      </p>
      <pre><code>{`import '@nexub/themes/view-transitions'; // after the base theme`}</code></pre>
      <p>
        Single-page apps wrap the route update in <code>startViewTransition</code>. Where the browser has no
        View Transitions API, or on the server, the update just runs.
      </p>
      <pre><code>{`import { startViewTransition } from '@nexub/react';

startViewTransition(() => navigate('/settings'));`}</code></pre>
      <p>Under reduced motion page transitions are a crossfade only.</p>

      <h2>Focus</h2>
      <p>
        One ring for everything: a 3px <code>outline</code> in <code>--color-ring-default</code>, offset 2px.
        It follows <code>border-radius</code>, so it hugs capsules and fields, clears 3:1 on every surface, and
        uses the system <code>Highlight</code> colour in forced-colours mode. Fields show focus as a 2px primary
        border instead.
      </p>

      <h2>Touch targets</h2>
      <p>
        On coarse pointers (<code>pointer: coarse</code>), small controls get an invisible hit area of at
        least 44×44px, centred on the control, without changing its visual size or layout. It comes from the{' '}
        <code>nx-hit</code> class (an <code>::after</code> pseudo-element), which Button, IconButton, Checkbox,
        Radio and Switch apply. Add <code>nx-hit</code> to your own small controls; leave at least 44px between
        their centres so the hit areas don’t overlap.
      </p>

      <h2>Reduced motion</h2>
      <p>
        Under <code>prefers-reduced-motion: reduce</code> transitions and animations become instant changes.
        The exceptions are deliberate: overlays (<code>nx-motion</code>) and revealed content
        (<code>nx-reveal</code>) keep a short crossfade with no travel or scale, so a layer never pops in.
        Nothing that conveys meaning relies on motion alone.
      </p>
    </div>
  );
}

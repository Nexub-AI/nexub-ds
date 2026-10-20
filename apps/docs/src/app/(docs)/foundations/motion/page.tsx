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

      <h2>Focus</h2>
      <p>
        One ring for everything: a 3px <code>outline</code> in <code>--color-ring-default</code>, offset 2px.
        It follows <code>border-radius</code>, so it hugs capsules and fields, clears 3:1 on every surface, and
        uses the system <code>Highlight</code> colour in forced-colours mode. Fields show focus as a 2px primary
        border instead.
      </p>

      <h2>Reduced motion</h2>
      <p>
        Under <code>prefers-reduced-motion: reduce</code> every transition and animation collapses to an
        instant change. Nothing that conveys meaning relies on motion alone.
      </p>
    </div>
  );
}

import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Principles',
  description: 'Calm Depth: the six principles behind the Nexub design language.',
};

const eyebrow = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '0.5rem' };

const principles = [
  {
    title: 'Content leads, chrome recedes',
    body: 'Navigation and toolbars are quieter than the content they frame. Remove a divider before adding one; let spacing and tone separate things.',
    do: 'A tonal sidebar with no border; the active item is a soft pill.',
    dont: 'A saturated brand-blue sidebar item and a hard line around every region.',
  },
  {
    title: 'Hierarchy through tone and layout, not decoration',
    body: 'Surfaces step through tonal tiers (surface → container → elevated). Shadows are only for things that float. No gradients or coloured chips in product UI.',
    do: 'A card on surface-elevated with a soft hairline.',
    dont: 'Drop shadows on in-flow cards, gradient eyebrow chips, coloured icon tiles.',
  },
  {
    title: 'One accent, spent deliberately',
    body: 'Each view has one emphasised action. Everything else is neutral or tonal. Expressive emphasis (glass tint, the expressive spring) is for key moments.',
    do: 'One filled button; the rest tonal, outlined or text.',
    dont: 'Three filled buttons in different brand colours side by side.',
  },
  {
    title: 'Physical, interruptible motion',
    body: 'Movement uses springs, not durations. Critically damped by default; a little bounce only where something is being directly manipulated. Exits are faster than entrances.',
    do: 'ease-spatial-default on a panel; ease-expressive-fast on a toggle thumb.',
    dont: 'transition-all 300ms ease on everything.',
  },
  {
    title: 'Honest numbers and states',
    body: 'Tabular figures in data, the currency’s own minor unit, a true minus sign. Hover, pressed, selected and disabled are explicit states, never just opacity.',
    do: '<Amount value={-89.99} currency="USD" tone="auto" />',
    dont: 'opacity: 0.5 to mean disabled; proportional digits in a table.',
  },
  {
    title: 'Accessible by construction',
    body: 'Contrast is an input to the colour system, not a check afterwards: every role pair meets WCAG 2.2 AA in light, dark and high contrast, and a test fails the build if it ever stops. Every material has a solid fallback; every user preference is honoured.',
    do: 'Respect prefers-reduced-motion, -transparency and -contrast, and forced colours.',
    dont: 'White text on a glass panel over an unknown background.',
  },
];

export default function PrinciplesPage() {
  return (
    <div className="docs-prose">
      <p style={eyebrow}>Foundations</p>
      <h1>Principles</h1>
      <p>
        <strong>Calm Depth</strong>: calm, tonal surfaces for content; a thin layer of adaptive glass for
        the controls that float above it; motion that feels physical; colour only where it means something.
        It borrows Material 3’s structure, Apple’s restraint and material, and Wise’s clarity, and copies none of them.
      </p>
      <p>These six principles are the tie-breakers in every design and code review.</p>

      {principles.map((p, i) => (
        <section key={p.title}>
          <h2>
            {i + 1}. {p.title}
          </h2>
          <p>{p.body}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, margin: '0 0 1.5rem' }}>
            <div className="rounded-[16px] py-3 px-4 bg-[var(--color-success-container)] text-[var(--color-on-success-container)]">
              <strong>Do</strong>
              <p style={{ margin: '4px 0 0' }}>{p.do}</p>
            </div>
            <div className="rounded-[16px] py-3 px-4 bg-[var(--color-error-container)] text-[var(--color-on-error-container)]">
              <strong>Don’t</strong>
              <p style={{ margin: '4px 0 0' }}>{p.dont}</p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

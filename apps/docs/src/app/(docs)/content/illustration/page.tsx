import type { Metadata } from 'next';
export const dynamic = 'force-static';
export const metadata: Metadata = { title: 'Illustration — Content' };

const principles = [
  {
    title: 'Purposeful, not decorative',
    desc: 'Every illustration should earn its place. Use visuals to explain something that words alone cannot — empty states, onboarding, complex concepts. Never add an illustration just to fill space.',
  },
  {
    title: 'Inclusive and global',
    desc: 'Characters should reflect a diverse, global audience. Avoid culturally specific gestures, clothing, or settings unless intentional. When in doubt, use abstract or object-based illustrations.',
  },
  {
    title: 'Brand-consistent',
    desc: 'Nexub illustrations use the brand color palette as a base. Accent colors should map to semantic token values where possible so they adapt across light and dark themes.',
  },
  {
    title: 'Minimal and clear',
    desc: 'Keep illustrations simple. A single focal point, limited palette, and clean lines. Detailed and intricate illustrations add cognitive load — simplicity communicates faster.',
  },
];

const whenToUse = [
  { context: 'Empty states', guidance: 'An illustration helps users understand the empty state is intentional and shows them how to take action. Keep it simple and pair it with clear body copy.' },
  { context: 'Onboarding', guidance: 'Welcome screens and feature introductions benefit from an illustration to set the tone and reduce anxiety about starting.' },
  { context: 'Error pages (404, 500)', guidance: 'A subtle, non-alarming illustration softens the experience. Avoid dramatic imagery.' },
  { context: 'Feature callouts', guidance: 'Use to visually anchor a major new feature or empty category in a product.' },
];

export default function IllustrationPage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Content</p>
      <h1>Illustration</h1>
      <p>
        Illustrations are used sparingly across Nexub products to communicate ideas that words alone can&apos;t capture —
        empty states, errors, onboarding. Follow these guidelines to keep the visual language consistent.
      </p>

      <h2>Principles</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {principles.map((p) => (
          <div
            key={p.title}
            style={{
              padding: '1.25rem',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: 'var(--shape-container)',
              background: 'var(--color-surface-container-low)',
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{p.title}</div>
            <div style={{ fontSize: '0.84rem', color: 'var(--color-on-surface-variant)', lineHeight: 1.7 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      <h2>When to use illustrations</h2>
      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
        {whenToUse.map((w) => (
          <div
            key={w.context}
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr',
              gap: '1rem',
              padding: '0.875rem 1.25rem',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: 'var(--shape-container)',
              background: 'var(--color-surface-elevated)',
              alignItems: 'start',
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.84rem' }}>{w.context}</span>
            <span style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.84rem', lineHeight: 1.6 }}>{w.guidance}</span>
          </div>
        ))}
      </div>

      <h2>What to avoid</h2>
      <ul>
        <li><strong>Stock-photo style illustrations</strong> — they feel generic and break brand cohesion</li>
        <li><strong>Illustrations in data-dense views</strong> — tables, dashboards, and list pages should stay clean</li>
        <li><strong>Illustrations that duplicate the heading</strong> — the visual and the text should be complementary, not redundant</li>
        <li><strong>Dark-only or light-only assets</strong> — all illustrations must adapt to both themes using CSS or SVG token-based fill values</li>
        <li><strong>Animations on illustrations by default</strong> — only animate if it adds clarity (e.g. a loading illustration). Respect <code>prefers-reduced-motion</code>.</li>
      </ul>

      <h2>File formats</h2>
      <ul>
        <li>Use <strong>SVG</strong> for all product illustrations — scalable, small, and styleable with CSS</li>
        <li>Export at <strong>1× only</strong> — SVG is resolution-independent</li>
        <li>Where SVG is not possible (e.g. complex photographic backgrounds), use <strong>WebP</strong> with a PNG fallback</li>
      </ul>
    </div>
  );
}

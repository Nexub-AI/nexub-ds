import type { Metadata } from 'next';
export const dynamic = 'force-static';
export const metadata: Metadata = { title: 'Tone of Voice — Content' };

const attributes = [
  {
    name: 'Clear',
    desc: 'Say exactly what you mean. Cut filler. Use simple words where possible — not "utilise", just "use".',
    do: '"Your payment failed. Check your card details and try again."',
    dont: '"Unfortunately, we were unable to process the transaction at this time."',
  },
  {
    name: 'Direct',
    desc: 'Get to the point fast. Users scan, they don\'t read. Put the most important thing first.',
    do: '"Save changes" — short, action-oriented.',
    dont: '"Click here to go ahead and save your recent changes."',
  },
  {
    name: 'Human',
    desc: 'Write like a smart colleague, not a corporate manual. Contractions are fine. Warmth matters.',
    do: '"You\'re all set." / "Something went wrong — we\'re on it."',
    dont: '"The operation completed successfully." / "An error has been encountered."',
  },
  {
    name: 'Confident',
    desc: 'Don\'t over-apologise or hedge. Trust the user to handle real information.',
    do: '"Delete account" (with a clear confirmation step)',
    dont: '"Are you absolutely sure you want to maybe delete your account?"',
  },
];

export default function ToneOfVoicePage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-primary-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Content</p>
      <h1>Tone of Voice</h1>
      <p>
        Nexub products speak with one voice across every surface — from button labels to error messages to onboarding flows.
        This is how we sound: clear, direct, human, and confident.
      </p>

      <h2>Voice attributes</h2>
      <p>Four qualities define how Nexub products communicate. Every piece of UI copy should embody all four.</p>

      <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
        {attributes.map((a) => (
          <div
            key={a.name}
            style={{
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '1rem 1.25rem', background: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border-default)' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-brand-primary-500)', fontSize: '0.9rem' }}>{a.name}</span>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>{a.desc}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
              <div style={{ padding: '0.875rem 1.25rem', borderRight: '1px solid var(--color-border-default)', background: 'var(--color-semantic-success-bg)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-semantic-success-default)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>✅ Do</div>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-primary)', fontStyle: 'italic' }}>{a.do}</div>
              </div>
              <div style={{ padding: '0.875rem 1.25rem', background: 'var(--color-semantic-error-bg)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-semantic-error-default)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>❌ Don&apos;t</div>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-primary)', fontStyle: 'italic' }}>{a.dont}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2>What we are not</h2>
      <p>The voice is <strong>not</strong> overly formal, robotic, or corporate. It is also <strong>not</strong> casual to the point of being flippant — especially in error states or when money is involved.</p>
      <ul>
        <li>Not &ldquo;Please be advised that your session has expired&rdquo; → &ldquo;Your session expired. Sign in again.&rdquo;</li>
        <li>Not &ldquo;Oops! Something went totally bonkers 🙈&rdquo; for a payment failure</li>
        <li>Not passive voice → active voice always</li>
      </ul>

      <h2>Adapt by context</h2>
      <p>The four attributes stay constant, but the register adapts to the moment:</p>
      <ul>
        <li><strong>Error states</strong> — calm and helpful, never alarming</li>
        <li><strong>Success states</strong> — warm and affirming, brief</li>
        <li><strong>Empty states</strong> — encouraging, action-focused</li>
        <li><strong>Destructive actions</strong> — clear and honest, no softening of consequences</li>
        <li><strong>Onboarding</strong> — welcoming, confidence-building</li>
      </ul>
    </div>
  );
}

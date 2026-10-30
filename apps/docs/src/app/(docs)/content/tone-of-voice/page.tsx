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
      <p className="text-[0.8rem] font-semibold text-[var(--color-primary)] tracking-wider uppercase mb-2">Content</p>
      <h1>Tone of Voice</h1>
      <p>
        Nexub products speak with one voice across every surface — from button labels to error messages to onboarding flows.
        This is how we sound: clear, direct, human, and confident.
      </p>

      <h2>Voice attributes</h2>
      <p>Four qualities define how Nexub products communicate. Every piece of UI copy should embody all four.</p>

      <div className="grid gap-4 mb-8">
        {attributes.map((a) => (
          <div
            key={a.name}
            className="border border-[var(--color-outline-variant)] rounded-shape-container overflow-hidden"
          >
            <div className="py-4 px-5 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]">
              <span className="font-bold text-[var(--color-primary)] text-[0.9rem]">{a.name}</span>
              <span className="text-[var(--color-on-surface-variant)] text-[0.85rem] ms-3">{a.desc}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
              <div style={{ padding: '0.875rem 1.25rem', borderRight: '1px solid var(--color-outline-variant)', background: 'var(--color-success-container)' }}>
                <div className="text-[0.68rem] font-bold text-[var(--color-success)] uppercase tracking-wider mb-1">✅ Do</div>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-on-surface)', fontStyle: 'italic' }}>{a.do}</div>
              </div>
              <div className="py-3.5 px-5 bg-[var(--color-error-container)]">
                <div className="text-[0.68rem] font-bold text-[var(--color-error)] uppercase tracking-wider mb-1">❌ Don&apos;t</div>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-on-surface)', fontStyle: 'italic' }}>{a.dont}</div>
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

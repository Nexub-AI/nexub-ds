import type { Metadata } from 'next';
export const dynamic = 'force-static';
export const metadata: Metadata = { title: 'Vocabulary — Content' };

const vocab: { use: string; avoid: string; notes: string }[] = [
  { use: 'Sign in', avoid: 'Login / Log in', notes: 'Use "sign in" and "sign out" consistently. "Log in" sounds technical.' },
  { use: 'Sign up', avoid: 'Register / Create an account', notes: '"Sign up" is friendlier. Use for new account creation.' },
  { use: 'Remove', avoid: 'Delete (for soft deletes)', notes: 'Use "Delete" only when the action is permanent and irreversible.' },
  { use: 'Email', avoid: 'E-mail / email address (as label)', notes: 'Single word, no hyphen. Use "Email" as a label, not "Email address".' },
  { use: 'Members', avoid: 'Users / Employees', notes: '"Members" for people in a workspace. "Users" is too generic.' },
  { use: 'Workspace', avoid: 'Organization / Company', notes: 'The top-level Nexub entity is a "workspace".' },
  { use: 'Plan', avoid: 'Subscription / Package / Tier', notes: '"Plan" is what the user is on. Avoid jargon.' },
  { use: 'Payment method', avoid: 'Credit card / Card details', notes: 'Inclusive of bank accounts, cards, and other methods.' },
  { use: 'Dashboard', avoid: 'Overview / Home / Panel', notes: 'The main landing page after sign-in is the "Dashboard".' },
  { use: 'Settings', avoid: 'Preferences / Configuration / Admin', notes: '"Settings" for user-facing config. "Admin" only for admin-level sections.' },
  { use: 'Invite', avoid: 'Add / Send an invite', notes: '"Invite" as a verb. "Send invite" → just "Invite [name]".' },
  { use: 'Export', avoid: 'Download / Save as', notes: '"Export" for moving data out of the product. "Download" for files.' },
];

const glossary: { term: string; def: string }[] = [
  { term: 'Workspace', def: 'The top-level account container. A workspace has members, plans, and settings.' },
  { term: 'Member', def: 'A person who belongs to a workspace. Members have roles.' },
  { term: 'Role', def: 'A set of permissions within a workspace (e.g. Owner, Admin, Member, Viewer).' },
  { term: 'Plan', def: 'The billing tier a workspace is subscribed to (e.g. Free, Pro, Enterprise).' },
  { term: 'Token', def: 'A design token — a named variable representing a design decision (color, spacing, radius).' },
  { term: 'Tone', def: 'A semantic color variant applied to a component (info, success, warning, danger, neutral).' },
];

export default function VocabularyPage() {
  return (
    <div className="docs-prose">
      <p className="text-[0.8rem] font-semibold text-[var(--color-primary)] tracking-wider uppercase mb-2">Content</p>
      <h1>Vocabulary</h1>
      <p>
        Consistent terminology builds trust and reduces confusion. Use these approved terms across all Nexub products and documentation.
      </p>

      <h2>Preferred terms</h2>
      <div className="overflow-x-auto mb-8">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-outline-variant)', background: 'var(--color-surface-container-low)' }}>
              {['Use this', 'Not this', 'Notes'].map((h) => (
                <th key={h} className="text-start py-2.5 px-3.5 font-bold text-[var(--color-on-surface-variant)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vocab.map((v, i) => (
              <tr key={v.use} style={{ borderBottom: i < vocab.length - 1 ? '1px solid var(--color-surface-container-high)' : 'none' }}>
                <td className="py-2.5 px-3.5 font-bold text-[var(--color-success)] font-mono text-[0.8rem] whitespace-nowrap">{v.use}</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-error)', fontFamily: 'var(--font-family-mono)', fontSize: '0.8rem', whiteSpace: 'nowrap', textDecoration: 'line-through', opacity: 0.7 }}>{v.avoid}</td>
                <td className="py-2.5 px-3.5 text-[var(--color-on-surface-variant)] text-[0.82rem]">{v.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Glossary</h2>
      <p>Key terms and their canonical definitions for the Nexub product ecosystem.</p>
      <div className="grid gap-3 mb-8">
        {glossary.map((g) => (
          <div
            key={g.term}
            style={{
              padding: '0.875rem 1.25rem',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: 'var(--shape-container)',
              background: 'var(--color-surface-container-low)',
              display: 'grid',
              gridTemplateColumns: '140px 1fr',
              gap: '1rem',
              alignItems: 'start',
            }}
          >
            <span className="font-mono font-bold text-[var(--color-primary)] text-[0.84rem]">{g.term}</span>
            <span className="text-[var(--color-on-surface-variant)] text-[0.84rem] leading-relaxed">{g.def}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

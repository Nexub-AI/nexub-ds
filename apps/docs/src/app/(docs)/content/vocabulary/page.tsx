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
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-primary-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Content</p>
      <h1>Vocabulary</h1>
      <p>
        Consistent terminology builds trust and reduces confusion. Use these approved terms across all Nexub products and documentation.
      </p>

      <h2>Preferred terms</h2>
      <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border-default)', background: 'var(--color-bg-subtle)' }}>
              {['Use this', 'Not this', 'Notes'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vocab.map((v, i) => (
              <tr key={v.use} style={{ borderBottom: i < vocab.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-semantic-success-default)', fontFamily: 'var(--font-family-mono)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{v.use}</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-semantic-error-default)', fontFamily: 'var(--font-family-mono)', fontSize: '0.8rem', whiteSpace: 'nowrap', textDecoration: 'line-through', opacity: 0.7 }}>{v.avoid}</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>{v.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Glossary</h2>
      <p>Key terms and their canonical definitions for the Nexub product ecosystem.</p>
      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
        {glossary.map((g) => (
          <div
            key={g.term}
            style={{
              padding: '0.875rem 1.25rem',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-bg-subtle)',
              display: 'grid',
              gridTemplateColumns: '140px 1fr',
              gap: '1rem',
              alignItems: 'start',
            }}
          >
            <span style={{ fontFamily: 'var(--font-family-mono)', fontWeight: 700, color: 'var(--color-brand-primary-500)', fontSize: '0.84rem' }}>{g.term}</span>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.84rem', lineHeight: 1.6 }}>{g.def}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import { Card, Text } from '@nexub/react';
import { DocTable, PageIntro, Section } from '@/components/kit';

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
  { term: 'Token', def: 'A design token: a named variable representing a design decision (color, spacing, radius).' },
  { term: 'Tone', def: 'A semantic color variant applied to a component (info, success, warning, danger, neutral).' },
];

export default function VocabularyPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Content"
        title="Vocabulary"
        lead="Consistent terminology builds trust and reduces confusion. Use these approved terms across all Nexub products and documentation."
      />

      <Section id="preferred-terms" title="Preferred terms">
        <DocTable
          caption="Preferred terms"
          head={['Use this', 'Not this', 'Notes']}
          rows={vocab.map((v) => [
            <span key="u" className="whitespace-nowrap font-semibold text-[var(--color-success)]">{v.use}</span>,
            <span key="a" className="text-[var(--color-error)] line-through decoration-1">{v.avoid}</span>,
            <span key="n" className="text-[var(--color-on-surface-variant)]">{v.notes}</span>,
          ])}
        />
      </Section>

      <Section id="glossary" title="Glossary" description="Key terms and their canonical definitions for the Nexub product ecosystem.">
        <div className="grid gap-3">
          {glossary.map((g) => (
            <Card key={g.term} className="grid gap-1 p-4 sm:grid-cols-[140px_1fr] sm:gap-4">
              <Text weight="semibold" className="font-mono !text-[var(--color-primary)]">{g.term}</Text>
              <Text tone="secondary">{g.def}</Text>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

import type { Metadata } from 'next';
export const dynamic = 'force-static';
export const metadata: Metadata = { title: 'Grammar & Style — Content' };

const rules: { rule: string; do: string; dont: string }[] = [
  { rule: 'Sentence case for UI', do: 'Save changes · Add new member · Are you sure?', dont: 'Save Changes · Add New Member · Are You Sure?' },
  { rule: 'Title case for headings', do: 'Getting Started · Team Settings · Billing & Plans', dont: 'Getting started · Team settings · Billing & plans' },
  { rule: 'Button copy starts with a verb', do: 'Save · Delete · Cancel · Export CSV', dont: 'OK · Confirm · Yes · Proceed' },
  { rule: 'No trailing punctuation on labels', do: 'Full name · Email address · Due date', dont: 'Full name: · Email address. · Due date —' },
  { rule: 'Oxford comma', do: 'Read, write, and delete permissions', dont: 'Read, write and delete permissions' },
  { rule: 'Contractions are fine', do: "You're all set · It's saved · We'll send you a link", dont: 'You are all set · It is saved · We will send you a link' },
  { rule: 'Numbers: spell out 1–9, use digits 10+', do: 'Three items · 10 members · 42 results', dont: '3 items · Ten members · Forty-two results' },
  { rule: 'Use the % symbol, not "percent"', do: '95% confidence · 0% tax', dont: '95 percent confidence · 0 percent tax' },
];

export default function GrammarStylePage() {
  return (
    <div className="docs-prose">
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-brand-primary-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Content</p>
      <h1>Grammar &amp; Style</h1>
      <p>
        Consistency in punctuation, capitalisation, and word choice makes the product feel polished and trustworthy.
        Follow these rules across every UI surface.
      </p>

      <h2>Quick-reference rules</h2>
      <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border-default)', background: 'var(--color-bg-subtle)' }}>
              {['Rule', '✅ Do', '❌ Don\'t'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 700, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => (
              <tr key={r.rule} style={{ borderBottom: i < rules.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>{r.rule}</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-semantic-success-default)', fontFamily: 'var(--font-family-mono)', fontSize: '0.78rem' }}>{r.do}</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-semantic-error-default)', fontFamily: 'var(--font-family-mono)', fontSize: '0.78rem' }}>{r.dont}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Error messages</h2>
      <p>Error messages should do three things: tell users what happened, why it happened (if helpful), and what to do next.</p>
      <ul>
        <li><strong>Required field:</strong> &ldquo;Enter your email address&rdquo; — not &ldquo;This field is required&rdquo;</li>
        <li><strong>Invalid format:</strong> &ldquo;Email must include an @ sign&rdquo; — not &ldquo;Invalid email&rdquo;</li>
        <li><strong>Server error:</strong> &ldquo;Something went wrong. Try again or contact support.&rdquo; — not &ldquo;Error 500&rdquo;</li>
        <li><strong>Permission denied:</strong> &ldquo;You don&apos;t have access to this page. Ask your admin.&rdquo;</li>
      </ul>

      <h2>Placeholder text</h2>
      <p>Placeholder copy in inputs should give a concrete example, not repeat the label.</p>
      <ul>
        <li><strong>Label:</strong> Email address → <strong>Placeholder:</strong> name@company.com</li>
        <li><strong>Label:</strong> Search → <strong>Placeholder:</strong> Search components…</li>
        <li><strong>Label:</strong> Amount → <strong>Placeholder:</strong> 0.00</li>
      </ul>
    </div>
  );
}

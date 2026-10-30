import type { Metadata } from 'next';
import { DoDont, DocTable, PageIntro, Section } from '@/components/kit';

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
      <PageIntro
        eyebrow="Content"
        title="Grammar & Style"
        lead="Consistency in punctuation, capitalisation, and word choice makes the product feel polished and trustworthy. Follow these rules across every UI surface."
      />

      <Section id="quick-reference-rules" title="Quick-reference rules">
        <div className="grid gap-4">
          {rules.map((r) => (
            <DoDont key={r.rule} title={r.rule} good={r.do} bad={r.dont} />
          ))}
        </div>
      </Section>

      <Section
        id="error-messages"
        title="Error messages"
        description="Error messages should do three things: tell users what happened, why it happened (if helpful), and what to do next."
      >
        <div className="grid gap-4">
          <DoDont title="Required field" good="“Enter your email address”" bad="“This field is required”" />
          <DoDont title="Invalid format" good="“Email must include an @ sign”" bad="“Invalid email”" />
          <DoDont title="Server error" good="“Something went wrong. Try again or contact support.”" bad="“Error 500”" />
          <DoDont title="Permission denied" good="“You don’t have access to this page. Ask your admin.”" bad="“403 Forbidden”" />
        </div>
      </Section>

      <Section
        id="placeholder-text"
        title="Placeholder text"
        description="Placeholder copy in inputs should give a concrete example, not repeat the label. It never replaces the label."
      >
        <DocTable
          caption="Placeholder examples"
          head={['Label', 'Placeholder']}
          rows={[
            ['Email', 'name@company.com'],
            ['Search', 'Search components…'],
            ['Amount', '0.00'],
          ]}
          mono={[1]}
        />
      </Section>
    </div>
  );
}

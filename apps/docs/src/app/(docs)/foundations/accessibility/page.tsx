import type { Metadata } from 'next';
import { Badge } from '@nexub/react';
import report from '@nexub/react/accessibility.json';
import { DocTable, List, Note, PageIntro, Prose, Section } from '@/components/kit';
import { DocsLink } from '@/components/layout/DocsLink';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Accessibility conformance',
  description: 'The WCAG 2.2 AA conformance report for every Nexub component: what is tested automatically, what is documented, and what is not covered yet.',
};

const RESULT = {
  pass: <Badge tone="success" variant="soft" size="sm">Pass</Badge>,
  'pass with documented exception': <Badge tone="warning" variant="soft" size="sm">Pass, with exception</Badge>,
  'not covered': <Badge tone="neutral" variant="outline" size="sm">Not covered</Badge>,
} as const;

export default function AccessibilityPage() {
  const comps = report.components;
  const n = (r: string) => comps.filter((c) => c.automated === r).length;
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Foundations"
        title="Accessibility conformance"
        lead={
          <>
            Nexub targets {report.standard}. This report shows the evidence for each component in v{report.version}:
            what runs automatically on every change, what is documented, and what is not covered yet. It is generated
            from the test suite and the docs, and ships in the package as <code>@nexub/react/accessibility.json</code>{' '}
            for procurement and audit tooling.
          </>
        }
      />

      <Section id="method" title="How it is tested">
        <List
          items={[
            <><strong>Automated.</strong> {report.method.automated}</>,
            <><strong>Contrast.</strong> {report.method.contrast}</>,
            <><strong>Manual.</strong> {report.method.manual}</>,
          ]}
        />
        <DocTable
          head={['Result', 'Components']}
          rows={[
            [RESULT.pass, String(n('pass'))],
            [RESULT['pass with documented exception'], String(n('pass with documented exception'))],
            [RESULT['not covered'], String(n('not covered'))],
          ]}
        />
        {report.exceptions.length > 0 && (
          <Note tone="warning" title="Accepted exceptions">
            {report.exceptions.map((e) => e.component).join(', ')}: <code>{report.exceptions[0]!.rules.join(', ')}</code>{' '}
            (WCAG 2.5.3 Label in Name). The account button&apos;s visible content is an avatar monogram such as
            &ldquo;SL&rdquo;; axe reads the initials as a text label, but they are image content, and its accessible name
            (&ldquo;Account: Sam Lee&rdquo;) is the useful one.
          </Note>
        )}
        <Prose>
          &ldquo;Not covered&rdquo; means no Storybook story renders the component yet, so axe does not run on it. The
          marketing sections are composed of covered components but are not tested as sections. Closing these gaps is part
          of the 4.0 work.
        </Prose>
      </Section>

      <Section id="components" title="By component">
        <DocTable
          head={['Component', 'Automated (axe, light and dark)', 'Keyboard', 'Screen reader']}
          rows={comps.map((c) => [
            <DocsLink key="n" href={`/${c.package === '@nexub/react' ? 'components' : 'patterns'}/${c.slug}`}>{c.name}</DocsLink>,
            RESULT[c.automated as keyof typeof RESULT],
            c.keyboard.length ? `${c.keyboard.length} documented` : '—',
            c.screenReader.length ? `${c.screenReader.length} documented` : '—',
          ])}
        />
        <Prose>Each component page has the details under Accessibility.</Prose>
      </Section>
    </div>
  );
}

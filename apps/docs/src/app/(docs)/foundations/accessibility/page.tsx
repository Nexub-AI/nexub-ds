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

// Manual screen-reader scripts for the complex components. Run each in VoiceOver
// (macOS Safari) and NVDA (Windows Firefox or Chrome) against the docs examples;
// "Hear" is the essential content, not the exact wording, which varies by reader.
const SCRIPTS: { component: string; slug: string; page?: false; steps: [string, string][] }[] = [
  {
    component: 'DataTable (grid)',
    slug: 'data-table',
    steps: [
      ['Tab into the table', 'Grid, its name, the first header (and "sorted ascending/descending" if sorted)'],
      ['Arrow Down, then Arrow Right', 'Each cell’s content with its column header; a checkbox cell reads "Select row, checkbox"'],
      ['Space on a row checkbox', '"Checked", then the selection count from the live region'],
      ['Home, End, Ctrl+Home, Ctrl+End', 'Focus lands on the row’s first or last cell, then the grid’s corners'],
      ['Tab', 'Focus leaves the table in one press; Shift+Tab returns to the last cell'],
    ],
  },
  {
    component: 'Autocomplete / Combobox (popover)',
    slug: 'autocomplete',
    steps: [
      ['Tab to the field', 'Its label, "combobox", "collapsed"'],
      ['Type two letters', '"Expanded" and the number of results; no focus jump'],
      ['Arrow Down', 'Each option and its position ("2 of 5")'],
      ['Enter', 'The chosen value in the field; the list collapses'],
      ['Type text that matches nothing, with onCreate', '"Create …" as the last option'],
    ],
  },
  {
    component: 'MultiSelect',
    slug: 'multi-select',
    steps: [
      ['Tab to the field', 'Its label, "combobox", and the selected values'],
      ['Arrow Down, Enter on an option', '"Selected"; the chip appears and the list stays open'],
      ['Backspace in the empty input', 'The last chip is removed and announced'],
      ['Tab to a chip’s remove button', '"Remove <value>, button"'],
    ],
  },
  {
    component: 'DateRangePicker',
    slug: 'date-range-picker',
    steps: [
      ['Enter on the trigger', 'Dialog opens; focus on a preset or today’s date'],
      ['Arrow keys in the calendar', 'Full dates ("Monday, November 2, 2026"), with "today" and "selected"'],
      ['Enter on two dates', 'The range in the trigger; the dialog closes and focus returns to it'],
      ['Read the footer (time zone set)', 'The time zone name the range is in'],
    ],
  },
  {
    component: 'FilterBuilder',
    slug: 'filter-builder',
    steps: [
      ['Tab through a rule', 'Field, Operator and Value, each with its label'],
      ['Activate "Add filter"', 'A new rule; focus stays on the button'],
      ['Read the group', '"Filter group, match all/any" for each nested group'],
      ['Activate "Remove filter"', 'The rule is gone; focus moves to the next control'],
    ],
  },
  {
    component: 'SavedViews',
    slug: 'saved-views',
    steps: [
      ['Enter on the trigger', 'Menu; the current view marked "checked"'],
      ['Choose "Save view"', 'Dialog with the "View name" field focused'],
      ['Save', 'Dialog closes; the new view name in the trigger'],
    ],
  },
  {
    component: 'AlertDialog with Confirm',
    slug: 'alert-dialog',
    steps: [
      ['Open the dialog', '"Alert dialog", its title and description; focus on Cancel'],
      ['Tab to the action', '"Dimmed"/"unavailable" until the text is typed'],
      ['Type the confirm text, then Tab', 'The action is now available'],
      ['Escape', 'Dialog closes; focus returns to the trigger'],
    ],
  },
  {
    component: 'FileUpload',
    slug: 'file-upload',
    page: false,
    steps: [
      ['Tab to the dropzone', 'Its label and accepted types'],
      ['Add a file that is too large', 'The error from the live region ("… is larger than …")'],
      ['Read an uploading item', 'File name and "40% uploaded"; "Cancel upload of <name>, button"'],
    ],
  },
  {
    component: 'CommandPalette',
    slug: 'command-palette',
    page: false,
    steps: [
      ['Press the shortcut', 'Dialog opens; focus in the search field'],
      ['Type, then Arrow Down', 'Results by group, each "option" with its position'],
      ['Enter', 'The command runs; the palette closes and focus returns'],
    ],
  },
  {
    component: 'OTPInput',
    slug: 'otp-input',
    steps: [
      ['Tab into the code', '"Verification code", digit 1 of 6'],
      ['Type the digits', 'Focus moves on after each digit without re-announcing the label'],
      ['Paste a full code', 'All digits fill; focus on the last'],
    ],
  },
];

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

      <Section
        id="screen-reader-scripts"
        title="Screen-reader test scripts"
        description="Manual checks for the complex components. Run each in VoiceOver (macOS Safari) and NVDA (Windows Firefox or Chrome) on the component's docs examples."
      >
        {SCRIPTS.map((s) => (
          <Section key={s.slug} level={3} id={`sr-${s.slug}`} title={s.page === false ? s.component : <DocsLink href={`/components/${s.slug}`}>{s.component}</DocsLink>}>
            <DocTable head={['Do', 'Hear']} rows={s.steps.map(([d, h]) => [d, h])} />
          </Section>
        ))}
      </Section>
    </div>
  );
}

import type { Metadata } from 'next';
import { DocTable, PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { MigrationPicker } from '@/components/docs/MigrationPicker';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Migrating to 7.0',
  description: 'What 7.0 removes (StepIndicator and inline Autocomplete) and how to upgrade.',
};

export default function MigratingTo7Page() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Migrating to 7.0">
        <MigrationPicker />
      </PageIntro>
      <p>
        7.0 is a cleanup release. It removes two things 6.x replaced and adds nothing you have to adopt. Everything new in
        6.1&ndash;6.8 (Form, TreeView, Stepper, ResizablePanels, Sortable, Kanban and the rest) keeps working as it is. 6.9
        is the release candidate: upgrade to it, run the codemod below, and fix what it reports.
      </p>
      <DocTable
        head={['Removed in 7.0', 'What to do']}
        rows={[
          [
            <>
              <code>StepIndicator</code> from <code>@nexub/patterns</code>.
            </>,
            <>
              Use <code>Stepper</code> from <code>@nexub/react</code> with <code>orientation=&quot;vertical&quot;</code>, and
              rename <code>currentStep</code> to <code>current</code>. Your <code>steps</code> array works as it is. Add{' '}
              <code>onStepChange</code> if people should be able to go back to finished steps.
            </>,
          ],
          [
            <>
              <code>Autocomplete</code> <code>mode=&quot;inline&quot;</code> (the list always shown under the input). The
              popover has been the default since 6.0, so <code>mode</code> goes too.
            </>,
            <>
              Remove <code>mode</code>. If you need a list that is always open, build it from the <code>Combobox</code> parts
              (<code>Combobox.Root</code>, <code>Combobox.Input</code>, <code>Combobox.List</code>).
            </>,
          ],
        ]}
      />
      <p>The default codemod rules report both. They don&rsquo;t rewrite them, since each needs a choice:</p>
      <CodeBlock lang="bash" code={`npx nexub-migrate src --rules removed-in-7`} />
      <p>
        One change of plan from the 6.x roadmap: Autocomplete stays. It is the ready-made single-select field, as
        MultiSelect is the multi-select one, and both are built on the Combobox parts. Only its second layout is removed.
      </p>
    </div>
  );
}

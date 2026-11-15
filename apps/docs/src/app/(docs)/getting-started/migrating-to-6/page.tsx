import type { Metadata } from 'next';
import { DocTable, PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { MigrationPicker } from '@/components/docs/MigrationPicker';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Migrating to 6.0',
  description: 'What 6.0 changes (enterprise defaults for Autocomplete, DataTable and FilterBar) and how to upgrade.',
};

export default function MigratingTo6Page() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Migrating to 6.0">
        <MigrationPicker />
      </PageIntro>
      <p>
        6.0 turns on three defaults that 5.x shipped as opt-ins. No component is removed and no prop is renamed. Each change
        is visible in the UI, so decide per app: take the new default, or pin the 5.x one. 5.9 is the release candidate:
        upgrade to it first and check your screens with the new props set.
      </p>
      <DocTable
        head={['Changes in 6.0', 'What to do']}
        rows={[
          [
            <>
              <code>Autocomplete</code> opens its list in a popover anchored to the field (<code>mode=&quot;popover&quot;</code>
              ). In 5.x the list rendered inline, pushing content below it down.
            </>,
            <>
              Nothing, to take the popover. To keep the inline list, set <code>mode=&quot;inline&quot;</code>.
            </>,
          ],
          [
            <>
              <code>DataTable</code> and <code>DataTableVirtual</code> with <code>enableRowSelection</code> show the checkbox
              column (with select-page and &ldquo;Select all N&rdquo;) by default.
            </>,
            <>
              Remove any checkbox column you built yourself. To keep selection without the column, set{' '}
              <code>selectionColumn={'{false}'}</code>.
            </>,
          ],
          [
            <>
              <code>FilterBar</code> names its search field from <code>searchPlaceholder</code> when you set one without{' '}
              <code>searchLabel</code> (&ldquo;Search invoices&hellip;&rdquo; is named &ldquo;Search invoices&rdquo;, not
              &ldquo;Search&rdquo;).
            </>,
            <>
              Nothing, in most apps. Set <code>searchLabel</code> when the placeholder is an example (&ldquo;e.g.
              INV-2041&rdquo;) rather than a description.
            </>,
          ],
        ]}
      />
      <p>To keep 5.x behaviour everywhere in one step, run the opt-in codemod rule. It only adds the props above:</p>
      <CodeBlock lang="bash" code={`npx nexub-migrate src --rules keep-5-defaults --write`} />
      <p>
        It reports any tag that spreads props (<code>{'<Autocomplete {...rest} />'}</code>), since the spread may already
        set them. Run it without <code>--write</code> first to preview.
      </p>
    </div>
  );
}

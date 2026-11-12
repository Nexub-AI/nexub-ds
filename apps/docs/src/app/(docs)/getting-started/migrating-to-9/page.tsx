import type { Metadata } from 'next';
import { DocTable, PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { MigrationPicker } from '@/components/docs/MigrationPicker';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Migrating to 9.0',
  description: 'What 9.0 removed (the classic style, Button’s legacy variants, the 8.5 parity aliases, hidePassword) and how to move off it.',
};

export default function MigratingTo9Page() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Migrating to 9.0">
        <MigrationPicker />
      </PageIntro>
      <p>
        9.0 removes, and adds nothing. Everything on this page was deprecated in 8.x and still works on 8.9. Move off
        each item on 8.9, with the codemod doing most of it, and 9.0 is a version bump.
      </p>

      <h2>Removed in 9.0</h2>
      <DocTable
        head={['Removed in 9.0', 'Use instead', 'Codemod']}
        rows={[
          [
            <>
              The <code>classic</code> style (the 7.x Material 3 look): <code>data-style=&quot;classic&quot;</code> on the
              web, and the <code>style</code> prop on <code>NexubNativeProvider</code> (both values). Deprecated in 8.0.
            </>,
            <>Signature, the only style. Remove the attribute or prop, then check your screens.</>,
            <><code>changes-in-9</code> reports it</>,
          ],
          [
            <>
              Button&rsquo;s legacy variants <code>primary</code>, <code>secondary</code>, <code>outline</code> and{' '}
              <code>ghost</code>. Deprecated in 8.4.
            </>,
            <>
              <code>filled</code>, <code>tonal</code>, <code>outlined</code> and <code>text</code> (same styles).
            </>,
            <><code>button-aliases</code> rewrites literals and reports expressions</>,
          ],
          [
            <>
              <code>onChange</code> on <code>DatePicker</code>, <code>DateTimePicker</code> and <code>NumberInput</code>.
              Deprecated in 8.5.
            </>,
            <><code>onValueChange</code> (same arguments), like every other Nexub input.</>,
            <><code>changes-in-9</code> rewrites it</>,
          ],
          [
            <>
              React Native: <code>dismissable</code> on <code>Dialog</code> and <code>BottomSheet</code>;{' '}
              <code>minimumDate</code> / <code>maximumDate</code> on <code>DateTimeField</code>;{' '}
              <code>direction=&quot;row&quot; | &quot;stack&quot;</code> on <code>ButtonGroup</code>. Deprecated in 8.5.
            </>,
            <>
              <code>dismissible</code>; <code>minDate</code> / <code>maxDate</code>;{' '}
              <code>orientation=&quot;horizontal&quot; | &quot;vertical&quot;</code>. The web names.
            </>,
            <><code>changes-in-9</code> rewrites them and reports a <code>direction</code> expression</>,
          ],
          [
            <>
              The <code>hidePassword</code> message. Deprecated in 7.2.
            </>,
            <>
              Nothing: <code>PasswordInput</code> keeps one name (&ldquo;Show password&rdquo;) and reports its state with{' '}
              <code>aria-pressed</code>. Delete the key from your message overrides.
            </>,
            <><code>changes-in-9</code> reports it</>,
          ],
        ]}
      />
      <CodeBlock
        lang="tsx"
        code={`<Button variant="filled">Pay</Button>             {/* was variant="primary" */}
<DatePicker value={date} onValueChange={setDate} />  {/* was onChange */}

// React Native
<BottomSheet dismissible={false} open={open} onOpenChange={setOpen}>…</BottomSheet>
<DateTimeField label="Date" value={d} onValueChange={setD} minDate={new Date()} />
<ButtonGroup orientation="vertical">…</ButtonGroup>`}
      />

      <h2>Find what to change</h2>
      <p>Run both rules on 8.9. They rewrite what is mechanical and list the rest with a file and line:</p>
      <CodeBlock lang="bash" code={`npx nexub-migrate src --rules changes-in-9,button-aliases           # dry run
npx nexub-migrate src --rules changes-in-9,button-aliases --write   # apply
npx nexub-migrate src --rules changes-in-9,button-aliases --check   # CI: exit 1 if anything is left`} />
      <p>
        TypeScript helps too: the removed props and the <code>ButtonLegacyVariant</code> names are marked{' '}
        <code>@deprecated</code> on 8.x, so your editor strikes them through.
        When the codemod and your editor are both quiet, upgrade.
      </p>
    </div>
  );
}

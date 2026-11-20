import type { Metadata } from 'next';
import Link from 'next/link';
import { DocTable, PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { MigrationPicker } from '@/components/docs/MigrationPicker';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Migrating to 11.0',
  description:
    '11.0 removes the four hand-written product theme files and makes overlays open as a bottom sheet on small screens by default. 10.9 is its release candidate, on the next tag.',
};

export default function MigratingTo11Page() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Migrating to 11.0">
        <MigrationPicker />
      </PageIntro>
      <p>
        11.0 is the first major since versions began to follow semver, so it is the first one that means &ldquo;something
        breaks&rdquo;. Two things change, and both can be cleared on 10.x before you upgrade. 11.0 is not released yet:
        10.9 is its release candidate.
      </p>

      <h2>Try the release candidate</h2>
      <p>
        10.9.x publishes under the npm tag <code>next</code>. <code>latest</code> stays on 10.8.x until 11.0.0, so a
        plain install does not move you. Move every <code>@nexub</code> package you use together:
      </p>
      <CodeBlock lang="bash" code={`npm install @nexub/react@next @nexub/themes@next @nexub/tokens@next @nexub/icons@next`} />
      <p>
        10.9 breaks nothing: it is 10.x with the warnings and the codemod rule for 11.0. Run the rule, clear what it
        finds, and 11.0 is a version bump.
      </p>
      <CodeBlock
        lang="bash"
        code={`npx nexub-migrate --rules changes-in-11          # dry run: the diff and the items to review
npx nexub-migrate --rules changes-in-11 --write  # apply the import rewrites
npx nexub-migrate --rules changes-in-11 --check  # CI: exit 1 while anything is left`}
      />

      <h2>What breaks: the four product theme files</h2>
      <DocTable
        head={['Removed in 11.0', 'Use instead', 'Codemod']}
        rows={[
          [
            <>
              <code>@nexub/themes/leap</code>, <code>@nexub/themes/bookub</code>, <code>@nexub/themes/payub</code> and{' '}
              <code>@nexub/themes/founderub</code>, the hand-written product files. Deprecated in 10.3.
            </>,
            <>
              <code>@nexub/themes/products</code>, the generated map. It sets the same accent under{' '}
              <code>data-product</code> for these four and for every other app, so the attribute and{' '}
              <code>ThemeProvider product</code> stay as they are.
            </>,
            <>
              <code>changes-in-11</code> rewrites the import and reports the duplicate lines to delete
            </>,
          ],
        ]}
      />
      <CodeBlock
        lang="css"
        code={`/* before */
@import '@nexub/themes/leap';
@import '@nexub/themes/payub';

/* after: one import covers every product */
@import '@nexub/themes/products';`}
      />
      <p>
        If you import <code>@nexub/react/styles.css</code> and none of the four files yourself, there is nothing to do:
        the stylesheet moves to the generated map in 11.0.
      </p>

      <h2>What changes by default: overlays on small screens</h2>
      <p>
        Since 10.6 pickers and menus can open as a bottom sheet with the <code>sheet</code> prop. In 11.0 its default
        goes from <code>false</code> to <code>&quot;auto&quot;</code>: a bottom sheet below 768px, the usual popover
        above. It is done in CSS, so nothing flashes after hydration.
      </p>
      <DocTable
        head={['Package', 'Components with the prop']}
        rows={[
          [
            <code key="p">@nexub/react</code>,
            <>
              <code>Select.Content</code>, <code>MultiSelect</code>, <code>Autocomplete</code>, <code>DatePicker</code>,{' '}
              <code>DateRangePicker</code>, <code>DateTimePicker</code>, <code>DropdownMenu.Content</code>,{' '}
              <code>ContextMenu.Content</code>, <code>Menubar.Content</code>, <code>Popover.Content</code>,{' '}
              <code>SplitButton</code>, <code>SavedViews</code>, <code>Breadcrumb.Trail</code>,{' '}
              <code>AlertDialog.Content</code>, <code>CommandPalette</code>
            </>,
          ],
          [
            <code key="p">@nexub/patterns</code>,
            <>
              <code>NotificationCenter</code>, <code>AppLauncher</code>, <code>AppHeader</code>
            </>,
          ],
        ]}
      />
      <CodeBlock
        lang="tsx"
        code={`<Select.Content sheet="auto">…</Select.Content>   {/* the 11.0 default: adopt it today */}
<Select.Content sheet={false}>…</Select.Content>  {/* keep a popover on small screens */}`}
      />
      <p>
        The codemod does not rewrite these, because either answer can be right. It reports each overlay that passes no{' '}
        <code>sheet</code> prop; look at the screen on a phone and choose. See{' '}
        <Link href="/components/select">Select</Link> for the sheet layout.
      </p>

      <h2>New since 10.2, worth adopting</h2>
      <p>All of it is additive and already in 10.x.</p>
      <DocTable
        head={['Version', 'What it added']}
        rows={[
          [
            '10.3',
            <>
              Vivid on app surfaces: page headers, <Link href="/patterns/stat-card">StatCard</Link>, sidebar, rows and
              charts (<Link href="/foundations/expression">Expression</Link>). <code>ThemeProvider product</code> accepts
              every product in the map.
            </>,
          ],
          [
            '10.4',
            <>
              One size scale (<code>sm</code>, <code>md</code>, <code>lg</code>) on every control, <code>invalid</code>{' '}
              on the non-text controls and <code>readOnly</code> on every input.
            </>,
          ],
          [
            '10.5',
            <>
              <code>loading</code>, <code>emptyState</code> and <code>errorState</code> on every data component,{' '}
              <Link href="/components/skeleton">Skeleton presets</Link>,{' '}
              <Link href="/components/illustration">Illustration</Link> and the{' '}
              <Link href="/patterns/status-page">StatusPage</Link> pattern.
            </>,
          ],
          [
            '10.6',
            <>
              The <code>sheet</code> prop, poppers that stay on screen, a Sidebar that collapses at a breakpoint, and
              layouts that follow their container.
            </>,
          ],
          [
            '10.7',
            <>
              Interactive charts, day and agenda views in <Link href="/components/event-calendar">EventCalendar</Link>,
              table density and sticky headers, DataTable footers and column filters,{' '}
              <Link href="/components/truncate">Truncate</Link>,{' '}
              <Link href="/components/description-list">DescriptionList</Link>,{' '}
              <Link href="/components/comparison-bar">ComparisonBar</Link> and{' '}
              <Link href="/patterns/status-steps">StatusSteps</Link>.
            </>,
          ],
          [
            '10.8',
            <>
              Twelve page templates (sign-up, verify code, onboarding, table page, booking, invoice and more),{' '}
              <Link href="/components/phone-input">PhoneInput</Link>,{' '}
              <Link href="/components/countdown">Countdown</Link> and{' '}
              <Link href="/components/time-slot-picker">TimeSlotPicker</Link>.
            </>,
          ],
          [
            '10.9',
            <>
              <Link href="/getting-started/react-native">React Native</Link>: the 10.3 look and the product map, gestures
              on the UI thread (<code>react-native-gesture-handler</code> becomes a required peer), new twins, tablet
              layouts. And this guide, the codemod rule and the notices for 11.0.
            </>,
          ],
        ]}
      />

      <h2>Postponed to the major after 11</h2>
      <p>
        The plan for 11.0 also listed removing sizes outside the shared scale and aligning the web and native variant
        names. Neither was deprecated in a 10.x release, and a major removes only what an earlier minor deprecated, with
        at least one release in between. So they are not in 11.0. They will be deprecated in an 11.x minor first, with a
        codemod, and removed in the major after.
      </p>

      <h2>Coming from 9.x</h2>
      <p>
        <Link href="/getting-started/migrating-to-10">Migrating to 10.0</Link> first: it removes nothing, so it is a
        version bump. Then this page.
      </p>
    </div>
  );
}

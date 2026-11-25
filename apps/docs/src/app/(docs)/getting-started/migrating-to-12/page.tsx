import type { Metadata } from 'next';
import Link from 'next/link';
import { DocTable, PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { MigrationPicker } from '@/components/docs/MigrationPicker';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Migrating to 12.0',
  description:
    '12.0 puts every prebuilt stylesheet in one nexub cascade layer, so your CSS wins without !important, removes Stepper current={-1}, deprecates the Tailwind v3 compatibility defaults and promotes 27 components to stable. The breaking changes can be cleared on 11.9 first.',
};

export default function MigratingTo12Page() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Migrating to 12.0">
        <MigrationPicker />
      </PageIntro>
      <p>
        12.0 changes one default and removes one deprecated value (RFC 12.0). Both can be cleared on
        11.9, its release candidate, before you upgrade. It also deprecates the Tailwind v3
        compatibility defaults (removed in 13.0) and promotes 27 components to stable. Nothing else
        in the API changes.
      </p>

      <h2>Upgrade in two steps</h2>
      <p>
        11.9.x is the release candidate for 12.0. Stop there first if you are on an older 11.x, and
        move every <code>@nexub</code> package you use together:
      </p>
      <CodeBlock
        lang="bash"
        code={`npm install @nexub/react@11.9 @nexub/themes@11.9 @nexub/tokens@11.9 @nexub/icons@11.9`}
      />
      <p>
        On 11.9, switch to the opt-in layered stylesheet (below) and clear what{' '}
        <code>deprecated-in-11</code> finds. An app that runs clean like that upgrades with a
        version bump. After the bump, run <code>changes-in-12</code>:
      </p>
      <CodeBlock
        lang="bash"
        code={`npx nexub-migrate --rules changes-in-12          # dry run: the diff and the items to review
npx nexub-migrate --rules changes-in-12 --write  # apply the rewrites
npx nexub-migrate --rules changes-in-12 --check  # CI: exit 1 while anything is left`}
      />

      <h2>What changes by default: one nexub cascade layer</h2>
      <p>
        Until 11.x the prebuilt stylesheets declared Tailwind&apos;s own layer names (
        <code>theme</code>, <code>base</code>, <code>components</code>, <code>utilities</code>). In
        an app that also uses Tailwind v4, its utilities and ours shared one <code>utilities</code>{' '}
        layer, so the stylesheet that loaded last won a tie. In 12.0 every style moves under one{' '}
        <code>nexub</code> layer:
      </p>
      <CodeBlock
        lang="css"
        code={`/* 11.x */
@layer theme, base, components, utilities;
/* 12.0 */
@layer nexub.theme, nexub.base, nexub.components, nexub.utilities;`}
      />
      <DocTable
        head={['Stylesheet', 'In 12.0']}
        rows={[
          [<code key="r">@nexub/react/styles.css</code>, 'Every layer under nexub'],
          [
            <code key="l">@nexub/react/styles.nexub-layer.css</code>,
            <>
              The 11.9 opt-in name: the same file as <code>styles.css</code>, kept in 12.x so early
              switchers keep working
            </>,
          ],
          [
            <>
              <code>@nexub/patterns/styles.css</code>, <code>@nexub/marketing/styles.css</code>,{' '}
              <code>@nexub/diagram/styles.css</code> and <code>theme.css</code>
            </>,
            'Every layer under nexub, so one @layer nexub; covers every package',
          ],
          [
            <code key="t">@nexub/themes/*</code>,
            <>
              Unchanged: you import them into your own <code>base</code> layer
            </>,
          ],
        ]}
      />
      <p>
        A layer ranks by where it is first named, so name <code>nexub</code> at the top of your own
        CSS and the import order stops mattering. Where depends on whether the app uses Tailwind:
      </p>
      <CodeBlock
        lang="css"
        code={`/* Tailwind v4 app: after preflight (base), before your components and utilities */
@layer theme, base, nexub, components, utilities;

/* no Tailwind: first, so every style of yours wins */
@layer nexub;`}
      />
      <p>
        With Tailwind, putting <code>nexub</code> first would put it under preflight, and
        preflight&apos;s element resets would win over our component rules wherever both set a
        property, because a layer beats specificity. After <code>base</code>, your utilities still
        win and preflight can&apos;t undo our styles.
      </p>
      <p>
        Without that line, load our stylesheets before your own CSS. If a <code>nexub</code>{' '}
        stylesheet loads after your layers, <code>nexub</code> is named last and ranks above them.
        Measured in Chromium, WebKit and Firefox (<code>packages/react/visual/layers.spec.ts</code>
        ).
      </p>
      <p>
        What to check: a style of yours that only won before because your file loaded later still
        wins, and one that lost to ours because ours loaded later now wins. That is the point, but
        look at screens where you styled <code>:focus-visible</code> or overrode a component&apos;s
        colours. <code>changes-in-12</code> points imports of <code>styles.nexub-layer.css</code>{' '}
        back at <code>styles.css</code>.
      </p>

      <h2>What breaks: Stepper current=&#123;-1&#125;</h2>
      <p>
        <code>current=&#123;-1&#125;</code> meant &ldquo;every step done&rdquo;. It was deprecated
        in 11.4; give the steps a <code>status</code> instead. In 12.0 a negative{' '}
        <code>current</code> throws in development and counts as <code>0</code> in production.
      </p>
      <CodeBlock
        lang="tsx"
        code={`// before
<Stepper current={-1} steps={[{ label: 'Account' }, { label: 'Payout' }]} />

// after: what changes-in-12 writes for a literal steps array
<Stepper current={1} steps={[{ label: 'Account', status: 'complete' }, { label: 'Payout', status: 'complete' }]} />`}
      />
      <p>
        <code>changes-in-12</code> rewrites it when <code>steps</code> is an array of object
        literals, keeping a step&apos;s own <code>status</code>, and reports every other case.
        Screen readers read each step as &ldquo;complete&rdquo;, as before. See{' '}
        <Link href="/components/stepper">Stepper</Link>.
      </p>

      <h2>Deprecated: the Tailwind v3 compatibility defaults</h2>
      <p>
        <code>@nexub/react/styles.css</code> still restores a few Tailwind v3 defaults that v4
        changed, so components look the same in a v3 or a v4 app: a bare <code>border</code> takes
        the hairline colour instead of <code>currentColor</code>, and placeholders keep the v3
        colour. They stay in 12.x, deprecated, and are removed in 13.0. Nothing changes when you
        upgrade to 12.0. Before 13.0, set any of these defaults your own screens rely on in your own{' '}
        <code>base</code> layer.
      </p>

      <h2>Promoted to stable</h2>
      <p>
        27 components move from beta to stable, because each one is used in production by at least
        two products (
        <a href="https://github.com/Nexub-AI/nexub-ds/blob/development/GOVERNANCE.md#status-lifecycle">
          GOVERNANCE.md
        </a>
        ). Their API doesn&apos;t change, only the badge:
      </p>
      <p>
        ActionBar, BarChart, CheckboxCard, DateTimePicker, DonutChart, EventCalendar, Funnel, Gauge,
        Heatmap, Kanban, KpiTile, LineChart, MessageBubble, MoneyInput, MultiSelect, PromptInput,
        RadioCard, SavedViews, Sortable, SplitButton, Stepper, ThinkingIndicator, TimePicker and
        TreeView, plus the ErrorSummary, Conversation and ListDetail patterns.
      </p>

      <h2>Coming from 10.x</h2>
      <p>
        <Link href="/getting-started/migrating-to-11">Migrating to 11.0</Link> first. Then this
        page.
      </p>
    </div>
  );
}

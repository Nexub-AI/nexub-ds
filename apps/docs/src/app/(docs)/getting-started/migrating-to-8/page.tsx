import type { Metadata } from 'next';
import { DocTable, PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { MigrationPicker } from '@/components/docs/MigrationPicker';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Migrating to 8.0',
  description: 'What 8.0 changes (Signature look, class scroll lock, strict safeHref), what it removes, and how to try it on 7.9.',
};

export default function MigratingTo8Page() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Migrating to 8.0">
        <MigrationPicker />
      </PageIntro>
      <p>
        8.0 flips defaults. It adds no features: everything it turns on already ships as an opt-in in 7.x, so you can try
        each change on 7.9 (the release candidate), one at a time, before you upgrade. It also removes what 7.x deprecated.
      </p>

      <h2>What changes in 8.0</h2>
      <DocTable
        head={['Changes in 8.0', 'Try it on 7.9', 'Keep 7.x behaviour']}
        rows={[
          [
            <>Signature becomes the default look. The Material 3 look stays as <code>classic</code>.</>,
            <>
              Set <code>data-style=&quot;signature&quot;</code> on <code>&lt;html&gt;</code>.
            </>,
            <>
              Set <code>data-style=&quot;classic&quot;</code> on <code>&lt;html&gt;</code>.
            </>,
          ],
          [
            <>
              <code>scrollLock</code> defaults to <code>&quot;class&quot;</code> on <code>Dialog.Root</code>,{' '}
              <code>AlertDialog.Root</code>, <code>Drawer.Root</code> / <code>Sheet.Root</code> and{' '}
              <code>CommandPalette</code>: no injected <code>&lt;style&gt;</code>, so it works under a strict CSP. It needs
              the <code>html.nexub-scroll-lock</code> rule from <code>@nexub/themes/base</code>.
            </>,
            <>
              Load <code>@nexub/themes/base</code> and set <code>scrollLock=&quot;class&quot;</code>.
            </>,
            <>
              Set <code>scrollLock=&quot;style&quot;</code>.
            </>,
          ],
          [
            <>
              <code>safeHref</code> is strict, and so is every Nexub link that uses it (Breadcrumb, CardLink, AppHeader,
              MarketingNav and the rest): only relative URLs, <code>#…</code>, http(s), <code>mailto:</code>,{' '}
              <code>tel:</code> and <code>sms:</code> render. Custom schemes such as <code>slack:</code> are dropped.
            </>,
            <>
              Call <code>safeHref(url, {'{ strict: true }'})</code>.
            </>,
            <>
              Call <code>safeHref(url, {'{ strict: false }'})</code> yourself. For a custom-scheme link inside a Nexub
              component, render your own <code>&lt;a&gt;</code>.
            </>,
          ],
        ]}
      />
      <CodeBlock
        lang="tsx"
        code={`<html data-style="signature">  {/* "classic" keeps the 7.x look */}

<Dialog.Root scrollLock="class">…</Dialog.Root>

const href = safeHref(url, { strict: true });`}
      />

      <h2>Removed in 8.0</h2>
      <DocTable
        head={['Removed in 8.0', 'What to do']}
        rows={[
          [
            <>
              The legacy motion tokens <code>--duration-*</code> (<code>instant</code>, <code>fast</code>,{' '}
              <code>normal</code>, <code>slow</code>, <code>slower</code>) and <code>--ease-*</code> (<code>linear</code>,{' '}
              <code>in</code>, <code>out</code>, <code>in-out</code>, <code>out-expo</code>, <code>spring</code>),
              deprecated in 7.3.
            </>,
            <>
              Use the spring tokens, e.g. <code>var(--motion-spring-effects-default-duration)</code> and{' '}
              <code>var(--motion-spring-effects-default-easing)</code>. The <code>--ease-spatial-*</code>,{' '}
              <code>--ease-effects-*</code> and <code>--ease-expressive-*</code> names stay.
            </>,
          ],
          [
            <>
              The <code>easing</code> prop on <code>Fade</code>, <code>Scale</code>, <code>Slide</code> and{' '}
              <code>Collapse</code>, deprecated in 7.3.
            </>,
            <>
              Remove it. <code>duration</code> picks the spring speed.
            </>,
          ],
        ]}
      />
      <p>
        Still deprecated, removed in 9.0: the <code>hidePassword</code> message. <code>PasswordInput</code> keeps one name
        (&ldquo;Show password&rdquo;) and reports its state with <code>aria-pressed</code>, so drop it from your message
        overrides when convenient.
      </p>

      <h2>Find what to change</h2>
      <p>
        The <code>changes-in-8</code> codemod rule reports each item above in your code: legacy motion tokens,{' '}
        <code>easing</code>, overlays without <code>scrollLock</code>, <code>safeHref</code> calls without{' '}
        <code>strict</code>, custom-scheme links passed to Nexub components, and a note where you import{' '}
        <code>@nexub/themes</code>. It reports only, since each needs a choice:
      </p>
      <CodeBlock lang="bash" code={`npx nexub-migrate src --rules changes-in-8`} />
      <p>
        Fix what it reports on 7.9, check your screens with <code>data-style=&quot;signature&quot;</code>, then upgrade.
      </p>
    </div>
  );
}

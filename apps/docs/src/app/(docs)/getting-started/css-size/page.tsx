import type { Metadata } from 'next';
import Link from 'next/link';
import { DocTable, PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Load only the CSS you use',
  description:
    'From 12.1, a Tailwind 4 app can load the Nexub CSS for the components it imports instead of all of them: about half the CSS on a typical page.',
};

export default function CssSizePage() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Load only the CSS you use" />
      <p>
        By default an app loads the CSS of every Nexub component, whether it uses 15 of them or all
        150. From 12.1 a Tailwind 4 app can load only what its components need. It is opt-in:
        nothing changes until you switch.
      </p>
      <DocTable
        head={['A typical page (15 components)', 'gzip']}
        rows={[
          [<code key="a">@nexub/react/styles.css</code>, '43.5 kB'],
          [
            'Tailwind 4 with every @nexub dist folder scanned (the setup before 12.1)',
            'about 42 kB',
          ],
          ['base-lean and the generated list', '26.7 kB'],
          [
            <>
              …then <code>--prune</code> after the build
            </>,
            '21.2 kB',
          ],
        ]}
      />
      <p>
        CI keeps the last line under 21.9 kB, half of the 11.6 budget for <code>styles.css</code>,
        for the page in <code>scripts/fixtures/css-page</code>. A larger app saves less: an admin
        app that imports 66 components went from 43.6 kB to 32.5 kB.
      </p>

      <h2>1. Load the lean base</h2>
      <p>
        <code>@nexub/themes/base</code> and <code>/core</code> carry the CSS of components that only
        some apps use: the drawer, charts, Aurora, Celebrate, the dialog surfaces and more.{' '}
        <code>base-lean</code> and <code>core-lean</code> are the same files without them: tokens,
        resets, the focus ring, motion and density.
      </p>
      <CodeBlock
        lang="css"
        code={`/* before */
@import '@nexub/themes/base' layer(base);
@source "../node_modules/@nexub/react/dist";
@source "../node_modules/@nexub/patterns/dist";

/* after */
@import '@nexub/themes/base-lean' layer(base);   /* or core-lean, if you used core */
@import './nexub.css';                            /* step 2 writes this file */`}
      />

      <h2>2. Generate the list</h2>
      <p>
        <code>nexub-usage --css</code> reads your imports from <code>@nexub/react</code>,{' '}
        <code>@nexub/patterns</code> and <code>@nexub/marketing</code>, follows each component to
        the files it uses, and writes one CSS file: the component parts they need from{' '}
        <code>@nexub/themes/parts</code>, and an <code>@source</code> line for each of those files,
        so Tailwind generates only their classes. It also adds a part when your own code uses one of
        its classes, such as <code>nx-stagger</code> or <code>nx-sheen</code>.
      </p>
      <CodeBlock
        lang="bash"
        code={`npx -p @nexub/tokens nexub-usage src --css src/nexub.css          # write it
npx -p @nexub/tokens nexub-usage src --css src/nexub.css --check  # CI: fail if it is stale`}
      />
      <p>
        Run it again when you import a component you didn’t use before, or add the{' '}
        <code>--check</code> line to CI so a stale list fails the build instead of leaving a
        component unstyled.
      </p>

      <h2>3. Prune after the build (optional)</h2>
      <p>
        Tokens define about 1,100 custom properties and a page reads about half. After your build,{' '}
        <code>--prune</code> removes the Nexub ones that neither your CSS nor your JavaScript names:
      </p>
      <CodeBlock
        lang="bash"
        code={`npx -p @nexub/tokens nexub-usage --prune .next/static/css --js .next/static`}
      />
      <ul>
        <li>
          It only removes properties that <code>@nexub/tokens</code> or <code>@nexub/themes</code>{' '}
          define, never your own.
        </li>
        <li>
          A property stays when any stylesheet or script names it, when a kept property’s value uses
          it, or when code builds names from its prefix (<code>{'`--motion-spring-${speed}`'}</code>{' '}
          keeps every <code>--motion-spring-*</code>).
        </li>
        <li>
          It can’t see a name that comes whole from data, such as <code>{"'--' + name"}</code>. Keep
          the prefix in your code (<code>{"'--color-' + tone"}</code> or{' '}
          <code>{'`var(--color-${tone})`'}</code> keep every <code>--color-*</code>), or skip this
          step.
        </li>
      </ul>

      <h2>Without Tailwind</h2>
      <p>
        <code>@nexub/react/styles.css</code> stays one file with every component. See{' '}
        <Link href="/getting-started/without-tailwind">Use without Tailwind</Link>.
      </p>
    </div>
  );
}

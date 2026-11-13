import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { MigrationPicker } from '@/components/docs/MigrationPicker';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Migrating to 10.0',
  description: '10.0 removes nothing: 9.x deprecated no API. What changes is the versioning, which follows semver from 10.0.',
};

export default function MigratingTo10Page() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Migrating to 10.0">
        <MigrationPicker />
      </PageIntro>
      <p>
        10.0 is 9.9 declared stable. Nothing was deprecated in 9.x, so 10.0 removes nothing and there is no codemod to
        run. If your app builds on 9.9, it builds on 10.0.
      </p>

      <h2>Before 10.0 is out</h2>
      <p>
        9.9 is the release candidate, on the <code>next</code> tag. Installing it now is the whole migration:
      </p>
      <CodeBlock lang="bash" code={`npm install @nexub/react@next @nexub/themes@next @nexub/tokens@next @nexub/icons@next`} />
      <p>
        Coming from 8.x? Do <Link href="/getting-started/migrating-to-9">Migrating to 9.0</Link> first; that is where
        the removals are. <Link href="/getting-started/release-status">10.0 release status</Link> shows what 10.0 is
        still waiting for.
      </p>

      <h2>What changes: versioning</h2>
      <p>
        Up to 10.0, every release bumped the minor and the tenth one became the next major, so a new major did not mean
        a breaking change. From 10.0 the version follows semver:
      </p>
      <ul>
        <li>
          Minors are additive. After 10.9 comes 10.10, not 11.0, so <code>^10.0.0</code> is safe to keep.
        </li>
        <li>A breaking change needs a new major, announced with a proposal and a migration guide.</li>
        <li>
          A minor ships every 3 to 4 weeks. Security and critical fixes ship as a patch on the latest version as soon
          as they are ready.
        </li>
      </ul>
      <CodeBlock lang="json" code={`"@nexub/react": "^10.0.0"`} />
    </div>
  );
}

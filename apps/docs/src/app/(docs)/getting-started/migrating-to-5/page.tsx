import type { Metadata } from 'next';
import { DocTable, PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { MigrationPicker } from '@/components/docs/MigrationPicker';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Migrating to 5.0',
  description: 'What 5.0 changes (Vivid by default, React 19) and how to upgrade.',
};

export default function MigratingTo5Page() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Migrating to 5.0">
        <MigrationPicker />
      </PageIntro>
      <p>
        5.0 makes Vivid the default and requires React 19. There are no component API changes, so for most apps the upgrade
        is a version bump plus one decision: keep Vivid, or pin Calm.
      </p>
      <DocTable
        head={['Changes in 5.0', 'What to do']}
        rows={[
          ['Vivid becomes the default expression for apps that do not set one.', <>Import <code>@nexub/themes/vivid</code> to get it. To keep the 4.x look, set <code>data-expression=&quot;calm&quot;</code> on <code>&lt;html&gt;</code> or pass <code>defaultExpression=&quot;calm&quot;</code> to <code>ThemeProvider</code>.</>],
          ['React 18 is no longer supported; peers require React 19.', 'Upgrade to React 19 (react and react-dom >=19 <20).'],
        ]}
      />
      <CodeBlock lang="html" code={`<html data-expression="calm">   <!-- keep the Calm look -->`} />
      <p>No component API changes in 5.0. Calm stays fully supported.</p>
    </div>
  );
}

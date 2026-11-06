import type { Metadata } from 'next';
import { DocTable, PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Migrating to 5.0',
  description: 'What 5.0 changes (Vivid by default, React 19) and how to prepare on 4.9.',
};

export default function MigratingTo5Page() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Migrating to 5.0" />
      <p>
        4.9 is the release candidate: the API is frozen and it warns in development about everything 5.0 changes. Clear the
        warnings on 4.9 and 5.0 is a version bump.
      </p>
      <DocTable
        head={['Changes in 5.0', 'Do this on 4.9']}
        rows={[
          ['Vivid becomes the default expression for apps that do not set one.', <>Set <code>data-expression=&quot;calm&quot;</code> on <code>&lt;html&gt;</code> to keep today&apos;s look, or <code>&quot;vivid&quot;</code> to opt in now.</>],
          ['React 18 is no longer supported; peers require React 19.', 'Upgrade to React 19.'],
        ]}
      />
      <CodeBlock lang="html" code={`<html data-expression="calm">   <!-- keep the Calm look after 5.0 -->`} />
      <p>No component API changes in 5.0. Calm stays fully supported.</p>
    </div>
  );
}

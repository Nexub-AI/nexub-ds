import * as React from 'react';
import { Badge } from '@nexub/react';
import type { ComponentEntry } from '@/registry/types';
import { getComponentEntry } from '@/registry/index';
import { DocsLink } from '@/components/layout/DocsLink';
import { Note, PageIntro } from '@/components/kit';
import { CopyButton } from './CopyButton';
import { InlineCode } from './PropsTable';
import { StatusBadge } from './StatusBadge';

export function ComponentHero({ entry, children }: { entry: ComponentEntry; children?: React.ReactNode }) {
  const { meta } = entry;
  const importLine = `import { ${meta.title.replace(/\s+/g, '')} } from '${meta.package}';`;
  const deprecation = meta.status === 'deprecated' ? meta.deprecation : undefined;
  const replacement = deprecation && getComponentEntry(deprecation.replacement);

  return (
    <PageIntro
      eyebrow={`Components · ${meta.category}`}
      title={meta.title}
      lead={meta.description}
      badges={
        <>
          {meta.status && <StatusBadge status={meta.status} />}
          {meta.addedIn && (
            <Badge tone="neutral" variant="outline">
              {meta.updatedIn ? `v${meta.addedIn} → v${meta.updatedIn}` : `Since v${meta.addedIn}`}
            </Badge>
          )}
        </>
      }
    >
      {deprecation && (
        <Note tone="danger" title={`Deprecated — removal planned in ${deprecation.removeIn}`}>
          Use{' '}
          <DocsLink href={`/components/${deprecation.replacement}`}>{replacement?.meta.title ?? deprecation.replacement}</DocsLink>{' '}
          instead: <InlineCode text={deprecation.migration} /> {meta.title} keeps working, unchanged, until{' '}
          {deprecation.removeIn}.
        </Note>
      )}
      <div className="docs-snippet inline-flex max-w-full items-center gap-2 self-start rounded-shape-field bg-[var(--docs-snippet-bg)] py-1.5 pe-2 ps-3 font-mono text-body-sm text-[var(--docs-snippet-fg)]">
        <code className="truncate">{importLine}</code>
        <CopyButton text={importLine} />
      </div>
      {children}
    </PageIntro>
  );
}

import * as React from 'react';
import { Badge } from '@nexub/react';
import type { ComponentEntry } from '@/registry/types';
import { PageIntro } from '@/components/kit';
import { CopyButton } from './CopyButton';

export function ComponentHero({ entry, children }: { entry: ComponentEntry; children?: React.ReactNode }) {
  const { meta } = entry;
  const importLine = `import { ${meta.title.replace(/\s+/g, '')} } from '${meta.package}';`;

  return (
    <PageIntro
      eyebrow={`Components · ${meta.category}`}
      title={meta.title}
      lead={meta.description}
      badges={
        <>
          {meta.status === 'stable' && <Badge tone="success" variant="soft">Stable</Badge>}
          {meta.status === 'beta' && <Badge tone="warning" variant="soft">Beta</Badge>}
          {meta.status === 'deprecated' && <Badge tone="danger" variant="soft">Deprecated</Badge>}
          {meta.addedIn && (
            <Badge tone="neutral" variant="outline">
              {meta.updatedIn ? `v${meta.addedIn} → v${meta.updatedIn}` : `Since v${meta.addedIn}`}
            </Badge>
          )}
        </>
      }
    >
      <div className="docs-snippet inline-flex max-w-full items-center gap-2 self-start rounded-shape-field bg-[var(--docs-snippet-bg)] py-1.5 pe-2 ps-3 font-mono text-body-sm text-[var(--docs-snippet-fg)]">
        <code className="truncate">{importLine}</code>
        <CopyButton text={importLine} />
      </div>
      {children}
    </PageIntro>
  );
}

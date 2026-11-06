import type { Metadata } from 'next';
import { DocTable, PageIntro, Prose, Section } from '@/components/kit';
import { DocsLink } from '@/components/layout/DocsLink';
import { StatusBadge } from '@/components/docs/StatusBadge';
import { componentEntries, patternEntries } from '@/registry/index';
import { NATIVE_STATUS, nativePatternTwins, nativeTwins } from '@/registry/native';
import type { ComponentEntry, ComponentStatus } from '@/registry/types';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Component status',
  description: 'Every component and pattern with its lifecycle status on web and native, and the version it was added and last changed in.',
};

const ORDER: ComponentStatus[] = ['stable', 'beta', 'alpha', 'deprecated'];

function rows(entries: ComponentEntry[], base: string, twins: typeof nativeTwins) {
  return [...entries]
    .sort((a, b) => a.meta.title.localeCompare(b.meta.title))
    .map(({ meta }) => {
      const twin = twins[meta.slug];
      return [
        <DocsLink key="n" href={`/${base}/${meta.slug}`}>{meta.title}</DocsLink>,
        <StatusBadge key="s" status={meta.status ?? 'stable'} size="sm" />,
        twin ? <StatusBadge key="m" status={twin.status ?? NATIVE_STATUS} size="sm" /> : '—',
        meta.addedIn ? `v${meta.addedIn}` : '—',
        meta.updatedIn ? `v${meta.updatedIn}` : '—',
        meta.package,
      ];
    });
}

export default function StatusPage() {
  const all = [...componentEntries, ...patternEntries];
  const count = (s: ComponentStatus) => all.filter((e) => (e.meta.status ?? 'stable') === s).length;
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Components"
        title="Component status"
        lead={
          <>
            How much each API can still move, on web and on native. Statuses follow the lifecycle in{' '}
            <a href="https://github.com/Nexub-AI/nexub-ds/blob/development/GOVERNANCE.md#status-lifecycle">GOVERNANCE.md</a>:
            alpha and beta may change in a minor, stable only through a deprecation, and deprecated parts are removed in
            the next major.
          </>
        }
      />

      <Section id="summary" title="Summary">
        <DocTable
          head={['Status', 'Web', 'What it promises']}
          rows={ORDER.map((s) => [
            <StatusBadge key="s" status={s} size="sm" />,
            String(count(s)),
            {
              stable: 'Safe to build on. Breaking changes only through a deprecation.',
              beta: 'The API is believed right; real usage is confirming it.',
              alpha: 'Usable, but the API is still being shaped.',
              deprecated: 'Still works, unchanged, until the next major. Do not use in new code.',
            }[s],
          ])}
        />
        <Prose>
          See which parts your own apps use with <code>npx -p @nexub/tokens nexub-usage ./src</code>: it lists every
          @nexub import with counts, so deprecations can follow real usage.
        </Prose>
      </Section>

      <Section id="components" title="Components">
        <DocTable head={['Component', 'Web', 'Native', 'Added', 'Changed', 'Package']} mono={[5]} rows={rows(componentEntries, 'components', nativeTwins)} />
      </Section>

      <Section id="patterns" title="Patterns">
        <DocTable head={['Pattern', 'Web', 'Native', 'Added', 'Changed', 'Package']} mono={[5]} rows={rows(patternEntries, 'patterns', nativePatternTwins)} />
      </Section>
    </div>
  );
}

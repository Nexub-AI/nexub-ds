import type { Metadata } from 'next';
import { PageIntro } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Migrating to 3.0' };

// What 3.0 removes and what replaces it. Source: ROADMAP_2.x.md (2.9, 3.0).
const removals: { what: string; replacement: string; codemod: string }[] = [
  { what: 'Banner', replacement: 'Alert, same props (tone, title, icon, action, onClose)', codemod: 'Rewritten' },
  { what: 'Callout', replacement: 'Alert (tone, icon)', codemod: 'Rewritten' },
  { what: 'Tag', replacement: 'Badge variant="soft" (size and tone carry over)', codemod: 'Rewritten' },
  { what: 'StatusPill', replacement: 'Badge variant="soft", with label as children', codemod: 'Rewritten; dot is reported (pass leadingIcon)' },
  { what: 'BannerProps, CalloutProps, TagProps, StatusPillProps', replacement: 'AlertProps, BadgeProps', codemod: 'Rewritten' },
  { what: 'bannerVariants, calloutVariants, tagVariants, statusPillVariants', replacement: 'alertVariants, badgeVariants', codemod: 'Reported' },
  { what: 'Legacy colour names (--color-text-primary, --color-bg-default, --color-success-500 …)', replacement: 'Calm Depth roles (--color-on-surface, --color-surface, --color-success …)', codemod: 'Rewritten; color-mix aliases reported' },
];

export default function MigratingTo3Page() {
  return (
    <div className="docs-prose">
      <PageIntro eyebrow="Getting Started" title="Migrating to 3.0" />
      <p>
        3.0 is the only release that removes anything. Everything it removes has been deprecated since 1.1, and
        the components warn in development. 2.9 is the release candidate: update to it, clear the warnings and the
        codemod report, and 3.0 is a version bump.
      </p>

      <h2>1. Update to 2.9 and run the codemod</h2>
      <CodeBlock lang="bash" code={`npx nexub-migrate src           # dry run: report changes
npx nexub-migrate src --write   # apply them
npx nexub-migrate src --check   # CI: exit 1 if anything is left`} />
      <p>
        <code>nexub-migrate</code> ships in <code>@nexub/tokens</code>. Keep <code>--check</code> in CI until you are
        on 3.0, so nothing deprecated creeps back in. CSS can’t warn at runtime, so this is the only check for the
        legacy colour names. Review the diff and run your tests after <code>--write</code>.
      </p>

      <h2>2. What 3.0 removes</h2>
      <table>
        <thead>
          <tr><th>Removed</th><th>Use instead</th><th>Codemod</th></tr>
        </thead>
        <tbody>
          {removals.map((r) => (
            <tr key={r.what}><td><code>{r.what}</code></td><td>{r.replacement}</td><td>{r.codemod}</td></tr>
          ))}
        </tbody>
      </table>
      <CodeBlock lang="tsx" code={`// before
<Banner tone="warning" title="Trial ends soon" />
<Tag size="sm" tone="info">Beta</Tag>
<StatusPill tone="success" label="Live" />

// after
<Alert tone="warning" title="Trial ends soon" />
<Badge variant="soft" size="sm" tone="info">Beta</Badge>
<Badge variant="soft" tone="success">Live</Badge>`} />
      <p>
        <code>@nexub/react-native</code> keeps its own <code>Banner</code>; nothing changes there.
      </p>

      <h2>3. Other 3.0 changes</h2>
      <ul>
        <li>
          <strong>rem spacing by default.</strong> The rem layer you can opt into today with{' '}
          <code>@nexub/tokens/css/rem</code> becomes the default. If your app sets{' '}
          <code>html {'{ font-size: 62.5% }'}</code> or similar, remove it first, or spacing shrinks with it. Turn
          the rem layer on while you are on 2.9 to see the effect early.
        </li>
        <li>
          <strong>ESM only.</strong> Every package already ships ESM only, so there is nothing to do.
        </li>
      </ul>
    </div>
  );
}

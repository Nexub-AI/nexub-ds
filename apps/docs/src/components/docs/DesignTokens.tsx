import Link from 'next/link';
import { DocTable } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';
import type { ComponentTokenGroup } from '@/lib/component-tokens';

/**
 * 12.6: a component page's "Design tokens" section. The component tier of the
 * token system, generated from @nexub/tokens/json/component.
 */
export function DesignTokens({ groups, title }: { groups: ComponentTokenGroup[]; title: string }) {
  const first = groups[0]?.rows[0];
  return (
    <>
      <p>
        {title} reads these component tokens. Each one is unset by default and falls back to the semantic role it
        aliases, so nothing changes until you set it. Set one on any element to restyle every {title} below it, and
        leave the roles other components share alone. See{' '}
        <Link href="/foundations/tokens#tiers">the three token tiers</Link>.
      </p>
      {groups.map((g) => (
        <div key={g.group} className="mt-4 space-y-2">
          {g.description && <p className="text-body-sm text-on-surface-variant">{g.description}</p>}
          <DocTable
            caption={`${title} design tokens`}
            head={['Token', 'Aliases', 'Notes']}
            mono={[0, 1]}
            rows={g.rows.map((r) => [
              <span key="n" className="whitespace-nowrap font-semibold text-primary">{r.name}</span>,
              <span key="a" className="whitespace-nowrap text-on-surface-variant">{r.aliases}</span>,
              <span key="d" className="text-on-surface-muted">
                {r.description ?? (r.css === `var(${r.aliases})` ? '—' : `Default: ${r.css}`)}
              </span>,
            ])}
          />
        </div>
      ))}
      {first && (
        <div className="mt-4">
          <CodeBlock
            lang="css"
            code={`/* One area of your app */\n.checkout {\n  ${first.name}: ${first.type === 'color' ? 'var(--color-secondary)' : 'var(--shape-field)'};\n}`}
          />
        </div>
      )}
    </>
  );
}

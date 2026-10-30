import { Badge } from '@nexub/react';
import type { PropDef } from '@/registry/types';
import { DocTable } from '@/components/kit';

/** Renders `backtick` spans in registry descriptions as inline code. */
export function InlineCode({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={i} className="rounded-shape-tooltip bg-[var(--color-surface-container)] px-1 py-px font-mono text-[0.85em]">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function PropsTable({ props }: { props: PropDef[] }) {
  if (!props.length) return null;
  return (
    <DocTable
      caption="Props"
      head={['Prop', 'Type', 'Default', 'Description']}
      mono={[1, 2]}
      rows={props.map((p) => [
        <span key="n" className="flex flex-wrap items-center gap-1.5 whitespace-nowrap font-mono text-body-sm font-semibold text-[var(--color-primary)]">
          {p.name}
          {p.required && <Badge size="sm" tone="danger" variant="soft">required</Badge>}
        </span>,
        <span key="t" className="text-[var(--color-on-surface-variant)]">{p.type}</span>,
        <span key="d" className="text-[var(--color-on-surface-muted)]">{p.default ?? '—'}</span>,
        <InlineCode key="x" text={p.description} />,
      ])}
    />
  );
}

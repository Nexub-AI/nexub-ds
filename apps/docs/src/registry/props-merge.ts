// 8.4: web prop tables come from the TypeScript types (web-props.generated.json,
// built by scripts/web-props.mjs). The registry keeps what types can't say well:
// the description and the order. Name, type, default and required come from source.
import type { ComponentEntry, PropDef } from './types';

export type GeneratedProps = Record<string, Record<string, { file: string; props: (PropDef & { deprecated?: boolean })[]; inherited?: string[] }>>;

/** The exported `XProps` (or `XRootProps`) an entry documents: its title without spaces (Data Table → DataTable). */
export function propsFor(entry: ComponentEntry, gen: GeneratedProps) {
  const pkg = gen[entry.meta.package ?? '@nexub/react'] ?? {};
  const key = entry.meta.title.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
  const find = (k: string) => Object.entries(pkg).find(([n]) => n.toLowerCase() === k)?.[1];
  return find(key) ?? find(`${key}root`);
}

/** A registry row that names generated props: `value` or `value / defaultValue / onValueChange`. */
export const rowParts = (row: PropDef) => row.name.split(' / ').map((s) => s.trim());

/** `StatBandItem label` documents a part's prop: returns that part's generated props and the prop names. */
export function subRow(entry: ComponentEntry, row: PropDef, gen: GeneratedProps) {
  const [, name, rest] = /^([A-Z]\w*) (\S.*)$/.exec(row.name) ?? [];
  const sub = name && rest ? gen[entry.meta.package ?? '@nexub/react']?.[name] : undefined;
  return sub && rest ? { sub, parts: rest.split(' / ').map((s) => s.trim()) } : undefined;
}

export function mergeProps(entry: ComponentEntry, gen: GeneratedProps): ComponentEntry {
  const g = propsFor(entry, gen);
  if (!g) return entry;
  const byName = new Map(g.props.map((p) => [p.name, p]));
  const out: PropDef[] = [];
  const seen = new Set<string>();
  const emit = (p: PropDef & { deprecated?: boolean }, description: string) => {
    if (seen.has(p.name)) return;
    seen.add(p.name);
    const { deprecated, ...rest } = p;
    out.push({ ...rest, description: deprecated && !/deprecated/i.test(description) ? `Deprecated. ${description}`.trim() : description });
  };
  for (const row of entry.props) {
    const parts = rowParts(row);
    if (parts.every((n) => byName.has(n))) parts.forEach((n) => emit(byName.get(n)!, row.description || byName.get(n)!.description));
    else if (subRow(entry, row, gen)?.parts.length === 1) {
      const { sub, parts } = subRow(entry, row, gen)!;
      const p = sub.props.find((q) => q.name === parts[0]);
      out.push(p ? { ...row, type: p.type, default: p.default, required: p.required } : row);
    } else out.push(row); // sub-component rows (`MessageActions onRegenerate`) and inherited DOM props stay hand-written
  }
  for (const p of g.props) emit(p, p.description);
  return { ...entry, props: out };
}

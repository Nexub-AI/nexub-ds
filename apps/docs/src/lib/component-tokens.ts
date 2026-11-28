// The "Design tokens" section of a component page, built at build time from
// `@nexub/tokens/json/component` (the single source: each group lists the docs
// slugs that read it under `$extensions["dev.nexub"].docs`). Pure and import-free
// so the docs tests can run it.

export interface ComponentTokenRow {
  /** The CSS custom property, e.g. `--button-filled-bg`. */
  name: string;
  /** DTCG type: `color` or `dimension`. */
  type: string;
  /** The semantic role it aliases (`--color-primary`), or the literal default (`transparent`). */
  aliases: string;
  /** The exact fallback the component reads when the token is unset. */
  css: string;
  description?: string;
}

export interface ComponentTokenGroup {
  /** The group key, e.g. `field`. */
  group: string;
  description?: string;
  rows: ComponentTokenRow[];
}

interface Dtcg {
  $type?: string;
  $value?: string;
  $description?: string;
  $extensions?: { 'dev.nexub'?: { css?: string; docs?: string[] } };
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

/** `{color.primary}` → `--color-primary`; a literal stays as it is. */
export function aliasOf(value: string): string {
  const m = value.match(/^\{([\w-]+)\.([\w-]+)\}$/);
  return m ? `--${m[1]}-${m[2]}` : value;
}

/** The component token groups a docs page documents (usually one; none for most pages). */
export function componentTokensFor(slug: string, component: Record<string, unknown>): ComponentTokenGroup[] {
  const groups: ComponentTokenGroup[] = [];
  for (const [group, raw] of Object.entries(component)) {
    if (group.startsWith('$') || !isObject(raw)) continue;
    const meta = raw as Dtcg;
    if (!meta.$extensions?.['dev.nexub']?.docs?.includes(slug)) continue;
    const rows: ComponentTokenRow[] = [];
    for (const [key, t] of Object.entries(raw)) {
      if (key.startsWith('$') || !isObject(t)) continue;
      const token = t as Dtcg;
      const value = token.$value ?? '';
      rows.push({
        name: `--${group}-${key}`,
        type: token.$type ?? '',
        aliases: aliasOf(value),
        css: token.$extensions?.['dev.nexub']?.css ?? value,
        ...(token.$description ? { description: token.$description } : {}),
      });
    }
    groups.push({ group, ...(meta.$description ? { description: meta.$description } : {}), rows });
  }
  return groups;
}

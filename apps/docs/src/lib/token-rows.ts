// Rows for the token explorer (/foundations/tokens), built once at build time from
// the published @nexub/tokens data. Pure and import-free so the docs tests can run it.

export type TokenTier = 'role' | 'component' | 'reference';

export interface TokenRow {
  /** The CSS custom property, e.g. `--color-primary`. */
  name: string;
  tier: TokenTier;
  category: string;
  value: string;
  /** A CSS colour to paint as a swatch (colour tokens only). */
  swatch?: string;
  /** Colour roles: the resolved hex in light and dark at standard contrast. */
  light?: string;
  dark?: string;
}

export const TIER_LABEL: Record<TokenTier, string> = {
  role: 'Semantic role',
  component: 'Component',
  reference: 'Reference',
};

// Token name prefix → category. The first segment of every name in tokens.json.
const CATEGORY: Record<string, string> = {
  color: 'Colour',
  gradient: 'Gradient',
  font: 'Type',
  text: 'Type',
  type: 'Type',
  spacing: 'Spacing',
  size: 'Size',
  container: 'Size',
  radius: 'Shape',
  shape: 'Shape',
  shadow: 'Elevation',
  elevation: 'Elevation',
  motion: 'Motion',
  state: 'State',
  z: 'Z-index',
  breakpoint: 'Breakpoint',
  marketing: 'Marketing',
};

/** Categories in the order the filter shows them ("Other" catches a prefix added later). */
export const TOKEN_CATEGORIES = [...new Set(Object.values(CATEGORY)), 'Other'];

interface ComponentToken {
  $type?: string;
  $value?: string;
  $extensions?: { 'dev.nexub'?: { css?: string } };
}

export interface TokenSources {
  /** `@nexub/tokens/json`: flat name → value. */
  tokens: Record<string, string>;
  /** `native.color.roles.standard` from `@nexub/tokens/native`: role → hex per scheme. */
  roles: { light: Record<string, string>; dark: Record<string, string> };
  /** `@nexub/tokens/json/component`: component → token → DTCG entry. */
  component: Record<string, unknown>;
}

/** Roles first, then component tokens, then the reference scales. Names are unique. */
export function buildTokenRows({ tokens, roles, component }: TokenSources): TokenRow[] {
  const rows = new Map<string, TokenRow>();
  const add = (row: TokenRow) => {
    if (!rows.has(row.name)) rows.set(row.name, row);
  };

  for (const [role, light] of Object.entries(roles.light)) {
    const dark = roles.dark[role] ?? light;
    const name = `--color-${role}`;
    add({ name, tier: 'role', category: 'Colour', value: `light-dark(${light}, ${dark})`, swatch: `var(${name})`, light, dark });
  }

  for (const [comp, group] of Object.entries(component)) {
    if (comp.startsWith('$') || typeof group !== 'object' || group === null) continue;
    for (const [key, raw] of Object.entries(group as Record<string, unknown>)) {
      if (key.startsWith('$') || typeof raw !== 'object' || raw === null) continue;
      const token = raw as ComponentToken;
      // Unset by default: the value is the fallback the component reads.
      const value = token.$extensions?.['dev.nexub']?.css ?? token.$value ?? '';
      const colour = token.$type === 'color';
      add({
        name: `--${comp}-${key}`,
        tier: 'component',
        category: colour ? 'Colour' : key.endsWith('radius') ? 'Shape' : token.$type === 'dimension' ? 'Size' : 'Other',
        value,
        ...(colour ? { swatch: value } : {}),
      });
    }
  }

  for (const [key, value] of Object.entries(tokens)) {
    const category = CATEGORY[key.split('-')[0]!] ?? 'Other';
    const name = `--${key}`;
    add({ name, tier: 'reference', category, value: String(value), ...(category === 'Colour' ? { swatch: `var(${name})` } : {}) });
  }

  return [...rows.values()];
}

/** Rows matching a query (name or value, case-insensitive) and the two filters. */
export function filterTokenRows(rows: TokenRow[], query: string, category: string | null, tier: TokenTier | null): TokenRow[] {
  const q = query.trim().toLowerCase();
  return rows.filter(
    (r) =>
      (!category || r.category === category) &&
      (!tier || r.tier === tier) &&
      (!q || r.name.toLowerCase().includes(q) || r.value.toLowerCase().includes(q)),
  );
}

// Prop vocabulary shared by web and native components, so the same prop means
// the same thing on both platforms.

/** Semantic or product tone: overrides a component's colour with a role. */
export type ToneValue =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'leap'
  | 'bookub'
  | 'payub'
  | 'founderub';

/** Category colours (10.3) for icon chips, tags and avatars: eight generated
 * hues (one per chart series) plus 'accent', the product's spot accent. */
export const CATEGORY_COLORS = ['accent', 'blue', 'amber', 'emerald', 'pink', 'violet', 'cyan', 'red', 'lime'] as const;
export type CategoryColor = (typeof CATEGORY_COLORS)[number];

/** Nexub product brands; each remaps the tertiary role family. */
export type Product = 'leap' | 'bookub' | 'payub' | 'founderub';

/** The five Nexub divisions (`data-division`, @nexub/themes/divisions). */
export const DIVISIONS = ['os', 'commerce', 'fintech', 'intelligence', 'autonomous'] as const;
export type DivisionKey = (typeof DIVISIONS)[number];

/** Every app key `data-product` accepts (@nexub/themes/products), aliases included:
 * book-hub = bookub, payhub = payub, founder-hub = founderub. */
export const PRODUCT_KEYS = ['leap', 'people', 'payub', 'contracts', 'bookub', 'forms', 'founderub', 'commerce', 'money', 'capital', 'mind', 'go', 'command-hub', 'runner', 'book-hub', 'payhub', 'founder-hub'] as const;
export type ProductKey = (typeof PRODUCT_KEYS)[number];

/** The attributes for an accent key: a division sets `data-division`, an app
 * `data-product`. 'commerce' is both a division and an app, so it sets both. */
export function accentAttrs(accent: ProductKey | DivisionKey | undefined): { 'data-product'?: ProductKey; 'data-division'?: DivisionKey } {
  const has = <T extends string>(list: readonly T[], key: string | undefined): key is T => list.includes(key as T);
  return {
    'data-product': has(PRODUCT_KEYS, accent) ? accent : undefined,
    'data-division': has(DIVISIONS, accent) ? accent : undefined,
  };
}

/** Glass intensity dial (user preference). 'off' makes every glass surface solid. */
export type GlassMode = 'clear' | 'balanced' | 'tinted' | 'off';

/** Contrast level of the colour scheme. */
export type ContrastLevel = 'standard' | 'medium' | 'high';

/** The control ladder (24 / 32 / 40 / 48 / 56). */
export type ControlSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

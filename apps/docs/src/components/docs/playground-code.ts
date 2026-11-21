// 11.0: the generated playground's data shape (registry/playground.generated.json,
// built by scripts/playground.mjs) and the JSX printer for the current props.
// Plain TypeScript with no imports, so node:test can load it.

export type PlaygroundValue = string | number | boolean;

/** `default` is the component's own default (from the types); `initial` is what the
 *  first docs example sets on the element, when it differs. */
export type PlaygroundControl =
  | { kind: 'select'; name: string; options: PlaygroundValue[]; default?: PlaygroundValue; initial?: PlaygroundValue }
  | { kind: 'switch'; name: string; default?: boolean; initial?: boolean }
  | { kind: 'text'; name: string; default?: string; initial?: string }
  | { kind: 'number'; name: string; default?: number; initial?: number };

export interface PlaygroundRecipe {
  /** The JSX tag the props go to, as written in the example (`Avatar`, `Accordion.Root`). */
  tag: string;
  /** What the element holds: editable text, other elements, or nothing. */
  children: 'text' | 'nodes' | 'none';
  /** Attributes of the example that are not controls, printed as written. */
  fixed: string[];
  controls: PlaygroundControl[];
  /** States gallery cells; the first is always the default render. */
  states: { prop: string; value: PlaygroundValue }[];
}

export type PlaygroundBag = Record<string, PlaygroundValue>;

/** The value a control shows: what the reader set, else the example's, else the default. */
export function effective(control: PlaygroundControl, bag: PlaygroundBag): PlaygroundValue | undefined {
  return bag[control.name] ?? control.initial ?? control.default;
}

export function printAttr(name: string, value: PlaygroundValue): string {
  if (value === true) return name;
  if (typeof value === 'string') return value.includes('"') ? `${name}={${JSON.stringify(value)}}` : `${name}="${value}"`;
  return `${name}={${value}}`;
}

/** JSX for the current props: only what differs from the component's defaults. */
export function printJsx(recipe: PlaygroundRecipe, bag: PlaygroundBag): string {
  const attrs = [...recipe.fixed];
  let text = '';
  for (const c of recipe.controls) {
    const v = effective(c, bag);
    if (c.name === 'children') {
      text = typeof v === 'string' ? v : '';
      continue;
    }
    if (v === undefined || v === '' || v === (c.default ?? (c.kind === 'switch' ? false : undefined))) continue;
    attrs.push(printAttr(c.name, v));
  }
  const open = `<${recipe.tag}${attrs.length ? ' ' + attrs.join(' ') : ''}`;
  if (recipe.children === 'none') return `${open} />`;
  return `${open}>${recipe.children === 'text' ? text : '…'}</${recipe.tag}>`;
}

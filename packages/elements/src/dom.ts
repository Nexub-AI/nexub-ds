// Icons are built as DOM nodes, not HTML strings: pages with Trusted Types (`require-trusted-types-for
// 'script'`) block every innerHTML write, and the elements must work on them.

/** One SVG shape: its tag and attributes. */
export type Shape = [tag: 'path' | 'rect', attributes: Record<string, string>];
const SVG_NS = 'http://www.w3.org/2000/svg';

/** A 24×24 stroked icon, hidden from assistive technology. */
export const svg = (shapes: Shape[]): SVGSVGElement => {
  const root = document.createElementNS(SVG_NS, 'svg');
  const attrs: Record<string, string> = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' };
  for (const [k, v] of Object.entries(attrs)) root.setAttribute(k, v);
  for (const [tag, a] of shapes) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(a)) node.setAttribute(k, v);
    root.append(node);
  }
  return root;
};

/** An element with attributes (`undefined` ones are skipped). */
export const el = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<Record<string, string>> = {}): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) if (v !== undefined) node.setAttribute(k, v);
  return node;
};

export const CHEVRON: Shape[] = [['path', { d: 'm6 9 6 6 6-6' }]];
export const CHECK: Shape[] = [['path', { d: 'M20 6 9 17l-5-5' }]];

/** The BCP 47 locale of `node`: its `locale` attribute, else the nearest `lang`; `undefined` when unreadable. */
export const localeOf = (node: Element): string | undefined => {
  const tag = node.getAttribute('locale') || node.closest('[lang]')?.getAttribute('lang') || undefined;
  try {
    return tag ? Intl.getCanonicalLocales(tag)[0] : undefined;
  } catch {
    return undefined;
  }
};

/** Whether `node` is in a right-to-left context. */
export const isRtl = (node: Element): boolean => {
  try {
    return node.matches(':dir(rtl)');
  } catch {
    return node.closest('[dir]')?.getAttribute('dir')?.toLowerCase() === 'rtl';
  }
};

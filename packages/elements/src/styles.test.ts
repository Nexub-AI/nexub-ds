// The design lint (packages/react/src/design-lint.test.ts) reads Tailwind classes; the elements
// write plain CSS. These are the same rules for that CSS: no hex colours, no raw pixel sizes
// (hairlines are fine), logical directions only, and only tokens that @nexub/tokens or
// @nexub/themes define (or the component tokens the React fields read, like --field-border).
/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';
import { fieldCss } from './styles.js';
import { pickerCss } from './picker-styles.js';
import { listCss } from './list-styles.js';

const css = fieldCss + pickerCss + listCss;
// The token and theme CSS, read as text (this package has no Node types).
const themeCss: Record<string, string> = {
  ...import.meta.glob('../../tokens/dist/css/*.css', { query: '?raw', import: 'default', eager: true }),
  ...import.meta.glob('../../themes/src/*.css', { query: '?raw', import: 'default', eager: true }),
};

describe('shadow styles', () => {
  it('have no hex colours or raw white and black', () => {
    expect(css.match(/#[0-9a-fA-F]{3,8}\b/g)).toBeNull();
    expect(css.match(/\b(?:white|black)\b/g)).toBeNull();
  });

  it('size in rem and tokens, not pixels (1px hairlines aside)', () => {
    expect(css.match(/(?<![\d.])(?!0px|1px)\d+(?:\.\d+)?px/g)).toBeNull();
  });

  it('use logical directions', () => {
    expect(css.match(/(?:margin|padding|border)-(?:left|right|top|bottom)\b|(?<![\w-])(?:left|right|top|bottom)\s*:|text-align:\s*(?:left|right)/g)).toBeNull();
  });

  it('only read token variables that the themes define', () => {
    const defined = new Set<string>();
    expect(Object.keys(themeCss).length).toBeGreaterThan(5);
    for (const text of Object.values(themeCss)) for (const m of text.matchAll(/(--[\w-]+)\s*:/g)) defined.add(m[1]!);
    // Component tokens the React fields read with a fallback (control.ts), and the element's own placement variables.
    const own = new Set(['--field-border', '--field-radius', '--field-bg', '--field-fg', '--day-cell', '--nx-top', '--nx-start', '--nx-width']);
    const used = [...new Set([...css.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]!))];
    expect(used.filter((v) => !defined.has(v) && !own.has(v))).toEqual([]);
  });

  it('handle reduced motion and forced colours', () => {
    expect(css).toContain('@media (prefers-reduced-motion: no-preference)');
    expect(css).toContain('@media (forced-colors: active)');
    // Transitions and animations live only inside the no-preference blocks.
    const outside = css.replace(/@media \(prefers-reduced-motion: no-preference\) \{[\s\S]*?\n\}/g, '');
    expect(outside).not.toMatch(/\b(?:transition|animation)\s*:/);
  });
});

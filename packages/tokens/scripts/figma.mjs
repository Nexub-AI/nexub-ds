// Figma variables (@nexub/tokens/figma): W3C Design Tokens (DTCG) JSON, one
// file per Figma mode, built from the same resolved values as
// @nexub/tokens/native, so a Figma library and the code can't drift.
//
//   color.<scheme>.<level>.tokens.json   colour roles + product brands, 6 modes
//   primitives.tokens.json               spacing, radius, shape, size, type (numbers, px)
//
// Import with Figma's "Import variables" (DTCG) or Tokens Studio, one collection
// per file name prefix and one mode per file.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';

const color = (hex) => ({ $type: 'color', $value: hex });
const number = (n) => ({ $type: 'number', $value: n });
const tree = (obj, leaf) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v !== null && typeof v === 'object' ? tree(v, leaf) : leaf(v)]));

/** @returns {Record<string, object>} file name → DTCG document */
export function figmaFiles(native) {
  const files = {};
  for (const [level, schemes] of Object.entries(native.color.roles)) {
    for (const scheme of ['light', 'dark']) {
      files[`color.${scheme}.${level}.tokens.json`] = {
        role: tree(schemes[scheme], color),
        product: Object.fromEntries(
          Object.entries(native.color.products).map(([p, levels]) => [p, tree(levels[level][scheme], color)]),
        ),
      };
    }
  }
  files['primitives.tokens.json'] = {
    spacing: tree(native.spacing, number),
    radius: tree(native.radius, number),
    shape: tree(native.shape, number),
    size: tree(native.size, number),
    type: Object.fromEntries(
      Object.entries(native.type).map(([role, v]) => [
        role,
        { size: number(v.size), 'line-height': number(v.lineHeight), weight: number(v.weight), 'letter-spacing': number(v.letterSpacing) },
      ]),
    ),
  };
  return files;
}

export function writeFigma(native, dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const [name, doc] of Object.entries(figmaFiles(native))) writeFileSync(`${dir}/${name}`, JSON.stringify(doc, null, 2) + '\n');
}

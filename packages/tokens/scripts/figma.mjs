// Figma variables (@nexub/tokens/figma): W3C Design Tokens (DTCG) JSON, one
// file per Figma mode, built from the same resolved values as
// @nexub/tokens/native, so a Figma library and the code can't drift.
//
//   color.<scheme>.<level>.tokens.json   colour roles + product brands, 6 modes
//   primitives.tokens.json               spacing, radius, shape, size, type (numbers, px)
//
// Import with Figma's "Import variables" (DTCG) or Tokens Studio, one collection
// per file name prefix and one mode per file. For collections that alias each
// other (reference palette → roles), use figma/variables/ (12.6, below).
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { LEVELS, PRODUCTS, ROLES, TONES, palettes, signaturePalettes, tertiary, tonesAt } from './generate.mjs';

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
        division: Object.fromEntries(
          Object.entries(native.color.divisions).map(([d, levels]) => [d, tree(levels[level][scheme], color)]),
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

// ─── Figma variables with collections and aliases (12.6) ─────────────────────
// @nexub/tokens/figma/variables/*.tokens.json: three Figma collections, built
// the way the CSS is (roles.css reads --color-palette-* tones), so a Figma
// library shows the same reference → semantic chain as the code.
//
//   primitives.tokens.json             collection "Primitives", one mode: the
//                                      reference palette (palette/<name>/<tone>,
//                                      shipped signature values), spacing,
//                                      radius, shape, size, type scale (px)
//   product.<product>.tokens.json      collection "Product", one mode per
//                                      data-product (default = no product): the
//                                      tertiary palette tones, aliasing Primitives
//   color.<scheme>.<level>.tokens.json collection "Color", six modes (light/dark
//                                      × standard/medium/high): every colour
//                                      role, aliasing Primitives (tertiary roles
//                                      alias Product)
//
// Values follow the DTCG 2025.10 format Figma's native import reads (colour
// objects with hex, px dimensions). Aliases use DTCG `{group.token}` syntax,
// plus Figma's com.figma.aliasData so a reference into another collection links
// by collection and variable name. The files above (one per mode, resolved hex)
// stay as they were.

export const COLLECTIONS = { primitives: 'Primitives', product: 'Product', color: 'Color' };
const PRODUCT_MODES = ['default', ...PRODUCTS];

const colorValue = (hex) => ({
  colorSpace: 'srgb',
  components: [1, 3, 5].map((i) => +(parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(4)),
  alpha: 1,
  hex,
});
const px = (n) => ({ $type: 'dimension', $value: { value: n, unit: 'px' } });
const alias = (collection, path) => ({
  $type: 'color',
  $value: `{${path.join('.')}}`,
  $extensions: { 'com.figma.aliasData': { targetVariableSetName: collection, targetVariableName: path.join('/') } },
});
const pxTree = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, px(v)]));

/** The palette the web ships: signature replaces primary, secondary and the neutrals. */
const shippedPalettes = () => ({ ...palettes(), ...signaturePalettes() });

/** Tones the tertiary roles read at any contrast level, both schemes. */
const tertiaryTones = () =>
  [...new Set(Object.values(tertiary('primary')).flatMap((e) => LEVELS.flatMap((l) => tonesAt(e, l).slice(1))))].sort(
    (a, b) => a - b,
  );

/** @returns {Record<string, object>} file name → DTCG document */
export function figmaVariableFiles(native) {
  const files = {};
  const pal = shippedPalettes();
  files['primitives.tokens.json'] = {
    palette: Object.fromEntries(
      Object.entries(pal).map(([name, tones]) => [
        name,
        Object.fromEntries(TONES.map((t) => [t, { $type: 'color', $value: colorValue(tones[t]) }])),
      ]),
    ),
    spacing: pxTree(native.spacing),
    radius: pxTree(native.radius),
    shape: pxTree({ ...native.shape, ...native.signature.shape }),
    size: Object.fromEntries(Object.entries(native.size).map(([k, v]) => [k, pxTree(v)])),
    type: Object.fromEntries(
      Object.entries(native.type).map(([role, v]) => [
        role,
        {
          size: px(v.size),
          'line-height': px(v.lineHeight),
          weight: { $type: 'number', $value: v.weight },
          'letter-spacing': px(native.signature.type[role]?.letterSpacing ?? v.letterSpacing),
        },
      ]),
    ),
  };
  for (const product of PRODUCT_MODES) {
    const from = product === 'default' ? 'primary' : product;
    files[`product.${product}.tokens.json`] = {
      product: {
        tertiary: Object.fromEntries(
          tertiaryTones().map((t) => [t, alias(COLLECTIONS.primitives, ['palette', from, String(t)])]),
        ),
      },
    };
  }
  const roles = { ...ROLES, ...tertiary('primary') };
  for (const level of LEVELS)
    for (const [scheme, col] of [['light', 1], ['dark', 2]]) {
      files[`color.${scheme}.${level}.tokens.json`] = {
        color: Object.fromEntries(
          Object.entries(roles).map(([role, entry]) => {
            const t = tonesAt(entry, level);
            const tone = String(t[col]);
            return [
              role,
              role.includes('tertiary')
                ? alias(COLLECTIONS.product, ['product', 'tertiary', tone])
                : alias(COLLECTIONS.primitives, ['palette', t[0], tone]),
            ];
          }),
        ),
      };
    }
  return files;
}

export function writeFigmaVariables(native, dir) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const [name, doc] of Object.entries(figmaVariableFiles(native)))
    writeFileSync(`${dir}/${name}`, JSON.stringify(doc, null, 2) + '\n');
}

/** Files in `dir` that differ from a fresh build: missing, stale or extra. */
export function staleFigmaVariables(native, dir) {
  const want = figmaVariableFiles(native);
  const read = (f) => {
    try {
      return readFileSync(`${dir}/${f}`, 'utf8');
    } catch {
      return null;
    }
  };
  let have = [];
  try {
    have = readdirSync(dir);
  } catch {
    // missing directory: every file is reported below
  }
  return [
    ...Object.entries(want)
      .filter(([f, doc]) => read(f) !== JSON.stringify(doc, null, 2) + '\n')
      .map(([f]) => f),
    ...have.filter((f) => !(f in want)),
  ];
}

// node scripts/figma.mjs [--check]: write dist/figma/variables, or (--check, CI)
// fail when it differs from what the tokens build writes.
if (import.meta.url === `file://${process.argv[1]}`) {
  const root = new URL('..', import.meta.url).pathname;
  const src = readFileSync(`${root}src/generated/native.ts`, 'utf8');
  const native = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));
  const dir = `${root}dist/figma/variables`;
  if (process.argv.includes('--check')) {
    const stale = staleFigmaVariables(native, dir);
    if (stale.length) {
      console.error(`dist/figma/variables is out of date (${stale.join(', ')}). Run the @nexub/tokens build.`);
      process.exit(1);
    }
    console.log('✓ dist/figma/variables is current.');
  } else {
    writeFigmaVariables(native, dir);
    console.log('✓ wrote dist/figma/variables');
  }
}

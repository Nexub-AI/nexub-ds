// The Figma variables must match the code: same values as @nexub/tokens/native,
// every colour mode has the same variables, and the built files are current.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { figmaFiles, figmaVariableFiles, staleFigmaVariables } from './figma.mjs';

const root = new URL('..', import.meta.url).pathname;
const src = readFileSync(`${root}src/generated/native.ts`, 'utf8');
const native = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));
const files = figmaFiles(native);
const paths = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => ('$value' in v ? [`${p}${k}`] : paths(v, `${p}${k}/`)));

test('six colour modes with identical variables, plus primitives', () => {
  const colour = Object.keys(files).filter((f) => f.startsWith('color.'));
  assert.equal(colour.length, 6);
  const first = paths(files[colour[0]]).join();
  for (const f of colour) assert.equal(paths(files[f]).join(), first, f);
  assert.ok(files['primitives.tokens.json']);
});

test('values are the resolved code values', () => {
  assert.equal(files['color.light.standard.tokens.json'].role.primary.$value, native.color.roles.standard.light.primary);
  assert.equal(files['color.dark.high.tokens.json'].product.payub.tertiary.$value, native.color.products.payub.high.dark.tertiary);
  assert.deepEqual(files['primitives.tokens.json'].type['body-md'].size, { $type: 'number', $value: native.type['body-md'].size });
});

test('dist/figma is current (run the tokens build)', () => {
  const dir = `${root}dist/figma/`;
  assert.deepEqual(readdirSync(dir).filter((f) => f.endsWith('.json')).sort(), Object.keys(files).sort());
  for (const [name, doc] of Object.entries(files)) assert.equal(readFileSync(dir + name, 'utf8'), JSON.stringify(doc, null, 2) + '\n', name);
});

// ─── figma/variables (12.6): collections with aliases ───────────────────────
const vars = figmaVariableFiles(native);
const get = (doc, ref) => ref.split('.').reduce((o, k) => o?.[k], doc);
const modes = (prefix) => Object.keys(vars).filter((f) => f.startsWith(prefix));

test('variables: Primitives (1 mode), Product (5 modes), Color (6 modes), each mode with the same variables', () => {
  assert.equal(modes('primitives.').length, 1);
  assert.deepEqual(modes('product.').sort(), ['bookub', 'default', 'founderub', 'leap', 'payub'].map((p) => `product.${p}.tokens.json`));
  assert.equal(modes('color.').length, 6);
  for (const prefix of ['product.', 'color.']) {
    const first = paths(vars[modes(prefix)[0]]).join();
    for (const f of modes(prefix)) assert.equal(paths(vars[f]).join(), first, f);
  }
});

test('variables: every alias is DTCG {ref} syntax naming a token in the target collection', () => {
  const target = { Primitives: [vars['primitives.tokens.json']], Product: modes('product.').map((f) => vars[f]) };
  for (const f of [...modes('product.'), ...modes('color.')]) {
    for (const p of paths(vars[f])) {
      const token = get(vars[f], p.replaceAll('/', '.'));
      const ref = /^\{([\w.-]+)\}$/.exec(token.$value)?.[1];
      assert.ok(ref, `${f} ${p} is an alias`);
      const { targetVariableSetName, targetVariableName } = token.$extensions['com.figma.aliasData'];
      assert.equal(targetVariableName, ref.replaceAll('.', '/'));
      for (const doc of target[targetVariableSetName]) assert.ok(get(doc, ref)?.$type === 'color', `${f} ${p} → ${ref}`);
    }
  }
});

// Resolve a Color-mode role through Product and Primitives to hex.
const resolve = (scheme, level, product, role) => {
  let token = vars[`color.${scheme}.${level}.tokens.json`].color[role];
  for (;;) {
    const ref = token.$value.slice(1, -1);
    const set = token.$extensions['com.figma.aliasData'].targetVariableSetName;
    token = get(set === 'Product' ? vars[`product.${product}.tokens.json`] : vars['primitives.tokens.json'], ref);
    if (typeof token.$value !== 'string') return token.$value.hex;
  }
};

test('variables: roles resolve to the shipped code values (native roles + signature, products over tertiary)', () => {
  for (const level of ['standard', 'medium', 'high'])
    for (const scheme of ['light', 'dark']) {
      const code = { ...native.color.roles[level][scheme], ...native.signature.roles[level][scheme] };
      for (const role of Object.keys(vars['color.light.standard.tokens.json'].color))
        assert.equal(resolve(scheme, level, 'default', role), code[role], `${scheme}/${level} ${role}`);
      for (const product of ['leap', 'bookub', 'payub', 'founderub'])
        for (const [role, hex] of Object.entries(native.color.products[product][level][scheme]))
          assert.equal(resolve(scheme, level, product, role), hex, `${product} ${scheme}/${level} ${role}`);
    }
});

test('variables: primitives use px dimensions and sRGB colour objects (Figma native import)', () => {
  const prim = vars['primitives.tokens.json'];
  assert.deepEqual(prim.spacing[Object.keys(native.spacing)[1]].$value, { value: Object.values(native.spacing)[1], unit: 'px' });
  assert.deepEqual(prim.type['body-md'].size, { $type: 'dimension', $value: { value: native.type['body-md'].size, unit: 'px' } });
  const c = prim.palette.primary['40'].$value;
  assert.equal(c.colorSpace, 'srgb');
  assert.match(c.hex, /^#[0-9a-f]{6}$/);
  for (const t of paths(prim)) assert.ok(['color', 'dimension', 'number'].includes(get(prim, t.replaceAll('/', '.')).$type), t);
});

test('dist/figma/variables is current (node scripts/figma.mjs --check)', () => {
  assert.deepEqual(staleFigmaVariables(native, `${root}dist/figma/variables`), []);
});

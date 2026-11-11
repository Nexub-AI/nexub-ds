// 8.5: web ↔ native prop parity. For every web component with a native twin
// (src/registry/native.ts), which props share a name, and which exist on one side only.
// Built from the two generated prop files, so any drift shows up as a diff here.
//   node scripts/parity.mjs          write src/registry/parity.generated.json
//   node scripts/parity.mjs --check  fail if out of date (CI)
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const reg = fileURLToPath(new URL('../src/registry/', import.meta.url));
const read = (f) => readFileSync(join(reg, f), 'utf8');
const native = JSON.parse(read('native-props.generated.json'));
const webGen = JSON.parse(read('web-props.generated.json'));
const web = { ...webGen['@nexub/react'], ...webGen['@nexub/patterns'] };
const out = join(reg, 'parity.generated.json');

// `slug: {\n    name: 'Native'` in nativeTwins and nativePatternTwins.
const twins = [...read('native.ts').matchAll(/^ {2}'?([a-z0-9-]+)'?: \{\n {4}name: '(\w+)'/gm)].map((m) => [m[1], m[2]]);
if (twins.length < 40) throw new Error(`parity: found only ${twins.length} twins in native.ts; did its format change?`);

// Props a web component gets from React's DOM types, which web-props.generated.json leaves out.
const DOM = new Set(['children', 'disabled', 'placeholder', 'value', 'defaultValue', 'checked', 'defaultChecked', 'name', 'required', 'autoFocus', 'onChange']);
// Styling and accessibility hooks every component has on its platform; not API differences.
const PLATFORM = new Set(['className', 'wrapperClassName', 'style', 'ref', 'id', 'aria-label', 'aria-labelledby', 'accessibilityLabel', 'testID']);

const find = (key) => Object.entries(web).find(([n]) => n.toLowerCase() === key);
const result = {};
for (const [slug, nativeName] of twins) {
  const key = slug.replace(/-/g, '');
  const [webName, w] = find(key) ?? find(`${key}root`) ?? [];
  const n = native[nativeName];
  if (!n) throw new Error(`parity: ${slug} → ${nativeName} has no generated native props`);
  // Deprecated names are on their way out (9.0), so they aren't part of the matrix.
  const nNames = n.props.filter((p) => !p.description.startsWith('Deprecated.')).map((p) => p.name).filter((p) => !PLATFORM.has(p));
  if (!w) {
    result[slug] = { web: null, native: nativeName, shared: [], webOnly: [], nativeOnly: nNames.sort() }; // compound on web (Dialog.Root, …)
    continue;
  }
  const wNames = new Set(w.props.filter((p) => !p.deprecated).map((p) => p.name).filter((p) => !PLATFORM.has(p)));
  const onWeb = (p) => wNames.has(p) || w.inherited?.includes(p) || DOM.has(p);
  result[slug] = {
    web: webName,
    native: nativeName,
    shared: nNames.filter(onWeb).sort(),
    webOnly: [...wNames].filter((p) => !nNames.includes(p)).sort(),
    nativeOnly: nNames.filter((p) => !onWeb(p)).sort(),
  };
}

const json = JSON.stringify(result, null, 2) + '\n';
if (process.argv.includes('--check')) {
  let current = '';
  try { current = readFileSync(out, 'utf8'); } catch {}
  if (current !== json) {
    console.error('parity.generated.json is out of date: run `node apps/docs/scripts/parity.mjs` and check the diff.');
    process.exit(1);
  }
} else {
  writeFileSync(out, json);
  console.log(`parity: ${twins.length} twins → ${out}`);
}

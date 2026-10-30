// Generates src/registry/native-props.generated.json: the props of every
// exported `XProps` interface in @nexub/react-native (components + patterns),
// read from source so the docs never drift from the package.
//   node scripts/native-props.mjs          write
//   node scripts/native-props.mjs --check  fail if out of date (CI)
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const here = fileURLToPath(new URL('.', import.meta.url));
const pkg = join(here, '../../../packages/react-native/src');
const out = join(here, '../src/registry/native-props.generated.json');
const dirs = ['components', 'patterns', 'primitives'];

// Simple type aliases (`type ControlSize = 'sm' | 'md'`) anywhere in the package,
// so the docs show `'sm' | 'md'` instead of an unexported name.
const aliases = {};
(function collect(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== '__tests__') collect(f); continue; }
    if (!/\.tsx?$/.test(e.name) || e.name.includes('.test.')) continue;
    const src = ts.createSourceFile(e.name, readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true);
    for (const st of src.statements) {
      if (ts.isTypeAliasDeclaration(st) && !st.typeParameters && ts.isUnionTypeNode(st.type)) {
        aliases[st.name.text] = st.type.getText(src).replace(/\s+/g, ' ').replace(/^\| /, '');
      }
    }
  }
})(pkg);
const resolve = (t) => aliases[t] ?? t;

const result = {};
for (const dir of dirs) {
  for (const file of readdirSync(join(pkg, dir)).filter((f) => f.endsWith('.tsx') && !f.includes('.test.'))) {
    const src = ts.createSourceFile(file, readFileSync(join(pkg, dir, file), 'utf8'), ts.ScriptTarget.Latest, true);
    // Defaults from `function X({ size = 'md', … })` destructuring.
    const defaults = {};
    src.forEachChild(function visit(node) {
      if ((ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) && node.parameters[0]) {
        const p = node.parameters[0].name;
        if (ts.isObjectBindingPattern(p)) {
          for (const el of p.elements) {
            if (el.initializer && ts.isIdentifier(el.name)) {
              (defaults[el.name.text] ??= new Set()).add(el.initializer.getText(src));
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    });
    for (const st of src.statements) {
      if (!ts.isInterfaceDeclaration(st) || !st.name.text.endsWith('Props')) continue;
      if (!st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
      const name = st.name.text.replace(/Props$/, '');
      const ext = st.heritageClauses?.flatMap((h) => h.types.map((t) => t.getText(src))) ?? [];
      result[name] = {
        file: `${dir}/${file}`,
        extends: ext,
        props: st.members.filter(ts.isPropertySignature).map((m) => {
          const prop = m.name.getText(src);
          const doc = ts.getJSDocCommentsAndTags(m).map((d) => (typeof d.comment === 'string' ? d.comment : '')).join(' ').trim();
          const def = defaults[prop]?.size === 1 ? [...defaults[prop]][0] : undefined;
          return {
            name: prop,
            type: m.type ? resolve(m.type.getText(src).replace(/\s+/g, ' ')) : 'unknown',
            required: !m.questionToken,
            ...(def ? { default: def } : {}),
            description: doc,
          };
        }),
      };
    }
  }
}

const json = JSON.stringify(result, null, 2) + '\n';
if (process.argv.includes('--check')) {
  let current = '';
  try { current = readFileSync(out, 'utf8'); } catch {}
  if (current !== json) {
    console.error('native-props.generated.json is out of date: run `node apps/docs/scripts/native-props.mjs`.');
    process.exit(1);
  }
} else {
  writeFileSync(out, json);
  console.log(`native props: ${Object.keys(result).length} interfaces → ${out}`);
}

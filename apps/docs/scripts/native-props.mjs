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
const all = {}; // non-exported or non-Props interfaces, by full name
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
      if (!ts.isInterfaceDeclaration(st)) continue;
      const exported = st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      const ext = st.heritageClauses?.flatMap((h) => h.types.map((t) => t.getText(src).replace(/\s+/g, ' '))) ?? [];
      // Every interface, so `extends StepperBaseProps` or `Omit<TextFieldProps, …>` can be followed below.
      const target = exported && st.name.text.endsWith('Props') ? result : (all[st.name.text] = {}, all);
      const name = target === result ? st.name.text.replace(/Props$/, '') : st.name.text;
      target[name] = {
        file: `${dir}/${file}`,
        extends: ext,
        props: st.members.filter(ts.isPropertySignature).map((m) => {
          const prop = m.name.getText(src);
          const doc = ts.getJSDocCommentsAndTags(m).map((d) => (typeof d.comment === 'string' ? d.comment : '')).join(' ').trim();
          const tag = (n) => ts.getJSDocTags(m).find((t) => t.tagName.text === n);
          const tagText = (t) => (typeof t?.comment === 'string' ? t.comment.trim() : '');
          const def = (defaults[prop]?.size === 1 ? [...defaults[prop]][0] : undefined) ?? (tagText(tag('default')) || undefined);
          const deprecated = tag('deprecated');
          return {
            name: prop,
            type: m.type ? resolve(m.type.getText(src).replace(/\s+/g, ' ')) : 'unknown',
            required: !m.questionToken,
            ...(def ? { default: def } : {}),
            description: deprecated ? `Deprecated. ${tagText(deprecated)}`.trim() : doc,
          };
        }),
      };
    }
  }
}

// 11.8: add inherited props, so `PasswordInputProps extends Omit<TextFieldProps, …>` lists TextField's
// props too (own props win; each inherited one names its source). Types outside the package
// (TextInputProps, ViewProps) aren't followed: they are React Native's, not ours.
const byFullName = (n) => result[n.replace(/Props$/, '')] && n.endsWith('Props') ? result[n.replace(/Props$/, '')] : all[n];
function flat(entry, seen = new Set()) {
  if (seen.has(entry)) return [];
  seen.add(entry);
  const out = [...entry.__own];
  for (const clause of entry.extends) {
    const m = /^(Omit|Pick)<\s*(\w+)(?:<[^>]*>)?\s*,\s*(.+)>$/.exec(clause);
    const base = m ? m[2] : clause.replace(/<.*$/, '');
    const keys = m ? [...m[3].matchAll(/'([^']+)'/g)].map((k) => k[1]) : [];
    const parent = byFullName(base);
    if (!parent) continue;
    for (const p of flat(parent, seen)) {
      if (m?.[1] === 'Omit' && keys.includes(p.name)) continue;
      if (m?.[1] === 'Pick' && !keys.includes(p.name)) continue;
      if (out.some((o) => o.name === p.name)) continue;
      out.push({ ...p, inherited: p.inherited ?? base.replace(/Props$/, '') });
    }
  }
  return out;
}
for (const v of [...Object.values(result), ...Object.values(all)]) Object.defineProperty(v, '__own', { value: v.props, enumerable: false });
const flattened = Object.fromEntries(Object.entries(result).map(([k, v]) => [k, flat(v)]));
for (const [k, props] of Object.entries(flattened)) result[k].props = props;

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

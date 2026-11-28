// Generates src/registry/web-props.generated.json: the own props (not inherited
// DOM attributes) of every exported `XProps` type in @nexub/react, @nexub/patterns,
// @nexub/marketing, @nexub/diagram and (12.8) @nexub/genui, keyed by package, resolved by the
// TypeScript checker so cva `VariantProps` and intersections are included.
// @nexub/elements has custom elements, not props: each exported element class
// (`NxNumberInput`) gives `NumberInputElement`, whose rows are its attributes.
//   node scripts/web-props.mjs          write
//   node scripts/web-props.mjs --check  fail if out of date (CI)
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = join(here, '../src/registry/web-props.generated.json');
let src, checker;
const ownFile = (f) => f.fileName.startsWith(src) && !f.fileName.includes('/vendor/');

// Syntactic defaults per file: `function X({ size = 'md' })` destructuring and cva `defaultVariants`.
const defaultsCache = new Map();
function defaultsOf(sf) {
  if (defaultsCache.has(sf)) return defaultsCache.get(sf);
  const d = {};
  const add = (k, v) => (d[k] ??= new Set()).add(v);
  sf.forEachChild(function visit(node) {
    if ((ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) && node.parameters[0]) {
      const p = node.parameters[0].name;
      if (ts.isObjectBindingPattern(p)) for (const el of p.elements) if (el.initializer && ts.isIdentifier(el.name)) add(el.name.text, el.initializer.getText(sf));
    }
    if (ts.isPropertyAssignment(node) && node.name.getText(sf) === 'defaultVariants' && ts.isObjectLiteralExpression(node.initializer)) {
      for (const p of node.initializer.properties) if (ts.isPropertyAssignment(p)) add(p.name.getText(sf), p.initializer.getText(sf));
    }
    ts.forEachChild(node, visit);
  });
  defaultsCache.set(sf, d);
  return d;
}

const clean = (s) => s.replace(/\s+/g, ' ').replace(/ \| undefined| \| null|^undefined \| |^null \| /g, '').replace(/"/g, "'");
// Literal-union aliases (`ButtonStatus`) print as their members, so the docs show the values.
const show = (t, at) => {
  const parts = t.isUnion() ? t.types.filter((m) => !(m.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null))) : [t];
  if (t.isUnion() && parts.every((m) => m.isLiteral() || m.flags & ts.TypeFlags.BooleanLiteral)) {
    const lits = parts.map((m) => checker.typeToString(m));
    return lits.includes('true') && lits.includes('false') && lits.length === 2 ? 'boolean' : lits.join(' | ');
  }
  return checker.typeToString(t, at, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);
};
/** `NxNumberInput` → its attributes: every public get/set pair whose getter reads an attribute. */
function elementAttributes(cls, sf) {
  const type = checker.getDeclaredTypeOfSymbol(cls);
  const byAttr = new Map();
  for (const p of checker.getPropertiesOfType(type)) {
    const get = p.declarations?.find(ts.isGetAccessorDeclaration);
    const set = p.declarations?.find(ts.isSetAccessorDeclaration);
    if (!get || !set || !ownFile(get.getSourceFile()) || !get.body) continue;
    if (ts.getCombinedModifierFlags(get) & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected)) continue;
    const [, how, attr] = /\b(get|has)Attribute\('([\w-]+)'\)/.exec(get.body.getText(get.getSourceFile())) ?? [];
    if (!attr || byAttr.has(attr)) continue;
    const t = checker.getTypeOfSymbolAtLocation(p, cls.valueDeclaration ?? get);
    const jsdoc = ts.displayPartsToString(p.getDocumentationComment(checker)).replace(/\s+/g, ' ').trim();
    byAttr.set(attr, { name: attr, type: how === 'has' ? 'boolean' : clean(show(t, get)), required: false, description: jsdoc });
  }
  return { file: sf.fileName.slice(src.length), props: [...byAttr.values()].sort((a, b) => a.name.localeCompare(b.name)) };
}

const all = {};
for (const pkg of ['react', 'patterns', 'marketing', 'diagram', 'elements', 'genui']) {
  const root = join(here, '../../../packages', pkg);
  src = join(root, 'src/');
  const cfg = ts.getParsedCommandLineOfConfigFile(join(root, 'tsconfig.json'), {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} });
  const program = ts.createProgram([join(src, 'index.ts')], cfg.options);
  checker = program.getTypeChecker();
  const result = {};
  const mod = checker.getSymbolAtLocation(program.getSourceFile(join(src, 'index.ts')));
  for (let sym of checker.getExportsOfModule(mod)) {
    const name = sym.name;
    if (pkg === 'elements') {
      if (sym.flags & ts.SymbolFlags.Alias) sym = checker.getAliasedSymbol(sym);
      const decl = sym.declarations?.find(ts.isClassDeclaration);
      const abstract = decl && ts.getCombinedModifierFlags(decl) & ts.ModifierFlags.Abstract;
      if (decl && !abstract && /^Nx\w+$/.test(name) && ownFile(decl.getSourceFile())) result[`${name.slice(2)}Element`] = elementAttributes(sym, decl.getSourceFile());
      continue;
    }
    if (!name.endsWith('Props')) continue;
    if (sym.flags & ts.SymbolFlags.Alias) sym = checker.getAliasedSymbol(sym);
    const decl = sym.declarations?.find((d) => ts.isInterfaceDeclaration(d) || ts.isTypeAliasDeclaration(d));
    if (!decl || !ownFile(decl.getSourceFile())) continue;
    const sf = decl.getSourceFile();
    const type = checker.getDeclaredTypeOfSymbol(sym);
    const defaults = defaultsOf(sf);
    const props = [];
    const inherited = [];
    for (const p of checker.getPropertiesOfType(type)) {
      const pd = p.declarations?.[0];
      if (!pd) continue;
      // Props from a dependency (Radix `onCheckedChange`) may be documented by hand; React DOM attributes are not listed.
      if (!ownFile(pd.getSourceFile())) {
        if (!pd.getSourceFile().fileName.includes('/@types/react/')) inherited.push(p.name);
        continue;
      }
      const t = checker.getTypeOfSymbolAtLocation(p, decl);
      const jsdoc = ts.displayPartsToString(p.getDocumentationComment(checker)).replace(/\s+/g, ' ').trim();
      const tags = p.getJsDocTags(checker);
      const tagDefault = tags.find((t) => t.name === 'default');
      const syn = defaults[p.name]?.size === 1 ? [...defaults[p.name]][0] : undefined;
      const def = tagDefault ? ts.displayPartsToString(tagDefault.text).trim() : syn;
      props.push({
        name: p.name,
        type: clean(show(t, decl)),
        required: !(p.flags & ts.SymbolFlags.Optional),
        ...(def ? { default: def.replace(/"/g, "'") } : {}),
        ...(tags.some((t) => t.name === 'deprecated') ? { deprecated: true } : {}),
        description: jsdoc,
      });
    }
    result[name.replace(/Props$/, '')] = { file: sf.fileName.slice(src.length), props: props.sort((a, b) => a.name.localeCompare(b.name)), ...(inherited.length ? { inherited: inherited.sort() } : {}) };
  }
  all[`@nexub/${pkg}`] = Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
}

const json = JSON.stringify(all, null, 2) + '\n';
if (process.argv.includes('--check')) {
  let current = '';
  try { current = readFileSync(out, 'utf8'); } catch {}
  if (current !== json) {
    console.error('web-props.generated.json is out of date: run `node apps/docs/scripts/web-props.mjs`.');
    process.exit(1);
  }
} else {
  writeFileSync(out, json);
  console.log(`web props: ${Object.entries(all).map(([k, v]) => `${k} ${Object.keys(v).length}`).join(', ')} → ${out}`);
}

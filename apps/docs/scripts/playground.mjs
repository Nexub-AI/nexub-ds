// 11.0: generates the playground and the states gallery of every component page.
//   src/registry/playground.generated.json   per slug: the controls (from the prop
//     types in web-props.generated.json), the states cells, or `{ skip: reason }`
//   src/components/docs/playground/<slug>.tsx the "base render": the component as
//     the first docs example renders it (code known to work), with the playground's
//     props spread onto it. One small client module per slug, so a page loads its own.
//   node scripts/playground.mjs          write
//   node scripts/playground.mjs --check  fail if out of date (CI)
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const here = fileURLToPath(new URL('.', import.meta.url));
const srcDir = join(here, '../src');
const jsonOut = join(srcDir, 'registry/playground.generated.json');
const baseDir = join(srcDir, 'components/docs/playground');

/* ── Prop type → control ─────────────────────────────────────────────────── */

const SKIP = new Set(['className', 'style', 'asChild', 'as', 'id', 'key', 'ref', 'open', 'defaultOpen', 'children']);
const TEXT_NAMES = /^(label|title|placeholder|description|subtitle|caption|heading|helperText|text|message|eyebrow|hint)$/;
const FIRST = ['variant', 'tone', 'size', 'orientation'];
const MAX_CONTROLS = 12;

/** `'a' | 'b'`, `false | true | 'auto'`, `1 | 2 | 3` → the members; anything else → null. */
export function parseUnion(type) {
  const parts = type.split(' | ').map((s) => s.trim());
  if (parts.length < 2) return null;
  const values = parts.map(parseLiteral);
  return values.every((v) => v !== undefined) ? values : null;
}

/** `'md'` → "md", `true` → true, `4` → 4; anything else → undefined. */
export function parseLiteral(text) {
  if (text === undefined) return undefined;
  const s = String(text).trim();
  const str = /^'([^']*)'$/.exec(s) ?? /^"([^"]*)"$/.exec(s);
  if (str) return str[1];
  if (s === 'true') return true;
  if (s === 'false') return false;
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : undefined;
}

/** One prop → a control, or null when it cannot be driven from a form field. */
export function controlFor(prop, exampleSetsString = false) {
  const { name, type } = prop;
  if (prop.deprecated || SKIP.has(name) || /^aria-|^data-|^on[A-Z]|^default[A-Z]/.test(name)) return null;
  const def = parseLiteral(prop.default);
  const withDefault = (c, ok) => (ok ? { ...c, default: def } : c);
  if (type === 'boolean') return withDefault({ kind: 'switch', name }, typeof def === 'boolean');
  if (type === 'number') return withDefault({ kind: 'number', name }, typeof def === 'number');
  if (type === 'string') return TEXT_NAMES.test(name) || exampleSetsString ? withDefault({ kind: 'text', name }, typeof def === 'string') : null;
  const options = parseUnion(type);
  return options ? withDefault({ kind: 'select', name, options }, options.includes(def)) : null;
}

const KIND_ORDER = { select: 0, switch: 1, text: 2, number: 3 };
const rank = (c) => [KIND_ORDER[c.kind], FIRST.includes(c.name) ? FIRST.indexOf(c.name) : FIRST.length, c.name];
export function sortControls(controls) {
  return [...controls].sort((a, b) => {
    const [ra, rb] = [rank(a), rank(b)];
    return ra[0] - rb[0] || ra[1] - rb[1] || ra[2].localeCompare(rb[2]);
  });
}

/* ── States gallery cells ────────────────────────────────────────────────── */

const STATE_FLAGS = ['disabled', 'invalid', 'readOnly', 'loading', 'checked', 'selected'];
const STATE_UNIONS = [['size', Infinity], ['variant', 8], ['tone', 8]];
const MAX_CELLS = 24;

/** `props`: name → type string. Most informative first: states, then sizes, then variants and tones. */
export function statesFor(props) {
  const cells = [];
  for (const flag of STATE_FLAGS) if (props[flag] === 'boolean') cells.push({ prop: flag, value: true });
  for (const [name, cap] of STATE_UNIONS) {
    const members = (props[name] && parseUnion(props[name])) || [];
    for (const value of members.filter((m) => typeof m === 'string').slice(0, cap)) cells.push({ prop: name, value });
  }
  return cells.slice(0, MAX_CELLS);
}

/* ── Example → base module ───────────────────────────────────────────────── */

const LAYOUT = new Set(['Stack', 'Flex', 'Grid', 'Box', 'Container', 'Section', 'Card']);
const ID_ATTRS = new Set(['id', 'htmlFor', 'aria-labelledby', 'aria-describedby', 'aria-controls']);
const isJsx = (n) => ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n);
const opening = (n) => (ts.isJsxElement(n) ? n.openingElement : n);

/** A JSX attribute's literal value (`"x"`, `{'x'}`, `{4}`, `{true}`, bare), else undefined. */
function attrLiteral(attr, sf) {
  if (!attr.initializer) return true;
  if (ts.isStringLiteral(attr.initializer)) return attr.initializer.text;
  const e = ts.isJsxExpression(attr.initializer) ? attr.initializer.expression : undefined;
  if (!e) return undefined;
  if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return e.text;
  return parseLiteral(e.getText(sf));
}

/**
 * Reads the first example of a component and returns the base module source and
 * what the example sets on the element. `names` are the lowercased tags to look
 * for (`avatar`, `accordionroot`). Returns null when the example has no such element.
 */
export function buildBase(source, names, slug) {
  const sf = ts.createSourceFile('example.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const fn = sf.statements.find((s) => ts.isFunctionDeclaration(s) && s.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword) && s.body);
  if (!fn) return null;
  let target;
  (function find(node) {
    if (target) return;
    if (isJsx(node) && names.includes(opening(node).tagName.getText(sf).replace(/\./g, '').toLowerCase())) target = node;
    else ts.forEachChild(node, find);
  })(fn.body);
  if (!target) return null;
  const open = opening(target);
  const tag = open.tagName.getText(sf);

  // Element alone when it reads nothing declared inside the example function; else the whole example.
  const locals = new Set();
  const bind = (name) => (ts.isIdentifier(name) ? locals.add(name.text) : name.elements.forEach((el) => !ts.isOmittedExpression(el) && bind(el.name)));
  (function collect(node) {
    if (node === target) return;
    if (ts.isVariableDeclaration(node) || ts.isParameter(node)) bind(node.name);
    if (ts.isFunctionDeclaration(node) && node.name && node !== fn) locals.add(node.name.text);
    ts.forEachChild(node, collect);
  })(fn);
  // A component around the element may be the context it needs (`TooltipProvider`, `RadioGroup`,
  // `X.Root`), so it comes along; plain layout wrappers and host elements do not.
  let outer = target;
  for (let n = target.parent; n && n !== fn; n = n.parent) {
    const name = isJsx(n) ? opening(n).tagName.getText(sf) : '';
    if (/^[A-Z]/.test(name) && !LAYOUT.has(name)) outer = n;
  }
  let usesLocal = false;
  (function used(node) {
    const p = node.parent;
    const isName = (ts.isJsxAttribute(p) || ts.isPropertyAccessExpression(p) || ts.isPropertyAssignment(p)) && p.name === node;
    if (ts.isIdentifier(node) && !isName && locals.has(node.text)) usesLocal = true;
    ts.forEachChild(node, used);
  })(outer);
  const region = usesLocal ? fn : outer;

  // Text edits inside the region, applied back to front.
  const edits = [[open.attributes.end, open.attributes.end, ' {...pg}']];
  let children = ts.isJsxElement(target) ? 'nodes' : 'none';
  let childText;
  if (ts.isJsxElement(target)) {
    const kids = target.children.filter((c) => !(ts.isJsxText(c) && c.containsOnlyTriviaWhiteSpaces));
    if (kids.length === 1 && ts.isJsxText(kids[0])) {
      children = 'text';
      childText = kids[0].text.replace(/\s+/g, ' ').trim();
      edits.push([kids[0].getFullStart(), kids[0].end, `{(pg.children as string) ?? ${JSON.stringify(childText)}}`]);
    }
  }
  let ids = false;
  (function rewriteIds(node) {
    if (ts.isJsxAttribute(node) && ID_ATTRS.has(node.name.getText(sf)) && node.initializer && ts.isStringLiteral(node.initializer)) {
      ids = true;
      edits.push([node.initializer.getStart(sf), node.initializer.end, `{pgId + ${JSON.stringify(node.initializer.text)}}`]);
    }
    ts.forEachChild(node, rewriteIds);
  })(region);
  const idLine = ids ? '\n  const pgId = usePgId();' : '';
  if (usesLocal) {
    edits.push([fn.getStart(sf), fn.body.getStart(sf), 'function Base(pg: Record<string, unknown>) ']);
    if (ids) edits.push([fn.body.getStart(sf) + 1, fn.body.getStart(sf) + 1, idLine]);
  }
  let text = source;
  let delta = 0;
  for (const [start, end, insert] of edits.sort((a, b) => b[0] - a[0] || b[1] - a[1])) {
    text = text.slice(0, start) + insert + text.slice(end);
    delta += insert.length - (end - start);
  }
  const body = text.slice(region.getStart(sf), region.end + delta);
  const base = usesLocal ? body : `function Base(pg: Record<string, unknown>) {${idLine}\n  return (\n    ${body}\n  );\n}`;

  // Module-level code the base still uses: other statements first (to a fixpoint), then imports.
  const uses = (code, name) => new RegExp(`(?<![\\w$.])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w$])`).test(code);
  const declared = (s) =>
    ts.isVariableStatement(s) ? s.declarationList.declarations.flatMap((d) => (ts.isIdentifier(d.name) ? [d.name.text] : [])) : s.name ? [s.name.text] : [];
  const others = sf.statements.filter((s) => s !== fn && !ts.isImportDeclaration(s) && !(ts.isExpressionStatement(s) && ts.isStringLiteral(s.expression)));
  const kept = new Set();
  for (let grew = true; grew; ) {
    grew = false;
    const code = base + [...kept].map((s) => s.getText(sf)).join('\n');
    for (const s of others) {
      if (kept.has(s)) continue;
      const namesOf = declared(s);
      if (!namesOf.length || namesOf.some((n) => uses(code, n))) {
        kept.add(s);
        grew = true;
      }
    }
  }
  const tail = others.filter((s) => kept.has(s)).map((s) => s.getText(sf));
  const code = base + tail.join('\n');
  const imports = [];
  for (const s of sf.statements.filter(ts.isImportDeclaration)) {
    const clause = s.importClause;
    const named = clause?.namedBindings && ts.isNamedImports(clause.namedBindings) ? clause.namedBindings.elements : undefined;
    if (!clause || clause.name || !named) {
      imports.push(s.getText(sf)); // default, namespace or side-effect import: kept as written
      continue;
    }
    const keep = named.filter((el) => uses(code, el.name.text)).map((el) => el.getText(sf));
    if (keep.length) imports.push(`import ${clause.isTypeOnly ? 'type ' : ''}{ ${keep.join(', ')} } from ${s.moduleSpecifier.getText(sf)};`);
  }
  if (ids) imports.unshift("import { useId as usePgId } from 'react';");

  const code2 =
    [
      `'use client'; // Generated by scripts/playground.mjs from examples/components/${slug}/0.tsx. Do not edit.`,
      '',
      ...imports,
      "import { PlaygroundView, type PlaygroundViewProps } from '../GeneratedPlayground';",
      '',
      ...tail.flatMap((t) => [t, '']),
      base,
      '',
      'export default function Generated(props: PlaygroundViewProps) {',
      '  return <PlaygroundView {...props} base={Base} />;',
      '}',
    ].join('\n') + '\n';

  const attrs = open.attributes.properties.filter(ts.isJsxAttribute).map((a) => ({ name: a.name.getText(sf), literal: attrLiteral(a, sf), text: a.getText(sf) }));
  return { module: code2, tag, children, childText, attrs, whole: usesLocal };
}

/* ── Recipe for one component ────────────────────────────────────────────── */

const short = (a) => (a.text.length <= 48 ? a.text.replace(/\s+/g, ' ') : `${a.name}={…}`);
const IDENT = /^[A-Za-z_$][\w$]*$/;

/** `entry`: the registry entry; `generated`: its web-props entry (or undefined); `built`: buildBase() result. */
export function recipeFor(entry, generated, built) {
  // The types are the source. Hand-written registry rows add what the types leave out: DOM props
  // (`disabled`) and the root of a compound (`Accordion.Root type`, `Root header`). Inherited
  // state props (Radix `disabled`, `checked`) are known by name only and are booleans.
  const rows = entry.props
    .map((r) => {
      const [part, name] = r.name.includes(' ') ? r.name.split(' ') : [built.tag, r.name];
      const root = part === built.tag || (part === 'Root' && built.tag.endsWith('.Root'));
      return root && IDENT.test(name ?? '') ? { ...r, name, type: r.type.replace(/"/g, "'") } : null;
    })
    .filter(Boolean);
  const own = [...(generated?.props ?? [])];
  const has = (name) => own.some((p) => p.name === name);
  for (const r of rows) if (!has(r.name)) own.push(r);
  for (const name of generated?.inherited ?? []) if (STATE_FLAGS.includes(name) && !has(name)) own.push({ name, type: 'boolean' });
  const types = Object.fromEntries(own.map((p) => [p.name, p.type]));

  const set = new Map(built.attrs.map((a) => [a.name, a]));
  const controls = [];
  for (const prop of own) {
    const attr = set.get(prop.name);
    if (attr && attr.literal === undefined) continue; // wired to the example's own state or data
    const c = controlFor(prop, typeof attr?.literal === 'string');
    if (!c) continue;
    const fits = attr && (c.kind === 'select' ? c.options.includes(attr.literal) : typeof attr.literal === { switch: 'boolean', text: 'string', number: 'number' }[c.kind]);
    if (attr && !fits) continue;
    controls.push(attr && attr.literal !== c.default ? { ...c, initial: attr.literal } : c);
  }
  const sorted = sortControls(controls).slice(0, MAX_CONTROLS);
  if (built.children === 'text') sorted.push({ kind: 'text', name: 'children', initial: built.childText });
  const controlled = new Set(sorted.map((c) => c.name));
  const states = statesFor(types);
  return {
    tag: built.tag,
    children: built.children,
    fixed: built.attrs.filter((a) => !controlled.has(a.name)).map(short),
    controls: sorted,
    states: states.length ? [{ prop: 'default', value: true }, ...states] : [],
  };
}

/* ── Main ────────────────────────────────────────────────────────────────── */

async function loadEntries() {
  const dir = join(srcDir, 'registry/components');
  const entries = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.ts')).sort()) {
    const js = ts.transpileModule(readFileSync(join(dir, f), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
    entries.push((await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)).default);
  }
  return entries;
}

export async function generate() {
  const gen = JSON.parse(readFileSync(join(srcDir, 'registry/web-props.generated.json'), 'utf8'));
  const recipes = {};
  const modules = {};
  for (const entry of await loadEntries()) {
    const { slug, title } = entry.meta;
    const key = title.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    const pkg = gen[entry.meta.package ?? '@nexub/react'] ?? {};
    const find = (k) => Object.entries(pkg).find(([n]) => n.toLowerCase() === k)?.[1]; // same lookup as registry/props-merge.ts
    const example = join(srcDir, 'examples/components', slug, '0.tsx');
    if (!existsSync(example)) {
      recipes[slug] = { skip: 'no docs example to build on' };
      continue;
    }
    // @nexub/elements pages render their custom element (`<nx-number-input>`), not a React component.
    const built = buildBase(readFileSync(example, 'utf8'), [key, `${key}root`, ...(entry.meta.element ? [entry.meta.element] : [])], slug);
    if (!built) {
      recipes[slug] = { skip: `the first example does not render <${title.replace(/[^A-Za-z0-9]/g, '')}> directly` };
      continue;
    }
    if (/<pre[\s>]|\bstyle=\{/.test(built.module)) {
      recipes[slug] = { skip: 'the first example has a raw <pre> or an inline style' };
      continue;
    }
    const recipe = recipeFor(entry, find(key) ?? find(`${key}root`), built);
    if (!recipe.controls.length && !recipe.states.length) {
      recipes[slug] = { skip: 'no controllable props and no states' };
      continue;
    }
    recipes[slug] = recipe;
    modules[slug] = built.module;
  }
  return { json: JSON.stringify(recipes, null, 2) + '\n', modules };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { json, modules } = await generate();
  const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
  const onDisk = existsSync(baseDir) ? readdirSync(baseDir).filter((f) => f.endsWith('.tsx')) : [];
  const stale = onDisk.filter((f) => !(f.replace(/\.tsx$/, '') in modules));
  if (process.argv.includes('--check')) {
    const changed = Object.entries(modules).filter(([slug, code]) => read(join(baseDir, `${slug}.tsx`)) !== code).map(([slug]) => `playground/${slug}.tsx`);
    if (read(jsonOut) !== json) changed.unshift('playground.generated.json');
    if (changed.length || stale.length) {
      console.error(`The generated playground is out of date (${[...changed, ...stale].slice(0, 8).join(', ')}): run \`node apps/docs/scripts/playground.mjs\`.`);
      process.exit(1);
    }
  } else {
    mkdirSync(baseDir, { recursive: true });
    writeFileSync(jsonOut, json);
    for (const [slug, code] of Object.entries(modules)) writeFileSync(join(baseDir, `${slug}.tsx`), code);
    for (const f of stale) rmSync(join(baseDir, f));
    const all = Object.values(JSON.parse(json));
    const withBase = all.filter((r) => !r.skip);
    console.log(`playground: ${withBase.filter((r) => r.controls.length).length} playgrounds, ${withBase.filter((r) => r.states.length).length} states galleries, ${all.length - withBase.length} skipped of ${all.length} → ${jsonOut}`);
  }
}

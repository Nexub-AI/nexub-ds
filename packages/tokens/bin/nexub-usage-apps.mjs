// nexub-usage --apps (12.7): a per-app adoption report. For each app folder it counts
//   - the Nexub components it renders, and the props it passes to each;
//   - local overrides: className / style on Nexub components, CSS or Tailwind that targets
//     .nx-* classes, and app code that redefines Nexub custom properties;
//   - copies of Nexub parts (heuristic, see findCopies);
//   - deprecated and removed APIs, from nexub-migrate's rules;
//   - the @nexub versions its package.json files ask for;
//   - indirect use through a wrapper package (a workspace package that wraps Nexub parts,
//     such as an app's own admin-ui): which Nexub parts each wrapper export renders is read
//     from the wrapper's source, and every import of that export counts for those parts;
//   - stopgaps still in use: imports of the wrapper exports a checked-in list says Nexub replaced.
//
// ponytail: regex and a small JSX attribute reader, not a TS parse. Good enough for counts;
// a name or a role match is a hint, not proof, so copies are labelled a heuristic.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { migrateSource } from './nexub-migrate.mjs';

/** Packages published from nexub-ds. A workspace package with one of these names is the app's own. */
export const DS_PACKAGES = new Set([
  '@nexub/brand',
  '@nexub/core',
  '@nexub/diagram',
  '@nexub/elements',
  '@nexub/icons',
  '@nexub/marketing',
  '@nexub/mcp',
  '@nexub/patterns',
  '@nexub/react',
  '@nexub/react-native',
  '@nexub/themes',
  '@nexub/tokens',
]);
/** Icons are counted apart: a className on an icon is sizing, not an override. */
const NOT_COMPONENTS = new Set(['@nexub/icons', '@nexub/tokens', '@nexub/themes', '@nexub/core']);

/**
 * nexub-migrate rules that find deprecated or removed Nexub APIs. Rewrites always count; `manual`
 * says which reports count too: all (true), none (false), or those whose message matches. The
 * rest are default changes to review, not deprecated APIs: changes-in-11 reports every overlay
 * without a `sheet` prop, and changes-in-8 the 8.0 default flips (Signature, scrollLock, safeHref).
 */
export const DEPRECATION_RULES = [
  { rule: 'legacy-tokens', manual: true },
  { rule: 'deprecated-components', manual: true },
  { rule: 'tailwind-3-preset', manual: true },
  { rule: 'removed-in-7', manual: true },
  { rule: 'changes-in-8', manual: /removed in 8\.0/ },
  { rule: 'button-aliases', manual: true },
  { rule: 'changes-in-9', manual: true },
  { rule: 'changes-in-11', manual: false },
  { rule: 'deprecated-in-11', manual: true },
  { rule: 'changes-in-12', manual: true },
];

// Build output only. Unlike the import table, `lib` is scanned: in an app it is source (src/lib).
const SKIP = new Set(['node_modules', 'dist', 'build', 'out', '.next', '.expo', '.turbo', '.git', 'coverage']);
const CODE = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const JSX = new Set(['.tsx', '.jsx', '.js']);
const STYLE = new Set(['.css', '.scss', '.less']);
const MAX_BYTES = 1024 * 1024;

/** Names too generic for a local component of the same name to be a copy (a page's own Section). */
const GENERIC = new Set([
  'Box', 'Code', 'Container', 'Flex', 'Form', 'Grid', 'Heading', 'Label', 'Link', 'Logo', 'Section',
  'Stack', 'Text', 'Scale', 'Fade', 'Slide', 'Float', 'Reveal', 'Highlight', 'Flag', 'Illustration',
]);

/** ARIA roles a hand-built part sets, and the Nexub part that already does it. */
export const ROLE_PARTS = {
  dialog: 'Dialog',
  alertdialog: 'AlertDialog',
  tablist: 'Tabs',
  switch: 'Switch',
  tooltip: 'Tooltip',
  menu: 'DropdownMenu',
  combobox: 'Combobox',
  listbox: 'Select',
  slider: 'Slider',
  progressbar: 'Progress',
  radiogroup: 'RadioGroup',
  tree: 'TreeView',
};

/** Native elements that have a Nexub part (counted, not graded: a raw <button> is often fine). */
const NATIVE = { button: 'Button', select: 'Select', textarea: 'Textarea', dialog: 'Dialog', progress: 'Progress', table: 'Table' };
const NATIVE_INPUT = { checkbox: 'Checkbox', radio: 'RadioGroup', range: 'Slider', date: 'DatePicker', 'datetime-local': 'DateTimePicker', time: 'TimePicker', month: 'DatePicker', color: 'ColorPicker', file: 'FileUpload', number: 'NumberInput' };

/**
 * Tailwind utilities that place or size a part from outside (margin, width, grid placement,
 * visibility) or arrange what is inside it (flex, gap, alignment, wrapping). Anything else in a
 * className on a Nexub component (padding, colour, border, radius, shadow, type) restyles it.
 */
const LAYOUT_UTILITY =
  /^-?(m[trblxyse]?|w|min-w|max-w|h|min-h|max-h|size|basis|grow|shrink|flex|self|justify-self|place-self|order|col|row|hidden|block|inline|inline-block|inline-flex|contents|sr-only|not-sr-only|relative|absolute|fixed|sticky|static|inset|inset-[xy]|top|bottom|start|end|left|right|z|isolate|overflow|overflow-[xy]|truncate|line-clamp|group|peer|print|motion-safe|motion-reduce|gap|gap-[xy]|space-[xy]|items|justify|content|place-items|place-content|grid|grid-cols|grid-rows|auto-cols|auto-rows|whitespace|break|tabular-nums|text-(?:start|end|center|left|right|justify)|select)(-|$)/;

const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

/** End index (exclusive) of a balanced {…} starting at `i`, skipping strings and template literals. */
function skipBraces(text, i) {
  let depth = 0;
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === "'") {
      i = skipString(text, i) - 1;
    } else if (c === '`') {
      for (i++; i < text.length && text[i] !== '`'; i++) {
        if (text[i] === '\\') i++;
        else if (text[i] === '$' && text[i + 1] === '{') i = skipBraces(text, i + 1) - 1;
      }
    } else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return i + 1;
  }
  return text.length;
}

function skipString(text, i) {
  const q = text[i];
  for (i++; i < text.length && text[i] !== q; i++) if (text[i] === '\\') i++;
  return i + 1;
}

/**
 * Reads the attributes of a JSX opening tag from `i` (just after the tag name).
 * Returns { attrs: [{ name, value }], end }; `value` is the raw text (null for a bare prop),
 * and a spread is recorded with the name '...'.
 */
export function readAttrs(text, i) {
  const attrs = [];
  while (i < text.length) {
    while (/\s/.test(text[i] ?? '')) i++;
    const c = text[i];
    if (c === undefined) break;
    if (c === '>') return { attrs, end: i + 1 };
    if (c === '/' && text[i + 1] === '>') return { attrs, end: i + 2 };
    if (c === '{') {
      const j = skipBraces(text, i);
      if (/^\{\s*\.\.\./.test(text.slice(i, j))) attrs.push({ name: '...', value: null });
      i = j;
      continue;
    }
    const m = /^[A-Za-z_$][\w$:.-]*/.exec(text.slice(i, i + 200));
    if (!m) return { attrs, end: i }; // not JSX after all (a type argument, a comparison)
    i += m[0].length;
    while (/\s/.test(text[i] ?? '')) i++;
    if (text[i] === '=') {
      i++;
      while (/\s/.test(text[i] ?? '')) i++;
      const start = i;
      if (text[i] === '"' || text[i] === "'") i = skipString(text, i);
      else if (text[i] === '{') i = skipBraces(text, i);
      attrs.push({ name: m[0], value: text.slice(start, i) });
    } else attrs.push({ name: m[0], value: null });
  }
  return { attrs, end: i };
}

const IMPORT_NAMED = /import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*['"](@nexub\/[^'"/]+)(?:\/[^'"]*)?['"]/g;
const IMPORT_NS = /import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s*['"](@nexub\/[^'"/]+)(?:\/[^'"]*)?['"]/g;
const RELATIVE_IMPORT = /import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*['"](\.[^'"]*)['"]/g;

/** Local name -> { pkg, name } for every named and namespace @nexub import. */
export function importsOf(text) {
  const named = new Map();
  const namespaces = new Map();
  for (const [, names, pkg] of text.matchAll(IMPORT_NAMED)) {
    for (const raw of names.split(',')) {
      const part = raw.trim().replace(/^type\s+/, '');
      if (!part) continue;
      const [name, local = name] = part.split(/\s+as\s+/).map((s) => s.trim());
      named.set(local, { pkg, name });
    }
  }
  for (const [, local, pkg] of text.matchAll(IMPORT_NS)) namespaces.set(local, pkg);
  return { named, namespaces };
}

/** Top-level declarations: [{ name, exported, start, body }]. A body runs to the next one. */
export function declarationsOf(text) {
  const re = /^(export\s+)?(?:default\s+)?(?:async\s+)?(?:function\s*\*?\s*([A-Za-z_$][\w$]*)|(?:const|let|var|class)\s+([A-Za-z_$][\w$]*))/gm;
  const found = [...text.matchAll(re)].map((m) => ({ name: m[2] ?? m[3], exported: !!m[1], start: m.index }));
  const top = /^(?:export|function|const|let|var|class|interface|type|import|async)\b/gm;
  return found.map((d) => {
    top.lastIndex = d.start + 1;
    let end = text.length;
    for (let m; (m = top.exec(text)); ) {
      if (m.index > d.start) {
        end = m.index;
        break;
      }
    }
    return { ...d, body: text.slice(d.start, end) };
  });
}

/** JSX tags in `text`: [{ tag, at, attrs }]. Upper-case and dotted tags only, unless `native`. */
export function jsxTags(text, { native = false } = {}) {
  const out = [];
  const re = native ? /<([a-z][\w-]*)(?=[\s/>])/g : /<([A-Z][\w$]*(?:\.[A-Za-z_$][\w$]*)*)(?=[\s/>])/g;
  for (const m of text.matchAll(re)) {
    const before = text[m.index - 1] ?? '';
    if (/[\w$)\]]/.test(before)) continue; // a type argument: useState<Item>(), Array<Row>
    const { attrs, end } = readAttrs(text, m.index + m[0].length);
    const close = text[end - 1];
    if (close !== '>') continue;
    out.push({ tag: m[1], at: m.index, attrs });
  }
  return out;
}

/** Resolves a JSX tag to a Nexub component: { pkg, component } or null. Card.Header -> Card.Header. */
function resolveTag(tag, { named, namespaces }) {
  const [head, ...rest] = tag.split('.');
  const imp = named.get(head);
  if (imp) return { pkg: imp.pkg, component: [imp.name, ...rest].join('.') };
  const ns = namespaces.get(head);
  if (ns && rest.length) return { pkg: ns, component: rest.join('.') };
  return null;
}

/** Quoted string contents inside a JSX attribute value: the static classes of className={cn('a', x && 'b')}. */
function staticStrings(value) {
  if (!value) return [];
  return [...value.matchAll(/(["'`])((?:\\.|(?!\1)[^\\$])*)\1/g)].map((m) => m[2]);
}

const inc = (obj, key, n = 1) => {
  obj[key] = (obj[key] ?? 0) + n;
};

/**
 * Everything one source file says about Nexub use.
 *   isDs(pkg)  true for a Nexub package (not a workspace package of the same scope)
 *   dsVars     custom property names Nexub defines (for overrides)
 *   parts      Nexub component names (for copies)
 */
export function analyzeSource(text, { ext = '.tsx', isDs = (p) => DS_PACKAGES.has(p), dsVars = new Set(), parts = new Set() } = {}) {
  const r = {
    imports: [],
    components: {},
    props: {},
    className: {},
    classNameVisual: {},
    classTokens: {},
    style: {},
    nxSelectors: 0,
    varOverrides: {},
    copies: [],
    native: {},
  };
  if (STYLE.has(ext)) {
    const css = strip(text);
    for (const [, head] of css.matchAll(/([^{};]+)\{/g)) if (/\.nx-[\w-]/.test(head) && !/^\s*@/.test(head)) r.nxSelectors++;
    for (const [, name] of css.matchAll(/(?<![\w-])(--[\w-]+)\s*:/g)) if (dsVars.has(name)) inc(r.varOverrides, name);
    return r;
  }
  if (!CODE.has(ext)) return r;
  const imports = importsOf(text);
  for (const [, { pkg, name }] of imports.named) r.imports.push({ pkg, name });
  const dsImports = {
    named: new Map([...imports.named].filter(([, v]) => isDs(v.pkg) && !NOT_COMPONENTS.has(v.pkg))),
    namespaces: new Map([...imports.namespaces].filter(([, p]) => isDs(p) && !NOT_COMPONENTS.has(p))),
  };
  // Overrides anywhere in the file: Tailwind arbitrary variants that reach into .nx-* classes,
  // and Nexub custom properties set from code (style objects, [--x:…] utilities, setProperty).
  for (const _ of text.matchAll(/\[[^\]\s'"`]*\.nx-[\w-]+[^\]\s'"`]*\]/g)) r.nxSelectors++;
  for (const [, name] of text.matchAll(/(?:\[|['"])(--[\w-]+)(?:['"]\s*:|:)/g)) if (dsVars.has(name)) inc(r.varOverrides, name);
  for (const [, name] of text.matchAll(/setProperty\(\s*['"](--[\w-]+)['"]/g)) if (dsVars.has(name)) inc(r.varOverrides, name);
  if (!JSX.has(ext)) return r;

  for (const { tag, attrs } of jsxTags(text)) {
    const hit = resolveTag(tag, dsImports);
    if (!hit) continue;
    const c = hit.component;
    inc(r.components, c);
    const props = (r.props[c] ??= {});
    for (const { name, value } of attrs) {
      inc(props, name);
      if (name === 'style') inc(r.style, c);
      if (name === 'className') {
        inc(r.className, c);
        const tokens = staticStrings(value).flatMap((s) => s.split(/\s+/)).filter(Boolean);
        const visual = tokens.filter((t) => !LAYOUT_UTILITY.test(t.replace(/^([\w-]+:)+/, '').replace(/^!/, '')));
        if (visual.length) inc(r.classNameVisual, c);
        const own = (r.classTokens[c] ??= {});
        for (const t of tokens) inc(own, t);
      }
    }
  }
  for (const { tag, attrs } of jsxTags(text, { native: true })) {
    if (NATIVE[tag]) inc(r.native, tag);
    if (tag === 'input') {
      const type = attrs.find((a) => a.name === 'type')?.value?.replace(/^\{?['"]|['"]\}?$/g, '');
      if (type && NATIVE_INPUT[type]) inc(r.native, `input[type=${type}]`);
    }
  }
  r.copies = findCopies(text, dsImports, parts);
  return r;
}

/**
 * Copies of Nexub parts in one file (heuristic). A top-level component counts when:
 *   - name: it has the name of a Nexub component (not a generic one like Section), renders its
 *     own markup (a lower-case JSX element), and does not render that Nexub component (a wrapper
 *     that renders <DsButton> under the name Button is a wrapper, not a copy); or
 *   - role: it sets an ARIA role that a Nexub part owns (role="dialog", role="switch") on its own
 *     markup, and renders no Nexub component of that name.
 * Returns [{ part, kind: 'name' | 'role' }].
 */
export function findCopies(text, dsImports, parts) {
  const out = [];
  for (const d of declarationsOf(text)) {
    if (!/^[A-Z]/.test(d.name)) continue;
    const rendered = new Set();
    for (const { tag } of jsxTags(d.body)) {
      const hit = resolveTag(tag, dsImports);
      if (hit) rendered.add(hit.component.split('.')[0]);
    }
    const ownMarkup = /<[a-z][\w-]*[\s/>]/.test(d.body);
    if (!ownMarkup) continue;
    if (parts.has(d.name) && !GENERIC.has(d.name) && !dsImports.named.has(d.name) && !rendered.has(d.name)) {
      out.push({ part: d.name, kind: 'name' });
      continue;
    }
    const seen = new Set();
    for (const [, role] of d.body.matchAll(/<[a-z][\w-]*\b[^>]*?\brole=\{?["']([a-z]+)["']/g)) {
      const part = ROLE_PARTS[role];
      if (!part || seen.has(part) || rendered.has(part)) continue;
      seen.add(part);
      out.push({ part, kind: 'role' });
    }
  }
  return out;
}

/** Counts of deprecated / removed Nexub APIs in one file, by nexub-migrate rule. */
export function deprecatedIn(text, ext) {
  const out = {};
  if (!/@nexub\/|--color-|--duration-|--ease-|\bnx-|bg-bg-|text-text-|border-border-/.test(text)) return out;
  for (const { rule, manual } of DEPRECATION_RULES) {
    let res;
    try {
      res = migrateSource(text, { ext, rules: new Set([rule]) });
    } catch {
      continue;
    }
    const counted = manual === true ? res.manual : manual ? res.manual.filter((m) => manual.test(m.message)) : [];
    let n = counted.length;
    if (res.output !== text) {
      const a = text.split('\n');
      const b = res.output.split('\n');
      const reported = new Set(counted.map((m) => m.line));
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i] && !reported.has(i + 1)) n++;
    }
    if (n) out[rule] = n;
  }
  return out;
}

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries.sort()) {
    if (SKIP.has(entry)) continue;
    const path = join(dir, entry);
    let st;
    try {
      st = statSync(path);
    } catch {
      continue;
    }
    if (st.isDirectory()) yield* walk(path);
    else if (st.size <= MAX_BYTES) yield path;
  }
}

const isTest = (path) => /(^|[\\/])(__tests__|__mocks__|e2e|test|tests|fixtures?)([\\/])|\.(test|spec|stories)\.[cm]?[jt]sx?$/.test(path);

/**
 * The app's package.json files: the @nexub versions it asks for (not workspace: ranges) and the
 * @nexub names that are its own workspace packages.
 */
export function manifestsOf(root) {
  const versions = {};
  const workspace = new Set();
  for (const file of walk(root)) {
    if (basename(file) !== 'package.json') continue;
    let pkg;
    try {
      pkg = JSON.parse(readFileSync(file, 'utf8'));
    } catch {
      continue;
    }
    if (pkg.name?.startsWith('@nexub/') && !DS_PACKAGES.has(pkg.name)) workspace.add(pkg.name);
    for (const deps of [pkg.dependencies, pkg.devDependencies, pkg.peerDependencies]) {
      for (const [name, spec] of Object.entries(deps ?? {})) {
        if (!name.startsWith('@nexub/')) continue;
        if (String(spec).startsWith('workspace:')) workspace.add(name);
        else (versions[name] ??= new Set()).add(String(spec));
      }
    }
  }
  return { versions: Object.fromEntries(Object.entries(versions).map(([k, v]) => [k, [...v].sort()])), workspace };
}

/** The version an app is on: @nexub/react's range if it has one, else the first Nexub package's. */
export function appVersion(versions) {
  const spec = versions['@nexub/react']?.[0] ?? Object.values(versions)[0]?.[0];
  return spec ? spec.replace(/^[\^~>=v\s]+/, '') : null;
}

/**
 * What each export of a wrapper package renders from Nexub: { pkg, exports: { Name: [parts] }, names }
 * (`names`: every top-level export, including those that render nothing from Nexub).
 * Read from the package's source, following wrappers that render other wrappers of the same package.
 */
export function wrapperMap(dir) {
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).name;
  const direct = new Map();
  const local = new Map();
  const names = new Set();
  for (const file of walk(dir)) {
    const ext = extname(file);
    if (!JSX.has(ext) && ext !== '.ts') continue;
    if (isTest(file)) continue;
    const text = readFileSync(file, 'utf8');
    const imports = importsOf(text);
    const ds = {
      named: new Map([...imports.named].filter(([, v]) => DS_PACKAGES.has(v.pkg) && !NOT_COMPONENTS.has(v.pkg))),
      namespaces: new Map([...imports.namespaces].filter(([, p]) => DS_PACKAGES.has(p) && !NOT_COMPONENTS.has(p))),
    };
    const relative = new Set();
    for (const [, names] of text.matchAll(RELATIVE_IMPORT))
      for (const raw of names.split(',')) {
        const n = raw.trim().replace(/^type\s+/, '').split(/\s+as\s+/).pop()?.trim();
        if (n) relative.add(n);
      }
    const decls = declarationsOf(text);
    const declared = new Set(decls.map((d) => d.name));
    for (const d of decls) {
      if (!d.exported) continue;
      names.add(d.name);
      const parts = new Set();
      const calls = new Set();
      for (const { tag } of jsxTags(d.body)) {
        const hit = resolveTag(tag, ds);
        if (hit) parts.add(hit.component.split('.')[0]);
        else if (declared.has(tag) || relative.has(tag)) calls.add(tag);
      }
      direct.set(d.name, parts);
      local.set(d.name, calls);
    }
  }
  const exports = {};
  for (const name of direct.keys()) {
    const all = new Set();
    const queue = [name];
    const seen = new Set();
    while (queue.length) {
      const n = queue.pop();
      if (seen.has(n)) continue;
      seen.add(n);
      for (const p of direct.get(n) ?? []) all.add(p);
      for (const c of local.get(n) ?? []) queue.push(c);
    }
    if (all.size) exports[name] = [...all].sort();
  }
  return { pkg, exports, names: [...names].sort() };
}

const sortDesc = (obj) => Object.fromEntries(Object.entries(obj).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));

/**
 * The per-app report.
 *   root      the app's folder
 *   wrappers  [wrapperMap()] for the workspace packages that wrap Nexub parts
 *   stopgaps  [{ pkg, name, replacement, since }]: wrapper exports Nexub has replaced, counted by
 *             import; an entry with `pattern` (a RegExp source) is counted by matches in code instead
 *   dsVars, parts  as in analyzeSource
 *   tests     include test and story files (default false: they are not the product)
 */
export function scanApp(root, { wrappers = [], stopgaps = [], dsVars = new Set(), parts = new Set(), tests = false } = {}) {
  const { versions, workspace } = manifestsOf(root);
  for (const w of wrappers) workspace.add(w.pkg);
  const isDs = (p) => DS_PACKAGES.has(p) && !workspace.has(p);
  const app = {
    version: appVersion(Object.fromEntries(Object.entries(versions).filter(([k]) => isDs(k)))),
    versions: Object.fromEntries(Object.entries(versions).filter(([k]) => isDs(k))),
    files: 0,
    imports: {},
    components: {},
    props: {},
    overrides: { className: {}, classNameVisual: {}, style: {}, nxSelectors: 0, varOverrides: {} },
    classTokens: {},
    copies: {},
    deprecated: {},
    native: {},
    wrapperImports: {},
    indirect: {},
    stopgaps: {},
  };
  const wrapperByPkg = new Map(wrappers.map((w) => [w.pkg, w]));
  const patterns = stopgaps.filter((s) => s.pattern).map((s) => ({ name: s.name, re: new RegExp(s.pattern, 'g') }));
  const patternHits = {};
  for (const file of walk(root)) {
    const ext = extname(file);
    if (!CODE.has(ext) && !STYLE.has(ext)) continue;
    if (!tests && isTest(file)) continue;
    const text = readFileSync(file, 'utf8');
    app.files++;
    const r = analyzeSource(text, { ext, isDs, dsVars, parts });
    for (const { pkg, name } of r.imports) {
      if (isDs(pkg)) inc((app.imports[pkg] ??= {}), name);
      const w = wrapperByPkg.get(pkg);
      if (!w) continue;
      inc((app.wrapperImports[pkg] ??= {}), name);
      for (const part of w.exports[name] ?? []) inc(app.indirect, part);
    }
    for (const [c, n] of Object.entries(r.components)) inc(app.components, c, n);
    for (const [c, props] of Object.entries(r.props)) for (const [p, n] of Object.entries(props)) inc((app.props[c] ??= {}), p, n);
    for (const key of ['className', 'classNameVisual', 'style']) for (const [c, n] of Object.entries(r[key])) inc(app.overrides[key], c, n);
    for (const [c, toks] of Object.entries(r.classTokens)) for (const [t, n] of Object.entries(toks)) inc((app.classTokens[c] ??= {}), t, n);
    app.overrides.nxSelectors += r.nxSelectors;
    for (const [v, n] of Object.entries(r.varOverrides)) inc(app.overrides.varOverrides, v, n);
    for (const { part, kind } of r.copies) inc((app.copies[part] ??= {}), kind);
    for (const [t, n] of Object.entries(r.native)) inc(app.native, t, n);
    for (const [rule, n] of Object.entries(deprecatedIn(text, ext))) inc(app.deprecated, rule, n);
    if (CODE.has(ext)) for (const { name, re } of patterns) for (const _ of text.matchAll(re)) inc(patternHits, name);
  }
  for (const s of stopgaps) {
    const n = s.pattern ? (patternHits[s.name] ?? 0) : (app.wrapperImports[s.pkg]?.[s.name] ?? 0);
    if (n) app.stopgaps[s.name] = n;
  }
  app.components = sortDesc(app.components);
  app.indirect = sortDesc(app.indirect);
  for (const c of Object.keys(app.props)) app.props[c] = sortDesc(app.props[c]);
  return app;
}

/** Totals for one app report: the numbers the scorecard shows. */
export function summarize(app) {
  const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
  const uses = sum(app.components);
  const direct = new Set(Object.keys(app.components).map((c) => c.split('.')[0]));
  const all = new Set([...direct, ...Object.keys(app.indirect)]);
  return {
    version: app.version,
    componentUses: uses,
    componentsDirect: direct.size,
    componentsWithWrappers: all.size,
    className: sum(app.overrides.className),
    classNameVisual: sum(app.overrides.classNameVisual),
    style: sum(app.overrides.style),
    nxSelectors: app.overrides.nxSelectors,
    varOverrides: sum(app.overrides.varOverrides),
    overrides: sum(app.overrides.classNameVisual) + sum(app.overrides.style) + app.overrides.nxSelectors + sum(app.overrides.varOverrides),
    copies: Object.values(app.copies).reduce((a, k) => a + (k.name ?? 0) + (k.role ?? 0), 0),
    deprecated: sum(app.deprecated),
    stopgaps: Object.keys(app.stopgaps).length,
  };
}

/** Custom property names defined by the CSS files under `dirs`. */
export function cssVarNames(dirs) {
  const names = new Set();
  for (const dir of dirs) {
    if (!dir || !existsSync(dir)) continue;
    for (const file of walk(dir)) {
      if (!file.endsWith('.css')) continue;
      for (const [, name] of readFileSync(file, 'utf8').matchAll(/(--[\w-]+)\s*:/g)) names.add(name);
    }
  }
  return names;
}

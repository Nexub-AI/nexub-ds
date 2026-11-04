#!/usr/bin/env node
// nexub-migrate — move app code onto current Nexub DS conventions.
// Dependency-free (node: built-ins only), Node >= 20. See ./README.md.
import { readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

export const RULES = ['legacy-tokens', 'logical-classes', 'tw-animate', 'opacity-modifier', 'deprecated-components'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.html', '.mdx']);
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.next', 'out', 'coverage']);
const MAX_BYTES = 1024 * 1024;

// ─── legacy-tokens: alias map ────────────────────────────────────────────────
const NEVER = new Set(['--color-text-disabled']); // the disabled-state role, not a legacy alias
const BRAND = {
  '--color-leap-500': '--color-leap',
  '--color-bookub-500': '--color-bookub',
  '--color-payub-500': '--color-payub',
  '--color-founderub-500': '--color-founderub',
  '--color-brand-primary-500': '--color-primary',
};
// Chains that end here are palette/scale tokens, not roles: leave them alone.
const NOT_ROLE = /^--color-(palette|accent|brand)-/;

/** Parse theme CSS (base.css, light.css …) into { aliases: {legacy: role}, mix: {legacy: value} }. */
export function buildAliasMap(cssTexts) {
  const decl = new Map();
  for (const css of cssTexts) {
    for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--color-[\w-]+)\s*:\s*([^;]+);/g)) decl.set(m[1], m[2].trim());
  }
  const resolve = (name, seen) => {
    if (BRAND[name]) return { to: BRAND[name] };
    const v = decl.get(name);
    if (v === undefined) return NOT_ROLE.test(name) ? null : { to: name };
    if (seen.has(name)) return null; // cycle
    seen.add(name);
    const ref = /^var\((--color-[\w-]+)\)$/.exec(v);
    if (ref) return resolve(ref[1], seen);
    if (v.startsWith('color-mix(')) return { mix: v };
    return null; // literal value: not an alias
  };
  const aliases = { ...BRAND };
  const mix = {};
  for (const name of decl.keys()) {
    if (NEVER.has(name)) continue;
    const r = resolve(name, new Set());
    if (r?.to && r.to !== name) aliases[name] = r.to;
    else if (r?.mix) mix[name] = r.mix;
  }
  return { aliases, mix };
}

// Snapshot of buildAliasMap([@nexub/themes base.css, light.css]) at 1.8.0 — used when
// @nexub/themes is not installed. bin/nexub-migrate.test.mjs fails if it drifts from source.
export const SNAPSHOT = /* SNAPSHOT:BEGIN */ {
  "aliases": {
    "--color-leap-500": "--color-leap",
    "--color-bookub-500": "--color-bookub",
    "--color-payub-500": "--color-payub",
    "--color-founderub-500": "--color-founderub",
    "--color-brand-primary-500": "--color-primary",
    "--color-success-500": "--color-success",
    "--color-success-600": "--color-on-success-container",
    "--color-success-bg": "--color-success-container",
    "--color-error-500": "--color-error",
    "--color-error-600": "--color-on-error-container",
    "--color-error-bg": "--color-error-container",
    "--color-danger-500": "--color-error",
    "--color-danger-600": "--color-on-error-container",
    "--color-danger-bg": "--color-error-container",
    "--color-warning-500": "--color-warning",
    "--color-warning-600": "--color-on-warning-container",
    "--color-warning-bg": "--color-warning-container",
    "--color-info-500": "--color-info",
    "--color-info-600": "--color-on-info-container",
    "--color-info-bg": "--color-info-container",
    "--color-border-input": "--color-outline",
    "--color-text-placeholder": "--color-on-surface-muted",
    "--color-text-info": "--color-on-info-container",
    "--color-text-success": "--color-on-success-container",
    "--color-text-warning": "--color-on-warning-container",
    "--color-text-danger": "--color-on-error-container",
    "--color-accent-500": "--color-primary",
    "--color-bg-default": "--color-surface",
    "--color-bg-subtle": "--color-surface-container-low",
    "--color-bg-muted": "--color-surface-container-high",
    "--color-bg-raised": "--color-surface-elevated",
    "--color-bg-inverse": "--color-inverse-surface",
    "--color-text-primary": "--color-on-surface",
    "--color-text-secondary": "--color-on-surface-variant",
    "--color-text-muted": "--color-on-surface-muted",
    "--color-text-subtle": "--color-outline",
    "--color-text-inverse": "--color-inverse-on-surface",
    "--color-text-link": "--color-primary",
    "--color-border-default": "--color-outline-variant",
    "--color-border-subtle": "--color-surface-container-high",
    "--color-border-strong": "--color-outline",
    "--color-border-inverse": "--color-inverse-on-surface",
    "--color-ring-default": "--color-primary",
    "--color-ring-offset": "--color-surface",
    "--color-surface-muted": "--color-surface-container-low",
    "--color-surface-raised": "--color-surface-elevated",
    "--color-surface-sunken": "--color-surface-container-high",
    "--color-surface-inverse": "--color-inverse-surface",
    "--color-semantic-success-default": "--color-success",
    "--color-semantic-success-strong": "--color-on-success-container",
    "--color-semantic-success-bg": "--color-success-container",
    "--color-semantic-error-default": "--color-error",
    "--color-semantic-error-strong": "--color-on-error-container",
    "--color-semantic-error-bg": "--color-error-container",
    "--color-semantic-warning-default": "--color-warning",
    "--color-semantic-warning-strong": "--color-on-warning-container",
    "--color-semantic-warning-bg": "--color-warning-container",
    "--color-semantic-info-default": "--color-info",
    "--color-semantic-info-strong": "--color-on-info-container",
    "--color-semantic-info-bg": "--color-info-container"
  },
  "mix": {
    "--color-success-border": "color-mix(in srgb, var(--color-success) 35%, transparent)",
    "--color-error-border": "color-mix(in srgb, var(--color-error) 35%, transparent)",
    "--color-danger-border": "color-mix(in srgb, var(--color-error) 35%, transparent)",
    "--color-warning-border": "color-mix(in srgb, var(--color-warning) 35%, transparent)",
    "--color-info-border": "color-mix(in srgb, var(--color-info) 35%, transparent)",
    "--color-semantic-success-border": "color-mix(in srgb, var(--color-success) 35%, transparent)",
    "--color-semantic-error-border": "color-mix(in srgb, var(--color-error) 35%, transparent)",
    "--color-semantic-warning-border": "color-mix(in srgb, var(--color-warning) 35%, transparent)",
    "--color-semantic-info-border": "color-mix(in srgb, var(--color-info) 35%, transparent)"
  }
} /* SNAPSHOT:END */;

export function loadAliasMap(cwd = process.cwd()) {
  for (const from of [path.join(cwd, 'package.json'), import.meta.url]) {
    try {
      const req = createRequire(from);
      const css = ['base', 'light'].map((f) => readFileSync(req.resolve(`@nexub/themes/${f}`), 'utf8'));
      return { ...buildAliasMap(css), source: '@nexub/themes' };
    } catch { /* not resolvable from here */ }
  }
  return { ...SNAPSHOT, source: 'snapshot' };
}

// ─── class-string contexts ───────────────────────────────────────────────────
/**
 * Find string-literal bodies in JS/TS source. Handles '…', "…", `…${…}…` (static chunks
 * only), // and /* comments. ponytail: no regex-literal or JSX-text awareness — a stray
 * quote (/'/ or <p>Don't</p>) can mis-pair until the end of that line.
 */
export function scanStrings(src) {
  const out = [];
  const stack = []; // brace depth at each open `${`
  let depth = 0;
  let i = 0;
  const n = src.length;
  const readTemplate = (j, tplStart, openLeft) => {
    const start = j;
    while (j < n && src[j] !== '`' && !(src[j] === '$' && src[j + 1] === '{')) j += src[j] === '\\' ? 2 : 1;
    const openRight = src[j] === '$';
    out.push({ start, end: j, quoteAt: tplStart, openLeft, openRight });
    if (openRight) { stack.push({ depth, tplStart }); return j + 2; }
    return j + 1;
  };
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i < 0) break; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2); if (i < 0) break; i += 2; continue; }
    if (c === "'" || c === '"') {
      let j = i + 1;
      while (j < n && src[j] !== c && src[j] !== '\n') j += src[j] === '\\' ? 2 : 1;
      out.push({ start: i + 1, end: Math.min(j, n), quoteAt: i, openLeft: false, openRight: false });
      i = j + 1;
      continue;
    }
    if (c === '`') { i = readTemplate(i + 1, i, false); continue; }
    if (c === '{') depth++;
    else if (c === '}') {
      if (stack.length && stack.at(-1).depth === depth) { i = readTemplate(i + 1, stack.pop().tplStart, true); continue; }
      depth--;
    }
    i++;
  }
  return out;
}

// Explicit class contexts: className= / class= attributes, cn/clsx/cva/cx/twMerge/twJoin(…) args, tw`…`.
const CLASS_CONTEXT = /(?:\bclass(?:Name)?\s*=\s*\{?\s*|\b(?:cn|clsx|cva|cx|twMerge|twJoin)\s*\((?:[^()]*?,)?\s*|\btw)$/;
// Otherwise a plain string counts only when every token looks like a Tailwind class:
// starts lowercase/digit/[/@/!/-, and has no quotes, braces or '<'. "Align text-left" is not one.
const TW_TOKEN = /^[!-]?[a-z0-9@[][^\s"'`<{}]*$/;
const looksLikeClassList = (text) => {
  const t = text.trim();
  return t !== '' && t.split(/\s+/).every((tok) => TW_TOKEN.test(tok));
};

export function classSegments(src, ext) {
  if (ext === '.css' || ext === '.scss') {
    return [...src.matchAll(/@apply\s+([^;}]+)/dg)].map((m) => ({ start: m.indices[1][0], end: m.indices[1][1] }));
  }
  if (ext === '.html' || ext === '.mdx') {
    return [...src.matchAll(/\bclass(?:Name)?\s*=\s*(["'])([^"']*)\1/dg)].map((m) => ({ start: m.indices[2][0], end: m.indices[2][1] }));
  }
  return scanStrings(src).filter((s) => {
    if (CLASS_CONTEXT.test(src.slice(Math.max(0, s.quoteAt - 120), s.quoteAt))) return true;
    return looksLikeClassList(src.slice(s.start, s.end));
  });
}

// ─── class-token rules ───────────────────────────────────────────────────────
const SIDE = { l: 's', r: 'e' };
const CORNER = { l: 's', r: 'e', tl: 'ss', tr: 'se', bl: 'es', br: 'ee' };
const LOGICAL = [
  // value-constrained so prose like "pr-review" never matches
  [/^([mp])([lr])-(\d+(?:\.\d+)?|px|auto|\[[^\]]+\])$/, (_, a, s, v) => `${a}${SIDE[s]}-${v}`],
  [/^border-([lr])(-.+)?$/, (_, s, r = '') => `border-${SIDE[s]}${r}`],
  [/^rounded-(tl|tr|bl|br|l|r)(-.+)?$/, (_, c, r = '') => `rounded-${CORNER[c]}${r}`],
  [/^text-(left|right)$/, (_, s) => `text-${s === 'left' ? 'start' : 'end'}`],
];
const POSITION = /^(left|right)-/;
const TW_ANIMATE = /^(animate-(in|out)|(fade|zoom|spin)-(in|out)(-.+)?|slide-(in-from|out-to)-.+)$/;
const OPACITY = /^([\w-]+)-\[var\((--[\w-]+)\)\]\/(\d+)$/;

/** Split `md:hover:!-ml-2` into { prefix: 'md:hover:', imp: '!', neg: '-', base: 'ml-2' }. */
function splitToken(tok) {
  let depth = 0;
  let cut = 0;
  for (let i = 0; i < tok.length; i++) {
    if (tok[i] === '[') depth++;
    else if (tok[i] === ']') depth--;
    else if (tok[i] === ':' && depth === 0) cut = i + 1;
  }
  let rest = tok.slice(cut);
  const imp = rest.startsWith('!') ? '!' : '';
  rest = rest.slice(imp.length);
  const neg = rest.startsWith('-') ? '-' : '';
  return { prefix: tok.slice(0, cut), imp, neg, base: rest.slice(neg.length) };
}

function rewriteClassText(text, seg, offset, rules, fix, report) {
  return text.replace(/\S+/g, (tok, off) => {
    if ((seg.openLeft && off === 0) || (seg.openRight && off + tok.length === text.length)) return tok; // glued to ${…}
    const at = offset + off;
    const { prefix, imp, neg, base } = splitToken(tok);
    let next = base;
    if (rules.has('logical-classes')) {
      for (const [re, fn] of LOGICAL) if (re.test(next)) { next = next.replace(re, fn); break; }
      if (POSITION.test(base)) report(at, 'logical-classes', `"${tok}" is a physical position; review for start-/end- (not auto-fixed)`);
    }
    if (rules.has('tw-animate') && TW_ANIMATE.test(base)) {
      report(at, 'tw-animate', `"${tok}" is a tailwindcss-animate class; use nx-motion / nx-pop / nx-dialog from @nexub/themes/base`);
    }
    if (rules.has('opacity-modifier')) {
      const m = OPACITY.exec(next);
      if (m) {
        const mixed = `${m[1]}-[color-mix(in_srgb,var(${m[2]})_${m[3]}%,transparent)]`;
        if (fix) next = mixed;
        else report(at, 'opacity-modifier', `"${tok}": Tailwind 3 emits nothing for /${m[3]} on a var(); use ${prefix}${imp}${neg}${mixed} (or --fix)`);
      }
    }
    return next === base ? tok : prefix + imp + neg + next;
  });
}

// ─── deprecated-components: @nexub/react components removed in 3.0 ───────────
const REPLACED = { Banner: 'Alert', Callout: 'Alert', Tag: 'Badge', StatusPill: 'Badge' };
const SOFT = new Set(['Tag', 'StatusPill']); // container-coloured, so Badge variant="soft", not its solid default
const TYPES = { BannerProps: 'AlertProps', CalloutProps: 'AlertProps', TagProps: 'BadgeProps', StatusPillProps: 'BadgeProps' };
const VARIANTS = new Set(['bannerVariants', 'calloutVariants', 'tagVariants', 'statusPillVariants']);
const COMPONENT_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mdx']);

const keepLines = (s) => s.replace(/[^\n]/g, ''); // removals keep line numbers stable

/** Index just past the `{…}` or quoted value starting at i. ponytail: braces inside strings in the value count. */
function skipValue(src, i) {
  if (src[i] === '"' || src[i] === "'") return src.indexOf(src[i], i + 1) + 1;
  let depth = 0;
  for (let j = i; j < src.length; j++) {
    if (src[j] === '{') depth++;
    else if (src[j] === '}' && --depth === 0) return j + 1;
  }
  return src.length;
}

/** Parse a JSX opening tag's attributes from i (just past the name) to its `>` or `/>`. */
function readTag(src, i) {
  const attrs = [];
  while (i < src.length) {
    const ws = i;
    while (/\s/.test(src[i])) i++;
    if (src.startsWith('/>', i)) return { attrs, close: ws, end: i + 2, selfClosing: true };
    if (src[i] === '>') return { attrs, close: ws, end: i + 1, selfClosing: false };
    if (src[i] === '{') { i = skipValue(src, i); continue; } // {...spread}
    const name = /^[\w:-]+/.exec(src.slice(i))?.[0];
    if (!name) return null;
    let j = i + name.length;
    let value = null;
    const eq = /^\s*=\s*/.exec(src.slice(j));
    if (eq) {
      const v = j + eq[0].length;
      j = skipValue(src, v);
      value = src.slice(v, j);
    }
    attrs.push({ name, start: ws, end: j, value });
    i = j;
  }
  return null;
}

/** Rewrite deprecated @nexub/react components. Returns { output, items: [{ line, rule, message }] }. */
function migrateComponents(src) {
  const edits = [];
  const items = [];
  const lineOf = (at) => src.slice(0, at).split('\n').length;
  const report = (at, message) => items.push({ line: lineOf(at), rule: 'deprecated-components', message });
  const locals = new Map(); // local JSX name -> { from, to, aliased }
  const types = new Set();
  const seen = new Set();
  const imports = [];
  for (const m of src.matchAll(/\bimport\s+(?:type\s+)?\{([^}]*)\}\s*from\s*(['"])@nexub\/react\2/dg)) {
    imports.push(m.indices[0]);
    const base = m.indices[1][0];
    for (const s of m[1].matchAll(/\s*(?:\btype\s+)?\b(\w+)(?:\s+as\s+(\w+))?(?:\s*,)?/dg)) {
      const [spec, name, alias] = s;
      const next = REPLACED[name] ?? TYPES[name] ?? name;
      if (VARIANTS.has(name)) report(base + s.index, `${name} is removed in 3.0; use alertVariants / badgeVariants or Alert / Badge`);
      if (REPLACED[name]) locals.set(alias ?? name, { from: name, to: REPLACED[name], aliased: !!alias });
      if (TYPES[name] && !alias) types.add(name);
      const out = alias ? `${next} as ${alias}` : next;
      if (seen.has(out)) { edits.push({ start: base + s.index, end: base + s.index + spec.length, text: keepLines(spec) }); continue; }
      seen.add(out);
      if (next !== name) edits.push({ start: base + s.indices[1][0], end: base + s.indices[1][1], text: next });
    }
  }
  for (const [local, { from, to, aliased }] of locals) {
    const tagName = aliased ? local : to;
    for (const m of src.matchAll(new RegExp(`<(/?)${local}(?![\\w.$-])`, 'g'))) {
      const nameEnd = m.index + m[0].length;
      edits.push({ start: m.index + 1 + m[1].length, end: nameEnd, text: tagName });
      if (m[1]) continue;
      const tag = readTag(src, nameEnd);
      if (!tag) { report(m.index, `<${local}>: could not parse the tag; migrate it to <${to}> by hand`); continue; }
      const attr = Object.fromEntries(tag.attrs.map((a) => [a.name, a]));
      if (SOFT.has(from) && !attr.variant) edits.push({ start: nameEnd, end: nameEnd, text: ' variant="soft"' });
      if (from !== 'StatusPill') continue;
      // StatusPill label -> children; dot has no Badge equivalent.
      const drop = (a) => edits.push({ start: a.start, end: a.end, text: keepLines(src.slice(a.start, a.end)) });
      if (attr.dot) {
        drop(attr.dot);
        if (attr.dot.value !== '{false}') report(m.index, `<${local} dot>: Badge has no dot; pass leadingIcon={<StatusDot />} or similar`);
      }
      const label = attr.label;
      if (!label?.value || label.value.includes('\n') || !tag.selfClosing) {
        report(m.index, `<${local}>: move label into <${tagName}>children</${tagName}> by hand`);
        continue;
      }
      const q = label.value[0];
      const inner = label.value.slice(1, -1);
      const children = q === '{' ? label.value : /[{}<>]/.test(inner) ? `{${label.value}}` : inner;
      drop(label);
      edits.push({ start: tag.close, end: tag.end, text: `${keepLines(src.slice(tag.close, tag.end))}>${children}</${tagName}>` });
    }
    // Non-JSX references (typeof X, styled(X), as={X}) keep the old name unless it was aliased.
    if (!aliased || SOFT.has(from)) {
      for (const m of src.matchAll(new RegExp(`(?:\\btypeof\\s+${local}\\b|[({]\\s*${local}\\s*[,)}])`, 'g'))) {
        if (!imports.some(([a, b]) => a <= m.index && m.index < b)) report(m.index, `${local} is used outside JSX; it becomes ${to} in 3.0 (check props)`);
      }
    }
  }
  if (types.size) {
    const re = new RegExp(`\\b(${[...types].join('|')})\\b`, 'g');
    for (const m of src.matchAll(re)) {
      if (!edits.some((e) => e.start <= m.index && m.index < e.end)) edits.push({ start: m.index, end: m.index + m[0].length, text: TYPES[m[0]] });
    }
  }
  let output = src;
  for (const e of edits.sort((a, b) => b.start - a.start || b.end - a.end)) output = output.slice(0, e.start) + e.text + output.slice(e.end);
  return { output, items };
}

// ─── per-file migration ──────────────────────────────────────────────────────
/**
 * Migrate one file's text. Returns { output, manual: [{ line, rule, message }] }.
 * opts: { ext, rules: Set, fix: boolean, aliasMap: { aliases, mix } }
 */
export function migrateSource(src, { ext, rules = new Set(RULES), fix = false, aliasMap = SNAPSHOT }) {
  const items = [];
  let text = src;
  if (['logical-classes', 'tw-animate', 'opacity-modifier'].some((r) => rules.has(r))) {
    let out = '';
    let last = 0;
    for (const seg of classSegments(src, ext)) {
      out += src.slice(last, seg.start) + rewriteClassText(src.slice(seg.start, seg.end), seg, seg.start, rules, fix,
        (at, rule, message) => items.push({ at, rule, message }));
      last = seg.end;
    }
    text = out + src.slice(last);
  }
  if (rules.has('legacy-tokens')) {
    // Skip definitions (`--color-x:` / `'--color-x':`) — those override the alias on purpose.
    text = text.replace(/(?<![\w-])--color-[a-z0-9-]+(?![\w-])(?!['"]?\s*:)/g, (name, at) => {
      if (aliasMap.aliases[name]) return aliasMap.aliases[name];
      if (aliasMap.mix[name]) items.push({ at, rule: 'legacy-tokens', message: `${name} is a color-mix alias (${aliasMap.mix[name]}); rewrite by hand` });
      return name;
    });
  }
  if (rules.has('deprecated-components') && COMPONENT_EXTS.has(ext) && /@nexub\/react['"]/.test(text)) {
    const r = migrateComponents(text);
    text = r.output;
    items.push(...r.items);
  }
  // Rewrites never add or remove newlines, so offsets in src and text share line numbers.
  const lineOf = (at) => src.slice(0, at).split('\n').length;
  const manual = items.map(({ at, line, rule, message }) => ({ line: line ?? lineOf(at), rule, message })).sort((a, b) => a.line - b.line);
  return { output: text, manual };
}

// ─── file walking ────────────────────────────────────────────────────────────
export function globToRegExp(glob) {
  const re = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*\/?|\*|\?/g, (m) => ({ '*': '[^/]*', '?': '[^/]', '**': '.*' })[m] ?? '(?:.*/)?');
  return new RegExp(`^${re}$`);
}

export function collectFiles(paths, { cwd = process.cwd(), ignore = [] } = {}) {
  const res = ignore.map(globToRegExp);
  const ignored = (rel) => res.some((re, i) => re.test(rel) || (!ignore[i].includes('/') && re.test(path.posix.basename(rel))));
  const files = [];
  const walk = (abs) => {
    const rel = path.relative(cwd, abs).split(path.sep).join('/');
    if (rel && ignored(rel)) return;
    let st;
    try { st = statSync(abs); } catch { return; }
    if (st.isDirectory()) {
      if (SKIP_DIRS.has(path.basename(abs)) && rel !== '') return;
      for (const e of readdirSync(abs).sort()) walk(path.join(abs, e));
    } else if (st.isFile() && EXTS.has(path.extname(abs)) && st.size <= MAX_BYTES) {
      files.push(abs);
    }
  };
  for (const p of paths) walk(path.resolve(cwd, p));
  return files;
}

// ─── CLI ─────────────────────────────────────────────────────────────────────
export const USAGE = `Usage: nexub-migrate [paths…] [options]

Move app code onto current Nexub DS conventions. Paths default to ./src.
Dry run by default: prints what would change and what needs a human.

Options:
  --write            apply fixes in place
  --check            exit 1 if anything fixable or reportable is found (CI)
  --json             print machine-readable results
  --fix              also rewrite opacity-modifier hits (preview, or apply with --write)
  --rules <a,b>      run only these rules (default: all)
  --ignore <glob>    skip paths matching glob (repeatable; supports * and **)
  -h, --help         show this help

Rules:
  legacy-tokens      var(--color-text-primary) -> var(--color-on-surface), brand -500 -> role;
                     color-mix aliases (e.g. --color-semantic-success-border) reported
  logical-classes    ml/mr, pl/pr, border-l/r, rounded-l/r/tl/tr/bl/br, text-left/right
                     -> ms/me, ps/pe, border-s/e, rounded-s/e/ss/se/es/ee, text-start/end;
                     left-/right- positions reported
  tw-animate         report tailwindcss-animate enter/exit classes (use nx-motion/nx-pop/nx-dialog)
  opacity-modifier   report [var(--x)]/NN (emits nothing in Tailwind 3); --fix rewrites to color-mix
  deprecated-components
                     @nexub/react components removed in 3.0: Banner, Callout -> Alert;
                     Tag -> <Badge variant="soft">; StatusPill label -> Badge children
                     (dot and non-JSX uses reported); *Props types renamed

Ignored: node_modules, dist, build, .next, out, coverage, files over 1 MB.
Exit codes: 0 ok, 1 --check found something, 2 usage error.`;

export function run(argv, { cwd = process.cwd(), stdout = (s) => process.stdout.write(s), stderr = (s) => process.stderr.write(s) } = {}) {
  let args;
  try {
    args = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        write: { type: 'boolean' }, check: { type: 'boolean' }, json: { type: 'boolean' }, fix: { type: 'boolean' },
        rules: { type: 'string' }, ignore: { type: 'string', multiple: true }, help: { type: 'boolean', short: 'h' },
      },
    });
  } catch (e) {
    stderr(`${e.message}\n\n${USAGE}\n`);
    return 2;
  }
  const { values: o, positionals } = args;
  if (o.help) { stdout(`${USAGE}\n`); return 0; }
  const rules = new Set(o.rules ? o.rules.split(',').map((r) => r.trim()).filter(Boolean) : RULES);
  const unknown = [...rules].filter((r) => !RULES.includes(r));
  if (unknown.length) { stderr(`Unknown rule(s): ${unknown.join(', ')}. Known: ${RULES.join(', ')}\n`); return 2; }

  const aliasMap = rules.has('legacy-tokens') ? loadAliasMap(cwd) : SNAPSHOT;
  const results = [];
  for (const abs of collectFiles(positionals.length ? positionals : ['src'], { cwd, ignore: o.ignore ?? [] })) {
    const src = readFileSync(abs, 'utf8');
    const { output, manual } = migrateSource(src, { ext: path.extname(abs), rules, fix: !!o.fix, aliasMap });
    const a = src.split('\n');
    const b = output.split('\n');
    const changes = a.flatMap((line, i) => (line === b[i] ? [] : [{ line: i + 1, before: line, after: b[i] }]));
    if (!changes.length && !manual.length) continue;
    if (o.write && changes.length) writeFileSync(abs, output);
    results.push({ file: path.relative(cwd, abs).split(path.sep).join('/'), changes, manual });
  }
  const totals = {
    files: results.length,
    changes: results.reduce((n, r) => n + r.changes.length, 0),
    manual: results.reduce((n, r) => n + r.manual.length, 0),
  };

  if (o.json) {
    stdout(`${JSON.stringify({ written: !!o.write, aliasSource: aliasMap.source ?? 'snapshot', results, totals }, null, 2)}\n`);
  } else {
    for (const r of results) {
      stdout(`--- ${r.file}\n+++ ${r.file}\n`);
      for (const c of r.changes) stdout(`@@ ${c.line} @@\n-${c.before}\n+${c.after}\n`);
      for (const m of r.manual) stdout(`! ${r.file}:${m.line} [${m.rule}] ${m.message}\n`);
    }
    const verb = o.write ? 'changed' : 'to change';
    stdout(`\n${totals.changes} line(s) ${verb} in ${results.filter((r) => r.changes.length).length} file(s); ${totals.manual} item(s) need manual review.`);
    stdout(!o.write && totals.changes ? ' Run with --write to apply.\n' : '\n');
  }
  return o.check && (totals.changes || totals.manual) ? 1 : 0;
}

const isMain = (() => {
  try { return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url); } catch { return false; }
})();
if (isMain) process.exitCode = run(process.argv.slice(2));

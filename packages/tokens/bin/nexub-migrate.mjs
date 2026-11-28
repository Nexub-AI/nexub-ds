#!/usr/bin/env node
// nexub-migrate — move app code onto current Nexub DS conventions.
// Dependency-free (node: built-ins only), Node >= 20. See ./README.md.
import { readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

export const RULES = ['legacy-tokens', 'logical-classes', 'tw-animate', 'opacity-modifier', 'deprecated-components', 'tailwind-3-preset', 'keep-5-defaults', 'removed-in-7', 'changes-in-8', 'button-aliases', 'changes-in-9', 'changes-in-11', 'deprecated-in-11', 'changes-in-12', 'text-weight', 'text-truncate', 'button-full-width', 'admin-ui-wrappers'];
// Run only when asked for by --rules (or --codemod). keep-5-defaults keeps old behaviour instead of moving code
// forward; changes-in-12 moves code onto 12.0, which on 11.x would undo the 11.9 opt-in stylesheet.
// The 12.7 codemods (text-weight …, see CODEMODS) move app workarounds onto DS props: opt-in too.
const OPT_IN = new Set(['keep-5-defaults', 'changes-in-12', 'text-weight', 'text-truncate', 'button-full-width', 'admin-ui-wrappers']);
export const DEFAULT_RULES = RULES.filter((r) => !OPT_IN.has(r));
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.html', '.mdx']);
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.next', 'out', 'coverage']);
const MAX_BYTES = 1024 * 1024;

// ─── legacy-tokens: alias map ────────────────────────────────────────────────
// Not legacy aliases: the disabled-state role, and three tokens brand themes override
// ([data-product] sets ring-default to its tertiary and accent-500 to its scale).
const NEVER = new Set(['--color-text-disabled', '--color-ring-default', '--color-ring-offset', '--color-accent-500']);
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

// buildAliasMap([@nexub/themes 2.9 base.css, light.css]), frozen: 3.0 removed these
// aliases from @nexub/themes, so this table is the only record of them.
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
// Tailwind colour utilities on a legacy name (bg-bg-default, text-text-primary/80):
// the preset and tailwind.css dropped these in 3.0. Same utility, role name.
const COLOR_UTILITY = /^(bg|text|border(?:-[xyselrtb])?|ring|ring-offset|outline|divide|fill|stroke|from|via|to|decoration|shadow|accent|caret|placeholder)-([a-z][\w-]*?)(\/\d+)?$/;

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

function rewriteClassText(text, seg, offset, rules, fix, report, aliasMap) {
  return text.replace(/\S+/g, (tok, off) => {
    if ((seg.openLeft && off === 0) || (seg.openRight && off + tok.length === text.length)) return tok; // glued to ${…}
    const at = offset + off;
    const { prefix, imp, neg, base } = splitToken(tok);
    let next = base;
    if (rules.has('logical-classes')) {
      for (const [re, fn] of LOGICAL) if (re.test(next)) { next = next.replace(re, fn); break; }
      if (POSITION.test(base)) report(at, 'logical-classes', `"${tok}" is a physical position; review for start-/end- (not auto-fixed)`);
    }
    if (rules.has('legacy-tokens')) {
      const m = COLOR_UTILITY.exec(next);
      const name = m && `--color-${m[2]}`;
      if (m && aliasMap.aliases[name]) next = `${m[1]}-${aliasMap.aliases[name].slice('--color-'.length)}${m[3] ?? ''}`;
      else if (m && aliasMap.mix[name]) report(at, 'legacy-tokens', `"${tok}" uses ${name}, a color-mix alias (${aliasMap.mix[name]}); rewrite by hand`);
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

// ─── keep-5-defaults (opt-in): pin the defaults 6.0 changes ──────────────────
// Adds the 5.x value as an explicit prop, so upgrading to 6.0 changes nothing.
const selection = (a) => (a.enableRowSelection && !a.selectionColumn ? ' selectionColumn={false}' : null);
const PINS = {
  DataTable: selection,
  DataTableVirtual: selection,
};

function pinDefaults(src) {
  const edits = [];
  const items = [];
  const locals = new Map(); // local JSX name -> exported name
  for (const m of src.matchAll(/\bimport\s+\{([^}]*)\}\s*from\s*(['"])@nexub\/react(?:\/\w+)?\2/g)) {
    for (const [, name, alias] of m[1].matchAll(/\b(\w+)(?:\s+as\s+(\w+))?/g)) if (PINS[name]) locals.set(alias ?? name, name);
  }
  for (const [local, name] of locals) {
    for (const m of src.matchAll(new RegExp(`<${local}(?![\\w.$-])`, 'g'))) {
      const at = m.index + m[0].length;
      const tag = readTag(src, at);
      const report = (message) => items.push({ line: src.slice(0, m.index).split('\n').length, rule: 'keep-5-defaults', message });
      if (!tag) { report(`<${local}>: could not parse the tag; check its 6.0 defaults by hand`); continue; }
      const pin = PINS[name](Object.fromEntries(tag.attrs.map((a) => [a.name, a])));
      if (!pin) continue;
      if (src.slice(at, tag.end).includes('{...')) { report(`<${local} {...spread}>: add${pin} unless the spread sets it`); continue; }
      edits.push({ at, text: pin });
    }
  }
  let output = src;
  for (const e of edits.sort((a, b) => b.at - a.at)) output = output.slice(0, e.at) + e.text + output.slice(e.at);
  return { output, items };
}

// ─── changes-in-8: report what 8.0 removes and which defaults it flips ───────
// Report only: each needs a choice (adopt the new default now, or pin the old one).
// The 7.x legacy motion tokens (tokens/motion.json); the spring tokens (--ease-spatial-* …) stay.
const LEGACY_MOTION = /(?<![\w-])--(?:duration-(?:instant|fast|normal|slow|slower)|ease-(?:linear|in|out|in-out|out-expo|spring))(?![\w-])(?!['"]?\s*:)/g;
const EASING_COMPONENTS = /<(Fade|Scale|Slide|Collapse)\b[^>]*\beasing=/g;
const SCROLL_LOCKED = /<((?:Dialog|AlertDialog|Drawer|Sheet)\.Root|CommandPalette)(?![\w.$-])/g;
const STRICT_SCHEMES = new Set(['http', 'https', 'mailto', 'tel', 'sms']);
const SCRIPT_SCHEMES = new Set(['javascript', 'vbscript', 'data', 'file']); // already dropped in 7.x
const SIGNATURE_NOTE = 'Signature becomes the default look in 8.0: try it now with data-style="signature" on <html>, or set data-style="classic" to keep the 7.x (Material 3) look';
const HREF_LITERAL = /\b\w*href\s*[=:]\s*\{?\s*(['"`])\s*([a-z][a-z0-9+.-]*):/gi;

function changesIn8(src, ext, report) {
  for (const m of src.matchAll(LEGACY_MOTION))
    report(m.index, `${m[0]} is removed in 8.0 (deprecated in 7.3): use the spring tokens, e.g. var(--motion-spring-effects-default-duration) and var(--motion-spring-effects-default-easing)`);
  if (!COMPONENT_EXTS.has(ext)) {
    if (ext === '.css' && /@nexub\/themes/.test(src) && !/data-style/.test(src))
      for (const m of src.matchAll(/@import\s+(?:url\()?['"]@nexub\/themes/g)) { report(m.index, SIGNATURE_NOTE); break; }
    return;
  }
  if (/@nexub\/react['"/]/.test(src)) {
    for (const m of src.matchAll(EASING_COMPONENTS))
      report(m.index, `<${m[1]} easing> is removed in 8.0 (deprecated in 7.3): drop easing and use duration, which rides the spring tokens`);
    for (const m of src.matchAll(SCROLL_LOCKED)) {
      const tag = readTag(src, m.index + m[0].length);
      if (tag && tag.attrs.some((a) => a.name === 'scrollLock')) continue;
      const spread = tag && src.slice(m.index, tag.end).includes('{...') ? ' (unless the spread sets scrollLock)' : '';
      report(m.index, `<${m[1]}> uses the default scrollLock${spread}, which becomes "class" in 8.0: load @nexub/themes/base CSS (it styles html.nexub-scroll-lock) and try scrollLock="class" now, or pin scrollLock="style" to keep 7.x`);
    }
    for (const m of src.matchAll(/\bsafeHref\(([^()]*)\)/g))
      if (!/\bstrict\b/.test(m[1])) report(m.index, 'safeHref() turns strict in 8.0 (only relative, http(s), mailto, tel, sms): pass { strict: true } now, or { strict: false } to keep custom schemes');
  }
  if (/@nexub\/(react|patterns|marketing)['"/]/.test(src)) {
    for (const m of src.matchAll(HREF_LITERAL)) {
      const s = m[2].toLowerCase();
      if (!STRICT_SCHEMES.has(s) && !SCRIPT_SCHEMES.has(s))
        report(m.index, `"${m[2]}:" link: 8.0 Nexub links use strict safeHref and drop it (only relative, http(s), mailto, tel, sms); render your own <a> for custom schemes`);
    }
  }
  const themes = /\bimport\s+['"]@nexub\/themes/.exec(src);
  if (themes && !/data-style/.test(src)) report(themes.index, SIGNATURE_NOTE);
}

// ─── button-aliases: Button's legacy variant names (deprecated 8.4, removed 9.0) ─
export const BUTTON_ALIASES = { primary: 'filled', secondary: 'tonal', outline: 'outlined', ghost: 'text' };
const ALIAS_RE = Object.keys(BUTTON_ALIASES).join('|');

function buttonAliases(src) {
  const edits = [];
  const items = [];
  const report = (at, message) => items.push({ line: src.slice(0, at).split('\n').length, rule: 'button-aliases', message });
  const locals = [];
  for (const m of src.matchAll(/\bimport\s+\{([^}]*)\}\s*from\s*(['"])@nexub\/react(?:\/\w+)?\2/g))
    for (const [, name, alias] of m[1].matchAll(/\b(\w+)(?:\s+as\s+(\w+))?/g)) if (name === 'Button') locals.push(alias ?? name);
  for (const local of locals) {
    for (const m of src.matchAll(new RegExp(`<${local}(?![\\w.$-])`, 'g'))) {
      const variant = readTag(src, m.index + m[0].length)?.attrs.find((a) => a.name === 'variant');
      if (!variant?.value) continue;
      const lit = /^(?:\{\s*)?(["'])(\w+)\1(?:\s*\})?$/.exec(variant.value);
      if (lit && BUTTON_ALIASES[lit[2]]) edits.push({ start: variant.end - variant.value.length, end: variant.end, text: `"${BUTTON_ALIASES[lit[2]]}"` });
      else if (!lit && new RegExp(`['"](${ALIAS_RE})['"]`).test(variant.value)) report(m.index, `<${local} variant={…}> may pass a legacy alias (removed in 9.0): use ${Object.entries(BUTTON_ALIASES).map(([a, b]) => `${a} -> ${b}`).join(', ')}`);
    }
  }
  // buttonVariants({ variant: 'primary' }) for links styled as buttons.
  for (const m of src.matchAll(new RegExp(`\\bbuttonVariants\\(\\{[^}]*?\\bvariant:\\s*(['"])(${ALIAS_RE})\\1`, 'g'))) {
    const at = m.index + m[0].length - m[2].length - 1;
    edits.push({ start: at, end: at + m[2].length, text: BUTTON_ALIASES[m[2]] });
  }
  let output = src;
  for (const e of edits.sort((a, b) => b.start - a.start)) output = output.slice(0, e.start) + e.text + output.slice(e.end);
  return { output, items };
}

// ─── changes-in-9: what 9.0 removes (the 7.x and 8.x deprecations) ──────────
// Prop renames are rewritten; the classic style and the hidePassword message are reported.
const RENAMES_9 = [
  { pkg: '@nexub/react', comps: ['DatePicker', 'DateTimePicker', 'NumberInput'], from: 'onChange', to: 'onValueChange', since: '8.5' },
  { pkg: '@nexub/react-native', comps: ['Dialog', 'BottomSheet'], from: 'dismissable', to: 'dismissible', since: '8.5' },
  { pkg: '@nexub/react-native', comps: ['DateTimeField'], from: 'minimumDate', to: 'minDate', since: '8.5' },
  { pkg: '@nexub/react-native', comps: ['DateTimeField'], from: 'maximumDate', to: 'maxDate', since: '8.5' },
  { pkg: '@nexub/react-native', comps: ['ButtonGroup'], from: 'direction', to: 'orientation', values: { row: 'horizontal', stack: 'vertical' }, since: '8.5' },
];

/** Local names of `names` imported from exactly `pkg` (or a subpath of it), aliases included. */
function importedAs(src, pkg, names) {
  const out = new Map();
  for (const m of src.matchAll(/\bimport\s+(?:type\s+)?\{([^}]*)\}\s*from\s*(['"])([^'"]+)\2/g)) {
    if (m[3] !== pkg && !m[3].startsWith(`${pkg}/`)) continue;
    for (const [, name, alias] of m[1].matchAll(/\b(\w+)(?:\s+as\s+(\w+))?/g)) if (names.includes(name)) out.set(alias ?? name, name);
  }
  return out;
}

function changesIn9(src, report) {
  const edits = [];
  for (const r of RENAMES_9) {
    for (const [local, name] of importedAs(src, r.pkg, r.comps)) {
      for (const m of src.matchAll(new RegExp(`<${local}(?![\\w.$-])`, 'g'))) {
        const attr = readTag(src, m.index + m[0].length)?.attrs.find((a) => a.name === r.from);
        if (!attr) continue;
        const nameAt = src.indexOf(r.from, attr.start);
        if (r.values) {
          const lit = /^(?:\{\s*)?(["'])(\w+)\1(?:\s*\})?$/.exec(attr.value ?? '');
          if (!lit || !r.values[lit[2]]) {
            report(m.index, `<${name} ${r.from}={…}> is removed in 9.0 (deprecated in ${r.since}): use ${r.to} (${Object.entries(r.values).map(([a, b]) => `${a} -> ${b}`).join(', ')})`);
            continue;
          }
          edits.push({ start: attr.end - attr.value.length, end: attr.end, text: `"${r.values[lit[2]]}"` });
        }
        edits.push({ start: nameAt, end: nameAt + r.from.length, text: r.to });
      }
    }
  }
  if (/@nexub\//.test(src) || /data-style/.test(src)) {
    for (const m of src.matchAll(/data-style\s*=\s*\{?\s*["']classic["']|\[data-style=["']?classic["']?\]|setAttribute\(\s*["']data-style["']\s*,\s*["']classic["']/g))
      report(m.index, 'The classic style (the 7.x Material 3 look) is removed in 9.0: Signature is the only style; drop data-style="classic"');
  }
  if (/['"]@nexub\/react-native['"/]/.test(src)) {
    for (const m of src.matchAll(/\bstyle\s*[=:]\s*\{?\s*["'](?:classic|signature)["']/g))
      report(m.index, 'NexubNativeProvider\'s style prop is removed in 9.0: Signature is the only style; drop the prop');
  }
  if (/['"]@nexub\/(core|react|react-native)['"/]/.test(src)) {
    for (const m of src.matchAll(/\bhidePassword\b/g))
      report(m.index, 'The hidePassword message is removed in 9.0 (deprecated in 7.2): PasswordInput keeps one name, showPassword, with aria-pressed; delete the key');
  }
  let output = src;
  for (const e of edits.sort((a, b) => b.start - a.start)) output = output.slice(0, e.start) + e.text + output.slice(e.end);
  return output;
}

// ─── changes-in-11: what 11.0 removed and flipped ─────────────────────────────
// Removed: the four hand-written product theme files (deprecated in 10.3). They set the same
// [data-product] accent the generated map sets, so the import is rewritten to it.
// Flipped: overlays' `sheet` default, false -> 'auto'. Reported, never rewritten.
const PRODUCT_THEME = /(['"(]@nexub\/themes\/(?:src\/)?)(leap|bookub|payub|founderub)(?=(?:\.css)?['")])/g;
const HAS_PRODUCTS = /['"(]@nexub\/themes\/(?:src\/)?products(?:\.css)?['")]/;
const SHEET_11 = [
  { pkg: '@nexub/react', comps: ['MultiSelect', 'Autocomplete', 'DatePicker', 'DateRangePicker', 'DateTimePicker', 'SplitButton', 'SavedViews', 'CommandPalette'] },
  { pkg: '@nexub/react', comps: ['Select', 'DropdownMenu', 'ContextMenu', 'Menubar', 'Popover', 'AlertDialog'], part: 'Content' },
  { pkg: '@nexub/react', comps: ['Breadcrumb'], part: 'Trail' },
  { pkg: '@nexub/patterns', comps: ['NotificationCenter', 'AppLauncher', 'AppHeader'] },
];

function changesIn11(src, ext, report) {
  let seen = HAS_PRODUCTS.test(src);
  const output = src.replace(PRODUCT_THEME, (_, head, name, at) => {
    if (seen) report(at, `@nexub/themes/${name} was removed in 11.0 and this file already imports @nexub/themes/products, which covers it: delete this line`);
    seen = true;
    return `${head}products`;
  });
  if (!COMPONENT_EXTS.has(ext)) return output;
  for (const { pkg, comps, part } of SHEET_11) {
    for (const [local, name] of importedAs(src, pkg, comps)) {
      const tagName = part ? `${local}.${part}` : local;
      for (const m of src.matchAll(new RegExp(`<${tagName.replace('.', '\\.')}(?![\\w.$-])`, 'g'))) {
        const tag = readTag(src, m.index + m[0].length);
        if (!tag || tag.attrs.some((a) => a.name === 'sheet')) continue;
        const spread = src.slice(m.index, tag.end).includes('{...') ? ' (a {...spread} here may already pass it)' : '';
        report(m.index, `<${part ? `${name}.${part}` : name}> has no sheet prop${spread}: in 11.0 the default changed from false to "auto" (a bottom sheet below 768px). Pass sheet={false} to keep the popover on small screens, or sheet="auto" to keep the new default`);
      }
    }
  }
  return output;
}

// ─── deprecated-in-11: deprecated in an 11.x minor, removed in 12.0 ───────────
// 11.4: Stepper current={-1} for "every step done". Reported, never rewritten: the fix is a
// `status` on each step (or `completed`), which only the app knows.
function deprecatedIn11(src, report) {
  for (const [local] of importedAs(src, '@nexub/react', ['Stepper'])) {
    for (const m of src.matchAll(new RegExp(`<${local}(?![\\w.$-])`, 'g'))) {
      const tag = readTag(src, m.index + m[0].length);
      if (!tag) continue;
      const text = src.slice(m.index, tag.end);
      if (/\bcurrent=\{\s*-\s*1\s*\}/.test(text))
        report(m.index, '<Stepper current={-1}> is deprecated in 11.4 and removed in 12.0: give each step a status (status: "complete") or pass completed with every index, and set current to the step being shown');
    }
  }
}

// ─── changes-in-12: what 12.0 removes and flips (RFC 12.0) ────────────────────
// Flipped: @nexub/react/styles.css moves every layer under one `nexub` layer, which is what the
// 11.9 opt-in file styles.nexub-layer.css already is, so imports of it go back to styles.css.
// Removed: Stepper current={-1}. With a literal steps array of object literals it is rewritten
// to current={n - 1} with status: 'complete' on each step (a step's own status is kept: it
// already won over current); anything else is reported.
const LAYERED_SHEET = /(['"(]@nexub\/react\/)styles\.nexub-layer\.css(?=['")])/g;
const MINUS_ONE = /^\{\s*-\s*1\s*\}$/;

/** Split `[a, b, …]` / `{a, b, …}` text into its top-level items (with offsets into `text`). */
function splitTopLevel(text) {
  const items = [];
  let depth = 0;
  let start = 1;
  for (let i = 1; i < text.length - 1; i++) {
    const c = text[i];
    if (c === '"' || c === "'" || c === '`') {
      for (i++; i < text.length && text[i] !== c; i++) if (text[i] === '\\') i++;
    } else if (text.startsWith('//', i) || text.startsWith('/*', i)) {
      return null; // comments: leave it to a human
    } else if ('[{('.includes(c)) depth++;
    else if (')}]'.includes(c)) depth--;
    else if (c === ',' && depth === 0) {
      items.push({ start, end: i });
      start = i + 1;
    }
  }
  items.push({ start, end: text.length - 1 });
  return items
    .map(({ start: s, end: e }) => {
      const raw = text.slice(s, e);
      const lead = raw.length - raw.trimStart().length;
      return { start: s + lead, end: s + raw.trimEnd().length, text: raw.trim() };
    })
    .filter((it, i, all) => it.text || i < all.length - 1); // a trailing comma leaves an empty last item
}

/** `{ label: 'A' }` → `{ label: 'A', status: 'complete' }`; null when the step isn't a plain object literal. */
function completeStep(step) {
  if (!/^\{[\s\S]*\}$/.test(step)) return null;
  const props = splitTopLevel(step);
  if (!props || props.some((p) => p.text.startsWith('...'))) return null;
  if (props.some((p) => /^(['"]?)status\1\s*(?::|$)/.test(p.text))) return step;
  const inner = step.slice(1, -1);
  const body = inner.trimEnd();
  const tail = inner.slice(body.length);
  if (!body.trim()) return `{ status: 'complete' }`;
  return `{${body}${body.endsWith(',') ? ` status: 'complete',` : `, status: 'complete'`}${tail}}`;
}

function changesIn12(src, ext, report) {
  let output = src.replace(LAYERED_SHEET, '$1styles.css');
  if (!COMPONENT_EXTS.has(ext)) return output;
  const edits = [];
  for (const [local] of importedAs(output, '@nexub/react', ['Stepper'])) {
    for (const m of output.matchAll(new RegExp(`<${local}(?![\\w.$-])`, 'g'))) {
      const tag = readTag(output, m.index + m[0].length);
      const current = tag?.attrs.find((a) => a.name === 'current' && MINUS_ONE.test(a.value ?? ''));
      if (!current) continue;
      const steps = tag.attrs.find((a) => a.name === 'steps');
      const array = /^\{\s*(\[[\s\S]*\])\s*\}$/.exec(steps?.value ?? '')?.[1];
      const items = array && splitTopLevel(array);
      const done = items?.length ? items.map((it) => completeStep(it.text)) : null;
      if (!done || done.includes(null) || tag.attrs.some((a) => a.name === 'completed')) {
        // A line, not an offset: earlier rules may have changed lengths (never newlines) on this text.
        report(output.slice(0, m.index).split('\n').length, '<Stepper current={-1}> is removed in 12.0 and its steps are not a literal array of objects here: give each step status: "complete" and set current={steps.length - 1}');
        continue;
      }
      const arrayAt = steps.end - steps.value.length + steps.value.indexOf('[');
      items.forEach((it, i) => edits.push({ start: arrayAt + it.start, end: arrayAt + it.end, text: done[i] }));
      const valueAt = current.end - current.value.length;
      edits.push({ start: valueAt, end: current.end, text: `{${items.length - 1}}` });
    }
  }
  for (const e of edits.sort((a, b) => b.start - a.start)) output = output.slice(0, e.start) + e.text + output.slice(e.end);
  return output;
}

// ─── codemods (12.7, opt-in): the workarounds nexub-usage --apps finds most ───
// Each rewrites only the unambiguous case and reports the rest. Text edits never add or remove
// a newline (a new import goes on the line of the one it replaces), so lines stay stable.
export const CODEMODS = ['text-weight', 'text-truncate', 'button-full-width', 'admin-ui-wrappers'];
export const DEFAULT_WRAPPER_PACKAGE = '@nexub/admin-ui';
const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const lineAt = (text, at) => text.slice(0, at).split('\n').length;
const applyEdits = (text, edits) => {
  let out = text;
  for (const e of edits.sort((a, b) => b.start - a.start || b.end - a.end)) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
};

/** `"a b"`, `'a b'`, `{"a b"}`, `{`a b`}` (no `${}`) → { at: offset of the text in value, text }; else null. */
function staticString(value) {
  const m = /^(\{\s*)?(["'`])([\s\S]*)\2(\s*\})?$/.exec(value ?? '');
  if (!m || !m[1] !== !m[4] || (m[2] === '`' && !m[1])) return null;
  if (m[3].includes(m[2]) || m[3].includes('\\') || (m[2] === '`' && m[3].includes('${'))) return null;
  return { at: (m[1]?.length ?? 0) + 1, text: m[3] };
}

/** Remove one whitespace-separated token from a class string, with the spaces on one side (never a newline). */
function dropToken(text, token) {
  const m = new RegExp(`(^|\\s)${reEscape(token)}(?=\\s|$)`).exec(text);
  if (!m) return text;
  const start = m.index + m[1].length;
  const end = start + token.length;
  const before = /[ \t]+$/.exec(text.slice(0, start))?.[0].length ?? 0;
  const after = /^[ \t]+/.exec(text.slice(end))?.[0].length ?? 0;
  return after ? text.slice(0, start) + text.slice(end + after) : text.slice(0, start - before) + text.slice(end);
}

// Text's weight variant is font-normal/medium/semibold/bold (regular, not normal, for 400).
const TEXT_WEIGHTS = { 'font-normal': 'regular', 'font-medium': 'medium', 'font-semibold': 'semibold', 'font-bold': 'bold' };
const CLASS_PROPS = {
  'text-weight': {
    comp: 'Text', prop: 'weight',
    toProp: (t) => (TEXT_WEIGHTS[t] ? `weight="${TEXT_WEIGHTS[t]}"` : null),
    // Another weight in the same string: which one wins depends on order, so leave it.
    conflict: (t) => /^font-(thin|extralight|light|extrabold|black|\[.+\])$/.test(t),
  },
  'text-truncate': {
    comp: 'Text', prop: 'truncate',
    toProp: (t) => (t === 'truncate' ? 'truncate' : null),
    conflict: (t) => /^(whitespace-|overflow-(?!hidden$)|text-(clip|ellipsis)$|line-clamp-|text-wrap$)/.test(t),
  },
  'button-full-width': {
    comp: 'Button', prop: 'fullWidth',
    toProp: (t) => (t === 'w-full' ? 'fullWidth' : null),
    conflict: (t) => /^w-/.test(t),
  },
};

/** <Text className="font-medium x"> → <Text weight="medium" className="x">, and the like. */
function classToProp(src, rule, report) {
  const { comp, prop, toProp, conflict } = CLASS_PROPS[rule];
  const edits = [];
  for (const [local] of importedAs(src, '@nexub/react', [comp])) {
    for (const m of src.matchAll(new RegExp(`<${local}(?![\\w.$-])`, 'g'))) {
      const tag = readTag(src, m.index + m[0].length);
      const cls = tag?.attrs.find((a) => a.name === 'className');
      if (!cls?.value) continue;
      const say = (why) => report(lineAt(src, m.index), `<${local} className>: ${why}; move it to the ${prop} prop by hand`);
      const str = staticString(cls.value);
      if (!str) {
        const hit = (cls.value.match(/[\w:![\]./-]+/g) ?? []).find((t) => toProp(t));
        if (hit) say(`"${hit}" is in a dynamic className (an expression, cn(…) or a template with \${})`);
        continue;
      }
      const tokens = str.text.split(/\s+/).filter(Boolean);
      const hits = tokens.filter((t) => toProp(t));
      if (!hits.length) continue;
      const clash = tokens.filter((t) => !toProp(t) && conflict(t));
      if (hits.length > 1) { say(`more than one ${prop} class (${hits.join(' ')})`); continue; }
      if (tag.attrs.some((a) => a.name === prop)) { say(`it already has a ${prop} prop and "${hits[0]}"`); continue; }
      if (src.slice(m.index, tag.end).includes('{...')) { say(`"${hits[0]}" with a {...spread} that may pass ${prop}`); continue; }
      if (clash.length) { say(`"${hits[0]}" next to ${clash.join(' ')}, which the order decides between`); continue; }
      const rest = dropToken(str.text, hits[0]);
      const propText = ` ${toProp(hits[0])}`;
      if (!rest.trim()) {
        edits.push({ start: cls.start, end: cls.end, text: propText + keepLines(src.slice(cls.start, cls.end)) });
      } else {
        const at = cls.end - cls.value.length + str.at;
        edits.push({ start: at, end: at + str.text.length, text: rest });
        edits.push({ start: cls.start, end: cls.start, text: propText });
      }
    }
  }
  return applyEdits(src, edits);
}

// admin-ui wrappers that are thin wrappers of a DS component now (the 11.x "platform can delete" list).
// keep: props passed as they are; rename: wrapper prop → DS prop. Anything else is reported.
const WRAPPERS = {
  CheckboxField: {
    pkg: '@nexub/react', to: 'CheckboxField',
    keep: ['key', 'label', 'checked', 'disabled', 'error', 'id', 'title', 'aside'],
    rename: { hint: 'description', onChange: 'onCheckedChange' },
    // The DS calls back with boolean | 'indeterminate' (a click always gives a boolean): an inline
    // handler's parameter gets `: boolean` so it still type-checks.
    booleanHandler: true,
  },
  SwitchField: {
    pkg: '@nexub/react', to: 'SwitchField',
    keep: ['key', 'label', 'checked', 'disabled', 'loading', 'id', 'size', 'aria-label'],
    rename: { hint: 'description', onChange: 'onCheckedChange' },
  },
  Metric: {
    pkg: '@nexub/patterns', to: 'StatCard',
    keep: ['key', 'label', 'value', 'change', 'trend', 'note'],
    rename: {},
    // invert → tone="bad-when-high"; the wrapper adds h-full; onClick wraps it in a button (reported).
    metric: true,
  },
};
const REPORT_ONLY = {
  ComboboxField: 'it takes value: string and onChange(string) with options { hint }, the DS one value: string | null, onValueChange and options { description } (noneOption for allowNone): move it by hand',
  askText: 'askText() is a module function; usePrompt() is a hook that returns [prompt, element] and the element must be rendered: move it by hand',
};

/** Rewrite a handler for an API that passes boolean | 'indeterminate'. Null when it can't be done safely. */
function booleanHandler(value) {
  const inner = /^\{\s*([\s\S]*?)\s*\}$/.exec(value ?? '')?.[1];
  if (inner === undefined) return null;
  if (/^[\w$.]+(\([^()]*\))?$/.test(inner)) return value; // a name, a member, or f(…) returning a handler
  const m = /^(async\s+)?(?:\(\s*\)|\(\s*([\w$]+)\s*(:\s*boolean\s*)?\)|([\w$]+))\s*=>/.exec(inner);
  if (!m) return null;
  const name = m[2] ?? m[4];
  if (!name || m[3]) return value;
  const at = value.indexOf(inner);
  return `${value.slice(0, at)}${m[1] ?? ''}(${name}: boolean) =>${inner.slice(m[0].length)}${value.slice(at + inner.length)}`;
}

function adminUiWrappers(src, pkg, report) {
  const edits = [];
  const importRe = new RegExp(`\\bimport\\s+(type\\s+)?\\{([^}]*)\\}\\s*from\\s*(['"])${reEscape(pkg)}\\3[ \\t]*;?`, 'dg');
  const decls = [...src.matchAll(importRe)].filter((m) => !m[1]);
  if (!decls.length) return src;
  const allImports = [...src.matchAll(/\bimport\s+([\s\S]*?)\s+from\s*['"]([^'"]+)['"]/g)];
  const boundElsewhere = (local, except) =>
    allImports.some((m) => m.index !== except && new RegExp(`(?:^|[{,\\s])(?:\\w+\\s+as\\s+)?${reEscape(local)}(?=\\s*[,}]|\\s*$)`).test(m[1])) ||
    new RegExp(`\\b(?:function|const|let|var|class)\\s+${reEscape(local)}\\b`).test(src);
  const inImport = (at) => allImports.some((m) => m.index <= at && at < m.index + m[0].length);
  // Only to ignore a name in a comment; a tag is always handled. ponytail: '//' in a string counts.
  const comments = [...src.matchAll(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g)].map((m) => [m.index, m.index + m[0].length]);
  const inComment = (at) => comments.some(([a, b]) => a <= at && at < b);
  const added = { '@nexub/react': [], '@nexub/patterns': [] };
  const removed = new Map(); // decl index -> Set of specifier offsets removed

  for (const decl of decls) {
    const base = decl.indices[2][0];
    for (const s of decl[2].matchAll(/(type\s+)?\b(\w+)(?:\s+as\s+(\w+))?/dg)) {
      const [, isType, name, alias] = s;
      if (isType) continue;
      const local = alias ?? name;
      const uses = [...src.matchAll(new RegExp(`(?<![\\w.$])${reEscape(local)}(?![\\w$])`, 'g'))].filter((u) => !inImport(u.index));
      if (REPORT_ONLY[name]) {
        for (const u of uses) report(lineAt(src, u.index), `${name} (${pkg}): ${REPORT_ONLY[name]}`);
        continue;
      }
      const w = WRAPPERS[name];
      if (!w || !uses.length) continue;
      const tagLocal = alias ?? w.to;
      const fail = [];
      const mine = [];
      // The DS name must be free in this file (or already be the same DS import).
      if (tagLocal !== local && importedAs(src, w.pkg, [w.to]).get(tagLocal) !== w.to && boundElsewhere(tagLocal, decl.index))
        fail.push([uses[0].index, `${w.to} is already a name in this file`]);
      for (const u of uses) {
        const open = src[u.index - 1] === '<';
        const close = src.slice(u.index - 2, u.index) === '</';
        if (close) { if (tagLocal !== local) mine.push({ start: u.index, end: u.index + local.length, text: tagLocal }); continue; }
        if (!open) { if (!inComment(u.index)) fail.push([u.index, `${local} is used outside JSX`]); continue; }
        const tag = readTag(src, u.index + local.length);
        if (!tag) { fail.push([u.index, 'could not parse the tag']); continue; }
        if (src.slice(u.index, tag.end).includes('{...')) { fail.push([u.index, 'a {...spread} may pass props the DS component names differently']); continue; }
        if (tagLocal !== local) mine.push({ start: u.index, end: u.index + local.length, text: tagLocal });
        let hasClass = false;
        for (const a of tag.attrs) {
          const nameAt = src.indexOf(a.name, a.start);
          if (w.keep.includes(a.name)) continue;
          if (w.metric && a.name === 'invert') {
            const v = a.value === null ? '{true}' : a.value.replace(/\s+/g, '');
            const expr = /^\{([\s\S]+)\}$/.exec(a.value ?? '')?.[1]?.trim();
            const text = v === '{true}' ? 'tone="bad-when-high"' : v === '{false}' ? null : expr ? `tone={${expr} ? 'bad-when-high' : 'default'}` : undefined;
            if (text === undefined) { fail.push([u.index, `invert=${a.value}`]); continue; }
            mine.push(text === null
              ? { start: a.start, end: a.end, text: keepLines(src.slice(a.start, a.end)) }
              : { start: nameAt, end: a.end, text });
            continue;
          }
          if (w.metric && a.name === 'className') {
            hasClass = true;
            const str = staticString(a.value);
            if (!str) { fail.push([u.index, 'className={…}: Metric adds h-full to it; merge by hand']); continue; }
            if (!str.text.split(/\s+/).includes('h-full')) {
              const at = a.end - a.value.length + str.at;
              mine.push({ start: at, end: at, text: str.text.trim() ? 'h-full ' : 'h-full' });
            }
            continue;
          }
          if (w.rename[a.name]) {
            let value = a.value;
            if (w.booleanHandler && a.name === 'onChange') {
              value = booleanHandler(a.value);
              if (value === null) { fail.push([u.index, 'onChange: a handler this codemod can not retype (use (v: boolean) => …)']); continue; }
            }
            mine.push({ start: nameAt, end: a.end, text: `${w.rename[a.name]}${a.value === null ? '' : src.slice(nameAt + a.name.length, a.end - a.value.length)}${value ?? ''}` });
            continue;
          }
          fail.push([u.index, a.name === 'onClick' && w.metric ? 'onClick: Metric wraps the tile in a button; StatCard has no onClick, so wrap it yourself' : `${a.name}: no 1:1 prop on ${w.to}`]);
        }
        if (w.metric && !hasClass) mine.push({ start: u.index + local.length, end: u.index + local.length, text: ' className="h-full"' });
      }
      if (fail.length) {
        for (const [at, why] of fail) report(lineAt(src, at), `<${local}> (${pkg}) → ${w.to} (${w.pkg}): ${why}; left as it is`);
        continue;
      }
      edits.push(...mine);
      if (!removed.has(decl.index)) removed.set(decl.index, []);
      removed.get(decl.index).push({ start: base + s.index, end: base + s.index + s[0].length });
      const spec = alias ? `${w.to} as ${alias}` : w.to;
      if (importedAs(src, w.pkg, [w.to]).get(tagLocal) !== w.to && !added[w.pkg].includes(spec)) added[w.pkg].push(spec);
    }
  }
  if (!removed.size) return applyEdits(src, edits);

  // Imports: drop the moved names from the wrapper import; add them to an existing DS import, or
  // put a new one on the same line (the wrapper import itself, when nothing is left in it).
  const pending = { ...added };
  for (const target of Object.keys(pending)) {
    if (!pending[target].length) continue;
    const existing = new RegExp(`\\bimport\\s+\\{([^}]*)\\}\\s*from\\s*(['"])${reEscape(target)}\\2`, 'd').exec(src);
    if (!existing) continue;
    const inner = existing[1];
    const body = inner.trimEnd();
    const at = existing.indices[1][0] + body.length;
    edits.push({ start: at, end: at, text: body.endsWith(',') ? ` ${pending[target].join(', ')},` : `${body.trim() ? ', ' : ' '}${pending[target].join(', ')}${body.trim() ? '' : ' '}` });
    pending[target] = [];
  }
  let placed = false;
  for (const decl of decls) {
    const gone = removed.get(decl.index);
    if (!gone) continue;
    const q = decl[3];
    const fresh = placed ? [] : Object.entries(pending).filter(([, specs]) => specs.length).map(([t, specs]) => `import { ${specs.join(', ')} } from ${q}${t}${q};`);
    placed = true;
    const base = decl.indices[2][0];
    const left = applyEdits(decl[2], gone.map((g) => ({ start: g.start - base, end: g.end - base, text: '' })));
    if (!left.replace(/[\s,]/g, '')) {
      edits.push({ start: decl.index, end: decl.index + decl[0].length, text: fresh.join(' ') + keepLines(decl[0]) });
      continue;
    }
    let floor = base;
    for (const g of gone.sort((a, b) => a.start - b.start)) {
      // Take the comma after the name (or the one before, for the last name) with it.
      const after = /^\s*,[ \t]*/.exec(src.slice(g.end));
      const before = /,\s*$/.exec(src.slice(floor, g.start));
      const e = after ? { start: g.start, end: g.end + after[0].length } : before ? { start: floor + before.index, end: g.end } : g;
      edits.push({ ...e, text: keepLines(src.slice(e.start, e.end)) });
      floor = e.end;
    }
    if (fresh.length) edits.push({ start: decl.index + decl[0].length, end: decl.index + decl[0].length, text: ` ${fresh.join(' ')}` });
  }
  return applyEdits(src, edits);
}

// ─── per-file migration ──────────────────────────────────────────────────────
/**
 * Migrate one file's text. Returns { output, manual: [{ line, rule, message }] }.
 * opts: { ext, rules: Set, fix: boolean, aliasMap: { aliases, mix }, wrapperPackage: string }
 */
export function migrateSource(src, { ext, rules = new Set(DEFAULT_RULES), fix = false, aliasMap = SNAPSHOT, wrapperPackage = DEFAULT_WRAPPER_PACKAGE }) {
  const items = [];
  let text = src;
  if (['logical-classes', 'tw-animate', 'opacity-modifier', 'legacy-tokens'].some((r) => rules.has(r))) {
    let out = '';
    let last = 0;
    for (const seg of classSegments(src, ext)) {
      out += src.slice(last, seg.start) + rewriteClassText(src.slice(seg.start, seg.end), seg, seg.start, rules, fix,
        (at, rule, message) => items.push({ at, rule, message }), aliasMap);
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
  if (rules.has('button-aliases') && COMPONENT_EXTS.has(ext) && /@nexub\/react['"/]/.test(text)) {
    const r = buttonAliases(text);
    text = r.output;
    items.push(...r.items);
  }
  if (rules.has('keep-5-defaults') && COMPONENT_EXTS.has(ext) && /@nexub\/react['"/]/.test(text)) {
    const r = pinDefaults(text);
    text = r.output;
    items.push(...r.items);
  }
  if (rules.has('tailwind-3-preset')) {
    // Report only: moving a tailwind.config preset to CSS-first Tailwind 4 is a config change, not a rewrite.
    for (const m of src.matchAll(/['"]@nexub\/tokens\/tailwind['"]/g))
      items.push({ at: m.index, rule: 'tailwind-3-preset', message: '@nexub/tokens/tailwind (the Tailwind 3 preset) is removed in 4.0: move to Tailwind 4 and @import "@nexub/tokens/tailwind.css" in your CSS' });
  }
  if (rules.has('removed-in-7') && COMPONENT_EXTS.has(ext)) {
    // Report only: both need a human choice (Stepper's import and props, or a Combobox layout).
    if (/@nexub\/patterns['"]/.test(src))
      for (const m of src.matchAll(/<StepIndicator\b/g))
        items.push({ at: m.index, rule: 'removed-in-7', message: 'StepIndicator (@nexub/patterns) is removed in 7.0: use <Stepper orientation="vertical" current={…}> from @nexub/react (currentStep -> current)' });
    if (/@nexub\/react['"/]/.test(src))
      for (const m of src.matchAll(/<Autocomplete\b[^>]*\bmode=/g))
        items.push({ at: m.index, rule: 'removed-in-7', message: 'Autocomplete `mode` is removed in 7.0 (the popover is the only layout): remove it; for an always-open list use the Combobox parts' });
  }
  if (rules.has('changes-in-8')) changesIn8(src, ext, (at, message) => items.push({ at, rule: 'changes-in-8', message }));
  if (rules.has('changes-in-9') && (COMPONENT_EXTS.has(ext) || ext === '.css' || ext === '.html'))
    text = changesIn9(text, (at, message) => items.push({ at, rule: 'changes-in-9', message }));
  if (rules.has('changes-in-11') && (COMPONENT_EXTS.has(ext) || ext === '.css' || ext === '.scss' || ext === '.html'))
    text = changesIn11(text, ext, (at, message) => items.push({ at, rule: 'changes-in-11', message }));
  if (rules.has('deprecated-in-11') && COMPONENT_EXTS.has(ext) && /@nexub\/react['"/]/.test(src))
    deprecatedIn11(src, (at, message) => items.push({ at, rule: 'deprecated-in-11', message }));
  if (rules.has('changes-in-12') && (COMPONENT_EXTS.has(ext) || ext === '.css' || ext === '.scss' || ext === '.html'))
    text = changesIn12(text, ext, (line, message) => items.push({ line, rule: 'changes-in-12', message }));
  if (COMPONENT_EXTS.has(ext)) {
    for (const rule of ['text-weight', 'text-truncate', 'button-full-width']) {
      if (rules.has(rule) && /@nexub\/react['"/]/.test(text)) text = classToProp(text, rule, (line, message) => items.push({ line, rule, message }));
    }
    if (rules.has('admin-ui-wrappers') && text.includes(wrapperPackage))
      text = adminUiWrappers(text, wrapperPackage, (line, message) => items.push({ line, rule: 'admin-ui-wrappers', message }));
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
  --rules <a,b>      run only these rules (default: all except the opt-in ones)
  --codemod <a,b>    run only these codemods (or all); they are opt-in rules, see Codemods
  --dry              dry run (the default): print the diff, write nothing
  --wrapper-package <name>
                     the app's wrapper package for admin-ui-wrappers (default @nexub/admin-ui)
  --ignore <glob>    skip paths matching glob (repeatable; supports * and **)
  -h, --help         show this help

Rules:
  legacy-tokens      var(--color-text-primary) -> var(--color-on-surface), brand -500 -> role;
                     Tailwind utilities too (bg-bg-default -> bg-surface, text-text-primary
                     -> text-on-surface); color-mix aliases (--color-semantic-success-border) reported
  logical-classes    ml/mr, pl/pr, border-l/r, rounded-l/r/tl/tr/bl/br, text-left/right
                     -> ms/me, ps/pe, border-s/e, rounded-s/e/ss/se/es/ee, text-start/end;
                     left-/right- positions reported
  tw-animate         report tailwindcss-animate enter/exit classes (use nx-motion/nx-pop/nx-dialog)
  opacity-modifier   report [var(--x)]/NN (emits nothing in Tailwind 3); --fix rewrites to color-mix
  deprecated-components
                     @nexub/react components removed in 3.0: Banner, Callout -> Alert;
                     Tag -> <Badge variant="soft">; StatusPill label -> Badge children
                     (dot and non-JSX uses reported); *Props types renamed
  tailwind-3-preset  report the Tailwind 3 preset (@nexub/tokens/tailwind), removed in 4.0;
                     use Tailwind 4 with @import "@nexub/tokens/tailwind.css"
  keep-5-defaults    opt-in: keep 5.x behaviour by pinning the defaults 6.0 changed:
                     <DataTable enableRowSelection> gets selectionColumn={false}
                     (Autocomplete's inline layout is gone in 7.0, so it is not pinned)
  removed-in-7       report what 7.0 removes: <StepIndicator> (use Stepper) and
                     Autocomplete's mode prop
  changes-in-8       report what 8.0 removes and flips: legacy --duration-*/--ease-* tokens,
                     the Motion easing prop, the default scrollLock (becomes "class"),
                     non-strict safeHref and custom-scheme links, and the Signature look
  button-aliases     Button's legacy variants (deprecated 8.4, removed 9.0): primary -> filled,
                     secondary -> tonal, outline -> outlined, ghost -> text (JSX literals and
                     buttonVariants({ variant })); variant={expressions} reported
  changes-in-9       what 9.0 removes: renames DatePicker/DateTimePicker/NumberInput onChange ->
                     onValueChange (@nexub/react); Dialog/BottomSheet dismissable -> dismissible,
                     DateTimeField minimumDate/maximumDate -> minDate/maxDate, ButtonGroup
                     direction row/stack -> orientation horizontal/vertical (@nexub/react-native);
                     reports the classic style and the hidePassword message
  changes-in-11      what 11.0 removed and flipped: rewrites @nexub/themes/{leap,bookub,payub,founderub}
                     (import and CSS @import) to @nexub/themes/products; reports every overlay
                     without a sheet prop (the default became "auto": a bottom sheet below
                     768px; sheet={false} keeps the popover)
  deprecated-in-11   report what an 11.x minor deprecated (removed in 12.0): <Stepper current={-1}>
                     (11.4: give steps a status instead)
  changes-in-12      opt-in: what 12.0 removes and flips: rewrites @nexub/react/styles.nexub-layer.css
                     (the 11.9 opt-in) back to @nexub/react/styles.css, which is that file in 12.0;
                     rewrites <Stepper current={-1}> with a literal steps array to current={n-1}
                     and status: "complete" on each step; reports the other current={-1} uses

Codemods (12.7, opt-in: --codemod <ids> or --rules <ids>), for the workarounds nexub-usage --apps
finds most. Each rewrites only the unambiguous case and reports the rest:
  text-weight        <Text className="font-medium …"> -> <Text weight="medium" className="…">
                     (font-normal -> regular, medium, semibold, bold)
  text-truncate      <Text className="truncate …"> -> <Text truncate className="…">
  button-full-width  <Button className="w-full …"> -> <Button fullWidth className="…">
                     These three take only the bare class from a static className (@nexub/react
                     Text/Button). Reported: a dynamic className (cn(…), \${…}), two such classes,
                     a class the order decides against (w-32, font-light, whitespace-normal …),
                     the prop already set, a {...spread}
  admin-ui-wrappers  wrapper package -> DS: CheckboxField and SwitchField (@nexub/react; hint ->
                     description, onChange -> onCheckedChange), Metric -> StatCard (@nexub/patterns;
                     invert -> tone="bad-when-high", keeps the wrapper's h-full). Reported: a prop
                     with no 1:1 match (Metric onClick …), a {...spread}, a use outside JSX;
                     ComboboxField and askText (-> usePrompt) are report-only

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
        codemod: { type: 'string' }, dry: { type: 'boolean' }, 'wrapper-package': { type: 'string' },
      },
    });
  } catch (e) {
    stderr(`${e.message}\n\n${USAGE}\n`);
    return 2;
  }
  const { values: o, positionals } = args;
  if (o.help) { stdout(`${USAGE}\n`); return 0; }
  if (o.dry && o.write) { stderr('--dry and --write together: pick one\n'); return 2; }
  const list = (s) => s.split(',').map((r) => r.trim()).filter(Boolean);
  const codemods = o.codemod ? list(o.codemod).flatMap((c) => (c === 'all' ? CODEMODS : [c])) : [];
  const badMod = codemods.filter((c) => !CODEMODS.includes(c));
  if (badMod.length) { stderr(`Unknown codemod(s): ${badMod.join(', ')}. Known: ${CODEMODS.join(', ')}, all\n`); return 2; }
  // --codemod alone runs only those codemods; with --rules, both.
  const rules = new Set([...(o.rules ? list(o.rules) : codemods.length ? [] : DEFAULT_RULES), ...codemods]);
  const unknown = [...rules].filter((r) => !RULES.includes(r));
  if (unknown.length) { stderr(`Unknown rule(s): ${unknown.join(', ')}. Known: ${RULES.join(', ')}\n`); return 2; }
  const wrapperPackage = o['wrapper-package'] ?? DEFAULT_WRAPPER_PACKAGE;

  const results = [];
  for (const abs of collectFiles(positionals.length ? positionals : ['src'], { cwd, ignore: o.ignore ?? [] })) {
    const src = readFileSync(abs, 'utf8');
    const { output, manual } = migrateSource(src, { ext: path.extname(abs), rules, fix: !!o.fix, wrapperPackage });
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
    stdout(`${JSON.stringify({ written: !!o.write, aliasSource: 'snapshot', results, totals }, null, 2)}\n`);
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

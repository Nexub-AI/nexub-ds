// 8.4: every TSX/TS code sample in the docs (the `code` strings shown in CodeFrames,
// registry entries and native twins) typechecks against the real packages.
// Samples are often fragments with placeholder names (`onPress={send}`), so unknown
// names are allowed; what fails is API drift: a wrong import, prop, or type.
//   node scripts/check-samples.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const docs = fileURLToPath(new URL('..', import.meta.url));
const src = join(docs, 'src');
const CODE_LANGS = new Set(['tsx', 'ts', 'jsx', 'js']);
// Fragments use placeholder names and untyped callbacks; those aren't API drift.
const IGNORE = new Set([
  2304, 2552, 2580, 2582, // cannot find name (placeholders)
  7006, 7031, 7034, 7005, // implicit any
  6133, 6192, 6196, // unused
  1208, // isolatedModules
  2875, // JSX tag requires 'react/jsx-runtime' (fragments)
  18004, // shorthand property with no value in scope (placeholder)
  2774, // placeholder named like a DOM global (`open`) reads as a function
]);

// CSS and asset subpaths (`@nexub/themes/glass`) have no types: they only need to be exported.
const exported = (spec) => {
  const [, pkg, sub] = /^@nexub\/([\w-]+)(?:\/(.+))?$/.exec(spec) ?? [];
  if (!pkg) return false;
  let exports;
  try { exports = JSON.parse(readFileSync(join(docs, `../../packages/${pkg}/package.json`), 'utf8')).exports ?? {}; } catch { return false; }
  const key = sub ? `./${sub}` : '.';
  return key in exports || Object.keys(exports).some((k) => k.endsWith('/*') && key.startsWith(k.slice(0, -1)));
};

// ─── collect samples ─────────────────────────────────────────────────────────
const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) { if (e !== 'examples') walk(p); } // examples/ are real .tsx, typechecked already
    else if (/\.tsx?$/.test(e) && !e.includes('.test.')) files.push(p);
  }
})(src);

const samples = [];
for (const f of files) {
  const sf = ts.createSourceFile(f, readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true, f.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  sf.forEachChild(function visit(n) {
    let init, owner;
    if (ts.isJsxAttribute(n) && n.name.getText(sf) === 'code' && n.initializer && ts.isJsxExpression(n.initializer)) [init, owner] = [n.initializer.expression, n.parent];
    else if (ts.isPropertyAssignment(n) && n.name.getText(sf) === 'code') [init, owner] = [n.initializer, n.parent];
    if (init && (ts.isNoSubstitutionTemplateLiteral(init) || ts.isStringLiteral(init))) {
      const lang = /\blang(?:uage)?\s*[=:]\s*\{?\s*["'`](\w+)/.exec(owner.getText(sf))?.[1] ?? 'tsx'; // CodeFrame's default
      if (CODE_LANGS.has(lang)) samples.push({ file: relative(docs, f), line: sf.getLineAndCharacterOfPosition(init.getStart(sf)).line + 1, text: init.text });
    }
    ts.forEachChild(n, visit);
  });
}

// ─── make each sample a module ───────────────────────────────────────────────
// As written if it parses; otherwise its non-import lines go inside a JSX fragment.
const parses = (text) => ts.createSourceFile('x.tsx', text, ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX).parseDiagnostics.length === 0;
function moduleFor(text) {
  if (parses(text)) return `${text}\nexport {};\n`;
  const lines = text.split('\n');
  let i = 0;
  while (i < lines.length && /^\s*(import\b|'use client'|"use client"|\/\/|$)/.test(lines[i])) i++;
  const head = lines.slice(0, i).join('\n');
  const wrapped = `${head}\nconst __sample = (<>\n${lines.slice(i).join('\n')}\n</>);\nexport {};\n`;
  if (parses(wrapped)) return wrapped;
  // Code and markup mixed: each blank-line-separated chunk that starts with `<` is a fragment.
  const chunks = lines.slice(i).join('\n').split(/\n\s*\n/).map((c) => (/^\s*</.test(c) ? `void (<>\n${c}\n</>);` : c));
  const mixed = `${head}\n${chunks.join('\n\n')}\nexport {};\n`;
  return parses(mixed) ? mixed : null;
}

const virtual = new Map();
const unparseable = [];
samples.forEach((s, i) => {
  const text = moduleFor(s.text);
  if (text === null) unparseable.push(`${s.file}:${s.line}`);
  else virtual.set(join(docs, `.samples/s${i}.tsx`), { ...s, text });
});

// ─── typecheck against the workspace packages ────────────────────────────────
const cfg = ts.getParsedCommandLineOfConfigFile(join(docs, 'tsconfig.json'), {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} });
const options = {
  ...cfg.options, rootDir: join(docs, '../..'), noEmit: true, incremental: false, jsx: ts.JsxEmit.ReactJSX, noUnusedLocals: false, noUnusedParameters: false, plugins: [],
  paths: {
    ...cfg.options.paths,
    // Not a docs dependency; native twins' samples resolve to the package source.
    '@nexub/react-native': ['../../packages/react-native/src/index.ts'],
    '@nexub/react-native/patterns': ['../../packages/react-native/src/patterns/index.ts'],
  },
};
const host = ts.createCompilerHost(options);
const { getSourceFile, fileExists, readFile } = host;
host.fileExists = (f) => virtual.has(f) || fileExists(f);
host.readFile = (f) => virtual.get(f)?.text ?? readFile(f);
host.getSourceFile = (f, lang, ...rest) => (virtual.has(f) ? ts.createSourceFile(f, virtual.get(f).text, lang, true, ts.ScriptKind.TSX) : getSourceFile(f, lang, ...rest));
const program = ts.createProgram([...virtual.keys()], options, host);

// A placeholder named like a DOM global (`open`, `screen`, `status`) resolves to window.*;
// errors that involve one are about the placeholder, not the API.
const checker = program.getTypeChecker();
const fromDom = (id) => !!checker.getSymbolAtLocation(id)?.declarations?.some((x) => /lib\.dom/.test(x.getSourceFile().fileName));
function touchesDomGlobal(sf, d) {
  // Deepest node holding the error, then its parent: `onPress={open}` for an error on
  // `onPress`, `screen.getByRole` for one on `getByRole`.
  let node = sf;
  for (let next = sf; next; ) {
    node = next;
    next = node.getChildren(sf).find((c) => c.getStart(sf) <= d.start && d.start + d.length <= c.getEnd());
  }
  const scope = node.parent ?? node;
  let hit = false;
  (function visit(n) {
    if (ts.isIdentifier(n) && fromDom(n)) hit = true;
    n.forEachChild(visit);
  })(scope);
  return hit;
}

const errors = [];
for (const [path, s] of virtual) {
  for (const d of [...program.getSyntacticDiagnostics(program.getSourceFile(path)), ...program.getSemanticDiagnostics(program.getSourceFile(path))]) {
    if (IGNORE.has(d.code)) continue;
    if (d.start !== undefined && touchesDomGlobal(program.getSourceFile(path), d)) continue;
    const msg = ts.flattenDiagnosticMessageText(d.messageText, ' ');
    // Only @nexub modules must resolve; samples also show next/link, app aliases, etc.
    const spec = /'([^']+)'/.exec(msg)?.[1] ?? '';
    if ((d.code === 2307 || d.code === 2882) && (!spec.startsWith('@nexub/') || (exported(spec) && !/\.(tsx?|jsx?)$/.test(spec) && d.code === 2882) || /\.(css|svg|png|json)$/.test(spec) && exported(spec))) continue;
    errors.push(`${s.file}:${s.line} TS${d.code}: ${msg}`);
  }
}

console.log(`docs samples: ${virtual.size} typechecked, ${unparseable.length} unparseable, ${errors.length} errors`);
for (const u of unparseable) console.error(`  unparseable (fix the snippet or give it a lang): ${u}`);
for (const e of errors) console.error(`  ${e}`);
process.exit(errors.length || unparseable.length ? 1 : 0);

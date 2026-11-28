// build-dist (12.7): writes the published copy of the theme files to dist/, without comments.
//
// src/ stays the source and keeps every comment (it is published too, for reading). dist/ is
// what the package exports resolve to: the same files with the comments taken out and the blank
// lines they leave dropped. Nothing else changes: no rule, selector, value or order, and every
// non-CSS file (fonts, parts/index.json) is copied as is, so relative url()s and @imports still
// resolve. The test checks that each dist file parses to exactly the same stylesheet as its
// source.

import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

/**
 * Removes CSS comments outside strings and url()s. Keeps `/*!` comments (licence notes).
 * Trailing whitespace and the empty lines left behind are dropped.
 */
export function stripComments(css) {
  let out = '';
  let i = 0;
  while (i < css.length) {
    const ch = css[i];
    if (ch === '"' || ch === "'") {
      // A string: copy up to the closing quote, honouring backslash escapes.
      let j = i + 1;
      while (j < css.length && css[j] !== ch) j += css[j] === '\\' ? 2 : 1;
      out += css.slice(i, j + 1);
      i = j + 1;
    } else if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      if (end === -1) throw new Error('unterminated comment');
      if (css[i + 2] === '!') out += css.slice(i, end + 2);
      i = end + 2;
    } else if (css.slice(i, i + 4).toLowerCase() === 'url(' && !/[\w-]/.test(css[i - 1] ?? '')) {
      // An unquoted url() may hold "/*"; copy it whole. Quoted ones are handled as strings.
      const end = css.indexOf(')', i);
      const inner = css.slice(i + 4, end).trimStart();
      if (inner.startsWith('"') || inner.startsWith("'")) {
        out += css.slice(i, i + 4);
        i += 4;
      } else {
        out += css.slice(i, end + 1);
        i = end + 1;
      }
    } else {
      out += ch;
      i += 1;
    }
  }
  return `${out
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line !== '')
    .join('\n')}\n`;
}

/** Every file under dir, as paths relative to it, sorted. */
export function filesUnder(dir) {
  const out = [];
  const walk = (d) => {
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else out.push(relative(dir, p));
    }
  };
  walk(dir);
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  rmSync(DIST, { recursive: true, force: true });
  for (const file of filesUnder(SRC)) {
    const from = join(SRC, file);
    const to = join(DIST, file);
    mkdirSync(dirname(to), { recursive: true });
    if (file.endsWith('.css')) writeFileSync(to, stripComments(readFileSync(from, 'utf8')));
    else cpSync(from, to);
  }
}

// nexub.design follows the rules it documents (skills/nexub-ds/SKILL.md §2.4, §3.4):
// no hardcoded colours, no arbitrary px, no Tailwind palette colours, motion on
// the spring tokens. Hex inside .tsx is not checked: pages quote hex as content
// (seed colours, contrast tables). Each allowed exception says why.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../src/', import.meta.url));
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const files = walk(src).map((p) => ({ rel: relative(src, p).split('\\').join('/'), text: readFileSync(p, 'utf8') }));
const tsx = files.filter((f) => /\.tsx?$/.test(f.rel));
const css = files.filter((f) => f.rel.endsWith('.css')).map((f) => ({ ...f, text: f.text.replace(/\/\*[\s\S]*?\*\//g, '') }));

function hits(set: typeof files, re: RegExp, allow: Record<string, string> = {}) {
  return set.flatMap(({ rel, text }) =>
    [...text.matchAll(re)].map((m) => `${rel}: ${m[0]}`).filter((h) => !Object.keys(allow).some((a) => h.startsWith(a))),
  );
}

test('no arbitrary px classes (use the 4px spacing scale or a token)', () => {
  assert.deepEqual(hits(tsx, /(?<![\w-])-?[a-z-]+-\[-?\d+(\.\d+)?px\]/g, {
    'components/feedback/FeedbackDialog.tsx: -start-[9999px]': 'off-screen honeypot field',
  }), []);
});

test('no [var(--color-…)] classes (every colour role has a utility)', () => {
  assert.deepEqual(hits(tsx, /[a-z-]+-\[(color:)?var\(--color-[a-z0-9-]+\)\]/g), []);
});

test('no Tailwind palette colours', () => {
  const palette = /\b(bg|text|border|ring|fill|stroke|from|to|via)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(-\d{2,3})?\b/g;
  assert.deepEqual(hits(tsx, palette, {
    'components/platform/PhoneFrame.tsx: bg-black': 'device camera cutout is black on every theme',
  }), []);
});

test('docs CSS uses colour tokens, not hex or rgb', () => {
  assert.deepEqual(hits(css, /#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?)\(/g), []);
});

test('docs CSS motion uses the spring tokens, not raw durations', () => {
  // Delays (stagger offsets) are fine; transition/animation durations are not.
  const raw = /(animation|transition)(-duration)?:[^;]*?\b\d*\.?\d+m?s\b/g;
  assert.deepEqual(hits(css, raw, {
    'styles/globals.css: animation: ring-orbit': 'ambient logo orbit loop; no spring equivalent, stopped under reduced motion',
  }), []);
});

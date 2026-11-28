// 12.7: dist/ is src/ without comments, and nothing else. Each published file must parse to the
// same stylesheet as its source, so an app gets the same rules in the same order.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from 'lightningcss';
import { filesUnder, stripComments } from './build-dist.mjs';

const src = new URL('../src/', import.meta.url);
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const parse = (file, code) =>
  transform({ filename: file, code: Buffer.from(code), minify: true }).code.toString();

test('comments go; strings, url()s and licence notes stay', () => {
  const css = [
    '/* a note */',
    ".a { content: '/* not a comment */'; } /* trailing */",
    '.b { background: url(data:image/svg+xml,/*x*/); }',
    '.c { background: url("/*y*/"); }',
    '/*! licence */',
    '',
    '.d { color: red; }  ',
  ].join('\n');
  assert.equal(
    stripComments(css),
    [
      ".a { content: '/* not a comment */'; }",
      '.b { background: url(data:image/svg+xml,/*x*/); }',
      '.c { background: url("/*y*/"); }',
      '/*! licence */',
      '.d { color: red; }',
      '',
    ].join('\n'),
  );
});

for (const file of filesUnder(src.pathname).filter((f) => f.endsWith('.css'))) {
  test(`${file}: the dist copy parses to the same stylesheet, without comments`, () => {
    const source = readFileSync(new URL(file, src), 'utf8');
    const built = stripComments(source);
    assert.equal(parse(file, built), parse(file, source));
    assert.doesNotMatch(built, /\/\*(?!!)/);
  });
}

test('every export resolves into dist/', () => {
  for (const [key, target] of Object.entries(pkg.exports)) assert.match(target, /^\.\/dist\//, key);
});

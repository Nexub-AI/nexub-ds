// 9.1: the shipped CSS works as written in every browser this package's
// `browserslist` names. lightningcss compiles each file for those targets; any vendor
// prefix or light-dark() fallback it has to add (a token the source lacks) means some
// supported browser would miss that rule, so the source must carry it itself.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import browserslist from 'browserslist';
import { browserslistToTargets, transform } from 'lightningcss';

const query = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).browserslist;
const targets = browserslistToTargets(browserslist(query));
const src = new URL('../src/', import.meta.url);
const tokens = (css) => new Set(css.match(/-(?:webkit|moz)-[a-z-]+|--lightningcss-(?:light|dark)/g));

test('the support matrix covers four engines and iOS Safari', () => {
  const names = new Set(browserslist(query).map((b) => b.split(' ')[0]));
  assert.deepEqual([...names].sort(), ['chrome', 'edge', 'firefox', 'ios_saf', 'safari']);
});

for (const file of readdirSync(src).filter((f) => f.endsWith('.css'))) {
  test(`${file} needs nothing added for the supported browsers`, () => {
    const code = readFileSync(new URL(file, src));
    const plain = tokens(code.toString());
    const built = tokens(transform({ filename: file, code, minify: true, targets }).code.toString());
    assert.deepEqual([...built].filter((t) => !plain.has(t)), []);
  });
}

// The docs site is built from the page kit (src/components/kit) and @nexub/react
// with Tailwind classes on the Nexub preset. Inline `style={…}` is only for
// values that are genuinely dynamic: computed from data or state (swatch
// colours, chart heights, preview widths, pointer position), CSS custom
// properties passed per element, or third-party/runtime-only cases.
//
// Every file that still has one is listed with its budget and the reason. A new
// file with inline styles, or a file going over budget, fails: use classes, or
// add the file here with a reason a reviewer agrees is dynamic.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../src/', import.meta.url));

const budget: Record<string, [max: number, reason: string]> = {
  'app/(docs)/foundations/colors/page.tsx': [6, 'swatch and ramp colours come from the role/palette name'],
  'app/(docs)/foundations/spacing/page.tsx': [1, 'bar width is the spacing step'],
  'components/docs/Playground.tsx': [1, 'preview width follows the toolbar'],
  'components/docs/ComponentLivePreview.tsx': [1, 'chart bar heights from data'],
  'components/docs/BrandSwitcher.tsx': [1, 'swatch colour per brand (custom property)'],
  'components/feedback/Annotator.tsx': [1, 'canvas size follows the captured image'],
  'components/landing/LandingHero.tsx': [4, 'cursor spotlight position; per-orb drift custom properties'],
  'components/kit/index.tsx': [3, 'grid min width prop; Do/Don’t accent per tone'],
  'components/platform/PhoneFrame.tsx': [8, 'device size × scale; status bar and cutout geometry per device'],
  'components/platform/BrowserFrame.tsx': [2, 'viewport width × scale to fit the column'],
  // Not yet converted (component/pattern pages, examples, motion, react-native,
  // app shell files). Reduce these as those pages move onto the kit.
  'app/(docs)/foundations/motion/MotionDemo.tsx': [5, 'pending conversion (spring demo positions are dynamic)'],
  'app/(docs)/foundations/motion/page.tsx': [1, 'pending conversion'],
  'components/docs/ColorSwatch.tsx': [3, 'swatch colour from props; pending conversion of the rest'],
  'components/docs/ComponentPreview.tsx': [8, 'preview width/background follow the toolbar; pending conversion'],
};

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : path.endsWith('.tsx') ? [path] : [];
  });
}

test('inline styles stay within the per-file budget', () => {
  const over: string[] = [];
  for (const file of walk(src)) {
    const rel = relative(src, file).split('\\').join('/');
    const count = (readFileSync(file, 'utf8').match(/\bstyle=\{/g) ?? []).length;
    const max = budget[rel]?.[0] ?? 0;
    if (count > max) over.push(`${rel}: ${count} inline style(s), budget ${max}`);
  }
  assert.deepEqual(over, [], 'Use Tailwind classes on the Nexub preset, or justify the file in the budget:\n' + over.join('\n'));
});

test('the budget lists no files that no longer exist or need it', () => {
  const stale = Object.keys(budget).filter((rel) => {
    try {
      return !/\bstyle=\{/.test(readFileSync(join(src, rel), 'utf8'));
    } catch {
      return true;
    }
  });
  assert.deepEqual(stale, [], 'Remove these from the budget:\n' + stale.join('\n'));
});

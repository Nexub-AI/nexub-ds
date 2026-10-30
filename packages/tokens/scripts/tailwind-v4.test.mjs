// Tailwind v4 compiles dist/tailwind/theme.css into the same var(--…) utilities the v3 preset gives.
// Run after `pnpm build` (reads dist/).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from 'tailwindcss';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const v4Dir = dirname(require.resolve('tailwindcss/package.json'));
const themePath = join(root, 'dist/tailwind/theme.css');

// utility → declarations it must contain
const EXPECT = {
  'bg-primary': ['background-color: var(--color-primary)'],
  'text-on-surface': ['color: var(--color-on-surface)'],
  'bg-surface-container-high': ['background-color: var(--color-surface-container-high)'],
  'bg-palette-primary-40': ['background-color: var(--color-palette-primary-40)'],
  'bg-chart-3': ['background-color: var(--color-chart-3)'],
  'rounded-shape-container': ['border-radius: var(--shape-container)'],
  'rounded-md': ['border-radius: var(--radius-md)'],
  'shadow-elevation-2': ['var(--elevation-2)'],
  'text-body-md': [
    'font-size: var(--type-body-md-size)',
    'line-height: var(--tw-leading, var(--type-body-md-lineHeight))',
    'letter-spacing: var(--tw-tracking, var(--type-body-md-letterSpacing))',
    'font-weight: var(--tw-font-weight, var(--type-body-md-weight))',
  ],
  'font-display': ['font-family: var(--font-family-display)'],
  'duration-spatial-default': ['transition-duration: var(--motion-spring-spatial-default-duration)'],
  'ease-spatial-default': ['transition-timing-function: var(--motion-spring-spatial-default-easing)'],
  'p-control-md': ['padding: var(--size-control-md)'],
  'h-control-md': ['height: var(--size-control-md)'],
  'ms-4': ['margin-inline-start: var(--spacing-4)'],
  'max-w-container-prose': ['max-width: var(--container-prose)'],
  // Tailwind's own max-w scale, not the --container-* layout tokens of the same name
  'max-w-sm': ['max-width: 24rem'],
  'text-sm': ['font-size: var(--text-sm)', 'line-height: var(--tw-leading, 1.25rem)'],
  'max-w-container-sm': ['max-width: var(--container-sm)'],
  'z-modal': ['z-index: var(--z-modal)'],
  'animate-accordion-down': ['animation: accordion-down var(--motion-spring-spatial-default-duration)'],
};

async function build(candidates) {
  const input = [
    `@import "tailwindcss" source(none);`,
    `@import "${themePath}";`,
    `@source inline("${candidates.join(' ')}");`,
  ].join('\n');
  const compiler = await compile(input, {
    base: root,
    async loadStylesheet(id) {
      const path = id === 'tailwindcss' ? join(v4Dir, 'index.css') : id.startsWith('tailwindcss/') ? join(v4Dir, id.slice(12)) : id;
      return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
    },
  });
  return compiler.build([]);
}

test('theme.css is @theme inline only (no base/utilities)', () => {
  const css = readFileSync(themePath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.match(css, /@theme inline reference \{/);
  assert.doesNotMatch(css, /@import|@tailwind|@layer/);
});

test('Tailwind v4 generates nexub utilities with runtime var(--…) values', async () => {
  const css = await build(Object.keys(EXPECT));
  for (const [cls, decls] of Object.entries(EXPECT)) {
    const rule = css.match(new RegExp(`\\.${cls.replace(/-/g, '\\-')} \\{([^}]*)\\}`))?.[1];
    assert.ok(rule, `${cls} not generated`);
    for (const d of decls) assert.ok(rule.includes(d), `${cls}: expected "${d}" in:${rule}`);
  }
  assert.match(css, /@keyframes accordion-down/);
});

test('@theme inline emits no self-referencing :root vars', async () => {
  const css = await build(['bg-primary', 'rounded-md', 'ms-4']);
  assert.doesNotMatch(css, /--color-primary:\s*var\(--color-primary\)/);
  assert.doesNotMatch(css, /--radius-md:\s*var\(--radius-md\)/);
});

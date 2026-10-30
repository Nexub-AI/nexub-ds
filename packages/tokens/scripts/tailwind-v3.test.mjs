// Tailwind v3 compiles the dist/tailwind/preset.js into the same var(--…) utilities the v4 theme gives.
// The repo itself builds on Tailwind v4 now; this keeps the v3 consumer path covered.
// Run after `pnpm build` (reads dist/).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const v3Dir = dirname(require.resolve('tailwindcss-v3/package.json'));
const tailwind = require(v3Dir);
const postcss = createRequire(join(v3Dir, 'package.json'))('postcss');
const { default: preset } = await import(join(root, 'dist/tailwind/preset.js'));

// utility → declarations it must contain (same values as tailwind-v4.test.mjs)
const EXPECT = {
  'bg-primary': ['background-color: var(--color-primary)'],
  'text-on-surface': ['color: var(--color-on-surface)'],
  'rounded-shape-container': ['border-radius: var(--shape-container)'],
  'rounded-md': ['border-radius: var(--radius-md)'],
  'shadow-elevation-2': ['var(--elevation-2)'],
  'text-body-md': ['font-size: var(--type-body-md-size)', 'line-height: var(--type-body-md-lineHeight)'],
  'font-display': ['font-family: var(--font-family-display)'],
  'duration-spatial-default': ['transition-duration: var(--motion-spring-spatial-default-duration)'],
  'ease-spatial-default': ['transition-timing-function: var(--motion-spring-spatial-default-easing)'],
  'h-control-md': ['height: var(--size-control-md)'],
  'ms-4': ['margin-inline-start: var(--spacing-4)'],
  'max-w-container-prose': ['max-width: var(--container-prose)'],
  // Tailwind's own max-w scale, not the --container-* layout tokens of the same name
  'max-w-sm': ['max-width: 24rem'],
  'max-w-container-sm': ['max-width: var(--container-sm)'],
  'z-modal': ['z-index: var(--z-modal)'],
  'animate-accordion-down': ['animation: accordion-down var(--motion-spring-spatial-default-duration)'],
  // tailwindcss-animate, registered by the preset
  'animate-in': ['animation-name: enter'],
};

test('Tailwind v3 generates nexub utilities from the preset', async () => {
  const config = { content: [{ raw: Object.keys(EXPECT).join(' '), extension: 'html' }], presets: [preset], corePlugins: { preflight: false } };
  const { css } = await postcss([tailwind(config)]).process('@tailwind utilities;', { from: undefined });
  for (const [cls, decls] of Object.entries(EXPECT)) {
    const rule = css.match(new RegExp(`\\.${cls.replace(/-/g, '\\-')} \\{([^}]*)\\}`))?.[1];
    assert.ok(rule, `${cls} not generated`);
    for (const d of decls) assert.ok(rule.includes(d), `${cls}: expected "${d}" in:${rule}`);
  }
  assert.match(css, /@keyframes accordion-down/);
});

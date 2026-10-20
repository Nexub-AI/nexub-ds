import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// WCAG 2.2 AA contrast for token pairs, resolved by the browser through the real
// theme cascade (light/dark × brand), so it keeps working when tokens move to
// OKLCH / color-mix in Phase 1.

const index = JSON.parse(
  readFileSync(new URL('../storybook-static/index.json', import.meta.url), 'utf8'),
) as { entries: Record<string, { id: string; type: string }> };
const anyStory = Object.values(index.entries).find((e) => e.type === 'story')!.id;

const TEXT = 4.5; // 1.4.3
const UI = 3; // 1.4.11 (input borders, focus ring)

// [foreground, background, minimum]. `#fff` = components' hard-coded text-white.
const PAIRS: [string, string, number][] = [
  ...['primary', 'secondary', 'muted'].flatMap((t) =>
    ['bg-default', 'bg-subtle', 'bg-muted', 'surface-raised'].map(
      (b) => [`--color-text-${t}`, `--color-${b}`, TEXT] as [string, string, number],
    ),
  ),
  ['--color-text-placeholder', '--color-bg-default', TEXT],
  ['--color-text-link', '--color-bg-default', TEXT],
  ['--color-text-info', '--color-bg-default', TEXT],
  ['--color-text-success', '--color-bg-default', TEXT],
  ['--color-text-warning', '--color-bg-default', TEXT],
  ['--color-text-danger', '--color-bg-default', TEXT],
  ['--color-text-inverse', '--color-bg-inverse', TEXT],
  ...['primary', 'info', 'success', 'warning', 'danger', 'accent'].flatMap((f) =>
    ['', '-hover'].map((h) => ['#fff', `--color-fill-${f}${h}`, TEXT] as [string, string, number]),
  ),
  ['--color-border-input', '--color-bg-default', UI],
  ['--color-ring-default', '--color-bg-default', UI],
];

// Failures that exist today. Phase 1 (role tokens) removes them; the test fails
// if one starts passing so this list can only shrink.
const KNOWN = new Set<string>([
  // Focus ring uses the -500 accent: below 3:1 on white (Phase 1 unified focus ring).
  'light/none --color-ring-default on --color-bg-default',
  'light/bookub --color-ring-default on --color-bg-default',
  'light/founderub --color-ring-default on --color-bg-default',
  // #64748b on #f1f5f9 = 4.34 (Phase 1 role tokens).
  ...['none', 'leap', 'bookub', 'payub', 'founderub'].map(
    (b) => `light/${b} --color-text-muted on --color-bg-muted`,
  ),
]);

const contexts = ['light', 'dark'].flatMap((theme) =>
  ['none', 'leap', 'bookub', 'payub', 'founderub'].map((brand) => ({ theme, brand })),
);

for (const { theme, brand } of contexts) {
  test(`contrast ${theme}/${brand}`, async ({ page }) => {
    const globals = `theme:${theme}${brand === 'none' ? '' : `;brand:${brand}`}`;
    await page.goto(`/iframe.html?id=${anyStory}&viewMode=story&globals=${globals}`);
    await page.waitForFunction(
      ([t, b]) =>
        document.body.classList.contains('sb-show-main') &&
        document.documentElement.dataset.theme === t &&
        (document.documentElement.dataset.product ?? 'none') === b,
      [theme, brand],
    );

    const ratios = await page.evaluate((pairs) => {
      // Canvas resolves any CSS color (rgba, oklch, color-mix) to composited sRGB.
      const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
      const probe = document.createElement('div');
      probe.style.transition = 'none'; // a global color transition would report the previous value
      document.body.append(probe);
      const css = (v: string) => {
        probe.style.color = v.startsWith('--') ? `var(${v})` : v;
        return getComputedStyle(probe).color;
      };
      const paint = (...layers: string[]) => {
        ctx.clearRect(0, 0, 1, 1);
        for (const c of layers) {
          ctx.fillStyle = c;
          ctx.fillRect(0, 0, 1, 1);
        }
        return [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)];
      };
      const lum = (rgb: number[]) => {
        const [r, g, b] = rgb.map((v) => {
          const s = v / 255;
          return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const page = css('--color-bg-default');
      const out = pairs.map(([fg, bg]) => {
        const b = paint(page, css(bg));
        const f = paint(page, css(bg), css(fg));
        const [hi, lo] = [lum(f), lum(b)].sort((x, y) => y - x);
        return (hi + 0.05) / (lo + 0.05);
      });
      probe.remove();
      return out;
    }, PAIRS);

    const failing = PAIRS.flatMap(([fg, bg, min], i) =>
      ratios[i] < min ? [`${theme}/${brand} ${fg} on ${bg}: ${ratios[i].toFixed(2)} < ${min}`] : [],
    );
    const key = (s: string) => s.split(':')[0];
    expect(failing.filter((f) => !KNOWN.has(key(f))), 'new contrast failures').toEqual([]);
    const fixed = [...KNOWN].filter(
      (k) => k.startsWith(`${theme}/${brand} `) && !failing.some((f) => key(f) === k),
    );
    expect(fixed, 'now passing: remove from KNOWN').toEqual([]);
  });
}

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
  ['--color-ring-default', '--color-surface-container-highest', UI],
  // Calm Depth roles
  ...['on-surface', 'on-surface-variant', 'on-surface-muted'].flatMap((t) =>
    ['surface', 'surface-container-lowest', 'surface-container-low', 'surface-container-high', 'surface-container-highest'].map(
      (s) => [`--color-${t}`, `--color-${s}`, TEXT] as [string, string, number],
    ),
  ),
  ...['primary', 'tertiary', 'error', 'success', 'warning', 'info'].flatMap(
    (a) =>
      [
        [`--color-on-${a}`, `--color-${a}`, TEXT],
        [`--color-on-${a}-container`, `--color-${a}-container`, TEXT],
        [`--color-${a}`, '--color-surface', TEXT],
      ] as [string, string, number][],
  ),
  ['--color-outline', '--color-surface', UI],
  ['--color-outline', '--color-surface-container-highest', UI],
  ['--color-inverse-on-surface', '--color-inverse-surface', TEXT],
];

// Failures that exist today; the test fails if one starts passing, so this
// list can only shrink. Phase 1 cleared the 8 Phase 0 entries.
const KNOWN = new Set<string>([]);

const contexts = ['light', 'dark'].flatMap((theme) =>
  ['standard', 'high'].flatMap((contrast) =>
    ['none', 'leap', 'bookub', 'payub', 'founderub'].map((brand) => ({ theme, contrast, brand })),
  ),
);

for (const { theme, contrast, brand } of contexts) {
  test(`contrast ${theme}/${contrast}/${brand}`, async ({ page }) => {
    const globals = `theme:${theme};contrast:${contrast};brand:${brand}`;
    await page.goto(`/iframe.html?id=${anyStory}&viewMode=story&globals=${globals}`);
    await page.waitForFunction(
      ([t, c, b]) =>
        document.body.classList.contains('sb-show-main') &&
        document.documentElement.dataset.theme === t &&
        (document.documentElement.dataset.contrast ?? 'standard') === c &&
        (document.documentElement.dataset.product ?? 'none') === b,
      [theme, contrast, brand],
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
      ratios[i] < min ? [`${theme}/${contrast}/${brand} ${fg} on ${bg}: ${ratios[i].toFixed(2)} < ${min}`] : [],
    );
    const key = (s: string) => s.split(':')[0];
    expect(failing.filter((f) => !KNOWN.has(key(f))), 'new contrast failures').toEqual([]);
    const fixed = [...KNOWN].filter(
      (k) => k.startsWith(`${theme}/${contrast}/${brand} `) && !failing.some((f) => key(f) === k),
    );
    expect(fixed, 'now passing: remove from KNOWN').toEqual([]);
  });
}

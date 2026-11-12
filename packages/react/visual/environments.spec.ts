import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

// 9.4: every story in every environment a user can put it in.
//   forced-colors (Windows contrast themes) and RTL: a baseline per story.
//   200% and 400% zoom: WCAG 1.4.10 reflow, as the equivalent viewport (640 and 320 CSS px
//     wide for a 1280 px window): the page must not scroll sideways.
//   reduced motion: nothing is still animating.
//   reduced transparency: no backdrop-filter is left, and glass stories keep a baseline.
// Chromium only (project "storybook"): forced-colors and the CDP media emulation need it.
const index = JSON.parse(
  readFileSync(new URL('../storybook-static/index.json', import.meta.url), 'utf8'),
) as { entries: Record<string, { id: string; type: string }> };
const stories = Object.values(index.entries).filter((e) => e.type === 'story');

// `story id` → `check` → why it is still listed. Shrink-only: a listed check that passes fails.
// Checks: reflow-200, reflow-400, motion, transparency.
const FRAME = 'the story pins a fixed device frame to show the pattern at that width';
const SHOWCASE = 'a multi-column showcase grid; each component in it reflows in its own story';
const KNOWN: Record<string, Record<string, string>> = {
  'patterns-listdetail--wide': { 'reflow-200': FRAME, 'reflow-400': FRAME },
  'patterns-listdetail--narrow': { 'reflow-400': FRAME },
  'foundations-glass--material': { 'reflow-400': SHOWCASE },
  'foundations-new-components--gallery': { 'reflow-400': SHOWCASE },
  'foundations-surfaces--cards': { 'reflow-400': SHOWCASE },
  'patterns-statcard--default': { 'reflow-400': 'a two-column demo grid; one card per row reflows (see patterns-statcard--neutral)' },
  'navigation-navigationmenu--default': {
    'reflow-400': 'four top-level items do not fit 320px (2px over); a nav menu collapses to a drawer there, and wrapping changed MarketingNav',
  },
  'perf-large-data--data-table-filter': { 'reflow-400': 'a data table: two-dimensional content is exempt from WCAG 1.4.10' },
};

async function open(page: Page, id: string, globals = 'theme:light') {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=${globals}`);
  await page.waitForFunction(() =>
    ['sb-show-main', 'sb-show-errordisplay', 'sb-show-nopreview'].some((c) => document.body.classList.contains(c)),
  );
  expect(await page.evaluate(() => document.body.classList.contains('sb-show-main'))).toBe(true);
  await page.evaluate(() => document.fonts.ready);
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-01-15T10:00:00Z'));
  await page.addInitScript(() => {
    let seed = 42;
    Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  });
});

for (const { id } of stories) {
  test(`${id} forced-colors`, async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await open(page, id);
    await expect(page).toHaveScreenshot(`${id}--forced-colors.png`, { fullPage: true });
  });

  test(`${id} rtl`, async ({ page }) => {
    await open(page, id, 'theme:light;dir:rtl');
    await expect(page).toHaveScreenshot(`${id}--rtl.png`, { fullPage: true });
  });

  test(`${id} zoom, motion and transparency`, async ({ page }) => {
    const known = KNOWN[id] ?? {};
    const failed: Record<string, string> = {};
    // Read once layout has settled: the same value on two reads a frame or more apart.
    const overflow = async () => {
      const read = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      let last = await read();
      for (let i = 0; i < 20; i++) {
        await page.waitForTimeout(100);
        const next = await read();
        if (next === last) return next;
        last = next;
      }
      return last;
    };

    for (const [check, width] of [['reflow-200', 640], ['reflow-400', 320]] as const) {
      await page.setViewportSize({ width, height: Math.round(width * 0.8) });
      await open(page, id);
      const px = await overflow();
      if (px > 1) failed[check] = `scrolls sideways by ${px}px at ${width}px wide`;
    }

    await page.setViewportSize({ width: 1024, height: 768 });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setEmulatedMedia', {
      features: [
        { name: 'prefers-reduced-motion', value: 'reduce' },
        { name: 'prefers-reduced-transparency', value: 'reduce' },
      ],
    });
    await open(page, id);
    await page.waitForTimeout(300); // past the load itself; what still moves after that is the finding
    // Reduced motion keeps opacity fades and removes movement: sample every animating
    // element's box twice; one that changed position or size is still moving.
    const moving = await page.evaluate(async () => {
      const targets = [...new Set(document.getAnimations().filter((a) => a.playState === 'running').map((a) => (a.effect as KeyframeEffect).target))].filter(
        // The story's content only: not <body>, and not Storybook's own loader.
        (el): el is Element => !!el && el !== document.body && !el.closest('.sb-loader, .sb-preparing-story, .sb-preparing-docs'),
      );
      const box = (el: Element) => {
        const r = el.getBoundingClientRect();
        return [r.x, r.y, r.width, r.height].map((n) => Math.round(n)).join(',');
      };
      const before = targets.map(box);
      await new Promise((r) => setTimeout(r, 120));
      return targets.filter((el, i) => box(el) !== before[i]).map((el) => el.tagName.toLowerCase() + '.' + String(el.getAttribute('class') ?? '').split(' ')[0]);
    });
    if (moving.length) failed.motion = `still moving: ${[...new Set(moving)].join(', ')}`;
    const blurred = await page.evaluate(
      () => [...document.querySelectorAll('*')].filter((el) => getComputedStyle(el).backdropFilter !== 'none').length,
    );
    if (blurred) failed.transparency = `${blurred} element(s) keep a backdrop-filter`;
    if (/glass/.test(id)) {
      await expect.soft(page).toHaveScreenshot(`${id}--reduced-transparency.png`, { fullPage: true });
    }

    // Exact match both ways, so KNOWN can only shrink.
    expect(Object.keys(failed).sort(), JSON.stringify(failed, null, 2)).toEqual(Object.keys(known).sort());
  });
}

test('KNOWN only lists existing stories', () => {
  const ids = new Set(stories.map((s) => s.id));
  expect(Object.keys(KNOWN).filter((k) => !ids.has(k))).toEqual([]);
});

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { expect, test } from '@playwright/test';

// axe-core (WCAG 2.2 A/AA, no best-practice) over every story in light and dark.
// Story list comes from the built Storybook, loaded the same way as stories.visual.spec.ts.

const index = JSON.parse(
  readFileSync(new URL('../storybook-static/index.json', import.meta.url), 'utf8'),
) as { entries: Record<string, { id: string; type: string }> };
const stories = Object.values(index.entries).filter((e) => e.type === 'story');
const axePath = createRequire(import.meta.url).resolve('axe-core');

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// Violations that exist today: `storyId` (both themes) or `storyId theme` → rule ids.
// Exact match both ways: a new violation fails, and so does a fixed one still listed
// here, so this map can only shrink. Every entry needs a comment saying why it stays.
// Monogram false positive: a button named "Account: Sam Lee" / "User menu" whose only
// visible content is an avatar monogram ("SL"). axe reads the initials as a text label
// (2.5.3 Label in Name); they are image content, and putting "S L" in the name would
// only add noise for screen-reader users.
const MONOGRAM = ['label-content-name-mismatch'];
const KNOWN: Record<string, string[]> = {
  'navigation-appshell--default': MONOGRAM,
  'navigation-topnav--default': MONOGRAM,
  'patterns-appheader--desktop': MONOGRAM,
  'patterns-appheader--embedded': MONOGRAM,
  'patterns-appheader--desktop-dark': MONOGRAM,
  'patterns-appheader--glass': MONOGRAM,
  'patterns-appheader--in-app-shell': MONOGRAM,
  'patterns-appheader--one-org': MONOGRAM,
  'patterns-appheader--phone-375': MONOGRAM,
  'patterns-appheader--phone-375-dark': MONOGRAM,
  'patterns-settingslayout--with-app-header': MONOGRAM,
  'patterns-settingslayout--with-app-header-phone': MONOGRAM,
};

test('KNOWN only lists existing stories', () => {
  const ids = new Set(stories.map((s) => s.id));
  expect(Object.keys(KNOWN).filter((k) => !ids.has(k.replace(/ (light|dark)$/, '')))).toEqual([]);
});

for (const { id } of stories) {
  for (const theme of ['light', 'dark']) {
    test(`a11y ${id} ${theme}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme};brand:none`);
      await page.waitForFunction(() =>
        ['sb-show-main', 'sb-show-errordisplay', 'sb-show-nopreview'].some((c) =>
          document.body.classList.contains(c),
        ),
      );
      const error = await page.locator('#error-message').textContent().catch(() => '');
      expect(await page.evaluate(() => document.body.classList.contains('sb-show-main')), error ?? '').toBe(true);
      const applied = await page
        .waitForFunction((t) => document.documentElement.dataset.theme === t, theme, { timeout: 3000 })
        .then(() => true, () => false);
      test.skip(!applied, 'story pins its own theme globals');
      await page.evaluate(() => document.fonts.ready);
      // Measure settled UI: reduced motion keeps short crossfades (nx-motion), so
      // wait for every finite animation; looping ones (spinners, shimmer) can't end.
      await page.evaluate(() =>
        Promise.all(
          document
            .getAnimations()
            .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
            .map((a) => a.finished.catch(() => undefined)),
        ),
      );

      await page.addScriptTag({ path: axePath });
      const violations = await page.evaluate(async (tags) => {
        // @ts-expect-error injected global
        const r = await window.axe.run('#storybook-root', { runOnly: { type: 'tag', values: tags } });
        return (r.violations as { id: string; nodes: { target: string[]; failureSummary: string }[] }[]).map(
          (v) => ({ id: v.id, nodes: v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')}: ${n.failureSummary}`) }),
        );
      }, TAGS);

      const found = violations.map((v) => v.id).sort();
      expect(found, JSON.stringify(violations, null, 2)).toEqual([...(KNOWN[`${id} ${theme}`] ?? KNOWN[id] ?? [])].sort());
    });
  }
}

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
// Tree items named by their own row (11.5): an OrgChart card or a TreeView row with actions is
// named with aria-labelledby (name and role, or label and trailing meta), as the APG tree
// pattern intends. axe counts the text of the reports or children nested inside the treeitem as
// its visible label and wants it in the name; naming the item from content instead would make the
// top of the chart read out the whole organisation. The row's own visible text is in the name.
const TREE_ROW = ['label-content-name-mismatch'];
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
  'components-orgchart--default': TREE_ROW,
  'components-orgchart--custom-card': TREE_ROW,
  'components-treeview--actions-and-links': TREE_ROW,
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
      // Measure settled UI: reduced motion keeps short crossfades (nx-motion), so wait for
      // every finite animation; looping ones (spinners, shimmer) can't end. Lazy chunks (the
      // seed-theming stories load @nexub/tokens/seed) and late theme writes can start new
      // transitions after a single wait: #762 measured the "Seed" label mid light-to-dark
      // (#1b1b1b on #131313). So wait for the network, then for three quiet frame pairs in a
      // row with no running finite animation and the requested theme still on <html>.
      await page.waitForLoadState('networkidle');
      await page.evaluate(async (t) => {
        const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
        for (let quiet = 0, i = 0; quiet < 3 && i < 200; i++) {
          await frame();
          await frame();
          const running = document
            .getAnimations()
            .filter((a) => a.playState === 'running' && a.effect?.getComputedTiming().iterations !== Infinity);
          if (running.length === 0 && document.documentElement.dataset.theme === t) quiet++;
          else {
            quiet = 0;
            await Promise.all(running.map((a) => a.finished.catch(() => undefined)));
          }
        }
      }, theme);

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

// Popups render in portals outside #storybook-root, so the per-story scan above never
// sees them open. Open each one and scan the popup itself (light theme). Scanning the
// page would flag the trigger behind a modal (aria-hidden by the focus trap, which
// keeps it unreachable): that's the intended modal pattern, not a defect.
// `press`: a key to press after the click, for a popup that opens from the keyboard.
const OPEN: { id: string; trigger?: string; press?: string }[] = [
  { id: 'components-multiselect--default', trigger: '[role=combobox]' },
  { id: 'components-autocomplete--default', trigger: '[role=combobox]' },
  { id: 'components-savedviews--default', trigger: 'button' },
  { id: 'forms-daterangepicker--default', trigger: 'button' },
  // 11.7: the month grid (each cell's name must start with its visible month name).
  // The grid loads lazily behind a placeholder trigger; the real one has aria-haspopup.
  { id: 'forms-datepicker--month-and-year', trigger: 'button[aria-haspopup=dialog]' },
  { id: 'navigation-commandpalette--default' }, // story renders it open
  { id: 'overlays-alertdialog--type-to-confirm', trigger: 'button' },
  { id: 'data-display-datatable--selection', trigger: 'button[aria-haspopup=menu]' },
  { id: 'components-splitbutton--default', trigger: 'button[aria-haspopup=menu]' },
  // 11.9: the diagram's "Connect to…" menu (the keyboard alternative to dragging a handle),
  // opened with C on a node (its connect button only takes pointer events on hover).
  { id: 'components-diagramcanvas--default', trigger: '.react-flow__node', press: 'c' },
  // 12.2: MessageCard's "More actions" menu.
  { id: 'ai-messagebubble--card-overflow', trigger: 'button[aria-haspopup=menu]' },
];
const POPUP = '[role=listbox],[role=menu],[role=dialog],[role=alertdialog],[role=grid]:not(table)';

for (const { id, trigger, press } of OPEN) {
  test(`a11y ${id} open`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:light;brand:none`);
    await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
    await page.evaluate(() => document.fonts.ready);
    if (trigger) await page.locator(`#storybook-root ${trigger}`).first().click();
    if (press) await page.keyboard.press(press);
    await page.locator(POPUP).first().waitFor();
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
          .map((a) => a.finished.catch(() => undefined)),
      ),
    );
    await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async ({ tags, popup }) => {
      // @ts-expect-error injected global
      const r = await window.axe.run({ include: Array.from(document.querySelectorAll(popup)) }, { runOnly: { type: 'tag', values: tags } });
      return (r.violations as { id: string; nodes: { target: string[]; failureSummary: string }[] }[]).map(
        (v) => ({ id: v.id, nodes: v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')}: ${n.failureSummary}`) }),
      );
    }, { tags: TAGS, popup: POPUP });
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  });
}

// 12.2 MessageBubble: what a screen reader gets from the new parts, in the real browser.
const story = (id: string) => `/iframe.html?id=${id}&viewMode=story&globals=theme:light;brand:none`;

test('sr ai-messagebubble--user-avatar: the own message keeps "You said"', async ({ page }) => {
  await page.goto(story('ai-messagebubble--user-avatar'));
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
  await expect(page.getByRole('article', { name: 'You said' })).toHaveCount(1);
});

test('sr ai-messagebubble--collapse: the toggle exposes its expanded state', async ({ page }) => {
  await page.goto(story('ai-messagebubble--collapse'));
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
  await page.evaluate(() => document.fonts.ready);
  const root = page.locator('#storybook-root');
  // Two long messages get a toggle; the short one fits and gets none.
  await expect(root.getByRole('button', { name: 'Read more' })).toHaveCount(2);
  const toggle = root.getByRole('button', { name: 'Read more' }).first();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  const controls = await toggle.getAttribute('aria-controls');
  await expect(page.locator(`[id="${controls}"]`)).toHaveCount(1);
  await toggle.click();
  const expanded = root.getByRole('button', { name: 'Show less' });
  await expect(expanded).toHaveAttribute('aria-expanded', 'true');
  await expect(expanded).toBeFocused();
});

test('sr ai-messagebubble--card-overflow: fields are term/definition pairs; the menu button is named', async ({ page }) => {
  await page.goto(story('ai-messagebubble--card-overflow'));
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
  const root = page.locator('#storybook-root');
  const dl = root.locator('dl');
  await expect(dl.getByRole('term')).toHaveText(['Amount', 'Vendor', 'Submitted by', 'Due']);
  await expect(dl.getByRole('definition')).toHaveCount(4);
  const more = root.getByRole('button', { name: 'More actions' });
  await expect(more).toHaveAttribute('aria-haspopup', 'menu');
  await expect(more).toHaveAttribute('aria-expanded', 'false');
  await expect(root.getByRole('button', { name: 'Show all' })).toHaveAttribute('aria-expanded', 'false');
  await more.click();
  await expect(page.getByRole('menu').getByRole('menuitem')).toHaveText(['Duplicate', 'Delete']);
});

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { expect, test, type Page } from '@playwright/test';

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
  // 12.2: RadioItem indicator="end" (icon at the start, tick at the inline end).
  { id: 'navigation-dropdownmenu--theme-menu', trigger: 'button' },
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

// 12.2 Conversation: what a screen reader gets from DateSeparator, the thinking slot and the
// "New messages" announcement.
test.describe('a11y Conversation 12.2', () => {
  const open = async (page: Page, story: string) => {
    await page.goto(`/iframe.html?id=patterns-conversation--${story}&viewMode=story&globals=theme:light;brand:none`);
    await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
  };

  test('DateSeparator reads as its day, in order, not as a bare separator', async ({ page }) => {
    await open(page, 'day-grouped-with-date-separators');
    const list = page.getByRole('region', { name: 'Conversation' });
    await expect(list.getByRole('separator')).toHaveCount(0);
    const days = list.locator('time');
    await expect(days).toHaveText(['Nov 22, 2026', 'Yesterday', 'Today']);
    await expect(days.nth(1)).toHaveAttribute('datetime', '2026-11-26');
    // Each separator: two hidden hairlines around a visible, readable label.
    const sep = days.nth(1).locator('..');
    await expect(sep.locator('> [aria-hidden="true"]')).toHaveCount(2);
    await expect(days.nth(1)).toBeVisible();
  });

  test('the thinking slot is a polite status after the messages', async ({ page }) => {
    await open(page, 'thinking');
    const status = page.locator('[data-conversation-thinking]');
    await expect(status).toHaveAttribute('role', 'status');
    await expect(status).toHaveAttribute('aria-live', 'polite');
    await expect(status).toContainText('Thinking');
    await page.getByRole('button', { name: 'Stop thinking' }).click();
    await expect(status).toBeEmpty();
  });

  test('messages arriving while scrolled up: "Jump to newest" and one polite "New messages"', async ({ page }) => {
    await open(page, 'jump-to-newest');
    const list = page.getByRole('region', { name: 'Conversation' });
    const live = page.locator('#storybook-root .sr-only[aria-live="polite"]');
    await expect(live).toHaveText('');
    await list.evaluate((el) => {
      el.scrollTop = 0;
    });
    await expect(page.getByRole('button', { name: 'Jump to latest' })).toBeVisible();
    await page.getByRole('button', { name: /Start new messages/ }).click();
    await expect(page.getByRole('button', { name: 'Jump to newest' })).toBeVisible({ timeout: 5000 });
    await expect(live).toHaveText('New messages');
    await page.getByRole('button', { name: 'Stop new messages' }).click();
    await page.getByRole('button', { name: 'Jump to newest' }).click();
    await expect(page.getByRole('button', { name: /Jump to/ })).toHaveCount(0);
    await expect(live).toHaveText('');
  });
});

// 12.2: an agent never reads as a person. Every AgentAvatar is one image whose
// accessible name says "AI agent"; its glyph and sparkle are not in the tree.
test('a11y AgentAvatar name says AI agent', async ({ page }) => {
  await page.goto('/iframe.html?id=components-avatar--agent-sizes&viewMode=story&globals=theme:light;brand:none');
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
  const root = page.locator('#storybook-root');
  await expect(root.getByRole('img', { name: 'Payhub agent, AI agent', exact: true })).toHaveCount(5);
  await expect(root.getByRole('img', { name: 'Ada Lovelace', exact: true })).toHaveCount(5);
  await expect(root.getByRole('img')).toHaveCount(10);
});

// 12.2: names, roles and states a screen reader gets from the new menu and sidebar behaviour.
test('a11y 12.2 theme menu: radio items keep role, name and checked state with indicator="end"', async ({ page }) => {
  await page.goto('/iframe.html?id=navigation-dropdownmenu--theme-menu&viewMode=story&globals=theme:light;brand:none');
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
  const trigger = page.getByRole('button', { name: 'Theme' });
  await trigger.focus();
  await page.keyboard.press('Enter'); // opens with focus on the first item (Light)
  const menu = page.getByRole('menu');
  await expect(menu.getByRole('menuitemradio')).toHaveCount(3);
  await expect(menu.getByRole('menuitemradio', { name: 'System' })).toHaveAttribute('aria-checked', 'true');
  await expect(menu.getByRole('menuitemradio', { name: 'Light' })).toHaveAttribute('aria-checked', 'false');
  await expect(menu.getByRole('menuitemradio', { name: 'Light' })).toBeFocused();
  await page.keyboard.press('Enter'); // picks Light and closes
  await expect(menu).toHaveCount(0);
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitemradio', { name: 'Light' })).toHaveAttribute('aria-checked', 'true');
});

test('a11y 12.2 collapsible sidebar group: a named toggle with aria-expanded hides its items', async ({ page }) => {
  await page.goto('/iframe.html?id=navigation-sidebar--collapsible-groups&viewMode=story&globals=theme:light;brand:none');
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
  const nav = page.getByRole('navigation');
  const workspace = nav.getByRole('button', { name: 'Workspace' });
  const admin = nav.getByRole('button', { name: 'Admin' });
  await expect(workspace).toHaveAttribute('aria-expanded', 'true');
  await expect(admin).toHaveAttribute('aria-expanded', 'false');
  // Closed: the items are inert, so Tab skips them.
  await expect(page.locator(`[id="${await admin.getAttribute('aria-controls')}"]`)).toHaveAttribute('inert', '');
  await admin.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Collapse to icon rail' })).toBeFocused();
  await admin.focus();
  await page.keyboard.press('Enter');
  await expect(admin).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.getByRole('link', { name: 'Team' })).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(nav.getByRole('link', { name: 'Settings' })).toBeFocused();
  await admin.focus();
  await page.keyboard.press('Space');
  await expect(admin).toHaveAttribute('aria-expanded', 'false');
  await page.addScriptTag({ path: axePath });
  const violations = await page.evaluate(async (tags) => {
    // @ts-expect-error injected global
    const r = await window.axe.run('#storybook-root', { runOnly: { type: 'tag', values: tags } });
    return (r.violations as { id: string }[]).map((v) => v.id);
  }, TAGS);
  expect(violations).toEqual([]);
  // Icon rail: every group open, toggles hidden.
  await page.getByRole('button', { name: 'Collapse to icon rail' }).click();
  await expect(nav.getByRole('button')).toHaveCount(0);
  await expect(nav.getByRole('link', { name: 'Team' })).toHaveCount(1);
});

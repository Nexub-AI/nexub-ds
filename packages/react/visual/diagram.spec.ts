import { createRequire } from 'node:module';
import { expect, test, type Page } from '@playwright/test';

// 11.9: the automated half of the @nexub/diagram screen-reader pass (packages/diagram/A11Y_REVIEW.md),
// in Chromium (project "storybook") and the "webkit" and "firefox" engine projects: axe on every
// story, names in the accessibility tree, the Tab order, the canvas keyboard map, the live-region
// announcements, the list view, reduced motion, forced colours and 320px reflow.
// Stories: packages/diagram/src/DiagramCanvas.stories.tsx.
const STORY = 'components-diagramcanvas';
const axePath = createRequire(import.meta.url).resolve('axe-core');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function open(page: Page, id: string, theme = 'light') {
  await page.goto(`/iframe.html?id=${STORY}--${id}&viewMode=story&globals=theme:${theme}`);
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
  // Nodes are hidden until React Flow has measured them.
  await expect(page.locator('.react-flow__node').first()).toBeVisible();
}

/** The focused element: a node or edge's data-id, else its accessible-ish description. */
const focused = (page: Page) =>
  page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    if (!a || a === document.body) return 'body';
    return a.getAttribute('data-id') ?? a.getAttribute('aria-label') ?? a.textContent?.trim() ?? a.localName;
  });
const live = (page: Page) => page.locator('[data-diagram-live]');
/** Every text the live region took, in order (a MutationObserver from here on). */
async function recordLive(page: Page) {
  await page.evaluate(() => {
    const region = document.querySelector('[data-diagram-live]')!;
    const log: string[] = [];
    (window as unknown as { liveLog: string[] }).liveLog = log;
    new MutationObserver(() => log.push(region.textContent ?? '')).observe(region, { childList: true, characterData: true, subtree: true });
  });
  return () => page.evaluate(() => (window as unknown as { liveLog: string[] }).liveLog);
}

for (const id of ['default', 'mind-map', 'read-only', 'tones', 'minimap']) {
  for (const theme of ['light', 'dark']) {
    test(`axe ${id} ${theme}`, async ({ page, browserName }) => {
      await open(page, id, theme);
      await page.waitForFunction((t) => document.documentElement.dataset.theme === t, theme);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.getAnimations().every((a) => a.effect?.getComputedTiming().iterations === Infinity));
      await page.addScriptTag({ path: axePath });
      // Firefox's page process crashes (4 runs in 6) while axe walks React Flow's minimap <svg>; with
      // the minimap left out it never does. Chromium and WebKit scan the minimap; the crash is
      // listed for the human pass in packages/diagram/A11Y_REVIEW.md.
      const context = browserName === 'firefox' ? { include: ['#storybook-root'], exclude: ['.react-flow__minimap'] } : '#storybook-root';
      const violations = await page.evaluate(
        async ({ tags, context }) => {
          // @ts-expect-error injected global
          const r = await window.axe.run(context, { runOnly: { type: 'tag', values: tags } });
          return (r.violations as { id: string; nodes: { target: string[]; failureSummary: string }[] }[]).map((v) => ({
            id: v.id,
            nodes: v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')}: ${n.failureSummary}`),
          }));
        },
        { tags: TAGS, context },
      );
      expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
    });
  }
}

test('the accessibility tree: edges named by node titles (not ids), no image wrappers', async ({ page }) => {
  await open(page, 'default');
  await expect(page.locator('#storybook-root')).toMatchAriaSnapshot(`
    - application "Lead onboarding workflow":
      - group "Connection from New sign-up to Enrich profile"
      - group "Connection from New sign-up to Send welcome email"
      - group "Connection from Enrich profile to Score lead"
      - group "New sign-up"
      - button "Zoom in"
      - button "Zoom out"
      - button "Fit view"
  `);
  // Every edge and node is named; none by its id.
  const names = await page.locator('.react-flow__edge, .react-flow__node').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''));
  expect(names.every((n) => n && !/^Edge from /.test(n)), names.join(' | ')).toBe(true);
  // Each edge's <svg> is not exposed as an image around it.
  await expect(page.locator('.react-flow__edges svg[role=none]')).toHaveCount(6);
});

test('Tab order: one stop for the edges, one for the nodes, then the controls and the list view; Shift+Tab goes back', async ({ page }) => {
  await open(page, 'default');
  await page.locator('body').focus();
  const forward: string[] = [];
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press('Tab');
    forward.push(await focused(page));
  }
  // The first edge and the first node: the workflow's first step, not the node drawn highest.
  expect(forward[0]).toMatch(/^trigger-/);
  expect(forward.slice(1, 7)).toEqual(['trigger', 'Zoom in', 'Zoom out', 'Fit view', 'React Flow attribution', 'Show as list']);
  const back: string[] = [];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Shift+Tab');
    back.push(await focused(page));
  }
  expect(back).toEqual(['React Flow attribution', 'Fit view', 'Zoom out', 'Zoom in', 'trigger', forward[0]]);
});

test('nodes: arrows move focus, Home is the first step, End the last; announcements for move, connect and delete', async ({ page }) => {
  await open(page, 'default');
  const log = await recordLive(page);
  await page.getByRole('group', { name: 'New sign-up', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  expect(['enrich', 'welcome']).toContain(await focused(page));
  await page.keyboard.press('End');
  expect(['notify', 'crm']).toContain(await focused(page));
  await page.keyboard.press('Home');
  expect(await focused(page)).toBe('trigger');

  // Move: Alt+Arrow.
  await page.keyboard.press('Alt+ArrowDown');
  await expect(live(page)).toHaveText(/^Moved New sign-up to -?\d+, -?\d+$/);
  expect(await focused(page)).toBe('trigger');

  // Connect: C opens the menu (focus in it), Escape returns focus to the node.
  await page.keyboard.press('c');
  const menu = page.getByRole('listbox', { name: 'Connect New sign-up to…' });
  await expect(menu).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  expect(await focused(page)).toBe('trigger');
  await page.keyboard.press('c');
  await expect(menu).toBeFocused();
  const target = await menu.locator('[aria-selected=true]').textContent();
  await page.keyboard.press('Enter');
  await expect(menu).toBeHidden();
  await expect(live(page)).toHaveText(`Connected New sign-up to ${target}`);
  expect(await focused(page)).toBe('trigger');

  // Delete a node: its edges go too, named, and focus moves on to the next node.
  await page.getByRole('group', { name: 'Send welcome email', exact: true }).focus();
  await page.keyboard.press('Delete');
  await expect(live(page)).toHaveText('Deleted Send welcome email and 2 connections');
  await expect(page.getByRole('group', { name: 'Send welcome email', exact: true })).toHaveCount(0);
  expect(await focused(page)).not.toBe('body');

  expect(await log()).toEqual([
    expect.stringMatching(/^Moved New sign-up to/),
    `Connected New sign-up to ${target}`,
    'Deleted Send welcome email and 2 connections',
  ]);
});

test('edges: arrows move between them; Delete removes the focused one; the same message twice is announced twice', async ({ page }) => {
  await open(page, 'default');
  const log = await recordLive(page);
  const first = page.getByRole('group', { name: /^Connection from New sign-up to/ }).first();
  await first.focus();
  const start = await focused(page);
  await page.keyboard.press('ArrowDown');
  const second = await focused(page);
  expect(second).not.toBe(start);
  await page.keyboard.press('ArrowUp');
  expect(await focused(page)).toBe(start);
  await page.keyboard.press('Delete');
  await expect(page.locator(`[data-id="${start}"]`)).toHaveCount(0);
  await expect.poll(() => focused(page)).toBe(second);
  await page.keyboard.press('Delete');
  await expect(page.locator(`[data-id="${second}"]`)).toHaveCount(0);
  // Two "Deleted 1 item" in a row: the region still changed, so a screen reader reads it again.
  await expect.poll(log).toEqual(['Deleted 1 item', 'Deleted 1 item ']);
  expect(await focused(page)).toMatch(/-/);
});

test('read-only: focus moves, nothing is moved or removed, and the hints say so', async ({ page }) => {
  await open(page, 'read-only');
  const node = page.getByRole('group', { name: 'New sign-up', exact: true });
  await node.focus();
  await expect(node).toHaveAccessibleDescription('Arrow keys move between nodes.');
  await page.keyboard.press('Alt+ArrowDown');
  await page.keyboard.press('Delete');
  await page.keyboard.press('c');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(live(page)).toHaveText('');
  await expect(node).toBeFocused();
  const edge = page.getByRole('group', { name: /^Connection from/ }).first();
  await expect(edge).toHaveAccessibleDescription('Arrow keys move between connections.');
});

test('the list view: a native disclosure, in the order of the flow, with connections by name', async ({ page }) => {
  await open(page, 'default');
  const summary = page.locator('summary', { hasText: 'Show as list' });
  await summary.focus();
  await page.keyboard.press('Enter');
  const items = page.locator('details[data-diagram-list] > ul > li');
  await expect(items).toHaveCount(6);
  await expect(items.first()).toContainText('New sign-up');
  await expect(items.first()).toContainText('Connects to: ');
});

test('320px: the page does not scroll sideways (the canvas pans; the list view is the text alternative)', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await open(page, 'default');
  const { scroll, client } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(scroll).toBeLessThanOrEqual(client);
});

// (Fit view's duration under reduced motion is a unit test: 'turns fit-view animation off for reduced motion'.)
test('reduced motion: no handle transition and no marching dashes on an animated edge', async ({ page }) => {
  await open(page, 'default');
  const motion = () =>
    page.evaluate(() => {
      const handle = getComputedStyle(document.querySelector('.nx-diagram-handle')!).transitionDuration;
      const edge = document.querySelector('.react-flow__edge')!;
      edge.classList.add('animated');
      const dash = getComputedStyle(edge.querySelector('path')!).animationName;
      edge.classList.remove('animated');
      return { handle: parseFloat(handle), dash };
    });
  // The themes' reduced-motion reset leaves 0.00001s, not 0.
  const reduced = await motion();
  expect(reduced.handle).toBeLessThan(0.001);
  expect(reduced.dash).toBe('none');
  // The same checks see motion when it is allowed.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const allowed = await motion();
  expect(allowed.handle).toBeGreaterThan(0.001);
  expect(allowed.dash).not.toBe('none');
});

test('forced colours: node borders, focus ring and tone are system colours', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'forced-colors emulation is Chromium only');
  await page.emulateMedia({ forcedColors: 'active' });
  await open(page, 'tones');
  const node = page.getByRole('group', { name: 'Tests', exact: true });
  await node.focus();
  const styles = await node.evaluate((el) => {
    const probe = document.createElement('div');
    probe.style.cssText = 'color: CanvasText; background: Highlight';
    document.body.append(probe);
    const p = getComputedStyle(probe);
    const card = getComputedStyle(el.querySelector('.nx-diagram-node')!);
    return { border: card.borderTopColor, canvasText: p.color, outline: getComputedStyle(el).outlineColor, highlight: p.backgroundColor, tone: card.borderInlineStartStyle };
  });
  expect(styles.border).toBe(styles.canvasText);
  expect(styles.outline).toBe(styles.highlight);
  // Warning reads as a dashed stripe, not only a colour.
  expect(styles.tone).toBe('dashed');
});

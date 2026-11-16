import { createRequire } from 'node:module';
import { expect, test, type Page } from '@playwright/test';

// 10.1: the grouped mega-menu of MarketingNav (the nexub.com Products / Solutions /
// Resources menus, apps/docs/src/examples/patterns/marketing-nav/1.tsx): structure,
// keyboard order, names, the 3 + 2 wrap, the drawer accordion, and axe on the open
// panel and the open drawer, which the per-story scan never sees.
const STORY = 'coverage-docs-examples--marketing-nav-grouped-story';
const axePath = createRequire(import.meta.url).resolve('axe-core');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const DIVISIONS = ['Nexub OS', 'Nexub Commerce', 'Nexub Fintech', 'Nexub Intelligence', 'Nexub Autonomous'];

async function open(page: Page, width: number, theme = 'light') {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`/iframe.html?id=${STORY}&viewMode=story&globals=theme:${theme}`);
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
  await page.evaluate(() => document.fonts.ready);
}
async function openMenu(page: Page, label: string) {
  const trigger = page.getByRole('button', { name: label, exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  return trigger;
}
async function axe(page: Page, selector: string) {
  await page.evaluate(() =>
    Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity).map((a) => a.finished.catch(() => undefined))),
  );
  await page.addScriptTag({ path: axePath });
  return page.evaluate(async ({ tags, selector }) => {
    // @ts-expect-error injected global
    const r = await window.axe.run({ include: [selector] }, { runOnly: { type: 'tag', values: tags } });
    return (r.violations as { id: string; nodes: { target: string[]; failureSummary: string }[] }[]).map(
      (v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')} ${n.failureSummary}`).join(' | ')}`,
    );
  }, { tags: TAGS, selector });
}
const tops = (page: Page) =>
  page.evaluate((names) => names.map((n) => Math.round(document.querySelector(`ul[aria-labelledby]`) && [...document.querySelectorAll('nav[aria-label=Main] a')].find((a) => a.textContent === n)!.getBoundingClientRect().top)), DIVISIONS);

test('Products: five labelled lists in one row, as wide as the container', async ({ page }) => {
  await open(page, 1440);
  await openMenu(page, 'Products');
  for (const name of DIVISIONS) await expect(page.getByRole('list', { name })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Nexub OS' }).getByRole('link')).toHaveCount(7);
  expect(new Set(await tops(page)).size).toBe(1);
  const [panel, container] = await page.evaluate(() => {
    const list = document.querySelector('ul[aria-labelledby]')!;
    const header = document.querySelector('header, [data-mode] > *')!;
    return [list.closest('[data-state=open]')!.getBoundingClientRect().width, header.querySelector('nav')!.parentElement!.getBoundingClientRect().width];
  });
  expect(Math.abs(panel - (container - 64))).toBeLessThanOrEqual(2); // container minus its lg padding
  // Footer strip.
  for (const name of ['All products', 'Nexub Account', 'Integrations']) await expect(page.getByRole('link', { name })).toBeVisible();
});

test('Products wraps 3 + 2 below xl', async ({ page }) => {
  await open(page, 1100);
  await openMenu(page, 'Products');
  await expect(page).toHaveScreenshot('marketing-nav-products-wrapped--light.png');
  const t = await tops(page);
  expect(t[0]).toBe(t[1]);
  expect(t[1]).toBe(t[2]);
  expect(t[3]).toBeGreaterThan(t[0]);
  expect(t[3]).toBe(t[4]);
});

test('keyboard: Tab and arrows go column by column, Escape returns focus', async ({ page }) => {
  await open(page, 1440);
  const trigger = await openMenu(page, 'Products');
  const order = await page.evaluate(() => [...document.querySelectorAll('ul[aria-labelledby]')].flatMap((ul) => [ul.parentElement!.querySelector('a')!, ...ul.querySelectorAll('a')].map((a) => a.textContent)));
  expect(order.slice(0, 9)).toEqual(['Nexub OS', 'Leap', 'People', 'PayHub', 'Contracts', 'Book Hub', 'Forms Early access', 'Founder Hub', 'Nexub Commerce']);
  const focused = () => page.evaluate(() => document.activeElement?.textContent);
  const seen: (string | null | undefined)[] = [];
  for (let i = 0; i < order.length; i++) {
    await page.keyboard.press('Tab');
    seen.push(await focused());
  }
  expect(seen).toEqual(order);
  // Arrow keys follow the same order.
  await page.getByRole('link', { name: 'Founder Hub' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect.poll(focused).toBe('Nexub Commerce'); // Radix moves focus on the next tick
  await page.keyboard.press('ArrowUp');
  await expect.poll(focused).toBe('Founder Hub');
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
});

test('badges are in the link name; tinted headings keep a visible focus ring', async ({ page }) => {
  await open(page, 1440);
  await openMenu(page, 'Products');
  await expect(page.getByRole('link', { name: 'Forms Early access' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Commerce Coming to Indonesia' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Robotics & logistics In research' })).toBeVisible();
  const colours = new Set<string>();
  for (const name of DIVISIONS) {
    await page.keyboard.press('Tab'); // keyboard focus, so :focus-visible applies
    const heading = page.getByRole('link', { name, exact: true });
    await heading.focus();
    const s = await heading.evaluate((el) => {
      const c = getComputedStyle(el);
      return { color: c.color, outline: c.outlineStyle, width: parseFloat(c.outlineWidth), ring: c.outlineColor, visible: el.matches(':focus-visible') };
    });
    expect(s.visible).toBe(true);
    expect(s.outline).toBe('solid');
    expect(s.width).toBeGreaterThanOrEqual(2);
    colours.add(s.color);
  }
  expect(colours.size).toBe(5); // each heading has its division's colour
});

for (const menu of ['Products', 'Solutions', 'Resources'])
  for (const theme of ['light', 'dark'])
    test(`${menu} panel ${theme}: axe and screenshot`, async ({ page }) => {
      await open(page, 1440, theme);
      await openMenu(page, menu);
      // The panel only: beside an open trigger Radix keeps an aria-hidden focus proxy (how Tab
      // gets into the panel), which axe reports as aria-hidden-focus.
      expect(await axe(page, 'nav[aria-label=Main] > div:last-child')).toEqual([]);
      await page.mouse.move(0, 899); // no hover state in the shot
      await expect(page).toHaveScreenshot(`marketing-nav-${menu.toLowerCase()}--${theme}.png`);
    });

test('Solutions has three columns and a feature card; Resources has Learn, Tools, Help', async ({ page }) => {
  await open(page, 1440);
  await openMenu(page, 'Solutions');
  for (const name of ['By stage', 'By industry', 'By need']) await expect(page.getByRole('list', { name })).toBeVisible();
  await expect(page.getByRole('link', { name: /closes its books/ })).toBeVisible();
  await openMenu(page, 'Resources');
  for (const name of ['Learn', 'Tools', 'Help']) await expect(page.getByRole('list', { name })).toBeVisible();
});

for (const theme of ['light', 'dark'])
  test(`mobile drawer ${theme}: columns are accordion sections, headings stay links`, async ({ page }) => {
    await open(page, 375, theme);
    await page.getByRole('button', { name: 'Open menu' }).click();
    const drawer = page.getByRole('dialog');
    await expect(drawer).toBeVisible();
    for (const name of DIVISIONS) {
      await expect(drawer.getByRole('link', { name, exact: true })).toHaveAttribute('href', /#/);
      await expect(drawer.getByRole('button', { name, exact: true })).toHaveAttribute('aria-expanded', 'false');
    }
    await expect(drawer.getByRole('link', { name: 'Leap' })).toBeHidden();
    const toggle = drawer.getByRole('button', { name: 'Nexub OS', exact: true });
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(drawer.getByRole('link', { name: 'Leap' })).toBeVisible();
    await expect(drawer.getByRole('link', { name: 'Forms Early access' })).toBeVisible();
    expect(await axe(page, '[role=dialog]')).toEqual([]);
    await expect(page).toHaveScreenshot(`marketing-nav-drawer--${theme}.png`);
  });

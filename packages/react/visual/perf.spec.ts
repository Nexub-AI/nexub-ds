import { expect, test, type Page } from '@playwright/test';

// Interaction-latency tripwire over the built Storybook (Perf/Large data stories).
// Not lab precision: CI machines vary and nothing is CPU-throttled, so the budgets
// are generous and only catch regressions like "every keystroke re-renders 1,000 rows".
//   INP-like: the slowest 'event' entry (durationThreshold 16) during the interaction.
//   Long tasks: none longer than LONG_TASK_MS while it runs.
// Run: pnpm --filter @nexub/react build-storybook && pnpm --filter @nexub/react test:visual --project=perf
const INP_MS = 200;
const LONG_TASK_MS = 100;

async function open(page: Page, story: string, size: number) {
  await page.goto(`/iframe.html?id=perf-large-data--${story}&viewMode=story&args=size:${size}`);
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
  await page.evaluate(() => document.fonts.ready);
}

/** Runs `interact` while observing event timing and long tasks; returns the worst of each. */
async function measure(page: Page, interact: () => Promise<void>) {
  await page.evaluate(() => {
    const w = window as unknown as { __perf: { inp: number; longTask: number } };
    w.__perf = { inp: 0, longTask: 0 };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) w.__perf.inp = Math.max(w.__perf.inp, e.duration);
    }).observe({ type: 'event', durationThreshold: 16 } as PerformanceObserverInit);
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) w.__perf.longTask = Math.max(w.__perf.longTask, e.duration);
    }).observe({ type: 'longtask' });
  });
  await interact();
  // Event entries are reported after the next paint; let deferred renders settle too.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 500))));
  const result = await page.evaluate(() => (window as unknown as { __perf: { inp: number; longTask: number } }).__perf);
  test.info().annotations.push({ type: 'perf', description: `inp ${result.inp}ms, longest task ${result.longTask}ms` });
  return result;
}

function expectBudgets({ inp, longTask }: { inp: number; longTask: number }) {
  expect(inp, 'slowest interaction (ms)').toBeLessThan(INP_MS);
  expect(longTask, 'longest task (ms)').toBeLessThan(LONG_TASK_MS);
}

test('DataTable: typing a filter over 1,000 rows', async ({ page }) => {
  await open(page, 'data-table-filter', 1000);
  const input = page.getByRole('searchbox', { name: 'Filter people' });
  await input.focus();
  const r = await measure(page, () => input.pressSequentially('Person 99', { delay: 50 }));
  await expect(page.getByRole('row')).toHaveCount(12); // header + 99, 990–999
  expectBudgets(r);
});

test('Combobox: typing over 1,000 options', async ({ page }) => {
  await open(page, 'combobox-options', 1000);
  const input = page.getByRole('combobox', { name: 'Search options' });
  await input.click();
  const r = await measure(page, () => input.pressSequentially('Option 99', { delay: 50 }));
  // cmdk matches fuzzily: assert the list narrowed rather than an exact count.
  await expect(page.getByRole('option', { name: 'Option 1', exact: true })).toHaveCount(0);
  await expect(page.getByRole('option', { name: 'Option 99', exact: true })).toBeVisible();
  expectBudgets(r);
});

test('Kanban: keyboard-moving a card on a 300-card board', async ({ page }) => {
  await open(page, 'kanban-board', 300);
  const grip = page.getByRole('button', { name: 'Move Task 1', exact: true });
  await grip.focus();
  const r = await measure(page, async () => {
    await page.keyboard.press('Alt+ArrowDown');
    await page.keyboard.press('Alt+ArrowRight');
  });
  await expect(page.getByRole('button', { name: 'Move Task 1', exact: true })).toBeFocused();
  expectBudgets(r);
});

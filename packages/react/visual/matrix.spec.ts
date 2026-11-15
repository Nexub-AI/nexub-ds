import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// 9.3: the state matrix. Every story is pushed through the states its component accepts,
// by updating its args in place: long content (200 characters with emoji and Arabic),
// empty, disabled, loading and invalid. In each state the story must not throw, and must
// not make the page scroll sideways.
const index = JSON.parse(
  readFileSync(new URL('../storybook-static/index.json', import.meta.url), 'utf8'),
) as { entries: Record<string, { id: string; type: string }> };
const stories = Object.values(index.entries).filter((e) => e.type === 'story');

const LONG =
  'Quarterly reconciliation for the Singapore entity 🧾 including every pending transfer, ' +
  'refund and chargeback — مراجعة ربع سنوية لجميع التحويلات — plus the notes the finance team ' +
  'left on each line before the books closed 🚀';

// `story id` → `state` → why it is still listed. Shrink-only.
const KNOWN: Record<string, Record<string, string>> = {};

test('LONG is the 200-character case', () => {
  expect(LONG.length).toBeGreaterThanOrEqual(200);
});

for (const { id } of stories) {
  test(`${id} state matrix`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:light`);
    await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));

    // What this story's component accepts, from its args and inferred argTypes.
    const states = await page.evaluate((long) => {
      type Preview = { currentRender: { story: { initialArgs: Record<string, unknown>; argTypes: Record<string, { options?: unknown[] }> } } };
      const { initialArgs, argTypes } = (window as unknown as { __STORYBOOK_PREVIEW__: Preview }).__STORYBOOK_PREVIEW__.currentRender.story;
      const text = Object.entries(initialArgs).filter(
        // Content props only: an enum without inferred options (variant, currency) is not text.
        ([k, v]) => typeof v === 'string' && !argTypes[k]?.options && /^(children|label|title|description|placeholder|helperText|hint|eyebrow|message|caption|heading|subtitle|text|alt|content|.*(Label|Text|Title|Description|Message))$/.test(k),
      );
      const lists = Object.entries(initialArgs).filter(([, v]) => Array.isArray(v));
      const out: Record<string, Record<string, unknown>> = {};
      if (text.length) {
        out.long = Object.fromEntries(text.map(([k]) => [k, long]));
        out.empty = Object.fromEntries(text.map(([k]) => [k, '']));
      }
      if (lists.length) out.empty = { ...out.empty, ...Object.fromEntries(lists.map(([k]) => [k, []])) };
      if ('disabled' in argTypes) out.disabled = { disabled: true };
      if ('loading' in argTypes) out.loading = { loading: true };
      if ('invalid' in argTypes) out.invalid = { invalid: true };
      return out;
    }, LONG);

    const failures: string[] = [];
    for (const [state, args] of Object.entries(states)) {
      if (KNOWN[id]?.[state]) continue;
      errors.length = 0;
      await page.evaluate(
        ([storyId, updatedArgs]) => {
          const w = window as unknown as { __STORYBOOK_ADDONS_CHANNEL__: { emit: (e: string, p: unknown) => void } };
          w.__STORYBOOK_ADDONS_CHANNEL__.emit('resetStoryArgs', { storyId });
          w.__STORYBOOK_ADDONS_CHANNEL__.emit('updateStoryArgs', { storyId, updatedArgs });
        },
        [id, args] as const,
      );
      await page.waitForTimeout(150);
      const result = await page.evaluate(() => ({
        crashed: document.body.classList.contains('sb-show-errordisplay'),
        message: document.querySelector('#error-message')?.textContent?.slice(0, 200) ?? '',
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      if (result.crashed || errors.length) failures.push(`${state}: threw ${errors[0] ?? result.message}`);
      else if (result.overflow > 1) failures.push(`${state}: page scrolls sideways by ${result.overflow}px`);
    }
    expect(failures).toEqual([]);
  });
}

test('KNOWN only lists existing stories', () => {
  const ids = new Set(stories.map((s) => s.id));
  expect(Object.keys(KNOWN).filter((k) => !ids.has(k))).toEqual([]);
});

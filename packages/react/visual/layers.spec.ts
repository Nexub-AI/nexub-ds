import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

// RFC 12.0, decision 2 (measured in 11.9, the default in 12.0): who wins between Nexub's prebuilt CSS and the app's own CSS.
// A page loads dist/styles.css or dist/styles.nexub-layer.css (run `pnpm build` first) and
// app CSS shaped like Tailwind v4's output (its four layers, a rule in `utilities` or `base`)
// or an unlayered rule, in either order. Each probe sets the property a real Nexub rule sets
// (`.bg-primary`, a utility; the v3 compatibility `* { border-color }`, in base) to an app
// colour, and the test reads the computed value. Runs in Chromium (project "storybook"),
// WebKit and Firefox.
const dist = (file: string) => readFileSync(new URL(`../dist/${file}`, import.meta.url), 'utf8');
const PLAIN = dist('styles.css');
const LAYERED = dist('styles.nexub-layer.css');
// In the tests below LAYERED stands for styles.css: they are the same file in 12.0.

const APP = 'rgb(1, 2, 3)';
const NEXUB_BORDER = 'rgb(229, 231, 235)'; // tailwind-v3-compat.css: v3's gray-200
// What a Tailwind v4 app's stylesheet starts with, then one rule in one of its layers.
const TW = '@layer theme, base, components, utilities;';
const appUtility = `${TW} @layer utilities { .app-bg { background-color: ${APP}; } }`;
const appBase = `${TW} @layer base { *, ::before, ::after { border-color: ${APP}; } }`;
const appUnlayered = `.app-bg { background-color: ${APP}; } * { border-color: ${APP}; }`;

async function probe(page: Page, sheets: string[]) {
  await page.setContent(
    `<!doctype html><html><head>${sheets.map((s) => `<style>${s}</style>`).join('')}</head>` +
      '<body><div id="p" class="bg-primary app-bg" style="border-width:2px;border-style:solid">x</div></body></html>',
  );
  return page.locator('#p').evaluate((el) => {
    const s = getComputedStyle(el);
    return { background: s.backgroundColor, border: s.borderTopColor };
  });
}

// 12.0: styles.css is the layered file. styles.nexub-layer.css (the 11.9 opt-in name) stays,
// byte for byte the same, so apps that switched early keep working.
test('styles.css and styles.nexub-layer.css are the same file', () => {
  expect(LAYERED).toBe(PLAIN);
});

test.describe('styles.css (12.0): one nexub layer', () => {
  test('loaded before the app, every app style wins: utilities, base and unlayered', async ({ page }) => {
    expect((await probe(page, [LAYERED, appUtility])).background).toBe(APP);
    expect((await probe(page, [LAYERED, appBase])).border).toBe(APP);
    expect(await probe(page, [LAYERED, appUnlayered])).toEqual({ background: APP, border: APP });
  });

  test('declaring `@layer nexub` first makes the load order irrelevant', async ({ page }) => {
    const first = `@layer nexub; ${appUtility}`;
    expect((await probe(page, [first, LAYERED])).background).toBe(APP);
    expect((await probe(page, [`@layer nexub; ${appBase}`, LAYERED])).border).toBe(APP);
  });

  test('a Tailwind app that names nexub after base: its utilities win, its base (preflight) does not', async ({ page }) => {
    // The Migrating to 12.0 advice for Tailwind v4 apps, in either load order.
    const order = '@layer theme, base, nexub, components, utilities;';
    for (const sheets of [[order, appUtility, LAYERED], [order, LAYERED, appUtility]]) {
      expect((await probe(page, sheets)).background).toBe(APP);
    }
    for (const sheets of [[order, appBase, LAYERED], [order, LAYERED, appBase]]) {
      expect((await probe(page, sheets)).border).toBe(NEXUB_BORDER);
    }
  });

  test('loaded after the app’s layers (and no `@layer nexub` first), nexub comes last and wins', async ({ page }) => {
    // The caveat the docs state: import the file before the app's CSS. Unlayered CSS still wins.
    expect((await probe(page, [appUtility, LAYERED])).background).not.toBe(APP);
    expect((await probe(page, [appBase, LAYERED])).border).toBe(NEXUB_BORDER);
    expect(await probe(page, [appUnlayered, LAYERED])).toEqual({ background: APP, border: APP });
  });

  test('with no app CSS, Nexub styles apply', async ({ page }) => {
    const plain = await probe(page, [PLAIN]);
    expect(plain.background).not.toBe('rgba(0, 0, 0, 0)'); // .bg-primary applies
    expect(plain.border).toBe(NEXUB_BORDER);
  });
});

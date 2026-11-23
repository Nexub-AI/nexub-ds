import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

// 11.9 (RFC 12.0, decision 2): who wins between Nexub's prebuilt CSS and the app's own CSS.
// A page loads dist/styles.css or dist/styles.nexub-layer.css (run `pnpm build` first) and
// app CSS shaped like Tailwind v4's output (its four layers, a rule in `utilities` or `base`)
// or an unlayered rule, in either order. Each probe sets the property a real Nexub rule sets
// (`.bg-primary`, a utility; the v3 compatibility `* { border-color }`, in base) to an app
// colour, and the test reads the computed value. Runs in Chromium (project "storybook"),
// WebKit and Firefox.
const dist = (file: string) => readFileSync(new URL(`../dist/${file}`, import.meta.url), 'utf8');
const PLAIN = dist('styles.css');
const LAYERED = dist('styles.nexub-layer.css');

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

test.describe('styles.css (11.x): Tailwind layer names, shared with the app', () => {
  test('an app utility ties with a Nexub utility: the later file wins', async ({ page }) => {
    expect((await probe(page, [PLAIN, appUtility])).background).toBe(APP);
    // Nexub loaded after the app: Nexub's .bg-primary wins over the app's own class.
    expect((await probe(page, [appUtility, PLAIN])).background).not.toBe(APP);
  });

  test('an app base rule ties with a Nexub base rule the same way', async ({ page }) => {
    expect((await probe(page, [PLAIN, appBase])).border).toBe(APP);
    expect((await probe(page, [appBase, PLAIN])).border).toBe(NEXUB_BORDER);
  });

  test('unlayered app CSS wins in either order', async ({ page }) => {
    for (const sheets of [[PLAIN, appUnlayered], [appUnlayered, PLAIN]]) {
      expect(await probe(page, sheets)).toEqual({ background: APP, border: APP });
    }
  });
});

test.describe('styles.nexub-layer.css (12.0): one nexub layer', () => {
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

  test('loaded after the app’s layers (and no `@layer nexub` first), nexub comes last and wins', async ({ page }) => {
    // The caveat the docs state: import the file before the app's CSS. Unlayered CSS still wins.
    expect((await probe(page, [appUtility, LAYERED])).background).not.toBe(APP);
    expect((await probe(page, [appBase, LAYERED])).border).toBe(NEXUB_BORDER);
    expect(await probe(page, [appUnlayered, LAYERED])).toEqual({ background: APP, border: APP });
  });

  test('renders like styles.css when there is no app CSS', async ({ page }) => {
    const plain = await probe(page, [PLAIN]);
    expect(plain.background).not.toBe('rgba(0, 0, 0, 0)'); // .bg-primary applies
    expect(plain.border).toBe(NEXUB_BORDER);
    expect(await probe(page, [LAYERED])).toEqual(plain);
  });
});

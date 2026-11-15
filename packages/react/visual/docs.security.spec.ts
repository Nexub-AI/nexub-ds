import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';
import { contentSecurityPolicy } from '../../../apps/docs/functions/_middleware';

// 9.6: the docs under the policy production sends (functions/_middleware.ts): a nonce and
// 'strict-dynamic' for scripts, nonce'd <style> elements, and Trusted Types enforced.
// The static export has no middleware, so this does what it does (a nonce on every
// <script>, <style> and script preload, the csp-nonce meta, the header) and then fails on
// any violation. Every component and pattern page renders its live examples, so this is
// also the proof that the library itself needs no 'unsafe-inline' script and makes no
// Trusted Types violation. Chromium only: it reports each violation as a DOM event.
const out = fileURLToPath(new URL('../../../apps/docs/out/', import.meta.url));
function pages(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return pages(path);
    if (!name.endsWith('.html')) return [];
    const route = '/' + relative(out, path).replace(/\.html$/, '').replace(/(^|\/)index$/, '');
    return [route.replace(/\/$/, '') || '/'];
  });
}
// /m is the Expo web preview (its own bundle and policy); 404 pages are the same shell.
const PAGES = pages(out)
  .filter((p) => !/^\/(m|device-shots|404|_not-found)(\/|$)/.test(p))
  .sort();

const NONCE = 'dGVzdC1ub25jZS0xMjM0NQ==';
type Violation = { directive: string; blocked: string; source: string; sample: string };

/** Serves documents the way the middleware does, and records every policy violation. */
async function enforce(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  await page.addInitScript(() => {
    const w = window as unknown as { __violations: unknown[] };
    w.__violations = [];
    document.addEventListener('securitypolicyviolation', (e) =>
      w.__violations.push({ directive: e.effectiveDirective, blocked: e.blockedURI, source: `${e.sourceFile}:${e.lineNumber}`, sample: e.sample }),
    );
  });
  await page.route(
    (url) => url.port === '6008',
    async (route) => {
      if (route.request().resourceType() !== 'document') return route.continue();
      const res = await route.fetch();
      if (!(res.headers()['content-type'] ?? '').includes('text/html')) return route.fulfill({ response: res });
      const html = (await res.text())
        .replace(/<(script|style)(?=[\s>])/g, `<$1 nonce="${NONCE}"`)
        .replace(/<link(?=[^>]*rel="(?:preload|modulepreload)")(?=[^>]*(?:as="script"|rel="modulepreload"))/g, `<link nonce="${NONCE}"`)
        .replace('<head>', `<head><meta name="csp-nonce" content="${NONCE}">`);
      const path = new URL(route.request().url()).pathname;
      await route.fulfill({
        response: res,
        body: html,
        headers: { ...res.headers(), 'content-security-policy': contentSecurityPolicy(NONCE, path) },
      });
    },
  );
  return async () => {
    const violations = await page.evaluate(() => (window as unknown as { __violations: Violation[] }).__violations);
    return [...violations.map((v) => `${v.directive} blocked ${v.blocked || 'inline'} at ${v.source} ${v.sample}`), ...errors];
  };
}

const hydrated = (page: Page) =>
  page.waitForFunction(() => Object.keys(document.querySelector('main, body > *') ?? {}).some((k) => k.startsWith('__reactFiber')));

test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'violations are read from Chromium');
});

for (const path of PAGES) {
  test(`docs security ${path}: no CSP or Trusted Types violation`, async ({ page }) => {
    const found = await enforce(page);
    await page.goto(path);
    await hydrated(page);
    await page.waitForLoadState('networkidle');
    expect(await found()).toEqual([]);
  });
}

test('docs security: navigating, searching, switching theme and opening feedback stay inside the policy', async ({ page }) => {
  const found = await enforce(page);
  await page.goto('/components/button');
  await hydrated(page);
  const sidebar = page.getByRole('complementary', { name: 'Documentation navigation' });
  // Client-side navigation renders the next page (code blocks, previews) in the browser.
  for (const href of ['/components/dialog', '/components/data-table', '/getting-started/security', '/foundations/colors']) {
    const link = sidebar.locator(`a[href="${href}"]`);
    while ((await link.count()) === 0) {
      const closed = sidebar.locator('[aria-expanded="false"]');
      if ((await closed.count()) === 0) break;
      await closed.first().click();
    }
    await link.click();
    await expect(page).toHaveURL(href);
    await expect(page.locator('main h1')).toBeVisible();
  }
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Search the docs' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('radiogroup', { name: 'Theme' }).getByTitle('Dark').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  // The feedback dialog loads Turnstile through the 'nexub-docs' Trusted Types policy.
  await page.getByRole('button', { name: 'Send feedback' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.waitForTimeout(500);
  expect(await found()).toEqual([]);
});

test('docs security: the policy has no script fallback and enforces Trusted Types', () => {
  const csp = contentSecurityPolicy('n', '/components/button');
  const script = csp.split('; ').find((d) => d.startsWith('script-src'));
  expect(script).toBe("script-src 'nonce-n' 'strict-dynamic'");
  expect(csp).toContain("require-trusted-types-for 'script'");
  // The only 'unsafe-inline' left is for style="" attributes.
  expect(csp.split('; ').filter((d) => d.includes("'unsafe-inline'"))).toEqual(["style-src-attr 'unsafe-inline'"]);
});

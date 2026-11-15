import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { bundledThemes } from 'shiki';

// The docs code surface (--docs-code-surface = surface-container-lowest).
const SURFACE = { light: '#ffffff', dark: '#0d0e11' } as const;
const THEMES = { light: 'github-light-default', dark: 'github-dark-default' } as const;

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Replaces the old per-colour CODE_CONTRAST patch: every syntax colour of both
// themes must clear WCAG AA (4.5:1) on the code surface as shipped.
for (const mode of ['light', 'dark'] as const) {
  test(`${THEMES[mode]} tokens clear AA on the ${mode} code surface`, async () => {
    const theme = (await bundledThemes[THEMES[mode]]()).default;
    const colors = new Set<string>();
    for (const t of theme.tokenColors ?? []) {
      const fg = t.settings?.foreground;
      // Tokens with their own background (invalid/ignored markers) don't sit on the surface.
      if (fg && !t.settings?.background &&/^#[0-9a-f]{6}$/i.test(fg)) colors.add(fg.toLowerCase());
    }
    const failing = [...colors]
      .map((c) => [c, contrast(c, SURFACE[mode])] as const)
      .filter(([, r]) => r < 4.5)
      .map(([c, r]) => `${c} ${r.toFixed(2)}:1`);
    assert.deepEqual(failing, []);
  });
}

// Every code sample goes through CodeBlock / CodeFrame, so there's one anatomy.
// Live demo output in src/examples is exempt (it's component content, not docs code).
test('docs pages and components use CodeBlock, not raw <pre>', () => {
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.tsx$/.test(name) && !p.endsWith('CodeFrame.tsx') && /<pre[\s>]/.test(readFileSync(p, 'utf8'))) offenders.push(p);
    }
  };
  walk('src/app');
  walk('src/components');
  assert.deepEqual(offenders, []);
});

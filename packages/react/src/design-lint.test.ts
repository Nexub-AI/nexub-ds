// @vitest-environment node
// Design lint: component source must use Calm Depth tokens (ENHANCEMENTS_PLAN.md
// B2). Scans @nexub/react and @nexub/patterns components (not tests/stories).
// KNOWN is shrink-only: when you fix a file, lower or delete its entry.
import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

const RULES: Record<string, RegExp> = {
  // Legacy colour names; roles only (--color-text-disabled is the disabled state).
  'legacy-color':
    /--color-(?:bg|text-(?!disabled\b)|border|brand|neutral|semantic|fill|accent|ring|chart)-|--color-(?:leap|bookub|payub|founderub)-\d|--color-(?:success|error|warning|info|primary|danger)-\d|\b(?:bg|text|border|ring|fill|stroke|from|to|via|outline|divide|placeholder|caret|accent|decoration)-(?:brand|accent|neutral|semantic|text|bg|border|ring)-/g,
  // Shape tokens (rounded-shape-*), rounded-full or rounded-none only.
  'legacy-radius': /\brounded(?:-[trblse]{1,2})?(?:-(?:xs|sm|md|lg|xl|2xl|3xl))?(?![\w\-[])/g,
  // Elevation tokens only.
  'legacy-shadow': /\bshadow-(?:xs|sm|md|lg|xl|2xl|card|plans|glow|lift|focus|inner|inner-highlight)\b/g,
  // The global :focus-visible outline is the one focus ring.
  'focus-ring-override': /\bfocus(?:-visible)?:(?:ring-(?!0\b)|ring-offset|outline-(?!none\b))/g,
  // Disabled is a colour state, never opacity.
  'opacity-disabled': /(?:disabled|data-\[disabled\]|aria-disabled|group-disabled|peer-disabled):opacity-/g,
  'raw-white-black': /\b(?:text|bg|border|fill)-(?:white|black)\b/g,
  'hex-color': /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-fA-F])/g,
  // Enter/exit is nx-motion (themes/base.css), not tailwindcss-animate.
  'tw-animate': /\b(?:animate-in|animate-out|fade-in-\d|fade-out-\d|zoom-in-\d|zoom-out-\d|slide-in-from-|slide-out-to-)/g,
  // RTL: logical spacing, borders, radii and alignment (ms/me, ps/pe, border-s/e,
  // rounded-s/e, text-start/end). left/right positions aren't linted: centring
  // (left-1/2) and explicit sides (Drawer side="left") are physical on purpose.
  'physical-direction': /(?<=^|[\s'"`:])-?(?:ml|mr|pl|pr)-|(?<=^|[\s'"`:])(?:border-[lr]|rounded-(?:[lr]|tl|tr|bl|br))(?=[-\s'"`]|$)|(?<=^|[\s'"`:])text-(?:left|right)(?=[\s'"`]|$)/gm,
  // Tailwind 3 emits nothing for an opacity modifier on a var() colour.
  'dead-opacity-modifier': /\[var\(--[a-z0-9-]+\)\]\/\d+/g,
};

// file (relative to packages/) → rule → allowed count. Shrink-only.
const KNOWN: Record<string, Record<string, number>> = {};

const PACKAGES = path.resolve(__dirname, '../..');
const ROOTS = ['react/src/components', 'patterns/src/components'];

function sourceFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.tsx?$/.test(e.name) && !/\.(test|stories)\.tsx?$/.test(e.name)) out.push(p);
    }
  };
  ROOTS.forEach((r) => walk(path.join(PACKAGES, r)));
  return out;
}

function violations(): Record<string, Record<string, number>> {
  const found: Record<string, Record<string, number>> = {};
  for (const file of sourceFiles()) {
    // Comments may mention old names; only code counts.
    const src = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '');
    for (const [rule, re] of Object.entries(RULES)) {
      const n = src.match(re)?.length ?? 0;
      if (n) (found[path.relative(PACKAGES, file)] ??= {})[rule] = n;
    }
  }
  return found;
}

describe('design lint', () => {
  const found = violations();

  it('scans the component sources', () => {
    expect(sourceFiles().length).toBeGreaterThan(100);
  });

  it('no new violations (fix them, or shrink KNOWN after fixing old ones)', () => {
    // Exact match both ways: a new violation fails, and so does a fixed one
    // still listed in KNOWN (so the allowlist only ever shrinks).
    expect(found).toEqual(KNOWN);
  });
});

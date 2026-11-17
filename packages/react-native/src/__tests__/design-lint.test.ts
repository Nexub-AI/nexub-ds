// 8.6 (K1): spacing and sizes come from the theme (tokens.spacing[4],
// tokens.shape.field), not raw numbers. Hairlines (0 and 1) are fine.
// KNOWN is shrink-only: when you fix a file, lower or delete its entry.
// This package has no Node types; jest runs the test in Node.
/* eslint-disable @typescript-eslint/no-require-imports -- typed by hand: no @types/node here */
const fs: {
  readdirSync(d: string, o: { withFileTypes: true }): { name: string; isDirectory(): boolean }[];
  readFileSync(p: string, e: 'utf8'): string;
} = require('node:fs');
const path: { join(...p: string[]): string; resolve(...p: string[]): string; relative(a: string, b: string): string } = require('node:path');
/* eslint-enable @typescript-eslint/no-require-imports */
declare const __dirname: string;

const PROPS =
  'padding|paddingHorizontal|paddingVertical|paddingTop|paddingBottom|paddingStart|paddingEnd|paddingLeft|paddingRight|' +
  'margin|marginHorizontal|marginVertical|marginTop|marginBottom|marginStart|marginEnd|marginLeft|marginRight|' +
  'gap|rowGap|columnGap|width|height|minWidth|minHeight|maxWidth|maxHeight|borderRadius|fontSize|lineHeight|top|bottom|left|right|start|end';
const RAW = new RegExp(`\\b(?:${PROPS})\\s*:\\s*-?(\\d+(?:\\.\\d+)?)\\b(?!\\s*[%*/+.-])`, 'g');

// file (relative to src/) → allowed count. What is left (10.5) has no token and
// no honest relation to one: Dialog maxWidth 400, the SegmentedControl's 3pt
// pill inset (4), the OTP cell height 52, the sheet grabber 5 × radius 3, the
// chat composer maxHeight 140 and the native tab label's 11pt.
const KNOWN: Record<string, number> = {
  'components/feedback.tsx': 1,
  'components/inputs.tsx': 4,
  'components/mobile.tsx': 1,
  'components/overlays.tsx': 2,
  'patterns/app.tsx': 1,
  'theme/navigation.ts': 1,
};

const SRC = path.resolve(__dirname, '..');

function counts(): Record<string, number> {
  const found: Record<string, number> = {};
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== '__tests__') walk(p);
      } else if (/\.tsx?$/.test(e.name) && !e.name.includes('.test.')) {
        const src = fs.readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '');
        const n = [...src.matchAll(RAW)].filter((m) => Number(m[1]) > 1).length;
        if (n) found[path.relative(SRC, p)] = n;
      }
    }
  };
  walk(SRC);
  return found;
}

it('no new raw numeric styles (use theme tokens, or shrink KNOWN after fixing old ones)', () => {
  expect(counts()).toEqual(KNOWN);
});

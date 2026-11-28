// The brand builder's logic (/foundations/theme-builder): contrast pairs, the
// polite summary and the export files, all from @nexub/tokens/seed so the page
// shows exactly what the package ships. Pure, so the docs tests run it in Node.
//
// The seed only recolours the accent family. Surfaces stay Nexub, so the page
// passes their resolved hex in (from @nexub/tokens/native, at build time) and
// every ratio here is arithmetic: no DOM measuring, same numbers on the server.
import {
  contrastRatio,
  createSeedRoles,
  createSeedStylesheet,
  createSeedThemeCss,
  createSeedTokens,
} from '@nexub/tokens/seed';

export type Target = 'primary' | 'tertiary';
export type Level = 'standard' | 'medium' | 'high';
export type Scheme = 'light' | 'dark';

export const LEVELS: Level[] = ['standard', 'medium', 'high'];
export const SCHEMES: Scheme[] = ['light', 'dark'];
export const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** The surfaces an accent is read on (the same list the seed tests check). */
export const SURFACE_ROLES = [
  'surface',
  'surface-dim',
  'surface-bright',
  'surface-container-lowest',
  'surface-container-low',
  'surface-container',
  'surface-container-high',
  'surface-container-highest',
  'surface-elevated',
] as const;
const NEUTRAL_ROLES = [...SURFACE_ROLES, 'inverse-surface'];

/** Resolved neutral roles per contrast level and scheme (hex). */
export type Neutrals = Record<Level, Record<Scheme, Record<string, string>>>;

/** Keeps only the roles the checks need, so the client gets a few hundred bytes, not the native tokens. */
export function pickNeutrals(roles: Record<Level, Record<Scheme, Record<string, string>>>): Neutrals {
  const out = {} as Neutrals;
  for (const level of LEVELS) {
    out[level] = { light: {}, dark: {} };
    for (const scheme of SCHEMES)
      for (const role of NEUTRAL_ROLES) {
        const hex = roles[level]?.[scheme]?.[role];
        if (!hex) throw new Error(`brand builder: no ${level}/${scheme} ${role} in the native roles`);
        out[level][scheme][role] = hex;
      }
  }
  return out;
}

/** Expands #rgb to #rrggbb, lower case (what <input type="color"> and the maths expect). */
export const longHex = (hex: string) =>
  (hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join('')}` : hex).toLowerCase();

// ── APCA slot ────────────────────────────────────────────────────────────────
// 12.6: `apcaContrast` is being added to @nexub/tokens/seed in a parallel PR.
// When it is on development, import it above and return `apcaContrast(fg, bg)`
// here: the contrast table shows an "APCA Lc" column as soon as this returns a
// number, and the tests in apps/docs/test/brand-builder.test.ts say what to add.
// Until then the builder reports WCAG 2 only.
export function apca(fg: string, bg: string): number | null {
  void fg;
  void bg;
  return null;
}

export interface PairCheck {
  /** Stable key, e.g. `on-primary/primary`. */
  id: string;
  fg: string;
  bg: string;
  fgHex: string;
  bgHex: string;
  /** WCAG 2 contrast ratio, 1–21. */
  ratio: number;
  /** The minimum the pair needs (4.5 for text, 3 for inverse-primary on inverse-surface). */
  min: number;
  pass: boolean;
  /** APCA Lc, once the seed entry has it (see `apca`). */
  apca: number | null;
}

/** The text/background pairs a seeded accent must meet, for one level and scheme. */
export function checkPairs(seed: string, target: Target, level: Level, scheme: Scheme, neutrals: Neutrals): PairCheck[] {
  const roles = createSeedRoles(seed, { target, contrast: level })[scheme];
  const hex = (role: string) => {
    const v = roles[role] ?? neutrals[level][scheme][role];
    if (!v) throw new Error(`brand builder: no colour for ${role}`);
    return longHex(v);
  };
  const a = target;
  const pairs: [string, string, number][] = [
    [`on-${a}`, a, 4.5],
    [`on-${a}-container`, `${a}-container`, 4.5],
    ...SURFACE_ROLES.map((s): [string, string, number] => [a, s, 4.5]),
    ...(a === 'primary' ? [['inverse-primary', 'inverse-surface', 3] as [string, string, number]] : []),
  ];
  return pairs.map(([fg, bg, min]) => {
    const [fgHex, bgHex] = [hex(fg), hex(bg)];
    const ratio = contrastRatio(fgHex, bgHex);
    return { id: `${fg}/${bg}`, fg, bg, fgHex, bgHex, ratio, min, pass: ratio >= min, apca: apca(fgHex, bgHex) };
  });
}

/** Every pair at every contrast level and scheme. */
export function checkAll(seed: string, target: Target, neutrals: Neutrals) {
  const checks = LEVELS.flatMap((level) =>
    SCHEMES.flatMap((scheme) => checkPairs(seed, target, level, scheme, neutrals).map((c) => ({ ...c, level, scheme }))),
  );
  return { total: checks.length, passed: checks.filter((c) => c.pass).length, failures: checks.filter((c) => !c.pass) };
}

/** The sentence the page's polite live region reads once the seed settles. */
export function summary(
  seed: string,
  scheme: Scheme,
  level: Level,
  checks: PairCheck[],
  all: { total: number; passed: number },
): string {
  const passed = checks.filter((c) => c.pass).length;
  const here = `${longHex(seed)}, ${scheme}, ${level} contrast: ${passed} of ${checks.length} pairs pass WCAG 2.`;
  const everywhere =
    all.passed === all.total
      ? `All ${all.total} checks pass across every level and scheme.`
      : `${all.total - all.passed} of ${all.total} checks fail across every level and scheme.`;
  return `${here} ${everywhere}`;
}

export interface ExportFile {
  id: 'css' | 'tailwind' | 'native' | 'react' | 'json';
  label: string;
  code: string;
  /** Set for files you can download as they are (the React tab is a snippet). */
  filename?: string;
  mime?: string;
}

/**
 * The theme in each format, from the @nexub/tokens/seed generators (not copies of them):
 * CSS custom properties (every contrast level), a Tailwind v4 `@theme` block, the native
 * role object, the React provider and DTCG tokens.
 */
export function buildExports(seed: string, target: Target, level: Level): ExportFile[] {
  const s = longHex(seed);
  const tertiary = target === 'tertiary';
  const opt = tertiary ? ", { target: 'tertiary' }" : '';
  const seedTarget = tertiary ? ' seedTarget="tertiary"' : '';
  const roles = createSeedRoles(s, { target, contrast: level });
  return [
    { id: 'css', label: 'CSS', filename: 'nexub-brand.css', mime: 'text/css', code: createSeedStylesheet(s, { target }) },
    {
      id: 'tailwind',
      label: 'Tailwind v4',
      filename: 'nexub-brand.tailwind.css',
      mime: 'text/css',
      code:
        `/* Tailwind v4, ${level} contrast. @import "tailwindcss"; then this file.\n` +
        ` * bg-${target}, text-on-${target} … follow color-scheme (light-dark()).\n` +
        ` * Using @nexub/tokens or @nexub/themes? Use the CSS export:\n` +
        ` * it carries every contrast level. */\n` +
        createSeedThemeCss(s, { selector: '@theme', target, contrast: level }),
    },
    {
      id: 'native',
      label: 'React Native',
      filename: 'nexub-brand.native.ts',
      mime: 'text/plain',
      code:
        `// ${level} contrast. The provider derives the same roles from the seed:\n` +
        `//   <NexubNativeProvider seed="${s}"${seedTarget}>\n` +
        `// or merge these over @nexub/tokens/native roles yourself (createSeedRoles('${s}'${opt})).\n` +
        `export const brandRoles = ${JSON.stringify(roles, null, 2)} as const;\n`,
    },
    {
      id: 'react',
      label: 'React',
      code: `<ThemeProvider seed="${s}"${seedTarget}>
  <App />
</ThemeProvider>

// No flash on first paint: also render the stylesheet on the server.
import { createSeedStylesheet } from '@nexub/tokens/seed';
<style>{createSeedStylesheet('${s}'${opt})}</style>`,
    },
    {
      id: 'json',
      label: 'Tokens (DTCG)',
      filename: 'nexub-brand.tokens.json',
      mime: 'application/json',
      code: JSON.stringify(createSeedTokens(s, { target, contrast: level }), null, 2) + '\n',
    },
  ];
}

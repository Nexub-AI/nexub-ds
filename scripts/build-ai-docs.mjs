// Builds the AI-facing docs from the same sources the docs site uses:
//   - the docs registry (apps/docs/src/registry) for components + patterns
//   - packages/tokens (token JSON + generated color roles)
// Outputs (all committed, so the Claude plugin can be installed straight from git):
//   plugins/nexub-ds/.claude-plugin/plugin.json      version = released package version
//   plugins/nexub-ds/skills/nexub-ds/references/**   tokens.md, components.md, components/<slug>.md, react-native.md
//   apps/docs/public/llms.txt, llms-full.txt         https://llmstxt.org
// @nexub/mcp ships the skill folder as-is (see packages/mcp/package.json).
//
//   pnpm ai-docs          write
//   pnpm ai-docs --check  fail if anything is stale (CI)

import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ROLES, tertiary, SPRINGS } from '../packages/tokens/scripts/generate.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const SITE_URL = 'https://nexub-ds-docs.pages.dev';
const plugin = join(root, 'plugins/nexub-ds');
const skill = join(plugin, 'skills/nexub-ds');
const refs = join(skill, 'references');
const version = JSON.parse(readFileSync(join(root, 'packages/react/package.json'), 'utf8')).version;

// ─── Registry ────────────────────────────────────────────────────────────────

const registry = join(root, 'apps/docs/src/registry');
const loadEntries = async (dir) => {
  const files = readdirSync(join(registry, dir)).filter((f) => f.endsWith('.ts')).sort();
  // Entry files only `import type`, so type stripping is enough to load them.
  return Promise.all(files.map(async (f) => (await import(pathToFileURL(join(registry, dir, f)).href)).default));
};
const entries = [...(await loadEntries('components')), ...(await loadEntries('patterns'))];

// Exported components with no registry entry still exist; list them so they are discoverable.
const pascal = (slug) => slug.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
const documented = new Set(entries.map((e) => pascal(e.meta.slug)));
const undocumented = Object.fromEntries(
  ['react', 'patterns'].map((p) => [
    `@nexub/${p}`,
    readdirSync(join(root, `packages/${p}/src/components`)).filter((c) => !documented.has(c)).sort(),
  ]),
);

const docsUrl = (e) => `${SITE_URL}/${e.meta.package === '@nexub/patterns' ? 'patterns' : 'components'}/${e.meta.slug}`;
const cell = (s = '') => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');

function componentMd(e) {
  const { meta, props, examples, usage, a11y } = e;
  const out = [`# ${meta.title}`, ''];
  if (meta.status === 'deprecated') {
    const d = meta.deprecation;
    const removal = d ? ` Removal planned in ${d.removeIn}: use [${pascal(d.replacement)}](${d.replacement}.md). ${d.migration}` : '';
    out.push(`> **Deprecated.** Do not use in new code.${removal} ${meta.description}`, '');
  }
  else out.push(meta.description, '');
  out.push(`- Package: \`${meta.package}\` · Category: ${meta.category} · Status: ${meta.status ?? 'stable'}`);
  out.push(`- Import: \`import { ${pascal(meta.slug)} } from '${meta.package}';\``);
  out.push(`- Docs: ${docsUrl(e)}`, '');
  if (usage) {
    out.push('## When to use', '', ...usage.whenToUse.map((u) => `- ${u}`), '');
    out.push('## When not to use', '', ...usage.whenNotToUse.map((u) => `- ${u}`), '');
  }
  if (props.length) {
    out.push('## Props', '', '| Prop | Type | Default | Description |', '| --- | --- | --- | --- |');
    for (const p of props) {
      out.push(`| \`${p.name}\`${p.required ? ' (required)' : ''} | \`${cell(p.type)}\` | ${p.default ? `\`${cell(p.default)}\`` : ''} | ${cell(p.description)} |`);
    }
    out.push('');
  }
  for (const ex of examples) {
    out.push(`## Example: ${ex.title}`, '');
    if (ex.description) out.push(ex.description, '');
    out.push('```tsx', ex.code.trim(), '```', '');
  }
  if (a11y) {
    out.push('## Accessibility', '');
    if (a11y.roles?.length) out.push(`- Roles: ${a11y.roles.join(', ')}`);
    for (const k of a11y.keyboard ?? []) out.push(`- \`${k.key}\`: ${k.description}`);
    for (const n of [...(a11y.focus ?? []), ...(a11y.screenReader ?? []), ...(a11y.notes ?? [])]) out.push(`- ${n}`);
    out.push('');
  }
  if (meta.related?.length) out.push(`Related: ${meta.related.map((r) => `[${r}](${r}.md)`).join(', ')}`, '');
  return out.join('\n');
}

function componentsIndexMd() {
  const byCategory = new Map();
  for (const e of entries) {
    const key = `${e.meta.package === '@nexub/patterns' ? 'Patterns' : 'Components'} — ${e.meta.category}`;
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push(e);
  }
  const out = [
    '# Component index',
    '',
    `Nexub DS v${version}. Open \`components/<slug>.md\` for props, examples and accessibility notes.`,
    'Never use a component marked deprecated.',
    '',
  ];
  for (const [category, list] of [...byCategory].sort(([a], [b]) => a.localeCompare(b))) {
    out.push(`## ${category}`, '');
    for (const e of list.sort((a, b) => a.meta.slug.localeCompare(b.meta.slug))) {
      const tag = e.meta.status === 'deprecated' ? ' **(deprecated)**' : '';
      out.push(`- [${e.meta.title}](components/${e.meta.slug}.md) \`${e.meta.package}\`${tag}: ${e.meta.description}`);
    }
    out.push('');
  }
  out.push('## Exported without a reference page', '', 'These exist; read their TypeScript props in `node_modules/<package>/dist/index.d.ts`.', '');
  for (const [pkg, names] of Object.entries(undocumented)) if (names.length) out.push(`- \`${pkg}\`: ${names.join(', ')}`);
  return out.join('\n') + '\n';
}

// ─── Tokens ──────────────────────────────────────────────────────────────────

const tokenFile = (name) => JSON.parse(readFileSync(join(root, `packages/tokens/tokens/${name}.json`), 'utf8'));
// [[path, value]] for every leaf token under `node`.
const flatten = (node, path = []) =>
  node && typeof node === 'object' && '$value' in node
    ? [[path, node.$value]]
    : Object.entries(node).filter(([k]) => !k.startsWith('$')).flatMap(([k, v]) => flatten(v, [...path, k]));
const table = (head, rows) => [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n');

const ROLE_USE = {
  surface: 'Page background',
  'surface-container-low': 'In-flow cards, sidebars',
  'surface-container': 'Default container',
  'surface-container-high': 'Pressed / neutral fills',
  'surface-elevated': 'Floating layers: menus, popovers, dialogs',
  'on-surface': 'Primary text',
  'on-surface-variant': 'Secondary text',
  'on-surface-muted': 'Tertiary text (still ≥ 4.5:1)',
  outline: 'Field borders, focus (≥ 3:1)',
  'outline-variant': 'Hairlines, dividers',
  primary: 'The one emphasised action; links',
  tertiary: 'Product brand accent (remapped by data-product)',
  error: 'Destructive / error',
};

function tokensMd() {
  const typography = tokenFile('typography');
  const roles = [...Object.keys(ROLES), ...Object.keys(tertiary('primary'))];
  const dims = (name, ns, tw) => flatten(tokenFile(name)[ns]).map(([p, v]) => [`\`--${[ns, ...p].join('-')}\``, tw(p.join('-')), v]);
  const out = [
    '# Tokens',
    '',
    `Nexub DS v${version}. Every token is a CSS custom property from \`@nexub/tokens/css\` (loaded by \`@nexub/themes/base\`).`,
    'The Tailwind preset (`@nexub/tokens/tailwind`) maps them to utilities. Never hardcode a hex, px spacing or shadow that a token covers.',
    '',
    '## Color roles',
    '',
    'Roles are `light-dark()` values: they follow `data-theme` and `data-contrast` automatically. Pair every background role with its `on-` role.',
    '',
    table(['Role', 'Tailwind', 'CSS var', 'Use for'], roles.map((r) => [`\`${r}\``, `\`bg-${r}\` / \`text-${r}\` / \`border-${r}\``, `\`--color-${r}\``, ROLE_USE[r] ?? ''])),
    '',
    'Legacy aliases (`--color-bg-*`, `--color-text-*`, `--color-border-*`, `--color-semantic-*`, raw `--color-brand-*` / `--color-accent-*` scales, `--gradient-*`) still work but must not be used in new code.',
    '',
    '## Chart colors',
    '',
    table(['CSS var', 'Value'], flatten(tokenFile('color').color.chart).map(([p, v]) => [`\`--color-chart-${p.join('-')}\``, v])),
    '',
    '## Typography roles',
    '',
    'Fonts: `font-sans` (Inter, UI), `font-display` (Plus Jakarta Sans, headlines), `font-mono` (Geist Mono, code and figures).',
    '',
    table(
      ['Tailwind', 'Size / line height', 'Weight'],
      Object.entries(typography.type).filter(([k]) => !k.startsWith('$')).map(([role, t]) => [`\`text-${role}\``, `${t.size.$value} / ${t.lineHeight.$value}`, t.weight.$value]),
    ),
    '',
    '## Spacing',
    '',
    table(['CSS var', 'Tailwind (p-, m-, gap-, w-, h-)', 'Value'], dims('spacing', 'spacing', (k) => `\`${k}\``)),
    '',
    'Containers: ' + flatten(tokenFile('spacing').container).map(([p, v]) => `\`max-w-container-${p.join('-')}\` (${v})`).join(', ') + '.',
    '',
    '## Control and component sizes',
    '',
    table(['CSS var', 'Tailwind', 'Value'], dims('size', 'size', (k) => (k.startsWith('control-') ? `\`h-${k}\`` : ''))),
    '',
    'Control heights shrink under `data-density="compact"`. Use the component `size` prop instead of setting heights.',
    '',
    '## Shape (corner radius by role)',
    '',
    table(['CSS var', 'Tailwind', 'Value'], dims('shape', 'shape', (k) => `\`rounded-shape-${k}\``)),
    '',
    'Raw radii (`rounded-sm` … `rounded-3xl`, `--radius-*`) exist; prefer the shape roles.',
    '',
    '## Elevation',
    '',
    table(['CSS var', 'Tailwind', 'Value'], dims('elevation', 'elevation', (k) => (/^\d$/.test(k) ? `\`shadow-elevation-${k}\`` : ''))),
    '',
    'Shadows are only for things that float. In-flow cards use tone (`surface-container-*`) and a hairline, not a shadow.',
    '',
    '## Motion',
    '',
    'Use springs, not durations. Each spring has a paired easing and duration:',
    '',
    table(
      ['Spring', 'Tailwind'],
      Object.entries(SPRINGS).flatMap(([kind, speeds]) =>
        Object.keys(speeds).map((s) => [`\`--motion-spring-${kind}-${s}-{easing,duration}\``, `\`ease-${kind}-${s} duration-${kind}-${s}\``]),
      ),
    ),
    '',
    '`spatial` = movement and size, `effects` = color and opacity (no bounce), `expressive` = key moments only. Exits use `fast`. Respect `prefers-reduced-motion`.',
    '',
    '## Z-index',
    '',
    table(['CSS var', 'Tailwind', 'Value'], dims('z-index', 'z', (k) => `\`z-${k}\``)),
    '',
    '## Breakpoints',
    '',
    flatten(tokenFile('breakpoint').breakpoint).map(([p, v]) => `\`${p.join('-')}\` ${v}`).join(' · '),
    '',
  ];
  return out.join('\n');
}

// ─── llms.txt ────────────────────────────────────────────────────────────────

const stripFrontmatter = (md) => md.replace(/^---\n[\s\S]*?\n---\n/, '');

function llmsTxt() {
  const out = [
    '# Nexub Design System',
    '',
    '> Token-driven React design system for SaaS products: @nexub/react components, @nexub/patterns composites, @nexub/tokens, @nexub/themes, @nexub/icons. Calm Depth visual language with an optional Liquid Glass material layer.',
    '',
    `Version ${version}. Install: \`npm install @nexub/react @nexub/patterns @nexub/themes @nexub/tokens @nexub/icons\`. Full reference for LLMs: ${SITE_URL}/llms-full.txt`,
    '',
    '## Docs',
    '',
    `- [Getting started](${SITE_URL}/getting-started): install, Tailwind preset, ThemeProvider`,
    `- [Principles](${SITE_URL}/foundations/principles): the six Calm Depth rules`,
    `- [Colors](${SITE_URL}/foundations/colors): color roles and contrast`,
    `- [Materials](${SITE_URL}/foundations/materials): Liquid Glass rules`,
    '',
    '## Components',
    '',
    ...entries.filter((e) => e.meta.package === '@nexub/react').map((e) => `- [${e.meta.title}](${docsUrl(e)}): ${e.meta.description}`),
    '',
    '## Patterns',
    '',
    ...entries.filter((e) => e.meta.package === '@nexub/patterns').map((e) => `- [${e.meta.title}](${docsUrl(e)}): ${e.meta.description}`),
    '',
    '## React Native',
    '',
    `- [React Native](${SITE_URL}/getting-started/react-native): @nexub/react-native components and @nexub/react-native/patterns screens for Expo and bare React Native apps (native chrome, Nexub content)`,
    '',
  ];
  return out.join('\n');
}

const llmsFullTxt = (files) =>
  [stripFrontmatter(readFileSync(join(skill, 'SKILL.md'), 'utf8')), files['tokens.md'], files['components.md'], ...entries.map((e) => files[`components/${e.meta.slug}.md`]), files['react-native.md']].join('\n\n---\n\n');

// ─── Write / check ───────────────────────────────────────────────────────────

// React Native: the package README is the reference (one source for npm, AI and people).
const files = {
  'tokens.md': tokensMd(),
  'components.md': componentsIndexMd(),
  'react-native.md': readFileSync(join(root, 'packages/react-native/README.md'), 'utf8'),
};
for (const e of entries) files[`components/${e.meta.slug}.md`] = componentMd(e);

const pluginJson = JSON.parse(readFileSync(join(plugin, '.claude-plugin/plugin.json'), 'utf8'));
const outputs = {
  ...Object.fromEntries(Object.entries(files).map(([f, s]) => [join(refs, f), s])),
  [join(plugin, '.claude-plugin/plugin.json')]: JSON.stringify({ ...pluginJson, version }, null, 2) + '\n',
  [join(root, 'apps/docs/public/llms.txt')]: llmsTxt(),
  [join(root, 'apps/docs/public/llms-full.txt')]: llmsFullTxt(files),
};

if (process.argv.includes('--check')) {
  const expected = new Set(Object.keys(outputs));
  const stale = Object.entries(outputs).filter(([p, s]) => !existsSync(p) || readFileSync(p, 'utf8') !== s).map(([p]) => p);
  const dir = join(refs, 'components');
  const orphans = existsSync(dir) ? readdirSync(dir).map((f) => join(dir, f)).filter((p) => !expected.has(p)) : [];
  if (stale.length || orphans.length) {
    console.error('AI docs are stale. Run `pnpm ai-docs` and commit the result:');
    for (const p of [...stale, ...orphans]) console.error(`  ${relative(root, p)}`);
    process.exit(1);
  }
  console.log(`ai-docs: up to date (${Object.keys(outputs).length} files, v${version})`);
} else {
  rmSync(join(refs, 'components'), { recursive: true, force: true });
  for (const [p, s] of Object.entries(outputs)) {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, s);
  }
  console.log(`ai-docs: wrote ${Object.keys(outputs).length} files (v${version})`);
}

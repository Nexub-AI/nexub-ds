// Serves the Nexub DS Claude skill (copied into dist/skill at build) over MCP,
// so every MCP client gets the same reference the Claude plugin ships.
import { readFileSync, existsSync } from 'node:fs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const skillDir = new URL('../dist/skill/', import.meta.url);
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const read = (path) => readFileSync(new URL(path, skillDir), 'utf8');
const text = (t) => ({ content: [{ type: 'text', text: t }] });

/** Parses references/components.md: `## <group>` headings and `- [Title](components/slug.md) \`pkg\`: desc` lines. */
export function loadCatalog() {
  const catalog = [];
  let group = '';
  for (const line of read('references/components.md').split('\n')) {
    if (line.startsWith('## ')) group = line.slice(3);
    const m = /^- \[(.+?)\]\(components\/([\w-]+)\.md\) `(.+?)`( \*\*\(deprecated\)\*\*)?: (.*)$/.exec(line);
    if (m) catalog.push({ title: m[1], slug: m[2], package: m[3], deprecated: Boolean(m[4]), group, description: m[5] });
  }
  return catalog;
}

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export function createServer() {
  const catalog = loadCatalog();
  const server = new McpServer({ name: 'nexub-ds', version });

  server.registerTool(
    'get_guidelines',
    {
      title: 'Nexub DS guidelines',
      description:
        'Setup steps, how to build a screen, Calm Depth principles, Liquid Glass rules, UI copy rules and the review checklist. Call this first before building any UI with Nexub DS.',
    },
    async () => text(read('SKILL.md').replace(/^---\n[\s\S]*?\n---\n/, '')),
  );

  server.registerTool(
    'list_components',
    {
      title: 'List Nexub components and patterns',
      description: 'Lists components (@nexub/react) and patterns (@nexub/patterns) with one-line descriptions. Optional query filters by name, category or description.',
      inputSchema: { query: z.string().optional().describe('e.g. "table", "pricing", "Overlays"') },
    },
    async ({ query }) => {
      const q = query?.toLowerCase();
      const hits = q ? catalog.filter((c) => `${c.title} ${c.group} ${c.description}`.toLowerCase().includes(q)) : catalog;
      if (!hits.length) return text(`No component matches "${query}". Call list_components with no query to see everything.`);
      return text(
        hits
          .map((c) => `- ${c.slug} (${c.title}, ${c.package}, ${c.group})${c.deprecated ? ' DEPRECATED, do not use' : ''}: ${c.description}`)
          .join('\n'),
      );
    },
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get a Nexub component reference',
      description: 'Props, import, examples, when to use and accessibility notes for one component or pattern. Accepts a slug ("date-picker") or name ("DatePicker").',
      inputSchema: { name: z.string().describe('Component slug or name') },
    },
    async ({ name }) => {
      const hit = catalog.find((c) => normalize(c.slug) === normalize(name) || normalize(c.title) === normalize(name));
      if (hit) return text(read(`references/components/${hit.slug}.md`));
      const close = catalog.filter((c) => normalize(c.slug).includes(normalize(name))).map((c) => c.slug);
      return text(
        `No reference page for "${name}".${close.length ? ` Did you mean: ${close.join(', ')}?` : ''} ` +
          'Some exported components have no page yet; read their props from the package .d.ts.',
      );
    },
  );

  server.registerTool(
    'get_tokens',
    {
      title: 'Get Nexub design tokens',
      description: 'Color roles, chart colors, typography roles, spacing, sizes, shape, elevation, motion, z-index and breakpoints, with Tailwind utilities and CSS variables. Optional section narrows the output.',
      inputSchema: {
        section: z.string().optional().describe('e.g. "Color roles", "Spacing", "Motion", "Typography roles"'),
      },
    },
    async ({ section }) => {
      const md = read('references/tokens.md');
      if (!section) return text(md);
      const parts = md.split(/\n(?=## )/);
      const hit = parts.find((p) => p.slice(3, p.indexOf('\n')).toLowerCase().includes(section.toLowerCase()));
      return text(hit ?? `No section "${section}". Sections: ${parts.slice(1).map((p) => p.slice(3, p.indexOf('\n'))).join(', ')}`);
    },
  );

  return server;
}

export const skillAvailable = () => existsSync(new URL('SKILL.md', skillDir));

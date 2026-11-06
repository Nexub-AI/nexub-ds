import * as fs from 'node:fs';
import * as path from 'node:path';
import type { Metadata } from 'next';
import type * as React from 'react';
import { Heading, Text } from '@nexub/react';
import { PageIntro, Section } from '@/components/kit';
import { exportName, mergeChangelogs, pageForCode } from '@/lib/changelog';
import { componentEntries, patternEntries } from '@/registry/index';
import { ChangelogBrowser } from '@/components/docs/ChangelogBrowser';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'What changed in each Nexub DS release, across every @nexub package.',
};

// Built from packages/*/CHANGELOG.md (written by Changesets) on every docs
// build, so a release shows up here with no manual step. Packages listed here
// come first; any new package follows alphabetically.
const ORDER = ['react', 'react-native', 'patterns', 'tokens', 'themes', 'icons', 'core', 'brand', 'mcp'];

function loadReleases() {
  const root = path.resolve(process.cwd(), '../../packages');
  const rank = (d: string) => (ORDER.includes(d) ? ORDER.indexOf(d) : ORDER.length);
  const dirs = fs
    .readdirSync(root)
    .filter((d) => fs.existsSync(path.join(root, d, 'CHANGELOG.md')))
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  return mergeChangelogs(
    dirs.map((d) => ({ name: `@nexub/${d}`, md: fs.readFileSync(path.join(root, d, 'CHANGELOG.md'), 'utf-8') })),
  );
}

// `BarChart` in a release note links to /components/bar-chart.
const PAGES = new Map([
  ...patternEntries.map((e) => [exportName(e.meta.slug), `/patterns/${e.meta.slug}`] as const),
  ...componentEntries.map((e) => [exportName(e.meta.slug), `/components/${e.meta.slug}`] as const),
]);

/* ── Minimal Markdown: paragraphs, nested "- " lists, `code`, **bold**, [links](url) ── */

const INLINE = /``\s?(.+?)\s?``|`([^`]+)`|\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function inline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    out.push(text.slice(last, m.index));
    const [, dbl, code, bold, label, href] = m;
    const k = m.index;
    if (dbl ?? code) {
      const c = (dbl ?? code)!;
      const page = pageForCode(c, PAGES);
      out.push(page ? <a key={k} href={page}><code>{c}</code></a> : <code key={k}>{c}</code>);
    }
    else if (bold) out.push(<strong key={k}>{inline(bold)}</strong>);
    else if (label && href && /^(https?:\/\/|\/)/.test(href)) out.push(<a key={k} href={href}>{inline(label)}</a>);
    else out.push(m[0]);
    last = k + m[0].length;
  }
  out.push(text.slice(last));
  return out;
}

interface Item { text: string; children: Item[] }
type Block = { p: string } | { ul: Item[] };

function blocks(md: string): Block[] {
  const out: Block[] = [];
  let para: string[] = [];
  let stack: { depth: number; items: Item[] }[] = [];
  const endPara = () => {
    if (para.length) out.push({ p: para.join(' ') });
    para = [];
  };
  for (const line of md.split('\n')) {
    const li = /^(\s*)- (.*)$/.exec(line);
    if (li) {
      endPara();
      const depth = Math.floor(li[1]!.length / 2);
      if (!stack.length) {
        const items: Item[] = [];
        out.push({ ul: items });
        stack = [{ depth, items }];
      }
      while (stack.length > 1 && depth < stack.at(-1)!.depth) stack.pop();
      const top = stack.at(-1)!;
      if (depth > top.depth && top.items.length) {
        const children = top.items.at(-1)!.children;
        stack.push({ depth, items: children });
      }
      stack.at(-1)!.items.push({ text: li[2]!, children: [] });
    } else if (!line.trim()) {
      endPara();
      stack = [];
    } else if (stack.length && /^\s/.test(line)) {
      stack.at(-1)!.items.at(-1)!.text += ' ' + line.trim();
    } else {
      stack = [];
      para.push(line.trim());
    }
  }
  endPara();
  return out;
}

const List = ({ items }: { items: Item[] }) => (
  <ul>
    {items.map((it, i) => (
      <li key={i}>
        {inline(it.text)}
        {it.children.length > 0 && <List items={it.children} />}
      </li>
    ))}
  </ul>
);

const Markdown = ({ md }: { md: string }) => (
  <>
    {blocks(md).map((b, i) => ('p' in b ? <p key={i}>{inline(b.p)}</p> : <List key={i} items={b.ul} />))}
  </>
);

export default function ChangelogPage() {
  const releases = loadReleases();
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Releases"
        title="Changelog"
        lead="Every Nexub DS release. Pick a series, then a version. All packages publish at the same version; each one's changes are listed under it."
      />

      <ChangelogBrowser
        releases={releases.map((r) => ({
          version: r.version,
          node: (
            <Section id={`v${r.version}`} title={<a href={`#v${r.version}`} className="text-inherit no-underline hover:underline">v{r.version}</a>}>
              {r.packages.length === 0 ? (
                <Text tone="muted">No user-facing changes; packages were republished at this version.</Text>
              ) : (
                r.packages.map((p) => (
                  <div key={p.name} className="flex flex-col gap-2">
                    <Heading level={3} className="font-mono text-title-md">
                      {p.name}
                    </Heading>
                    {p.entries.map((e, i) => (
                      <div key={i}>
                        <Markdown md={e.body} />
                      </div>
                    ))}
                  </div>
                ))
              )}
            </Section>
          ),
        }))}
      />
    </div>
  );
}

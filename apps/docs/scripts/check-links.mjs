// 8.8: no dead links in the docs. Reads the static export (apps/docs/out, after
// `pnpm --filter @nexub/docs build`) and checks every same-site href: the page
// exists, and a #fragment names an id on that page.
//   node scripts/check-links.mjs
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../out/', import.meta.url));
if (!existsSync(out)) throw new Error('apps/docs/out is missing: run `pnpm --filter @nexub/docs build` first');

const pages = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) { if (e.name !== '_next') walk(p); } else if (e.name.endsWith('.html')) pages.push(p);
  }
})(out);

// /a/b → a/b.html or a/b/index.html; static files (/llms.txt, /og.png) as they are.
const fileFor = (path) => {
  const clean = decodeURI(path).replace(/^\/|\/$/g, '');
  return [join(out, `${clean}.html`), join(out, clean, 'index.html'), join(out, clean)].find((f) => existsSync(f) && statSync(f).isFile());
};
const ids = new Map();
const idsOf = (file) => {
  if (!ids.has(file)) ids.set(file, new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(file);
};

const broken = new Set();
for (const page of pages) {
  // 404, and the full-page template demos under /examples, whose nav links are placeholders.
  if (page.endsWith('404.html') || relative(out, page).startsWith('examples/')) continue;
  const self = '/' + relative(out, page).replace(/(\/?index)?\.html$/, '');
  for (const [, raw] of readFileSync(page, 'utf8').matchAll(/<a\b[^>]*?\shref="([^"]+)"/g)) {
    const href = raw.replace(/&amp;/g, '&');
    if (!/^\/(?!\/)|^#/.test(href)) continue; // external, mailto:, protocol-relative
    const [beforeHash, hash] = href.split('#');
    const path = beforeHash.split('?')[0] || self;
    const file = fileFor(path);
    if (!file) broken.add(`${self} → ${href} (no page)`);
    else if (hash && file.endsWith('.html') && !idsOf(file).has(decodeURIComponent(hash))) broken.add(`${self} → ${href} (no #${hash})`);
  }
}

console.log(`docs links: ${pages.length} pages checked, ${broken.size} broken`);
for (const b of broken) console.error(`  ${b}`);
process.exit(broken.size ? 1 : 0);

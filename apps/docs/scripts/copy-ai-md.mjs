// Copies the per-component AI references (written by scripts/build-ai-docs.mjs
// into the Claude plugin) to public/components/<slug>.md and
// public/patterns/<slug>.md, so every docs page has a Markdown twin at the same
// URL plus ".md" (https://llmstxt.org). Gitignored: the plugin copy is the one
// committed source.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const docs = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(docs, '../../plugins/nexub-ds/skills/nexub-ds/references/components');
const out = { components: join(docs, 'public/components'), patterns: join(docs, 'public/patterns') };

for (const dir of Object.values(out)) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}
if (!existsSync(from)) throw new Error(`copy-ai-md: ${from} is missing. Run \`pnpm ai-docs\` first.`);
let n = 0;
for (const file of readdirSync(from).filter((f) => f.endsWith('.md'))) {
  // Same split as the docs routes, read from the page's own "Docs:" URL (src/registry/packages.ts
  // decides it: @nexub/react, @nexub/diagram and @nexub/elements under /components, the rest under /patterns).
  const kind = /^- Docs: \S+\/(components|patterns)\/[\w-]+$/m.exec(readFileSync(join(from, file), 'utf8'))?.[1];
  if (!kind) throw new Error(`copy-ai-md: ${file} has no "- Docs:" line`);
  copyFileSync(join(from, file), join(out[kind], file));
  n++;
}
console.log(`copy-ai-md: ${n} pages`);

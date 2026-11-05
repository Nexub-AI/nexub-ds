#!/usr/bin/env node
// nexub-usage: counts which @nexub exports your repos import, so the design
// system's deprecations and codemods follow real usage (roadmap R6).
//
//   npx -p @nexub/tokens nexub-usage ./apps/web ./apps/admin   markdown table
//   npx -p @nexub/tokens nexub-usage . --json                   JSON
//
// ponytail: regex over import statements, not a TS parse. It misses
// `import * as N` member use and re-exports; switch to the TS API if those matter.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKIP = new Set(['node_modules', 'dist', 'lib', 'build', '.next', '.expo', '.turbo', '.git', 'coverage']);
const EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const IMPORT = /import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*['"](@nexub\/[^'"]+)['"]/g;

/** Returns [{ pkg, name }] for every named @nexub import in one source file. */
export function scanSource(text) {
  const out = [];
  for (const [, names, pkg] of text.matchAll(IMPORT)) {
    for (const raw of names.split(',')) {
      const name = raw.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
      if (name) out.push({ pkg, name });
    }
  }
  return out;
}

function* files(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* files(path);
    else if (EXT.has(extname(entry))) yield path;
  }
}

/** Tallies imports across repos: one row per pkg + export, with use and repo counts. */
export function scanRepos(roots) {
  const tally = new Map();
  for (const root of roots) {
    for (const file of files(root)) {
      for (const { pkg, name } of scanSource(readFileSync(file, 'utf8'))) {
        const key = `${pkg} ${name}`;
        const row = tally.get(key) ?? { pkg, name, uses: 0, repos: new Set() };
        row.uses++;
        row.repos.add(root);
        tally.set(key, row);
      }
    }
  }
  return [...tally.values()].sort((a, b) => b.uses - a.uses || a.name.localeCompare(b.name));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const roots = args.filter((a) => !a.startsWith('--'));
  if (!roots.length) {
    console.error('usage: nexub-usage <repo-dir>... [--json]');
    process.exit(1);
  }
  const rows = scanRepos(roots);
  if (args.includes('--json')) {
    console.log(JSON.stringify(rows.map((r) => ({ ...r, repos: [...r.repos] })), null, 2));
  } else {
    console.log('| Package | Export | Imports | Repos |\n|---|---|---|---|');
    for (const r of rows) console.log(`| ${r.pkg} | ${r.name} | ${r.uses} | ${r.repos.size} |`);
  }
}

// CI guard for the versioning policy (PUBLISHING.md → "Versioning policy"):
// changesets may only request "minor" (normal release) or "patch" (hotfix).
// Majors happen automatically when the minor rolls over past 9.

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function invalidBumps(markdown) {
  const front = /^---\n([\s\S]*?)\n---/.exec(markdown)?.[1] ?? '';
  return [...front.matchAll(/^\s*["']?([^"':]+)["']?\s*:\s*(\w+)\s*$/gm)]
    .filter(([, , bump]) => bump !== 'minor' && bump !== 'patch')
    .map(([, pkg, bump]) => `${pkg}: ${bump}`);
}

function main() {
  const dir = fileURLToPath(new URL('../.changeset/', import.meta.url));
  const problems = readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .flatMap((f) => invalidBumps(readFileSync(dir + f, 'utf8')).map((p) => `.changeset/${f} → ${p}`));
  if (problems.length) {
    console.error(
      'Changesets must use "minor" or "patch" only (majors come from minor rollover):\n  ' +
        problems.join('\n  '),
    );
    process.exit(1);
  }
  console.log('check-changesets: ok');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

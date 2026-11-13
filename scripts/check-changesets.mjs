// CI guard for the versioning policy (PUBLISHING.md → "Versioning policy"):
// changesets may only request "minor" (normal release) or "patch" (hotfix).
// Up to 10.0, majors came from the minor rolling over past 9. From 10.0 on there is no
// rollover: a major needs an RFC and a migration guide, and the PR that ships it changes this guard.

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
      'Changesets must use "minor" or "patch" only (a major needs an RFC, see PUBLISHING.md):\n  ' +
        problems.join('\n  '),
    );
    process.exit(1);
  }
  console.log('check-changesets: ok');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

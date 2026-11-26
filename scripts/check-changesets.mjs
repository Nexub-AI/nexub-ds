// CI guard for the versioning policy (PUBLISHING.md → "Versioning policy"):
// changesets may only request "minor" (normal release) or "patch" (hotfix).
// Up to 10.0, majors came from the minor rolling over past 9. From 10.0 on there is no
// rollover: a major needs an RFC and a migration guide, and the PR that ships it changes this guard.

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { APPROVED_MAJOR } from './release-version.mjs';

/** `allowMajor`: true only while the release an accepted RFC approved is still unreleased (see main). */
export function invalidBumps(markdown, allowMajor = false) {
  const front = /^---\n([\s\S]*?)\n---/.exec(markdown)?.[1] ?? '';
  return [...front.matchAll(/^\s*["']?([^"':]+)["']?\s*:\s*(\w+)\s*$/gm)]
    .filter(([, , bump]) => bump !== 'minor' && bump !== 'patch' && !(allowMajor && bump === 'major'))
    .map(([, pkg, bump]) => `${pkg}: ${bump}`);
}

function main() {
  const dir = fileURLToPath(new URL('../.changeset/', import.meta.url));
  // A `major` is accepted only on the line just before the approved major (11.x for 12.0).
  const current = JSON.parse(readFileSync(new URL('../packages/react/package.json', import.meta.url), 'utf8')).version;
  const allowMajor = Number(current.split('.')[0]) === APPROVED_MAJOR - 1;
  const problems = readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .flatMap((f) => invalidBumps(readFileSync(dir + f, 'utf8'), allowMajor).map((p) => `.changeset/${f} → ${p}`));
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

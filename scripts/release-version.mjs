// Release versioning policy (see PUBLISHING.md → "Versioning policy").
//
// All @nexub/* packages share one version. Every release bumps the MINOR:
//   1.0.0 → 1.1.0 → … → 1.9.0 → 2.0.0 → 2.1.0 …   (patch: 1.4.0 → 1.4.1)
// i.e. the minor "rolls over" into the major after 9. Major bumps are never
// requested directly — scripts/check-changesets.mjs rejects them in CI.
//
// Runs after `changeset version` (root script `version-packages`), which has
// already written e.g. 1.10.0; this rewrites that to 2.0.0 everywhere.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const parse = (v) => {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
  if (!m) throw new Error(`Unsupported version "${v}" (expected MAJOR.MINOR.PATCH)`);
  return m.slice(1).map(Number);
};

/** Version to publish, given the previous release and what changesets proposed. */
export function nextVersion(previous, proposed) {
  const [pMaj] = parse(previous);
  const [maj, min, pat] = parse(proposed);
  if (maj !== pMaj) {
    throw new Error(
      `changesets proposed a major bump (${previous} → ${proposed}). ` +
        'Majors only happen by minor rollover; use "minor" or "patch" in changesets.',
    );
  }
  if (min >= 10) return `${maj + 1}.0.0`;
  return `${maj}.${min}.${pat}`;
}

/**
 * Rename the newest release section of a CHANGELOG from the proposed version to
 * the rolled-over one: the `## x.10.0` heading and every `@nexub/*@x.10.0`
 * dependency line inside that section (older sections are untouched).
 */
export function renameChangelogSection(text, from, to) {
  const heading = `\n## ${from}\n`;
  const start = text.indexOf(heading);
  if (start === -1) return text;
  const bodyStart = start + heading.length;
  const next = text.indexOf('\n## ', bodyStart);
  const end = next === -1 ? text.length : next;
  const body = text.slice(bodyStart, end).split(`@${from}`).join(`@${to}`);
  return `${text.slice(0, start)}\n## ${to}\n${body}${text.slice(end)}`;
}

function main() {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const pkgs = readdirSync(`${root}packages`)
    .map((dir) => `${root}packages/${dir}`)
    .filter((dir) => existsSync(`${dir}/package.json`))
    .map((dir) => ({ dir, json: JSON.parse(readFileSync(`${dir}/package.json`, 'utf8')) }))
    .filter((p) => !p.json.private);

  const proposed = [...new Set(pkgs.map((p) => p.json.version))];
  if (proposed.length !== 1) {
    throw new Error(`Packages are not in lockstep: ${proposed.join(', ')}`);
  }

  // Previous release = version in the last commit (before `changeset version` ran).
  const previous = JSON.parse(
    execFileSync('git', ['show', 'HEAD:packages/react/package.json'], { cwd: root, encoding: 'utf8' }),
  ).version;

  const target = nextVersion(previous, proposed[0]);
  if (target === proposed[0]) {
    console.log(`release-version: ${previous} → ${target}`);
    return;
  }

  for (const { dir, json } of pkgs) {
    json.version = target;
    writeFileSync(`${dir}/package.json`, `${JSON.stringify(json, null, 2)}\n`);
    const changelog = `${dir}/CHANGELOG.md`;
    if (existsSync(changelog)) {
      const text = readFileSync(changelog, 'utf8');
      writeFileSync(changelog, renameChangelogSection(text, proposed[0], target));
    }
  }
  console.log(`release-version: ${previous} → ${target} (rolled over from ${proposed[0]})`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

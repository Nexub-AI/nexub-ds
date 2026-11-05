// Merges the per-package CHANGELOG.md files Changesets writes into one
// release history: newest version first, each package's changes under it.
// Pure (no fs) so test/changelog.test.ts can run it under node --test.

export interface ChangelogEntry {
  /** Markdown body, dedented, commit-hash prefix removed. */
  body: string;
}

export interface PackageChanges {
  name: string;
  entries: ChangelogEntry[];
}

export interface Release {
  version: string;
  packages: PackageChanges[];
}

const isNoise = (first: string) =>
  first.startsWith('Updated dependencies') || /^@nexub\/[\w-]+@\S+$/.test(first);

/** version → entries for one CHANGELOG.md. */
export function parseChangelog(md: string): Map<string, ChangelogEntry[]> {
  const out = new Map<string, ChangelogEntry[]>();
  let entries: ChangelogEntry[] | undefined;
  let current: string[] | undefined;

  const flush = () => {
    if (!current || !entries) return;
    const first = current[0] ?? '';
    if (!isNoise(first)) {
      const body = current.join('\n').replace(/^[0-9a-f]{7,40}: /, '').trim();
      if (body) entries.push({ body });
    }
    current = undefined;
  };

  for (const line of md.split('\n')) {
    const version = /^## (\d+\.\d+\.\d+\S*)\s*$/.exec(line);
    if (version) {
      flush();
      entries = [];
      out.set(version[1]!, entries);
    } else if (line.startsWith('#')) {
      flush(); // "### Minor Changes" etc.
    } else if (line.startsWith('- ')) {
      flush();
      current = [line.slice(2)];
    } else if (current) {
      current.push(line.startsWith('  ') ? line.slice(2) : line);
    }
  }
  flush();
  return out;
}

const compareVersions = (a: string, b: string) => {
  const pa = a.split(/[.-]/).map(Number);
  const pb = b.split(/[.-]/).map(Number);
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return (pb[i] ?? 0) - (pa[i] ?? 0);
  return 0;
};

/**
 * One release per version across all packages, newest first. A changeset that
 * bumps several packages is copied into each of their changelogs; it is shown
 * once, under the first package (in the order given) that lists it.
 */
export function mergeChangelogs(changelogs: { name: string; md: string }[]): Release[] {
  const byVersion = new Map<string, PackageChanges[]>();
  for (const { name, md } of changelogs) {
    for (const [version, entries] of parseChangelog(md)) {
      const list = byVersion.get(version) ?? [];
      byVersion.set(version, list);
      const seen = new Set(list.flatMap((p) => p.entries.map((e) => e.body)));
      const fresh = entries.filter((e) => !seen.has(e.body));
      if (fresh.length) list.push({ name, entries: fresh });
    }
  }
  return [...byVersion]
    .sort(([a], [b]) => compareVersions(a, b))
    .map(([version, packages]) => ({ version, packages }));
}

# Changesets

This directory is used by [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

## Adding a changeset

```bash
pnpm changeset
```

Pick **`minor`** for every normal change, or **`patch`** for a hotfix to the current release. **Never `major`**: CI rejects it. The major rolls over automatically after `x.9` (`1.9.x → 2.0.0`).

All five `@nexub/*` packages share one version (`fixed` group), and all of a release's changesets combine into one bump.

Breaking change? Still `minor`. Start the line with `**Breaking:**` and add a one-line migration.

Full policy: [PUBLISHING.md → Versioning Policy](../PUBLISHING.md#versioning-policy).

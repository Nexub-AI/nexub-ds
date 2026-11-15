# Changesets

This directory is used by [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

## Adding a changeset

```bash
pnpm changeset
```

Pick **`minor`** for every normal change, or **`patch`** for a hotfix to the current release. **Never `major`**: CI rejects it. 9.9 → 10.0 is the last automatic rollover; from 10.0 a major needs an RFC and a migration guide.

All seven `@nexub/*` packages share one version (`fixed` group), and all of a release's changesets combine into one bump.

Breaking change? Not in a 10.x minor: deprecate first, and propose the removal as an RFC for the next major.

Full policy: [PUBLISHING.md → Versioning Policy](../PUBLISHING.md#versioning-policy).

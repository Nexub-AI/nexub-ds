# Changesets

This directory is used by [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

## Adding a changeset

```bash
pnpm changeset
```

Follow the prompts to select which packages changed and describe the change. All five `@nexub/*` packages are **linked**, so bumping one with `minor` bumps all five.

## What constitutes a patch vs minor vs major?

- **patch** — bug fix, docs, internal refactor with no public API change.
- **minor** — new component, new prop, new token, backwards-compatible addition.
- **major** — breaking API change (prop rename, removed export, token rename that changes CSS var names).

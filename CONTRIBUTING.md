# Contributing to Nexub Design System

## Setup

```bash
node --version   # >= 20
pnpm --version   # >= 9
pnpm install
pnpm build
```

## Adding a changeset

Every change that affects a published package must include a changeset:

```bash
pnpm changeset
```

Use **`minor`** (or **`patch`** for a hotfix). **Never `major`**: CI rejects it, and the major rolls over automatically after `x.9`. All five `@nexub/*` packages share one version. See [PUBLISHING.md → Versioning Policy](./PUBLISHING.md#versioning-policy).

### Semver guide

| Type | When to use |
| --- | --- |
| `patch` | Bug fix, docs, internal refactor with no public API change |
| `minor` | New component, new prop, new token, backwards-compatible addition |
| `major` | Breaking API change — prop rename, removed export, CSS var rename |

## Adding a component

1. Create `packages/react/src/components/<Name>/` with `<Name>.tsx`, `<Name>.test.tsx`, `<Name>.stories.tsx`, `index.ts`.
2. Add `export * from './components/<Name>/index.js';` to `packages/react/src/index.ts`.
3. Add a changeset.
4. Open a PR; CI must be green.

## PR checklist

- [ ] `pnpm build` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test` passes.
- [ ] No hard-coded hex colors in component files.
- [ ] Changeset included.
- [ ] Storybook story added or updated.

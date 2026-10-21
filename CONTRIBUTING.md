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

Use **`minor`** (or **`patch`** for a hotfix). **Never `major`**: CI rejects it, and the major rolls over automatically after `x.9`. All six `@nexub/*` packages share one version. See [PUBLISHING.md → Versioning Policy](./PUBLISHING.md#versioning-policy).

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

## Running CI locally

Tests run locally and on the office Mac minis (self-hosted runners); GitHub-hosted
Actions only deploy and release. Before you open or merge a PR, run what CI runs:

```bash
pnpm ci:local          # audit, build, bundle size, docs build, release policy, AI docs, typecheck, lint, tests
pnpm ci:local:visual   # Storybook + docs screenshots, axe and contrast (needs Docker, e.g. Colima)
```

## Visual regression & contrast

CI screenshots every Storybook story (light, dark, payub) and checks WCAG AA contrast for theme token pairs (`packages/react/visual/`). Baselines must be rendered in the pinned Playwright Linux image, so run them through Docker:

```bash
pnpm turbo build --filter='./packages/*' && pnpm --filter @nexub/react build-storybook
pnpm --filter @nexub/react test:visual:docker                       # check
pnpm --filter @nexub/react test:visual:docker --update-snapshots    # accept intended changes
```

Review the changed PNGs in the PR diff before committing them. Contrast failures that already exist are listed in `KNOWN` in `contrast.spec.ts`. That list may only shrink.

## PR checklist

- [ ] `pnpm build` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test` passes.
- [ ] No hard-coded hex colors in component files.
- [ ] Changeset included.
- [ ] Storybook story added or updated.

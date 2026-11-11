# How to give feedback

Nexub is open source but not open contribution. The code is MIT and public: read it, use it, fork it. Only maintainers write it, which keeps the design coherent, keeps outside code out of CI, and keeps maintainer time on the library.

**How you are heard:**

- **Bug, glitch, feature request, docs or accessibility problem:** open an [issue](https://github.com/Nexub-AI/nexub-ds/issues/new/choose) with the matching form.
- **Questions and ideas:** [GitHub Discussions](https://github.com/Nexub-AI/nexub-ds/discussions).
- **Something wrong on a docs page:** the Feedback button on that page.

Ideas with real demand become an RFC that a maintainer writes and builds ([GOVERNANCE.md](./GOVERNANCE.md#proposing-a-change)).

**Pull requests from outside the maintainer team are closed automatically** with a pointer to the issue forms. Please don't take it personally; open an issue instead and we'll build it.

**Glitches** (visual or interaction defects: flicker, layout shift, focus lost, wrong state) get the `glitch` label and are triaged within 14 days.

---

# For maintainers

New components, new packages, breaking changes and new token categories need an RFC first. See [GOVERNANCE.md](./GOVERNANCE.md) for the RFC template, who decides, the component status lifecycle (alpha → beta → stable → deprecated) and the deprecation policy.

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

Use **`minor`** (or **`patch`** for a hotfix). **Never `major`**: CI rejects it, and the major rolls over automatically after `x.9`. All seven `@nexub/*` packages share one version. See [PUBLISHING.md → Versioning Policy](./PUBLISHING.md#versioning-policy).

### Semver guide

| Type | When to use |
| --- | --- |
| `patch` | Bug fix, docs, internal refactor with no public API change |
| `minor` | New component, new prop, new token, backwards-compatible addition. Breaking changes are minors too: start the line with `**Breaking:**` and give the migration |

## Adding a component

1. Get the RFC accepted ([GOVERNANCE.md](./GOVERNANCE.md#proposing-a-change)).
2. Create `packages/react/src/components/<Name>/` with `<Name>.tsx`, `<Name>.test.tsx`, `<Name>.stories.tsx`, `index.ts`.
3. Add `export * from './components/<Name>/index.js';` to `packages/react/src/index.ts`.
4. Add a docs registry entry (`apps/docs/src/registry/components/<slug>.ts`) with `status: 'alpha'`; promotion criteria are in [GOVERNANCE.md](./GOVERNANCE.md#status-lifecycle). Each entry in its `examples` gets one file, `apps/docs/src/examples/components/<slug>/<index>.tsx`, with a default export: it is the live preview, and its source is the code the docs and AI docs show.
5. Add a changeset.
6. Open a PR; CI must be green.

## Running CI locally

CI runs on GitHub-hosted runners (the repo is public, so minutes are free). Before you
push, run what CI runs:

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

## Knowledge graph (graphify)

A local knowledge graph of the repo helps answer "what uses X?" or "why was Y decided?" before you change things. It is not committed.

```bash
uv tool install graphifyy             # once
graphify update .                     # code only, no LLM: refresh after pulling
```

In Claude Code, `/graphify .` builds the full graph (code plus the plans, READMEs and changelogs) and `/graphify query "…"` searches it. `.graphifyignore` keeps out screenshots, brand images and generated docs. Output goes to `graphify-out/` (gitignored): `GRAPH_REPORT.md`, `graph.json` and an interactive `graph.html`.

## PR checklist

- [ ] `pnpm build` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test` passes.
- [ ] No hard-coded hex colors in component files.
- [ ] Changeset included.
- [ ] Storybook story added or updated.

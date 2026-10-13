# Nexub DS — Publishing Guide

This document is the canonical reference for releasing packages.
Update the [Release History](#release-history) table after every publish.

---

## Package Overview

| Package | npm | Purpose |
|---|---|---|
| `@nexub/tokens` | [![npm](https://img.shields.io/npm/v/@nexub/tokens)](https://www.npmjs.com/package/@nexub/tokens) | Design tokens (CSS vars + Tailwind preset) |
| `@nexub/themes` | [![npm](https://img.shields.io/npm/v/@nexub/themes)](https://www.npmjs.com/package/@nexub/themes) | CSS theme files (light, dark, 4 brands) |
| `@nexub/icons` | [![npm](https://img.shields.io/npm/v/@nexub/icons)](https://www.npmjs.com/package/@nexub/icons) | Tree-shakeable icon components |
| `@nexub/react` | [![npm](https://img.shields.io/npm/v/@nexub/react)](https://www.npmjs.com/package/@nexub/react) | 90+ React UI components |
| `@nexub/patterns` | [![npm](https://img.shields.io/npm/v/@nexub/patterns)](https://www.npmjs.com/package/@nexub/patterns) | Composite UI patterns |
| `@nexub/brand` | [![npm](https://img.shields.io/npm/v/@nexub/brand)](https://www.npmjs.com/package/@nexub/brand) | Brand files (mark SVGs, app icons, favicon) |

All six packages are in a changesets **`fixed`** group — they always publish at the same version number.
`@nexub/docs` is excluded from publishing (it's the docs website, not a library).

---

## Release History

| Version | Date | Type | Summary | Tag |
|---|---|---|---|---|
| `0.0.1` | — | Initial | Initial private release (pre-public, workspace only) | — |
| `0.0.2` | 2026-04-27 | Patch | Focus ring double-ring fix (Input, Textarea, Select, NumberInput, Heading); Toast SSR guard; Collapse RAF cleanup; FileUpload useMemo; useMergedRefs stable callback; Motion willChange hints | [v0.0.2](https://github.com/Nexub-AI/nexub-ds/releases/tag/v0.0.2) |
| `1.0.0` | 2026-10-12 | Major | Liquid Glass material layer; first public 1.0 (lockstep versioning) | — |
| `1.1.0` | 2026-10-12 | Minor | Plus Jakarta Sans typeface; ESM-only packages with working tree-shaking and RSC-safe builds; accessibility and stability fixes (DatePicker labels, WCAG input borders); lighter dependencies; StatusPill/Tag/Banner/Callout deprecated | [@nexub/react@1.1.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.1.0) |
| `1.2.0` | 2026-10-12 | Minor | Official Nexub mark in `Logo` (`mark`, `product`, brand-mark tokens); new `@nexub/brand` package; `AppLauncher` and `SettingsLayout` patterns; `Apps`/`Pin`/`Send`/`Crown` icons; Sheet sideways-scroll, Tabs inactive-panel and Drawer CSP fixes | [@nexub/react@1.2.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.2.0) |

---

## Versioning Policy

Nexub DS uses **one rolling version** for all six packages. It is not strict semver. **Every release bumps the minor**, and the minor **rolls over into the major after 9**:

```
1.0.0 → 1.1.0 → 1.2.0 → … → 1.9.0 → 2.0.0 → 2.1.0 → … → 2.9.0 → 3.0.0
```

| Situation | Changeset bump | Example |
|---|---|---|
| Normal release (features, fixes, breaking changes, anything) | `minor` | `1.3.0` → `1.4.0` |
| Hotfix to the current release only | `patch` | `1.4.0` → `1.4.1` |
| Next release after any `x.9.y` | `minor` (rolls over automatically) | `1.9.1` → `2.0.0` |
| `major` | **never**. CI rejects it | — |

Rules:
1. **Write changesets with `minor` or `patch` only.** `pnpm check:release-policy` (in CI) fails on `major`.
2. **Multiple changesets in one release still produce one bump.** All packages share a version (changesets `fixed` group) and the highest bump wins, so a day's worth of `minor` changesets ships as a single `1.x+1.0`.
3. **Rollover is automatic.** The release job runs `pnpm version-packages` = `changeset version` + `scripts/release-version.mjs`, which turns `x.10.0` into `x+1.0.0` in every `package.json` and CHANGELOG.
4. **Breaking changes ship in a minor, so say so.** Consumers on `^1.0.0` receive every 1.x automatically. Start the changeset line with `**Breaking:**` and give the one-line migration. Removals go through a deprecation first (`@deprecated` JSDoc for at least one release) wherever practical.
5. **After every publish, merge the back-merge PR.** The release job opens `chore(release): back-merge vX into development` (production → development). Merge it before the next promotion, or the version lines will conflict.

The policy code lives in `scripts/release-version.mjs` and `scripts/check-changesets.mjs`, tested by `scripts/release-version.test.mjs`.

---|---|---|
| Bug fix, internal refactor, performance, docs | `patch` | `0.0.2` → `0.0.3` |
| New component, new prop, backward-compatible feature | `minor` | `0.0.3` → `0.1.0` |
| Renamed/removed export, breaking prop change, peer dep bump | `major` | `0.1.0` → `1.0.0` |

All packages in the fixed group always bump to the **same version** even if only one package changed.

---

## Release Process

Publishing is automated by `.github/workflows/release.yml` (changesets/action). Nobody runs `npm publish` by hand.

1. **Add a changeset in your PR.** Run `pnpm changeset` and pick **`minor`** (or `patch` for a hotfix). See the [Versioning Policy](#versioning-policy). Or write `.changeset/<name>.md` by hand:
   ```markdown
   ---
   "@nexub/react": patch
   ---

   Short description of what changed and why.
   ```
   Use one changeset per logical change. All of a release's changesets combine into one version bump.
2. **Merge through the branches:** feature → `development` (CI) → `staging` (deploys the staging docs) → `production`.
3. **The first push to `production`** with pending changesets makes changesets/action open or update a **"chore(release): version packages"** PR. That PR bumps versions and writes the CHANGELOGs.
4. **Merging the version PR** publishes all `@nexub/*` packages to npm (`pnpm release`, using the `NPM_TOKEN` secret) and deploys the docs to production.
5. **Add a row** to the [Release History](#release-history) table.

> The release job authenticates with the `RELEASE_PAT` repo secret (a fine-grained PAT with Contents + Pull requests write), because the org blocks the Actions bot from creating PRs. Since the version PR is opened by a real user, CI runs on it like any other PR.

### Pre-flight check (optional)

```bash
pnpm turbo build --filter='./packages/*'
for pkg in tokens themes icons react patterns; do (cd packages/$pkg && npm pack --dry-run); done
```

Check that only `dist/` (or `src/` for themes) is listed and that react stays under ~150 KB packed.

### Break-glass: manual publish

Use this only if the workflow is broken. Run `npm login` (`npm whoami` to confirm), then `pnpm changeset version`, `pnpm release`, and commit the version bump.

---

## Troubleshooting

### `workspace:*` dependencies in published package
pnpm rewrites `workspace:*` and `workspace:^` to real versions on publish. Verify with `npm pack --dry-run`.

### "Package name too similar to existing package" / 403 on first publish
The `@nexub` scope must exist on npm and you must have publish rights.
Create the org at https://www.npmjs.com/org/create if needed.

### Publish succeeded but `npm view` shows old version
npm CDN propagates in ~30 seconds. Wait and re-run `npm view`.

---

## What ships in each package

| Package | Ships | Does NOT ship |
|---|---|---|
| `@nexub/tokens` | `dist/` (CSS vars, JS, Tailwind preset, JSON) | `src/`, `scripts/`, tests |
| `@nexub/themes` | `src/` (raw CSS files) | nothing extra — CSS is the source |
| `@nexub/icons` | `dist/` (ESM + types) | `src/`, tests |
| `@nexub/react` | `dist/` (ESM, one entry per component, + types) | `src/`, tests, stories |
| `@nexub/patterns` | `dist/` (ESM + types) | `src/`, tests |
| `@nexub/brand` | `assets/` (SVG, PNG, ICO) | `scripts/`, `glyphs/` |

---

## Peer Dependencies

| Package | Peers |
|---|---|
| `@nexub/react` | `react`, `react-dom` `>=18 <20`; `@nexub/tokens` |
| `@nexub/patterns` | `react`, `react-dom`; `@nexub/react` (+ optional `@nexub/icons`, `@nexub/tokens`) |
| `@nexub/icons` | `react`, `react-dom` `>=18 <20` |
| `@nexub/tokens` | optional `tailwindcss ^3` (only for the Tailwind preset) |
| `@nexub/themes` | none |
| `@nexub/brand` | none |

All packages are **ESM-only**. Loading the Tailwind preset with `require()` needs Node ≥ 20.19.

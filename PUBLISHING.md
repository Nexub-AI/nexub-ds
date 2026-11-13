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
| `@nexub/mcp` | [![npm](https://img.shields.io/npm/v/@nexub/mcp)](https://www.npmjs.com/package/@nexub/mcp) | MCP server serving the Claude skill (components, tokens, rules) |

All seven packages are in a changesets **`fixed`** group — they always publish at the same version number.
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
| `1.3.0` | 2026-10-13 | Minor | Strict CSP: `scrollLock="class"` for Sheet/Drawer; fully typed Drawer without `vaul`; `Sidebar.Header`; Strict CSP docs page | [@nexub/react@1.3.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.3.0) |
| `1.4.0` | 2026-10-20 | Minor | Calm Depth refresh, phases 0–4: HCT colour roles, Inter + Jakarta, capsule controls, spring motion, Glass 2.0 dial, overlays and surfaces; visual regression | [@nexub/react@1.4.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.4.0) |
| `1.5.0` | 2026-10-20 | Minor | Connected ButtonGroup, SplitButton, floating Toolbar, NavigationRail, Amount/MoneyInput, ListDetail; rewritten foundations docs | [@nexub/react@1.5.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.5.0) |
| `1.5.1` | 2026-10-20 | Patch | Landing page on DS components; `TextGradient` background-image fix | [@nexub/react@1.5.1](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.5.1) |
| `1.6.0` | 2026-10-21 | Minor | Enhancement waves 1–4: strict-CSP components, every component on Calm Depth, design lint; cards, sheen, selectable/media cards, stacked toasts; data-viz palettes, P3, medium contrast, async buttons, ErrorSummary, undo, i18n/RTL; AI surface kit. | [@nexub/react@1.6.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.6.0) |
| `1.7.0` | 2026-10-21 | Minor | Hardening: axe checks over every story, bundle-size budgets, docs visual tests; date pickers follow locale + RTL; native-label FileUpload; accessibility fixes; Claude skill, `llms.txt` and new `@nexub/mcp` package | [@nexub/react@1.7.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.7.0) |
| `1.8.0` | 2026-10-21 | Minor | Adoption: `nexub-migrate` CLI, Upgrading guide, example dashboard; DataTable column type/alignment/caption, keyboard-scrollable Table, StatCard `sentiment`, PageHeader `level`, AppHeader `position` + translatable strings; RTL fixes | [@nexub/react@1.8.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.8.0) |
| `1.9.0` | 2026-10-21 | Minor | Foundations: brand theming from a seed colour (`ThemeProvider seed`, `@nexub/tokens/seed`); Tailwind v4 theme (`@nexub/tokens/tailwind.css`) | [@nexub/react@1.9.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%401.9.0) |
| `2.0.0` | 2026-10-28 | Minor | Rolling-minor release after 1.9 (not breaking): app tiles for every Nexub app in `@nexub/brand`, `AppLauncher` groups; body-parser 2.4.0. (its changelogs first listed dependencies as `1.10.0`, the pre-rollover name; corrected, and the rollover script now renames them) | [@nexub/react@2.0.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%402.0.0) |
| `2.1.0` | 2026-10-30 | Minor | React Native support: new `@nexub/react-native` (provider, primitives, components and screen patterns for iOS and Android), new `@nexub/core` (strings, locale, money formatting and prop types shared by web and native), `@nexub/tokens/native` and `@nexub/tokens/seed`, `@nexub/icons/native` | [@nexub/react@2.1.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%402.1.0) |
| `2.2.0` | 2026-10-30 | Minor | nexub.design rebuilt on the design system (faster navigation, Web · Mobile previews on every component and pattern, mobile-only components, native props tables); page templates in `@nexub/patterns` (Dashboard, Activity, Transaction detail, Settings, Sign in, Checkout, Chat, Paywall) with React Native twins; motion on web (spring transitions, `ListTransition`, `SkeletonSwap`) and React Native (`nxEnter`/`nxExit`/`nxLayout`/`nxSpring`) | [@nexub/react@2.2.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%402.2.0) |
| `2.3.0` | 2026-10-31 | Minor | Sticky `Sidebar.Footer` and `SettingsLayout` `navFooter`; docs and Storybook on Tailwind 4, `@nexub/tokens` peer accepts Tailwind `^3 \|\| ^4` (v4 theme pins `max-w-*` and text line heights; button pointer cursor in `@nexub/themes`; Pagination tabular figures); React Native enter/exit/layout presets back on the springs (2.2.0's timed presets broke iOS) and the toast on Reanimated's stock fade | [@nexub/react@2.3.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%402.3.0) |
| `2.3.1` | 2026-10-31 | Patch | First release published with npm trusted publishing (OIDC) from `release.yml`; every package now carries npm provenance. No code changes. `NPM_TOKEN` retired | [@nexub/react@2.3.1](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%402.3.1) |
| `2.4.0` | 2026-10-31 | Minor | Release hardening, no API changes: native previews checked against committed iOS/Android screenshot baselines in CI (also shown as "On device" shots in the docs); Lighthouse CI (≥95 in all four categories on 5 docs pages); `GOVERNANCE.md` with the alpha → beta → stable → deprecated lifecycle and status badges; Banner, Callout, Tag and StatusPill removal planned in 3.0; post-publish check of npm versions and provenance | [@nexub/react@2.4.0](https://github.com/Nexub-AI/nexub-ds/releases/tag/%40nexub%2Freact%402.4.0) |

---

## Versioning Policy

Nexub DS uses **one version** for every `@nexub/*` package. **Every release bumps the minor.**

**From 10.0: semver, no rollover.** After 10.9 comes 10.10. A major happens only when something has to break.

```
9.8.0 → 9.9.0 (10.0 RC, on `next`) → 10.0.0 → 10.1.0 → … → 10.9.0 → 10.10.0
```

| Situation | Changeset bump | Example |
|---|---|---|
| Scheduled release (additive, opt-in) | `minor` | `10.3.0` → `10.4.0` |
| Security or critical fix on the latest version | `patch` | `10.4.0` → `10.4.1` |
| Breaking change | `major`, by RFC only. CI rejects it until the RFC is accepted | `10.x` → `11.0.0` |

**Up to 10.0: rolling minor.** The minor rolled over into the major after 9 (`1.9.0` → `2.0.0`, …, `9.9.0` → `10.0.0`), so a major was not a breaking-change signal and breaking changes shipped in minors. 9.9 → 10.0 is the last rollover (`LAST_ROLLOVER_MAJOR` in `scripts/release-version.mjs`).

Rules:
1. **Write changesets with `minor` or `patch` only.** `pnpm check:release-policy` (in CI) fails on `major`.
2. **Multiple changesets in one release still produce one bump.** All packages share a version (changesets `fixed` group) and the highest bump wins.
3. **A major needs an RFC and a migration guide.** The PR that ships it changes the guards in `scripts/check-changesets.mjs` and `scripts/release-version.mjs`. It removes only what a 10.x minor deprecated at least one release earlier (`@deprecated` JSDoc, dev warning, docs notice: see GOVERNANCE.md).
4. **Minors don't break.** From 10.0 a consumer on `^10.0.0` gets every 10.x, so a minor may add and deprecate, never remove or change a default.
5. **After every publish, merge the back-merge PR.** The release job opens `chore(release): back-merge vX into development` (production → development). Merge it before the next promotion, or the version lines will conflict.

### Release candidates and the `next` tag

`scripts/publish-tarballs.mjs` picks the npm dist-tag from the version (`distTag`). 9.9.x is the 10.0 release candidate: it publishes to `next`, and `latest` stays on 9.8 until 10.0. Consumers try it with `npm install @nexub/react@next`.

- **Freeze.** From 9.9 to 10.0 only fixes that block 10.0 are merged: no new component, prop, token or default.
- **Soak.** The RC stays on `next` for 4 weeks in the Payub and Matchub pilots. A regression is fixed as 9.9.x (still `next`) and the 4 weeks start again.
- **10.0 ships when every exit criterion is met** (ROADMAP_8.x.md; the public list is the docs page `/getting-started/release-status`, updated by hand with its date).
- **A fix `latest` users need during the soak** can't ship as 9.8.x (production is already on 9.9). Remove the 9.9 rule from `distTag` in the fix PR: 9.9.x then publishes to `latest` and the soak continues there.

The policy code lives in `scripts/release-version.mjs` and `scripts/check-changesets.mjs`, tested by `scripts/release-version.test.mjs`.

---|---|---|
| Bug fix, internal refactor, performance, docs | `patch` | `0.0.2` → `0.0.3` |
| New component, new prop, backward-compatible feature | `minor` | `0.0.3` → `0.1.0` |
| Renamed/removed export, breaking prop change, peer dep bump | `minor` with a `**Breaking:**` line (see the policy above) | `1.4.0` → `1.5.0` |

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
4. **Merging the version PR** publishes all `@nexub/*` packages to npm (the tarballs packed and attested by the reusable `build-release.yml` build, uploaded byte for byte by `scripts/publish-tarballs.mjs`, then tagged with `changeset tag`; authenticated by npm trusted publishing: each package on npmjs.com trusts `Nexub-AI/nexub-ds` → `release.yml`, so no npm token is stored; versions carry provenance), attaches an SPDX SBOM to the `@nexub/react` GitHub release, and deploys the docs to production. The `publish` job's last step, `scripts/verify-published.mjs`, then checks that every published version is on the registry with a provenance attestation (retrying for up to 5 minutes while the registry catches up) and fails the run, naming the packages, if any is missing or unattested.
5. **Add a row** to the [Release History](#release-history) table.

> `release.yml` holds one credential per job (since 7.1). `build` has no secrets and builds packages and docs; `version` (Version PR) and `back-merge` use `RELEASE_PAT`; `publish` uses only npm OIDC and the job's own token; `deploy-docs` uses only the Cloudflare token, with wrangler pinned in the lockfile. Jobs that hold a credential install with `--ignore-scripts` and build nothing.
>
> `RELEASE_PAT` (a fine-grained PAT with Contents + Pull requests write; the org blocks the Actions bot from creating PRs) and the Cloudflare secrets belong in the **`release` environment** (Settings → Environments, deployment branch `production` only), not in repo secrets, so no PR-triggered workflow can read them. Since the version PR is opened by a real user, CI runs on it like any other PR.

### Pre-flight check (optional)

```bash
pnpm turbo build --filter='./packages/*'
for pkg in tokens themes icons react patterns; do (cd packages/$pkg && npm pack --dry-run); done
```

Check that only `dist/` (or `src/` for themes) is listed and that react stays under ~150 KB packed.

### Supply chain (9.7)

- The release build packs deterministically: `pnpm check:reproducible` builds twice and compares tarball hashes; CI compares its own build with the release build on every PR (job "Release rehearsal").
- The publish job attaches the tarballs, `checksums.txt` and `nexub-provenance.intoto.jsonl` to the `@nexub/react@<version>` release, verifies each published tarball's attestation (`gh attestation verify`), and pushes a Sigstore-signed tag `v<version>`. Since 9.8 both steps fail the run (the packages are already on npm by then; see `INCIDENT_RUNBOOK.md`, "A release step failed after the publish").
- If a publish stops halfway, re-run the workflow: versions already on npm are skipped.
- The Version Packages PR runs the release build and the publish dry run against the new version numbers, so a publish problem shows there, before the merge that publishes.
- A security or critical fix ships as a `patch` through the same path, without waiting for the next release: `INCIDENT_RUNBOOK.md`, "Hotfix".

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
| `@nexub/mcp` | `src/` (server + CLI), `dist/skill/` (copy of `plugins/nexub-ds/skills/nexub-ds`) | tests |

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

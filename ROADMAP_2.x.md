# Roadmap: 2.5 → 3.0 (2026-11-01)

Status: **proposed.** Roadmap row R10 in [REVIEW_WORK_ITEMS.md](REVIEW_WORK_ITEMS.md).

## Inputs

- The releases so far: 2.4.0 shipped on 2026-10-31.
- What is still open in [MOBILE_PLAN.md](MOBILE_PLAN.md) (M5), [DESIGN_REFRESH_PLAN.md](DESIGN_REFRESH_PLAN.md) (deferred items) and [REVIEW_WORK_ITEMS.md](REVIEW_WORK_ITEMS.md) (R2–R6, #19, #26, #30).
- The 2026-11 research run.

## Rules this plan follows

- **Order follows dependencies.** Each version unblocks the next one.
- **3.0 is the only version that removes anything.** [GOVERNANCE.md](GOVERNANCE.md) says to deprecate in a minor and remove only in the next major. Every removal must give a development warning in a 2.x minor first.
- **One release per version,** as in 2.1.0–2.4.0. Work merges into `development` after green CI, then goes through staging → production → npm ([PUBLISHING.md](PUBLISHING.md)).

## Overview

| Version | Theme | Size |
|---|---|---|
| **2.5** | Mobile adoption, plus the start of the 3.0 runway | M |
| **2.6** | Prebuilt CSS, so Nexub works without our Tailwind preset | M |
| **2.7** | Native components promoted, token tiers, medium contrast | M–L |
| **2.8** | Toolchain majors and tech debt | M |
| **2.9** | 3.0 release candidate: migration tooling, feature freeze | S–M |
| **3.0** | Breaking cleanup: remove what is deprecated | S–M |

## 2.5: Mobile adoption

| Item | Where | Size |
|---|---|---|
| Support the Payub pilot as it adopts `@nexub/react-native` (MOBILE_PLAN M5 exit). | `packages/react-native` | M |
| Native performance pass: list FPS, startup, bundle size. | `packages/react-native`, `apps/mobile` | S–M |
| Add NexubMark and the product marks to `@nexub/icons/native`. | `packages/icons` | S |
| Add a native `SkeletonSwap` twin. | `packages/react-native` | S |
| Add development warnings to Banner, Callout, Tag and StatusPill. GOVERNANCE requires them before 3.0 can remove the components. | `packages/react` | S |
| Finish R2 (i18n): replace the 3 hardcoded English aria-labels with `NexubMessages`, and check the 8 `left-*`/`right-*` classes. | `packages/patterns/src/components/{NotificationItem,ActivityFeed}` | S |
| Make `@nexub/tokens` tests depend on the build (a cold run fails today). | `turbo.json` | S |
| Make sure PR runs never write a cache that release builds read. | `.github/workflows/*` | S |
| Confirm the lockfile resolves sharp ≥ 0.35.5. | `pnpm-lock.yaml` | S |
| Widen the axe sweep (P1 #19): 36 components, open overlays included, axe-core directly rather than `vitest-axe`. ✅ in #180 | `packages/react` | S–M |

## 2.6: Prebuilt CSS (R4)

| Item | Where | Size |
|---|---|---|
| Ship `@nexub/react/styles.css`, so consumers no longer need our Tailwind preset and `content` globs. Tailwind 3 and 4 consumers keep working as they do today. | `packages/react`, `packages/tokens` | M |
| Add a "Use without Tailwind" docs page. | `apps/docs` | S |
| Move the packages to Tailwind 4 and tailwind-merge 3 internally. | `packages/*` | M |
| **Decision:** rem-based spacing and radius. If yes, ship it opt-in here and make it the default in 3.0. | `packages/tokens` | S |

## 2.7: Native promotion and token tiers

| Item | Where | Size |
|---|---|---|
| Promote native components from Payub's feedback: M1–M2 to `stable`, M3–M4 to `beta`. If the feedback is not in yet, this moves to 2.8 and the rest of 2.7 ships. (Not in yet as of 2026-11-03.) | `packages/react-native`, docs badges | S–M |
| R3, token tiers: reference (palettes, scales) → semantic (roles) → component. The component tier covers Button, fields, Card and Badge, read through `var()` fallbacks and listed in DTCG as `@nexub/tokens/json/component`. No names change, so no aliases are needed. More components can join in 2.8. | `packages/tokens`, `packages/react` | M |
| Medium contrast level: already shipped in Wave 3. Left: a site-wide `data-contrast` switcher in the docs, applied before paint by `ThemeScript`'s new `contrastStorageKey`. | `packages/react`, `apps/docs` | S |

## 2.8: Toolchain and tech debt

| Item | Where | Size |
|---|---|---|
| Internal majors: tsup 9, vite 8, shiki 4, and TypeScript 6.0. TypeScript 7 is held back because it ships no compiler API, which tsup's declaration build and typescript-eslint (<6.1) need. Revisit when those support it. | repo | M |
| Majors consumers can see: react-day-picker 10 (DatePicker), lucide-react 1.x. Done; no prop or icon-name changes. | `packages/react`, `packages/icons` | M |
| Single-source the docs examples (#26): one `.tsx` per example. This deletes about 2k lines from `ComponentLivePreview.tsx`. 201 examples in 100 entries; its own PR, because it moves many docs screenshots. | `apps/docs` | L |
| API consistency (#30): a shared `Size` type, and `useControllableState` in SearchInput and PasswordInput (which gains `visible`, `defaultVisible`, `onVisibleChange`). Done. | `packages/react` | M |
| R6 usage telemetry: scan the Leap, Bookub, Payub and Founderub repos for component usage. The 3.0 removals and the 2.9 codemods should follow this data. The script is in (`node scripts/usage-scan.mjs <repo>...`); the data still needs access to those repos, which are not in the Nexub-AI org. | `scripts/` | S |

## 2.9: 3.0 release candidate

| Item | Where | Size |
|---|---|---|
| Feature freeze: only migration work and fixes. | — | — |
| Codemods in `nexub-migrate`: `Banner`/`Callout` → `Alert`, `Tag`/`StatusPill` → `Badge`, old token names → new ones. | `scripts/`, `packages/react` | M |
| Write the 3.0 migration guide, and add a development warning for every planned removal. | `apps/docs` | S |
| **Decision:** ESM-only packages. If yes, warn CJS users in this release. | `packages/*` | S |
| Re-check Glass 2.0 against the iOS 27 Liquid Glass HIG, once Apple publishes it. | `packages/themes` | S |

## 3.0: Breaking cleanup

| Item | Where | Size |
|---|---|---|
| Remove Banner, Callout, Tag and StatusPill. | `packages/react`, docs, `@nexub/mcp` references | S |
| Remove the legacy token aliases (kept since Calm Depth) and the R3 aliases from 2.7. | `packages/tokens` | S |
| Turn on the 2.9 decisions: ESM-only, and rem spacing as default if 2.6 approved it. | `packages/*` | S–M |
| **Decision:** drop the Tailwind 3 preset now that prebuilt CSS exists? | `packages/tokens` | S |
| **Decision:** drop Expo SDK 57 / Gesture Handler 2 support in `@nexub/react-native`? | `packages/react-native` | S |

## Risks

- **Payub is on the critical path** for 2.5 and 2.7. If their feedback is slow, swap 2.7 and 2.8.
- **R3 token tiers are the largest item.** They can split across 2.7 and 2.8 without blocking 3.0, because the aliases keep old names working.

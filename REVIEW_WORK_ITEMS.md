# Design System Review: Work Items (2026-10-12)

Scope: full review of `packages/*`, `apps/docs`, CI/release. Verified against `origin/development` (025a87b).
Baseline: typecheck clean, lint clean, 643/643 tests pass, build OK. `pnpm audit --prod`: 36 vulns (2 critical, via `next`).

Already fixed on development: stray `package-lock.json` removed; Storybook reinstated for `@nexub/react`.

Effort: S = under half a day, M = 1–3 days, L = about a week.

---

## P0: Breaks consumers or is a live risk

| # | Item | Where | Effort |
|---|------|-------|--------|
| 1 | ✅ **Bundle drops `'use client'`.** The dist has 0 directives, so any import from a Next RSC crashes. Add a tsup `banner` (or per-entry directives with #2). | `packages/{react,patterns}/tsup.config.ts` | S |
| 2 | ✅ **`@nexub/react` doesn't tree-shake.** One 207 KB file with 212 non-pure `forwardRef` calls: `import { cn }` costs **130 KB gz**. Per-component entries + splitting measured: `cn` 6.9 KB, `Button` 18.6 KB gz. Also removes the 126 KB gz chunk on every docs page. | `packages/react/tsup.config.ts`, exports map | M |
| 3 | ✅ **`@nexub/icons` pulls in all 119 icons for one icon.** One `ArrowRight` costs 10 KB gz; it should be 2.4 KB. Use named lucide imports + `/* @__PURE__ */` on `createIcon` calls. Every react component inherits this cost. | `packages/icons/src/lucide.ts:1` | S |
| 4 | ✅ **Broken exports maps.** react/icons/patterns: CJS types "masquerade as ESM" (attw). `.d.cts` is emitted but never referenced. tokens `./tailwind` and `.` are import-only, so `require('@nexub/tokens/tailwind')` throws, and Tailwind v3 configs use require. Docs hides this with a relative dist path. **Decision:** nested `import`/`require` conditions, or go ESM-only (smaller, and fine at 0.0.x). | `packages/*/package.json`, `apps/docs/tailwind.config.ts:10` | S |
| 5 | ✅ **Dark theme is forced when `data-theme` is absent.** `:root:not([data-theme])` sits outside the media query and outranks light. Light-OS users get dark until JS runs, and the `@media` block is a dead copy. `ThemeProvider attribute="class"` can never work. There's also a theme flash and a hydration mismatch, because `localStorage` is read in the `useState` initializer and no pre-paint script exists. `useMediaQuery` has the same mismatch. Glass inherits the mismatch. | `themes/src/dark.css:6-7`, `ThemeProvider.tsx:51-56,90`, `hooks/useMediaQuery.ts`, `themes/src/glass.css` | S |
| 6 | ✅ **`tailwindcss-animate` isn't registered anywhere.** About 22 `animate-in`/`zoom-in`/`slide-in` classes generate no CSS, so Dialog/Toast/Popover enter and exit animations are dead. Add it to the tokens preset and make it a dependency. | `tokens/scripts/build.mjs` (preset), `react/package.json` | S |
| 7 | ✅ **CI gaps.** Feature PRs into `development` get no CI. Tests run with `continue-on-error`, so failures never fail CI. ci.yml has no `permissions:` block. | `.github/workflows/ci.yml:6-10,62` | S |
| 8 | ✅ **Feedback endpoint hardening:** (a) HTML-escape user text in the Google Chat card, which renders `<a>`/`<b>` (phishing links into the team space); (b) Turnstile fails *open* when the secret is unset, so return 503 and check `hostname`; (c) reject on `Content-Length` before `formData()`; (d) the screenshot reader needs `nosniff` + `Content-Disposition: attachment` + magic-byte check on upload; (e) the in-memory rate limit is per-isolate, so use a Cloudflare WAF rule instead; (f) add an R2 lifecycle expiry. | `apps/docs/functions/api/feedback.ts:49-65,89,173,239`, `feedback/screenshot/[key].ts` | M |
| 9 | ✅ **Bump `next`** to the latest 15.5.x (critical and high advisories). Low exposure on a static export, but it clears the audit. | `apps/docs/package.json` | S |

## P1: Stability and accessibility

| # | Item | Where | Effort |
|---|------|-------|--------|
| 10 | ✅ **Contrast fails WCAG AA.** White on brand-500 is 2.98, danger-500 3.76, bookub 2.54, founderub 2.15. Semantic text tones on white: warning 2.15, success 2.54. Placeholder 2.56. Input border 1.23 (needs 3:1). Move fills to -600/-700, add `--color-*-on` fg tokens, alias text tones to `-strong`. | `Button.tsx:29,39,41`, `themes/src/base.css:43-46`, tokens | M |
| 11 | ✅ **Slider thumbs remount on every value change** (`key={thumb-${i}-${val}}`), losing focus mid-keyboard/drag. The count prefers `defaultValue` over `value`. No per-thumb `aria-label`. | `Slider/Slider.tsx:17-19` | S |
| 12 | ✅ **Rating** is `role=radiogroup` with no roving tabindex or arrow keys. At value 0 nothing is checked. | `Rating/Rating.tsx` | S |
| 13 | ✅ **Motion:** no `prefers-reduced-motion` anywhere. Exits finish only on `transitionend`, so `unmountOnExit` can hang forever. Collapse doesn't check `e.target`. Add `useReducedMotion` + a timeout fallback + `motion-reduce:` utilities. | `Motion/useMotion.ts`, `Motion/Collapse.tsx`, Spinner, Toast | S |
| 14 | ✅ **Small component bugs:** Toaster never renders `t.action` (public type) and duplicates Toast styles. Autocomplete renders a literal `Loading…` and shows the option *id* in the input (consider deleting it in favour of Combobox). NumberInput's `disabled ??` skips the bounds check when `disabled={false}`, so use `\|\|`. `key={index}` in AvatarGroup and CheckList. | `Toast/Toaster.tsx`, `Autocomplete.tsx:42`, `NumberInput.tsx:107,117`, `AvatarGroup.tsx:51`, `CheckList.tsx:19` | S |
| 15 | ✅ **Nav a11y:** TopNav items are `hidden md:flex` with no mobile menu, so mobile users have no nav. `<nav>`/`<aside>` have no `aria-label`. Collapsed Sidebar items have no accessible label or tooltip. Nav items are plain `<a>` with no `asChild`, so they can't be router links. | `TopNav/TopNav.tsx`, `Sidebar/Sidebar.tsx` | M |
| 16 | ✅ **Link:** `{...rest}` is spread after `externalProps`, so a caller can override the hardened `rel`. `target="_blank"` without `external` gets no `rel`. Spread rest first and add `asChild`. | `Link/Link.tsx:44-45` | S |
| 17 | ✅ **Token correctness:** `--shadow-focus` is hardcoded to white/blue, so dark and brands show the wrong ring; build it from `--color-ring-*`. `--shadow-card-hover` and `--color-gradient-eyebrow-chip` are undefined. brand 800 = 900. Icon `SIZE_MAP` and the GradientDivider/Rating hexes duplicate tokens. | `tokens`, `Card.tsx:15`, `EyebrowChip.tsx:30`, `createIcon.tsx:5-11` | S |
| 18 | ✅ **Release correctness:** changesets uses `linked`, but the docs promise lockstep, so it should be `fixed` (then delete the manual realign script in PUBLISHING.md). `baseBranch: "main"` doesn't exist. Patterns peers are `"*"`; use `workspace:^`. Add npm provenance (`id-token: write`). Pin `changesets/action` by SHA and pin `wrangler` (it runs with secrets). | `.changeset/config.json`, `.github/workflows/*`, `patterns/package.json:47-49` | S |
| 19 | 🟡 SSR smoke + keyboard tests done; vitest-axe not added. **Tests:** current tests are render smoke tests (1–6 per component). Add `vitest-axe`, a `renderToString` SSR smoke test over all exports (it would have caught #1 and #5), and keyboard tests for custom interactive components (Rating, Slider, SegmentedControl, NumberInput). | `packages/react` | M |

## P2: Simplify, de-duplicate, lighten

| # | Item | Where | Effort |
|---|------|-------|--------|
| 20 | ✅ **Delete dead code:** `.do/` (DigitalOcean `next start` against a static export; no workflow uses it). `react/src/utils/{Slot,cva,polymorphic,index}.ts`, `hooks/index.ts`. Unused exports `switchVariants`, `thumbVariants`, Tooltip `Root/Trigger/Content`, `TokenRow`, `compressIfTooLarge`. tokens "Phase 2" empty `css/light`/`css/dark` stubs. tokens source maps that point at unpublished `src/`. | various | S |
| 21 | ✅ **Drop unused deps:** icons `@radix-ui/react-slot`. react `@nexub/tokens` (no JS import) becomes a peer. Docs `lucide-react` and `cmdk` go to `@nexub/icons`/`CommandPalette` (12 of 14 icons already exist; add Camera and Layers). Optional: date-fns becomes `Intl.DateTimeFormat`. | package.json files | S |
| 22 | ⛔ Won't do: brand files are public subpath exports (merging breaks imports, generating needs a build step themes doesn't have); dark.css media duplication can't be shared in plain CSS. **Themes dedupe:** `light.css` duplicates the token defaults. The 4 brand files differ only by name, so generate them from `color.accent.*` with `color-mix()`. Collapse dark.css into one selector list (fixes #5 too). | `packages/themes/src/*` | S |
| 23 | ✅ **CI simplification:** replace the hand-ordered 4-step builds in 3 workflows with `pnpm turbo build` (turbo orders it correctly). release.yml builds twice. Add `out/**` to the turbo build outputs. Optional turbo cache. Move to Node 22 (20 is EOL). | `.github/workflows/*`, `turbo.json`, `.nvmrc` | S |
| 24 | ✅ **Docs weight:** move the registry index out of client components (27 KB gz on every page) and pass nav/search as props. Swap framer-motion for CSS or the DS `Fade` (35 KB gz on `/`). Load the feedback dialog with `import()` on click, and fix the misleading comment. | `DocsSidebar.tsx:6`, `SearchModal.tsx:6`, `landing/*`, `ClientProviders.tsx:15` | S |
| 25 | ✅ **Docs cleanup:** add `description`/OG/`metadataBase`, `sitemap.ts`, `robots.ts`. Fix double-suffixed titles. "89+ components" is hard-coded; there are actually 73. Keep one error boundary instead of 3 copies, and drop the `loading.tsx` flashes. Remove no-op `next.config` image options. Migrate off the deprecated `next lint`. | `apps/docs/src/app/**`, `next.config.mjs` | S |
| 26 | 🟡 Mismatches fixed (5 empty previews added/removed, 7 dead branches pruned, 2 examples documenting non-existent props deleted, DatePicker docs fixed) + drift-guard test; full single-sourcing still open. **Single-source docs examples.** Each example is written twice (registry code string + JSX in the 1,965-line `ComponentLivePreview.tsx`), matched by index. 12 slugs have mismatched counts and 2 render empty previews (date-picker #3, text-gradient #3). Use one `.tsx` per example and read its source at build time; that deletes about 2k lines and gives each example its own chunk. Can be done slug by slug. | `apps/docs/src/registry/**`, `ComponentLivePreview.tsx` | L |
| 27 | ✅ **Stories are unchecked.** Storybook is back on development, but `*.stories.tsx` are excluded from tsconfig and nothing builds Storybook in CI. Add a stories typecheck and `build-storybook` to CI, or the 99 stories will drift. | `packages/{react,patterns}/tsconfig.json`, ci.yml | S |
| 28 | ✅ **Lint for packages:** a root flat ESLint config with `react-hooks` + `typescript-eslint`. Today only docs is linted. | root | M |
| 29 | ✅ Deprecate-only (decided 2026-10-12): StatusPill/Tag → Badge, Banner/Callout → Alert (+ Banner role fix). Kept: FormError (icon + role=alert), Stack (divider), FilterChip (selection/count), GradientDivider/TextGradient (no replacement yet), EmptyState/ErrorState, Kbd/KeyboardShortcut. **Component consolidation (public API, needs deprecation aliases):** pills (Badge/StatusPill/Tag/Chip/FilterChip/EyebrowChip) become Badge + Chip. Notices (Alert/Banner/Callout) become one Alert. Stack vs Flex. FormError vs HelperText. EmptyState vs ErrorState. Kbd vs KeyboardShortcut. TextGradient becomes a Text prop. GradientDivider becomes a Separator variant. Motion Fade/Scale/Slide become one `Transition`. | `packages/react/src/components` | M–L |
| 30 | 🟡 forwardRef/displayName gaps fixed; date pickers labelable. Skipped: shared Size type, SearchInput/PasswordInput (state is native-onChange / UI-local by design). **API consistency:** a shared `Size` type, `useControllableState` everywhere (SearchInput and PasswordInput hand-roll it, and it flips to uncontrolled on `undefined`), and `displayName`/`forwardRef` on Autocomplete, Toaster, VisuallyHidden, FormField. | `packages/react` | M |
| 31 | ✅ **PUBLISHING.md** describes a manual `npm login` flow that contradicts release.yml. Rewrite it around changesets → Version PR → CI publish. Drop the "DTS race" troubleshooting entry. | `PUBLISHING.md` | S |

## Decide later (not recommended now)

- **ESM-only packages:** halves package size, but it's a policy call. Tied to #4.
- **Prebuilt `@nexub/react/styles.css`:** consumers currently must use the Tailwind preset plus `content` globs, which is undocumented (document it now, S). Prebuilt CSS decouples consumers from Tailwind and is the prerequisite for Tailwind v4.
- **Tailwind v4:** not worth it until prebuilt CSS lands.
- **rem-based spacing and radius** in the preset: it is px today.

## Suggested sprints

1. **Sprint A (consumer-breaking): done 2026-10-12.** 1, 2, 3, 4, 5, 6, 7, 9 (ESM-only chosen for #4)
2. **Sprint B (security + a11y): done 2026-10-12.** 8, 10–18 (+ SSR/keyboard tests from 19).
   Input borders: done (decided 2026-10-12, `--color-border-input`). Left open: npm provenance (repo is private), icon SIZE_MAP/GradientDivider hex dedupe, vitest-axe.
3. **Sprint C (lighten + simplify): done 2026-10-12.** 20, 21, 23, 24, 25, 27, 31; 22 won't-do. Also documented the Tailwind preset setup.
   Docs `/` First Load 192 → 129 kB; registry data no longer ships to the client; framer-motion removed.
4. **Sprint D (larger refactors): in progress 2026-10-12.** 28 and 29 done; 26 and 30 partial (see rows). Full example single-sourcing deferred by decision.

---

# Sprint E: Security (2026-10-13)

| # | Item | Status |
|---|------|--------|
| E1 | Docs CSP + HSTS + Permissions-Policy + COOP (`apps/docs/public/_headers`). `script-src` keeps `'unsafe-inline'` (static export inlines RSC scripts). | ✅ |
| E2 | `ThemeScript` export (pre-paint theme, `nonce` for strict CSP); docs dogfoods it. | ✅ |
| E3 | Actions pinned by SHA, `persist-credentials: false`, zizmor in CI, Dependabot (7-day cooldown), CODEOWNERS, SECURITY.md. | ✅ |
| E4 | pnpm 10 (install scripts blocked except `esbuild`, `sharp`). | ✅ |
| E5 | npm trusted publishing (OIDC) instead of `NPM_TOKEN`. Needs npmjs.com setup per package; check pnpm/changesets OIDC support first. Provenance is not generated for private repos. | ⏳ owner action |
| E6 | `pnpm audit --prod --audit-level=high` CI gate (overrides for postcss/nanoid/source-map-js/sharp; `braces` GHSA-vfj7-8cjw-p6xm ignored, build-time only). axe-core sweep over 24 components. | ✅ |

Also fixed: feedback "Capture page" failed on any page with a non-CORS image (Avatar examples).

# Roadmap: scaling to Apple / Google / Wise level

| # | Item | Evidence | Effort |
|---|------|----------|--------|
| R1 | ✅ (2026-10-20, refresh Phase 0) Visual regression: every story × light/dark/payub in CI (`packages/react/visual/`), plus a token contrast test. | No visual tests; 90+ components × 7 themes. | M |
| R2 | 🟡 i18n + RTL: `NexubProvider` with `locale`/`dir`/`messages` and logical classes shipped; remaining: hardcoded labels in patterns. | 2026-11: 8 physical (`left/right` positioning) vs 94 logical classes; 3 hardcoded English aria-labels (was 61 vs 2 and 16). | S |
| R3 | Token tiers (reference → semantic → component); Swift/Compose outputs if native apps exist. | Tokens are DTCG already. | M–L |
| R4 | Prebuilt CSS, then Tailwind v4. | Consumers must adopt our Tailwind preset. | M |
| R5 | Governance: per-component status (alpha/beta/stable/deprecated), RFC process, deprecation removal policy (rolling-minor has no major to remove in). | 4 deprecated components with no removal path. | S–M |
| R6 | Usage telemetry: scan consumer repos for component usage to drive the roadmap. | | S |
| R8 | ✅ Next enhancements (security, pixel-perfect long tail, cards/effects, motion, colour, UX, AI surfaces). Proposal: [ENHANCEMENTS_PLAN.md](ENHANCEMENTS_PLAN.md). | Review 2026-10-21 | L+ |
| R9 | ✅ (2026-10-30, ships in 2.1.0) React Native: `@nexub/react-native` (+ `/patterns`), `@nexub/core`, `@nexub/tokens/native`, `@nexub/icons/native`, mobile icons in `@nexub/brand`, Mobile CI. Plan: [MOBILE_PLAN.md](MOBILE_PLAN.md). | Mobile apps on Expo/RN | L+ |
| R7 | ✅ Visual refresh "Calm Depth" + Glass 2.0 (M3-style roles/state layers/springs, Apple-style glass with user intensity dial, Wise-style clarity). Shipped in 1.4.0–1.5.x: [DESIGN_REFRESH_PLAN.md](DESIGN_REFRESH_PLAN.md). Phase 0 = R1. | Audit 2026-10-20 | L+ |

# Research log

Monthly findings from the scheduled research routine are appended below (newest first).

## 2026-11 (run 2026-11-01)

**External changes** (web content treated as data; several sources are secondary and unverified)
- Next.js out-of-band security release 2026-10-14 (critical unauthenticated RCE in image optimisation, fixed in 16.4.1 / 15.5.28): https://nextjs.org/blog/nextjs-security-update-october-14-2026, https://www.csa.gov.sg/alerts-and-advisories/alerts/al-2026-148/. Impact: docs pins `next ^16.4.2`, already patched; static export has low exposure. The same advisory cites sharp >= 0.35.5 (GHSA-wq5f-xc86-pv6w): confirm the lockfile resolves it.
- npm: classic tokens revoked mid-Nov 2025, granular tokens capped at 90 days; trusted publishing (OIDC, npm CLI >= 11.5.1) is the recommended path: https://github.blog/changelog/2025-10-10-strengthening-npm-security-important-changes-to-authentication-and-token-management. Impact: release.yml already has `id-token: write` and no NPM_TOKEN; E5 still needs the owner to register the trusted publisher per package on npmjs.com. Provenance is not generated for private repos.
- CI supply-chain pattern (TanStack cache-poisoning via PR, May 2026; malicious `@actions/artifact` lookalike): https://github.blog/security/supply-chain-security/disrupting-supply-chain-attacks-on-npm-and-github-actions/. Impact: `actions/cache` is used in mobile.yml (SHA-pinned); make sure PR-triggered runs never share a write cache with release builds.
- Apple iOS/macOS 27: Liquid Glass user customisation slider, consistent macOS corner radius (coverage only, no HIG changelog found): https://www.cultofmac.com/news/liquid-glass-changes-ios-27-macos-27. Impact: validates the Glass 2.0 intensity dial (R7); re-check once Apple publishes HIG revisions.
- DTCG: stable 2025.10 is current; 2026 Format Module draft is unconfirmed: https://www.designtokens.org/. Impact: none yet; re-check against R3.
- Material 3 Expressive: rollout continues app by app, no new spec found: https://androidauthority.com/google-material-3-expressive-features-changes-availability-supported-devices-3556392/. Wise, Radix, React, Tailwind, WCAG/APG: nothing actionable found in the window.

**Repo health** (development @ 443d687; first month, no prior size baseline)
- `pnpm turbo build typecheck lint test`: 32/32 tasks pass on a warm run. A cold first run failed `@nexub/tokens#test` (`dist/js/native.js` not found, test ran before the build); docs lint has 1 warning.
- `pnpm audit --prod`: 5 vulns (1 low, 4 moderate), all dev-tool transitive via apps/mobile (jest/expo): minimatch <11.0.1, glob <=14.0.1, deepmerge 4.3.1 (no patch). No high/critical.
- Major gaps (`pnpm outdated -r`): typescript 5.9.3 -> 7.0.2, tailwindcss 3.4.19 -> 4.3.3, tailwind-merge 2.6.1 -> 3.7.0, react-day-picker 9.14 -> 10.0.2, tsup 8.5.1 -> 9.0.0, vite 7.3 -> 8.3, shiki 1.29 -> 4.5, lucide-react 0.468 -> 1.66.
- Size (gzip -9): `packages/react/dist/index.js` 2,987 B (10.4 KB raw; per-component entries); `packages/icons/dist/index.js` 7,854 B (32.6 KB raw).
- R2 evidence: physical Tailwind classes 8 (all `left-*`/`right-*` positioning) vs 94 logical (was 61 vs 2); `NexubProvider` has locale/dir/messages via `@nexub/core`; 3 hardcoded English aria-labels in patterns (was 16).

**Recommended next items**
1. Finish R2: replace the 3 hardcoded aria-labels (NotificationItem x2, ActivityFeed) with `NexubMessages`; check the 8 `left/right` classes. Where: `packages/patterns/src/components/{NotificationItem,ActivityFeed}`. Effort S.
2. E5: register npm trusted publishers per package, then drop any remaining token fallback. Where: npmjs.com + `release.yml`. Effort S (owner).
3. Make `@nexub/tokens` test self-sufficient (depend on build in turbo, `test.dependsOn: [build]`). Where: `turbo.json`. Effort S.
4. R4: prebuilt CSS, the prerequisite for Tailwind v4 (4.3.3 now available) and tailwind-merge 3. Where: `packages/react`, `packages/tokens`. Effort M.
5. R5: per-component status + deprecation removal policy (GOVERNANCE.md exists; add status metadata). Where: `packages/react`, docs. Effort S-M.

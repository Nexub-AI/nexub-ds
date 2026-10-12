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
| 20 | **Delete dead code:** `.do/` (DigitalOcean `next start` against a static export; no workflow uses it). `react/src/utils/{Slot,cva,polymorphic,index}.ts`, `hooks/index.ts`. Unused exports `switchVariants`, `thumbVariants`, Tooltip `Root/Trigger/Content`, `TokenRow`, `compressIfTooLarge`. tokens "Phase 2" empty `css/light`/`css/dark` stubs. tokens source maps that point at unpublished `src/`. | various | S |
| 21 | **Drop unused deps:** icons `@radix-ui/react-slot`. react `@nexub/tokens` (no JS import) becomes a peer. Docs `lucide-react` and `cmdk` go to `@nexub/icons`/`CommandPalette` (12 of 14 icons already exist; add Camera and Layers). Optional: date-fns becomes `Intl.DateTimeFormat`. | package.json files | S |
| 22 | **Themes dedupe:** `light.css` duplicates the token defaults. The 4 brand files differ only by name, so generate them from `color.accent.*` with `color-mix()`. Collapse dark.css into one selector list (fixes #5 too). | `packages/themes/src/*` | S |
| 23 | **CI simplification:** replace the hand-ordered 4-step builds in 3 workflows with `pnpm turbo build` (turbo orders it correctly). release.yml builds twice. Add `out/**` to the turbo build outputs. Optional turbo cache. Move to Node 22 (20 is EOL). | `.github/workflows/*`, `turbo.json`, `.nvmrc` | S |
| 24 | **Docs weight:** move the registry index out of client components (27 KB gz on every page) and pass nav/search as props. Swap framer-motion for CSS or the DS `Fade` (35 KB gz on `/`). Load the feedback dialog with `import()` on click, and fix the misleading comment. | `DocsSidebar.tsx:6`, `SearchModal.tsx:6`, `landing/*`, `ClientProviders.tsx:15` | S |
| 25 | **Docs cleanup:** add `description`/OG/`metadataBase`, `sitemap.ts`, `robots.ts`. Fix double-suffixed titles. "89+ components" is hard-coded; there are actually 73. Keep one error boundary instead of 3 copies, and drop the `loading.tsx` flashes. Remove no-op `next.config` image options. Migrate off the deprecated `next lint`. | `apps/docs/src/app/**`, `next.config.mjs` | S |
| 26 | **Single-source docs examples.** Each example is written twice (registry code string + JSX in the 1,965-line `ComponentLivePreview.tsx`), matched by index. 12 slugs have mismatched counts and 2 render empty previews (date-picker #3, text-gradient #3). Use one `.tsx` per example and read its source at build time; that deletes about 2k lines and gives each example its own chunk. Can be done slug by slug. | `apps/docs/src/registry/**`, `ComponentLivePreview.tsx` | L |
| 27 | **Stories are unchecked.** Storybook is back on development, but `*.stories.tsx` are excluded from tsconfig and nothing builds Storybook in CI. Add a stories typecheck and `build-storybook` to CI, or the 99 stories will drift. | `packages/{react,patterns}/tsconfig.json`, ci.yml | S |
| 28 | **Lint for packages:** a root flat ESLint config with `react-hooks` + `typescript-eslint`. Today only docs is linted. | root | M |
| 29 | **Component consolidation (public API, needs deprecation aliases):** pills (Badge/StatusPill/Tag/Chip/FilterChip/EyebrowChip) become Badge + Chip. Notices (Alert/Banner/Callout) become one Alert. Stack vs Flex. FormError vs HelperText. EmptyState vs ErrorState. Kbd vs KeyboardShortcut. TextGradient becomes a Text prop. GradientDivider becomes a Separator variant. Motion Fade/Scale/Slide become one `Transition`. | `packages/react/src/components` | M–L |
| 30 | **API consistency:** a shared `Size` type, `useControllableState` everywhere (SearchInput and PasswordInput hand-roll it, and it flips to uncontrolled on `undefined`), and `displayName`/`forwardRef` on Autocomplete, Toaster, VisuallyHidden, FormField. | `packages/react` | M |
| 31 | **PUBLISHING.md** describes a manual `npm login` flow that contradicts release.yml. Rewrite it around changesets → Version PR → CI publish. Drop the "DTS race" troubleshooting entry. | `PUBLISHING.md` | S |

## Decide later (not recommended now)

- **ESM-only packages:** halves package size, but it's a policy call. Tied to #4.
- **Prebuilt `@nexub/react/styles.css`:** consumers currently must use the Tailwind preset plus `content` globs, which is undocumented (document it now, S). Prebuilt CSS decouples consumers from Tailwind and is the prerequisite for Tailwind v4.
- **Tailwind v4:** not worth it until prebuilt CSS lands.
- **rem-based spacing and radius** in the preset: it is px today.

## Suggested sprints

1. **Sprint A (consumer-breaking): done 2026-10-12.** 1, 2, 3, 4, 5, 6, 7, 9 (ESM-only chosen for #4)
2. **Sprint B (security + a11y): done 2026-10-12.** 8, 10–18 (+ SSR/keyboard tests from 19).
   Left open: input-border 3:1 contrast (design call), npm provenance (repo is private), icon SIZE_MAP/GradientDivider hex dedupe, vitest-axe.
3. **Sprint C (lighten + simplify, about 1 week):** 19–25, 27, 31
4. **Sprint D (larger refactors):** 26, 28, 29, 30

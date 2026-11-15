# Roadmap 8.1 → 10.0 — Stable, secure, glitch-free

Drafted 2026-11-09. Follows [ROADMAP_7.x.md](ROADMAP_7.x.md). 20 releases: 8.1–8.9, 9.0, 9.1–9.9, 10.0. Same release rules: one version at a time, rolling-minor, development → staging → production → npm, each version on npm before the next starts.

**Direction.** 5.x and 6.x added components. 7.x deepens them and gives Nexub its own look. **8.x and 9.x add nothing.** No new components, props or variants. Every item fixes, tests, documents, tightens, secures or deprecates something that already exists. Removals and renames happen only in 9.0 and 10.0.

- **8.x — Foundation.** Make the docs, the tests and the API docs tell the truth.
- **9.0 — Clean-up major.** Remove what 8.x deprecated.
- **9.x — Zero glitches, high security.** Hunt glitches across browsers, environments and long sessions, then harden security down to the supply chain and finish with a structured security review.
- **10.0 — Stable.** It ships only when every exit criterion below is green. After it, releases slow to one every 3–4 weeks (see "After 10.0").

## What "10.0" means (exit criteria)

10.0 is not a date. It ships only when all of these are true, and CI checks every one that a machine can check:

| Area | Criterion |
|---|---|
| Bugs | 0 open P1/P2 bugs and 0 open `glitch` issues older than 14 days |
| Tests | Every exported web and RN component has unit, SSR/hydration, StrictMode and visual tests. Coverage at or above the ratchet. Quarantine list empty |
| Flakes | Under 0.5% flaky runs over the last 100 CI runs on `development` |
| Browsers | Visual and interaction suites green on Chromium, WebKit and Firefox, plus iOS and Android for RN |
| Accessibility | 0 axe violations. Forced-colors, RTL, 200%/400% zoom and reduced-motion baselines all green |
| Performance | CLS 0 on docs pages, INP under 200 ms, frame-time budgets green, size budgets under 95% |
| Resilience | Mount/unmount leak test flat, 30-minute soak with no errors or heap growth |
| Security | CodeQL 0 high/critical, OpenSSF Scorecard ≥ 8, SBOM and provenance on every release, Trusted Types enforced on docs, internal security review findings all closed |
| Soak | The RC lives on the `next` dist-tag for 4 weeks in real apps (Payub/Matchub pilots) with no regression |

## Where 7.x stands (2026-11-09)

| Version | State |
|---|---|
| 7.0.1 | **Shipped** (npm 2026-11-09): RELEASE_PAT out of PR jobs (S1), PasswordInput reveal (S5), Progress indeterminate (M1) |
| 7.1.0 | **Shipped** (npm 2026-11-09): CI lockdown, split `release.yml`, CodeQL, Scorecard, SBOM, Avatar error reset |
| Docs fix | **Next**, docs-only, before 7.2: 8.1's type map and `CodeBlock` work, pulled forward |
| 7.2 → 7.9 | Not started: secure defaults, Motion 2, feedback/loading, rich inputs, rich surfaces, reorder/data, native smoothness, Signature + RC |
| 8.0 | Not started: Signature becomes the default, secure defaults flip |
| 7.x decisions | Settled: full Signature, `classic` removed in 9.0 |

This plan assumes 7.x lands as planned. 7.x already covers the first wave of security (CI credentials, CodeQL, Scorecard, SBOM, overlay CSP, `safeHref`, feedback endpoint), so 9.x builds on it and doesn't repeat it. 8.0 re-baselines every visual, so baselining in 8.3 has to come after it.

## Evidence (checked against `development` @ 7.0.1 and the live docs, 2026-11-09)

### Docs site: typography (measured on nexub-ds-docs.pages.dev)

| # | Finding | Evidence |
|---|---|---|
| D1 | Body text uses three sizes on the same page | `/getting-started/nextjs`: paragraphs 18px but list items 16px. `/components/button`: `<p>` at 12, 14, 16 and 18px (44 of them at 14px). `kit/Prose` uses `body-lg`, while `kit/Section` descriptions fall back to `Text`'s default `body-md` |
| D2 | Two h3 scales | `.docs-h3` (kit) caps at 1.375rem (measured 20.9px). `.docs-prose h3` caps at 1.5rem (24px). Both are defined in `globals.css:85` and `:167`, and h1/h2 are also defined twice |
| D3 | Code text has four sizes | raw `<pre>` 16px, Shiki `CodeBlock` 13px, Playground snippet 13px, inline `code` 0.85em (15.3px). Code blocks borrow `text-label-md`, a UI label role, and not a code role |
| D4 | Ad-hoc sizes | `text-[2rem]` ×2, `text-[0.85rem]`, `w-[56px]`/`w-[160px]` on code labels, so not everything goes through tokens |

### Docs site: code blocks

| # | Finding | Evidence |
|---|---|---|
| C1 | **Inline code and block code share one background**, so a block reads as highlighted text and not as code | both use `--color-surface-container` (`rgb(30,32,34)` dark). No border, no header and no edge, so nothing marks it as an editor surface |
| C2 | 5 pages use raw `<pre>`: no syntax colours, no copy button | `foundations/materials`, `foundations/colors`, `foundations/marketing-mode`, `getting-started/ai-tools`, `getting-started/nextjs` |
| C3 | Three separate code renderers | `CodeBlock.tsx` (Shiki), `Playground.tsx:80` and `ComponentPreview.tsx:141` (`.docs-snippet`, plain text) and `ComponentHero.tsx:42` (import strip). Each has its own padding, size and background |
| C4 | No code-block anatomy | no filename/language label, no line numbers, no line highlight or diff markers, no wrap toggle. The copy button floats over the code |
| C5 | Contrast is patched per token | `CODE_CONTRAST` rewrites 4 GitHub colours so they pass AA on surface-container. A dedicated code surface removes the reason for the patch |

Also seen: the Button page header shows `v0.0.1 → v1.7.0` while the site is on 7.0.1, which looks stale or unclear (needs checking). On first paint, `data-reveal` sections render faded until the reveal animation finishes.

### Library stability

| # | Finding | Evidence |
|---|---|---|
| T1 | **React Native is mostly untested** | 47 of 90 exported RN components are never named in `src/__tests__/` (Avatar, Badge, BottomSheet, Dialog, Switch, Slider, TextField, PasswordInput, Carousel and almost every screen pattern) |
| T2 | Web gaps | 8 components have no test: ActionBar, Amount, DateTimePicker, Fieldset, FloatingInput, Kanban, ResizablePanels, ScrollProgress |
| T3 | No coverage gate | no `coverage` in any vitest config and no coverage script. `turbo.json` declares `coverage/**` outputs that nothing writes |
| V1 | Missing visual baselines | ActionBar, AgentKit, DataTableVirtual, Fieldset, FloatingInput, MoneyInput, NavigationRail, ResizablePanels, ScrollProgress, SharedElement, SplitButton. Five of these also have no story |
| V2 | Known flakes are re-run, never fixed | iOS Maestro launch crash, Android Maestro 504, RN "Select: opens a sheet" timeout, docs `/foundations/motion` screenshot and Lighthouse timeout. Playwright has no `retries` and no quarantine |
| A1 | **Web prop tables are hand-written** | 120 registry entries with no check against the types. Already wrong: `button.ts` says `default: 'primary'`, but `primary` is a legacy alias that isn't in its own union (`Button.tsx:74`). Native tables are generated and checked |
| A2 | Undated legacy API | Button `primary/secondary/outline/ghost` aliases are not `@deprecated` and have no `removeIn` |
| A3 | Stale-closure risk | 11 `react-hooks/exhaustive-deps` suppressions: RN `overlays.tsx` ×5, `inputs.tsx` ×2, `mobile.tsx`, `patterns/money.tsx`, web `DataTable.tsx:420`, `ListTransition.tsx:103` |
| P1 | Web ↔ native drift | Button variants differ (`filled/tonal/outlined/text/glass` vs web's `hero/subtle/link/destructive/accent`). Dialog is props-based on native and compound on web. Badge `dot` exists only on native. Toast ↔ ToastProvider, Tabs ↔ SegmentedControl, Sheet ↔ BottomSheet |
| K1 | Raw px bypasses tokens | 94 in react, 34 in patterns (e.g. `Switch.tsx:40 translate-x-[18px]`), and 111 raw numeric styles in RN. `design-lint` only checks hex |
| B1 | Budgets only loosen | `check-size.mjs --update` resets each budget to size +10%. Main react bundle at 99.1%, Combobox and Card at 100% |

### Glitches and security depth (for 9.x)

| # | Finding | Evidence |
|---|---|---|
| G1 | **Chromium only** | `playwright.config.ts` has two projects (storybook, docs) and no WebKit or Firefox, so Safari and Firefox glitches are never seen before users report them |
| G2 | No StrictMode testing | `StrictMode` appears 0 times in tests. Double-mount bugs (effects, subscriptions, portals) go unseen |
| G3 | SSR checked in patches | `renderToString`/`hydrateRoot` appear in 27 files, mostly patterns and marketing. There's no per-component hydration-mismatch sweep across `@nexub/react` |
| G4 | Environments barely covered | `forced-colors` in 4 files and RTL in 6 across all packages. No zoom or reflow tests |
| G5 | No resilience testing | no property-based or fuzz tests (0 hits for fast-check or fuzz) for money, date, URL or colour parsing. No leak or soak test |
| G6 | Trusted Types absent | 0 hits. 7.2 adds report-only mode, and enforcement is still open |
| G7 | Security fixes ship on the latest minor only | `SECURITY.md`. That policy stays (no LTS), but with slower releases it has to say how fast an urgent fix ships |
| G8 | Supply chain partly covered | provenance check exists. No signed tags, reproducible-build check, dependency age policy or outside audit. Trusted publisher per package (E5) still needs owner action on npmjs.com |

Already solid (not re-planned): 0 TODO/FIXME, 0 raw hex, deprecation tracking test (`status.test.ts`), generated native props, CI timeouts, 878 visual baselines, SHA-pinned actions, zizmor, OIDC publishing, a docs CSP with nonce and `strict-dynamic`.

## Versions

### 8.x — Foundation

| Version | Theme | Headline |
|---|---|---|
| 8.1 | **Docs: type and code** | *The type and code-block work ships early, as a docs-only change before 7.2; 8.1 keeps the guards, the `glitch` label and the contribution model.* One docs type map: title, h2, h3, body, body-small, caption, code, code-inline, each defined once and shared by `kit/*` and `.docs-prose`, with the duplicate h1–h3 rules deleted (D1, D2, D4). One `CodeBlock` used everywhere: the 5 raw-`<pre>` pages, Playground, ComponentPreview and the hero strip all move onto it (C2, C3). Editor anatomy: its own theme-matched code surface token (near-white in light, near-black in dark, not surface-container), a hairline border, a header bar with filename or language and the copy button, a mono size fixed for code (13/14px, line-height 1.6, tab-size 2), optional line numbers, highlighted lines and diff `+`/`-` (C1, C4). Inline code looks different from block code: a subtle tint and hairline, never the block surface. Pick a light/dark Shiki pair that passes AA on the new surface and delete `CODE_CONTRAST` (C5). Guards: a docs lint that fails on `text-[…]` and raw `<pre>`, plus a Playwright computed-style check of font sizes on 6 sample pages in both themes. Fix the version badge and the faded first paint. Start a `glitch` issue label with a 14-day triage SLA. Switch to the contribution model below: issue forms, Discussions, PR auto-close, and rewritten `CONTRIBUTING.md`/`GOVERNANCE.md` |
| 8.2 | Test floor | A smoke test that loops over every exported RN and web component (render, a11y name, no console errors), so nothing new ships untested (T1, T2). Real behaviour tests for the 47 RN and 8 web gaps, overlays and inputs first. Coverage reporting on in vitest/jest, with thresholds set at today's numbers (ratchet, never lower) (T3) |
| 8.3 | Visual completeness and flake debt | Stories and baselines for the 11 in V1, on the 8.0 Signature look. Fix each recurring flake at the root instead of re-running: iOS launch wait, Maestro download cached or mirrored, RN Select test on fake timers, motion page screenshot with animations frozen (V2). Playwright `retries: 0` locally and 1 in CI, a quarantine list that CI reports on and that may only shrink, and a flake-rate report per run |
| 8.4 | API truth | Generate web prop tables from the TypeScript types, the same way native already works, and fail CI on drift (A1). Mark Button's legacy aliases `@deprecated` with `removeIn: 9.0` (A2). Remove the 11 exhaustive-deps suppressions with correct deps or refs, each with a regression test (A3). Every docs code sample typechecks in CI |
| 8.5 | Web ↔ native parity | A generated parity matrix (web props vs native props per component) on the docs and in CI, so drift is visible (P1). Where names differ for no reason, add the matching name as a deprecated alias now. Real renames wait for 9.0. Differences that exist on purpose get written down |
| 8.6 | Token discipline | `design-lint` px rule for react and patterns, with a KNOWN list that may only shrink, and the 128 raw px moved onto spacing/size tokens (K1). An RN lint that does the same for the 111 numeric styles |
| 8.7 | Budgets and performance | `--update` stops adding +10%: budgets ratchet down, and a raise needs a written reason in the PR. Get the react main bundle, Combobox and Card back under 95% by tree-shaking and splitting, not by raising limits (B1). Keep 7.7's INP and frame-time budgets as hard gates |
| 8.8 | Docs accuracy | Dead links, stale version and status badges, every example runnable, and each component page checked against the generated props. A11y pass of the docs site itself (focus order, TOC, search, contrast of the new code surface in both themes) |
| 8.9 | 9.0 RC | Freeze. The full list of what 9.0 removes, `nexub-migrate` rules for each, and Migrating to 9.0 |

### 9.0 — Clean-up major

| Version | Theme | Headline |
|---|---|---|
| 9.0 | Remove, never add | Remove Button legacy aliases, the parity aliases from 8.5 and the 7.x/8.x deprecations. Remove the `classic` style. Coverage, parity and px gates become blocking with empty KNOWN lists |

### 9.x — Zero glitches, high security

| Version | Theme | Headline |
|---|---|---|
| 9.1 | Every browser | Add WebKit and Firefox projects to the Playwright story, docs and interaction suites, with baselines per engine (G1). A written browser-support matrix (last 2 versions of Chrome, Edge, Firefox and Safari, plus iOS Safari 17+) checked by `browserslist` in CI. Fix whatever WebKit and Firefox reveal, especially glass, `backdrop-filter`, `@starting-style` and view transitions, with fallbacks that are tested and not assumed. Playwright WebKit stands in for Safari (no paid real-device cloud) |
| 9.2 | Render glitches | A sweep that renders every component under `StrictMode` (G2) and through `renderToString` → `hydrateRoot` with no hydration-mismatch warning (G3). No theme flash: a FOUC test for `ThemeScript` across light, dark, contrast and density. CLS 0 on every docs page as a Lighthouse budget. Layout-shift checks on fonts, images (Avatar, MediaCard) and skeleton-to-content swaps |
| 9.3 | Interaction glitches | An interaction suite run on every overlay and input: focus goes in and comes back, scroll lock with no content jump (`scrollbar-gutter`), nested and rapid open/close, double-click, Escape order in stacks, IME composition (CJK) in text inputs, pointer vs touch vs keyboard, and drag cancel. A "state matrix" test per component: disabled, loading, error, empty and long-content (overflow, 200-character labels, emoji, RTL text) |
| 9.4 | Every environment | Forced-colors, RTL, 200% and 400% zoom (WCAG reflow), reduced motion and reduced transparency, each with baselines for every component (G4). RN: font scaling to 200%, bold text, screen-reader order, dark/light switch while mounted. Write up the results per component on the docs Accessibility page |
| 9.5 | Resilience | Property-based tests (fast-check, dev-only) for money, date, number and colour parsing, `safeHref` and every input mask (G5). A leak test that mounts and unmounts each component 1,000 times and checks heap and listener counts. A 30-minute docs and mobile soak (navigate, open overlays, switch theme) with no errors and flat memory. Patterns get error boundaries with tested fallbacks |
| 9.6 | Security: the library | A short threat model per risky component (anything that renders URLs, HTML, files, user or LLM content). An XSS corpus run against every such prop. Trusted Types **enforced** on docs, with a test proving the library makes no TT violations (G6). A strict docs CSP with no `unsafe-inline` anywhere. MCP server and feedback endpoint review: input limits, rate limits as code, logging without secrets |
| 9.7 | Security: the supply chain | Signed release tags and SLSA L3 build provenance. A reproducible-build check that builds twice and compares hashes. A dependency policy: fewer runtime deps (audit each one), a minimum package age before an upgrade, lockfile lint, and Dependabot grouped with a review SLA. Trusted publishing on every `@nexub` package (E5, owner action). CodeQL 0 high and Scorecard ≥ 8 as blocking gates (G8) |
| 9.8 | Security review and response | A structured internal security review (no paid vendor) of the packages, docs site, feedback endpoint and MCP server against a written checklist (OWASP ASVS L2 where it applies), with every finding fixed in this release. Incident runbook, GitHub Security Advisories, a CVE process and a tested "hotfix in 24 h" drill. `SECURITY.md` states that fixes ship on the latest version only, as a patch, without waiting for the next scheduled release (G7) |
| 9.9 | 10.0 RC | Feature and API freeze. RC on the `next` dist-tag for a 4-week soak in Payub/Matchub pilots. Every exit criterion checked on a public status page in the docs. Only release-blocking fixes land. Migrating to 10.0. Change the release policy for after 10.0: turn off the automatic x.9 → major rollover in `release-version.mjs` and `check:release-policy`, and update `PUBLISHING.md` |

### 10.0 — Stable

| Version | Theme | Headline |
|---|---|---|
| 10.0 | Stable | Ships when every exit criterion is green and not before. Removes only what 9.x deprecated. The public API is frozen under semver. Every gate from 8.x and 9.x stays blocking for good. The slower release rhythm starts here |

## After 10.0: release rhythm (decided 2026-11-09)

Until 10.0, 8.x and 9.x keep today's pace: each version ships as soon as it's ready. After 10.0 there's no LTS line. Instead, development slows down and every release gets time to be used before the next one is planned.

- **One scheduled minor every 3–4 weeks.** 10.1 ships 3–4 weeks after 10.0, then 10.2, and so on. Minors stay additive and opt-in.
- **No automatic rollover.** After 10.9 comes 10.10. A new major happens only when something has to break, and it needs an RFC and a migration guide.
- **Patches don't wait.** Security and critical bug fixes ship as a patch (10.1.1) whenever needed. Fixes go only on the latest version, so consumers are expected to stay current.
- **Each cycle is mostly use, not build:**
  - Weeks 1–2: use the current release in real apps (Payub, Matchub, Leap, Bookub), and collect gaps and bugs from them and from issue forms, Discussions and docs feedback.
  - Week 3: plan and build the fixes and the few additions that held up.
  - Week 4: RC on the `next` dist-tag, a soak in one app, then release.
- **Same gates as 10.0.** A minor that turns any exit criterion red doesn't ship.

## Contribution model (decided 2026-11-09)

Open source but not open contribution. The code stays MIT and public: anyone can read it, use it and fork it. Only maintainers write it.

- **How people are heard:** issue forms (bug, feature request, docs feedback, accessibility), GitHub Discussions for questions and ideas, and the docs feedback button. Ideas with real demand become an RFC that a maintainer writes and builds.
- **Outside PRs** are closed politely by a bot that points to the issue forms.
- **Why:** design coherence, a smaller security surface (no outside code in CI, the same class of risk as S1), and maintainer time.
- **Docs:** `CONTRIBUTING.md` becomes "How to give feedback", and the "Contributors are anyone opening an issue or PR" line in `GOVERNANCE.md` changes to match. Ships in 8.1.

## Why this order

- **Docs first.** It's what people see every day, it's what you asked for, and it doesn't touch library code.
- **Truth before hunting.** 8.x makes the tests, docs and budgets honest. A glitch hunt on top of untested components and hand-written docs would miss things.
- **Clean up at 9.0.** 9.x tests a smaller, settled API, not aliases that are about to go.
- **Glitches before security depth.** 9.1–9.5 build the browser and environment harness, and 9.6's XSS and Trusted Types checks run on it.
- **Review last.** The security review looks at the finished, hardened library, so its findings are real ones.
- **10.0 is a gate, not a date.** If an exit criterion is red, 9.9 gets another RC.

## Decisions

All settled 2026-11-09. Nothing is open.

- No LTS, a 3–4 week release rhythm after 10.0 with no automatic major rollover, and open source without open contribution (both sections above).
- **8.1's docs work ships early**, as a docs-only change right after 7.1 and before 7.2.
- **Code surface is theme-matched**: near-white with a hairline in light, near-black in dark.
- **Coverage ratchets** from today's numbers and never goes down. No fixed target.
- **Button legacy aliases** are deprecated in 8.4 and removed in 9.0.
- **`classic` style** is deprecated through 8.x and removed in 9.0 (7.x decision 3).
- **No paid work.** 9.8 is a structured internal security review, not an outside audit, and 9.1 accepts Playwright WebKit as the Safari stand-in. Either can be added later without changing the plan.
- **RFCs #302–#307** (PhoneInput, QRCode/QRScanner, Countdown, React Native twins, description list/status steps, Malayalam typeface) are parked until after 10.0, as candidates for the scheduled minors. The **Matchub brand** (PR #301) is a theme, not a feature, so it may ship whenever it's ready.

## Out of scope

New components, new props or variants, Tailwind v4 prebuilt CSS (R4), the parked RFCs (#302–#307), paid audits or device clouds, and everything already planned in 7.x.

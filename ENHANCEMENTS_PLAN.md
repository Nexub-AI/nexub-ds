# Next enhancements — review and proposal (2026-10-21)

Status: **approved 2026-10-21.** Waves 1–4 shipped in **v1.6.0**; hardening, adoption and foundations follow in 1.7.0–1.9.0 (tracker below). Decisions: Wave 1 first; sheen opt-in; AI kit in scope; Next 16 landed separately (#87). Builds on the shipped Calm Depth refresh (v1.5.1, [DESIGN_REFRESH_PLAN.md](DESIGN_REFRESH_PLAN.md)). Roadmap row R8 in [REVIEW_WORK_ITEMS.md](REVIEW_WORK_ITEMS.md).

Scope asked for: security, pixel-perfect UI, UX, colour, cards, hovers and card effects, animation.

## Release tracker

Updated at every step. Flow per version: feature PRs → `development` (CI green) → `staging` → `production` → Version Packages PR → npm publish → back-merge.

| Version | Scope | Status | PRs | Released |
|---|---|---|---|---|
| **1.6.0** | Waves 1–4: security + consistency, cards + motion, colour + UX, AI surface kit | ✅ **Released** — on npm (all 6 packages), docs deployed, production = development | #94–#97 → staging #98 → production #99 → version #100 → back-merge #101 | 2026-10-21 |
| **1.7.0** | Hardening: release-workflow token cleanup; axe accessibility checks over every story in CI; bundle-size budgets; visual tests for docs foundation pages; date pickers follow locale + RTL; translated file sizes; swipeable `Toast.Root`; Tag shape decision | 🚧 **Built, in review** — PR open, CI running; then staging → production → npm | #103 | — |
| **1.8.0** | Adoption: 1.5 → 1.6+ migration guide (new props, brand roles, NexubProvider, design-lint rules for apps); codemod for app code (legacy tokens → roles, physical → logical classes); an example product screen in the docs built only from public APIs, and the fixes it turns up | ⏳ Planned | — | — |
| **1.9.0** | Foundations: runtime brand theming from a seed colour (`ThemeProvider seed`); Tailwind v4 readiness (CSS-first preset alongside the v3 preset, no breaking change) | ⏳ Planned | — | — |

After 1.9.x the next release is **2.0.0** (rolling-minor policy, PUBLISHING.md); nothing in this plan needs a breaking change.

Still yours to do (repo settings): turn on Dependabot alerts and secret-scanning push protection. npm trusted publishing is already live — v1.6.0 published through OIDC.

---

## 1. Review: where v1.5.1 actually stands

Measured on `development` today, across 95 react components and 14 patterns.

### 1.1 Pixel-perfect: the refresh has a long tail

Phases 2 and 4 rebuilt the core controls and overlays. **About 45 components were never touched.** Their colours look right, because legacy names alias the roles, but shape, states and focus don't match the rest.

| Debt | Count | Where (examples) |
|---|---|---|
| Legacy colour names (`--color-bg-*`, `--color-text-*`…) | 236 uses | Accordion, Alert, DataTable, DatePicker, Pagination, FileUpload, StatCard, PlanCard… |
| Per-component focus rings (`focus-visible:ring-*`) | 49 | Accordion, Alert, DatePicker, FilterChip, Link, Rating, Toast… |
| Old radius / shadow utilities (`rounded-lg`, `shadow-md`) | 46 | Alert, Callout, Code, FileUpload, Pagination, StatCard, PlanCard, UserCard, AuthCard… |
| `tailwindcss-animate` enter/exit (not springs) | 22 | most overlays |
| `brand-primary` / `fill-*` + `text-white` | 25 + 12 | DatePicker, Pagination, StepIndicator, FilterChip, ErrorState |
| Opacity-as-disabled | 18 | DataTable, DatePicker, NumberInput, Pagination |
| Physical left/right classes vs logical (RTL) | 134 vs 3 | everywhere |
| Hard-coded English `aria-label`s | 18 | |
| Hex colours in components | 10 | GradientDivider, Rating |

**Visual regression has blind spots.**
- Only rest states are captured: no hover, focus or pressed.
- No high-contrast, compact or RTL variants.
- No docs pages.
- Playwright's default per-pixel threshold let a whole glass-recipe change through on near-white backgrounds.

### 1.2 Security

| Finding | Severity | Notes |
|---|---|---|
| `pnpm audit`: 57 findings (3 critical, 32 high) | dev-only | vitest/tinypool (critical), vite, jsdom, storybook 8, ws, js-yaml, style-dictionary. Most are fixed by the open Dependabot PRs #85, #88, #89; Storybook needs a major (9). |
| Shipped dependencies: `postcss-selector-parser` | moderate | via Tailwind; build-time only. |
| **npm publish token expires ~2026-11-11** | high (availability) | Releases break silently after that. Move to npm trusted publishing (OIDC + provenance). |
| Dependabot **alerts**, code scanning, secret scanning: **off** | medium | Only Dependabot version PRs are on. |
| 14 components render inline `style={}` | medium | Under a strict CSP (`style-src` without `'unsafe-inline'`) server-rendered `style=""` is blocked: Flex, Grid, Stack, Text, Heading, Progress, Skeleton, Textarea… |
| Docs CSP `script-src 'unsafe-inline'` | low–medium | The static export inlines RSC scripts; hashes can replace it. |

### 1.3 UX gaps

- No selectable / clickable-card pattern (whole-card link, radio card, checkbox card).
- No unified async-action feedback (loading → success → error) on buttons and forms.
- Toasts don't stack or expand (Sonner-style).
- No form-validation pattern (error summary, on-blur rules).
- xs controls (24px) have no 44px touch hit area.
- Nothing for AI surfaces, which matters for a product org named Nexub AI: streaming text, citations, a prompt composer, a "thinking" state.

---

## 2. Proposals

### A. Security and supply chain (do first)

1. **Dependency hygiene.**
   - Merge Dependabot #85 (38 minor/patch updates), #88 (vitest 5, fixes the critical), #89 (jsdom 30) and #86 (@types/node), fixing any test fallout.
   - Upgrade Storybook 8 → 9.
   - Review #87 (Next 16) separately: docs only, with breaking changes.
2. **Publishing without a long-lived token.**
   - Switch `release.yml` to npm **trusted publishing** (OIDC, `id-token: write`, provenance) before the token expires.
   - *Owner action:* enable it per package on npmjs.com.
3. **Turn on Dependabot alerts and secret scanning push protection** (*owner action* in repo settings).
4. **Strict-CSP-clean components.**
   - Replace inline `style={}` with class or data-attribute maps for discrete values (gap, columns, line clamp, progress).
   - Keep `style` only for truly arbitrary consumer values, and document which props those are.
   - Add a test: `renderToString` every export → no `style="` in the output.
5. **Docs CSP:** replace `script-src 'unsafe-inline'` with build-time SHA-256 hashes of the inline scripts.

### B. Pixel-perfect consistency

1. **Finish the long tail.** Move the ~45 remaining components onto:
   - semantic shapes, roles and `on-*` colours;
   - the global focus ring;
   - state layers;
   - explicit disabled states;
   - spring enter/exit via `@starting-style`, which retires `tailwindcss-animate`.
2. **Design lint (prevent regressions).** A test that fails when component source uses:
   - legacy colour names;
   - `rounded-(sm|md|lg|xl)` or `shadow-(sm…2xl)`;
   - `focus-visible:ring`;
   - `opacity-*` for disabled;
   - `text-white`;
   - hex values.
   It's the same idea as the contrast `KNOWN` list: a shrink-only allowlist.
3. **Visual regression without blind spots.**
   - Add hover, focus and pressed captures for every interactive story.
   - Add high-contrast, compact and RTL variants.
   - Tighten the threshold for glass stories.
   - Screenshot the docs foundations pages.
4. **RTL** (roadmap R2): logical properties everywhere, `dir` on a `NexubProvider`, and an RTL story variant.
5. **Optical details.**
   - Icons sized in `em` next to text.
   - Icon/label baseline nudges in buttons.
   - `tabular-nums` in every numeric column.
   - `text-wrap: balance` on card titles.

### C. Cards, hovers and effects (the signature work)

Guiding rule (Principle 4): **effects must be physical and quiet**. No 3D tilt and no glow by default. Everything respects reduced motion, reduced transparency and touch.

1. **Interactive card, rebuilt.**
   - Hover: a 2px spring lift + elevation 1 → 2 + the state layer.
   - Press: `scale(.99)`.
   - Focus: the ring on the card itself.
   - Exit is faster than enter, so it never feels sticky.
2. **Pointer specular ("sheen") — opt-in `effect="sheen"`.**
   - A soft radial highlight follows the cursor across the card. It uses CSS vars set via CSSOM, so it's strict-CSP safe.
   - On glass, it also brightens the top edge, the web version of Liquid Glass lighting that responds to movement.
   - Off for touch, reduced motion and reduced transparency.
3. **Clickable card done right.**
   - A whole-card link via the "stretched link" pattern, so there's one accessible name and nested buttons still work.
   - `focus-within` ring.
4. **Selectable cards.** `RadioCard` and `CheckboxCard`:
   - selected = a primary outline + a check badge that springs in;
   - keyboard: arrows and Space.
5. **Media card.** An image with a glass caption and a soft scroll edge; content-aware dimming for legibility.
6. **Bento grid pattern.** Container-query tiles for dashboards and marketing (1×1, 2×1, 2×2), with concentric radii.
7. **Hover intent.** Consistent delays for HoverCard and Tooltip, and a tooltip "skip delay" after the first one.

### D. Motion

1. **`@starting-style` + springs for every overlay.** This replaces `tailwindcss-animate` with no dependency and is interruptible.
2. **View Transitions.**
   - Menus and popovers grow out of their trigger.
   - Optional page-transition presets (`::view-transition-*`) for Next/React apps.
3. **Number ticker.** `Amount` and `StatCard` digits roll on change, tabular and spring-driven, with a plain swap under reduced motion.
4. **Toast stack.**
   - Stacked with depth.
   - Expands on hover or focus.
   - Swipe to dismiss.
   - Pauses while hovered.
5. **Micro-moments.**
   - The checkbox check draws in.
   - Success state on async buttons.
   - Skeleton crossfades into content.
6. **Scroll-driven header.** AppHeader condenses on scroll with `animation-timeline: scroll()`, falling back to static.
7. **Designed reduced-motion fallbacks.** Crossfade instead of slide or scale, per component, instead of only zeroing durations.

### E. Colour

1. **Data-viz palettes** (`chart.1–8` are still the old hex values). HCT-generated:
   - categorical (8, checked for colour-vision deficiency);
   - sequential;
   - diverging;
   - all light-dark aware.
2. **Wide gamut (P3).** More vivid primary and tertiary on P3 displays (`@media (color-gamut: p3)`), with sRGB unchanged.
3. **Medium contrast level** (deferred in Phase 1) and a `data-contrast` toggle in docs.
4. **Runtime seed theming (optional).** `<ThemeProvider seed="#…">` for white-label products. Only if a consumer needs it.

### F. User experience

1. **Async actions.** `Button loading` → success tick → error shake (spring); `aria-live` announcements.
2. **Form validation pattern.** FormField rules (on blur, then on change), an error summary with links, and `aria-describedby` wiring.
3. **Undo over confirm.** A destructive-action pattern: act → toast with Undo → commit.
4. **Touch targets.** A 44px hit area on xs and sm controls (`::after`), invisible.
5. **i18n.** `NexubProvider { locale, dir, messages }` and no hard-coded English labels.
6. **AI surface kit (innovation, fits Nexub AI)**:
   - `PromptInput` (composer with attachments and send/stop);
   - `StreamingText` (smooth token reveal, `aria-busy`);
   - `ThinkingIndicator` (a shape-morph loader);
   - `Citation` / `SourceChip`;
   - `MessageBubble`;
   - plus a feedback row (copy, thumbs, regenerate).

---

## 3. Suggested waves

| Wave | Contents | Release |
|---|---|---|
| **1. Secure and consistent** | A1–A5, B1–B2 (long tail + design lint), D1 (`@starting-style`) | v1.6.0 |
| **2. Cards and motion** | C1–C7, D2–D7, B3 (VR states) | v1.6.0 |
| **3. Colour and UX** | E1–E3, F1–F5, B4–B5 (RTL, optics) | v1.6.0 |
| **4. AI surfaces** | F6 (E4 moved to 1.9.0) | v1.6.0 |

Planned as one release per wave; all four were promoted together and shipped as **v1.6.0**.

## 4. Decisions needed

1. **Order.** Wave 1 first (security + consistency), or lead with cards and effects?
2. **Pointer sheen.** Opt-in only (recommended), or on by default for interactive cards?
3. **AI surface kit.** In scope (recommended: it's the most product-relevant innovation)?
4. **Next 16 for docs.** Now with wave 1, or later?
5. **Owner actions** (only you can do these):
   - enable npm trusted publishing;
   - rotate the npm token as a stop-gap before ~2026-11-11;
   - turn on Dependabot alerts and secret scanning.

## 5. Results

| Wave | PR | Highlights |
|---|---|---|
| 1 | #94 | Deps 57 → 2 audit findings; strict-CSP components + SSR test; docs nonce CSP; npm trusted-publishing ready (Node 24); ~45 components migrated (485-alias codemod); brand accent roles; nx-motion springs; design-lint |
| 2 | #95 | Card lift/press, opt-in sheen, CardLink; RadioCard/CheckboxCard, MediaCard, NumberTicker, BentoGrid; Sonner-style toasts; check draw, AppHeader condense, view transitions; VR for states/contrast/compact/RTL |
| 3 | #96 | CVD-tested data-viz palettes, P3 accents, medium contrast; async Button; ErrorSummary; toast.undoable; NexubProvider (i18n + direction); RTL codemod + lint; 44px touch targets; tabular figures |
| 4 | #97 | PromptInput, ThinkingIndicator, StreamingText, MessageBubble/MessageActions, Citation/SourceList, Conversation pattern; AI docs + guide |

All four waves shipped in **v1.6.0** (2026-10-21). See the release tracker at the top for what follows.

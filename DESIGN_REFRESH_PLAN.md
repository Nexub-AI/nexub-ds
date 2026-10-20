# Design Refresh — research and plan (2026-10-20)

Status: **proposal, not approved**. Nothing here is built yet.

Goal: make nexub-ds look minimal, classy, modern and durable for about five years.
- It borrows Material 3's structure (tonal color roles, state layers, springs).
- It borrows Apple's restraint and material (Liquid Glass, concentric shapes, hierarchy through layout).
- It borrows Wise's clarity (explicit states, honest numbers, tinted neutrals).
- It copies none of them.

Inputs:
- A full audit of this repo.
- Four research briefs: Material 3 / M3 Expressive, Apple HIG / Liquid Glass incl. WWDC26, Wise (read from its published npm token packages), and 2025–26 industry trends.

Sources are listed at the end. **[V]** means checked against a primary source. **[U]** means from memory and needs checking before it becomes a token.

---

## 1. Where we are today (audit summary)

Today's look is Tailwind-2021 / shadcn-era:
- slate neutrals and Tailwind blue;
- gradient brand flourishes;
- hovers that are colour swaps;
- no tonal surfaces.

The engineering underneath is solid: DTCG tokens, Radix, CVA, SSR/CSP hardened, glass v1 shipped. The visual layer is what's behind.

| Area | Today | Gap vs. Apple/Google/Wise level |
|---|---|---|
| Color | Hex 11-step Tailwind-like scales. Roles: `text/bg/surface/border`. Fixed `--color-fill-*` shades for white text. | No OKLCH. No `on-*` / `*-container` roles. No surface-container tiers. Neutrals not brand-tinted. No contrast levels. `text-white` hard-coded 38×. |
| Interaction states | Hover = swap to a darker token | No state layers. No pressed state anywhere. No press feedback. |
| Shape | xs2 / sm4 / md8 / lg12 / xl16 / 2xl24 / 3xl32 | Ad-hoc use: Card 12, Dialog 16, Tooltip 4. Bare `rounded` 12×. No concentric rule. No semantic shape tokens. |
| Elevation | Tailwind-style `shadow-sm…2xl` picked per component | No elevation levels. No tonal elevation. Card has a hard-coded fallback shadow. |
| Typography | Plus Jakarta Sans Variable; h1–h6 / body / caption / label | No role-based scale. Tracking only on h1–h3. No tabular numerals. No `text-wrap: balance`. |
| Motion | 5 durations; "spring" = overshoot cubic-bezier | No real springs. Accordion/Collapsible keyframes **don't exist** (animation is dead). Reduced-motion handled by a global kill-switch only. |
| Sizing | Size tokens 24/32/40/48/56 **never used** | Button md, Input, Select = 36px; Combobox = 40px. Mixed heights. |
| Focus | Global ring + about 30 per-component overrides; 13× `focus:outline-none` | Ring doesn't follow the shape. Several variants. |
| Glass v1 | blur 16, bg α .55, hairline, inset highlight. Card/Dialog/Popover/Drawer/TopNav. | No `saturate()`. No `@supports` fallback. No `forced-colors`. No thickness tiers or tint. Not user-adjustable. |
| Quality gates | axe sweep over 24 components; SSR test | **No visual regression** (R1). The token contrast test the a11y test refers to **does not exist**. |
| Smaller bugs | Tooltip uses the popover z-index and a bg that doesn't flip in dark mode. Switch "on" is about 3:1. `ring-red-600` hard-coded in AlertDialog. | Fold these into the phases below. |

---

## 2. What the leaders actually do (distilled)

### Google — Material 3 + M3 Expressive (May 2025)

**Color math [V]**
- HCT tone is L*. A tone gap of 40 gives ≥3:1 contrast; a gap of 50 gives ≥4.5:1. Contrast becomes arithmetic.
- Roles are tones of a palette. For example, primary = T40 in light and T80 in dark; on-primary = T100 / T20; container = T90 / T30.
- Surfaces are 5 container tiers (T100…T90 in light, T4…T22 in dark).
- Contrast level (standard / medium / high) is a *scheme input*, not a separate theme.

**State layers [V]:** an "on-color" overlay at 8% (hover), 10% (focus), 10% (pressed) and 16% (dragged).

**Springs, not curves [V]:**
- Spatial springs (position/size) and effects springs (opacity/colour), each in fast / default / slow.
- Standard: damping 0.9, stiffness 1400 / 700 / 300.
- Expressive: 0.6/800, 0.8/380, 0.8/200.
- Effects springs never bounce.

**Shape [V]:** 0 / 4 / 8 / 12 / 16 / 28 / full, plus Expressive 20 / 32 / 48.

**Expressive research [V, Google's own claims]**
- Key elements were spotted up to 4× faster.
- The age gap closed.
- Google's caveat: use it for *key moments*, not everywhere.

**New patterns [V]:** split button, connected button groups, floating toolbar, FAB menu, shape-morphing loading indicator.

### Apple — HIG + Liquid Glass (WWDC25, refined at WWDC26)

**Principles [V]:**
- **Hierarchy** comes through layout and grouping, "instead of relying on decoration".
- **Harmony:** concentric shapes echo the hardware.
- **Consistency** across platforms.

**Glass is for the navigation/control layer only [V]:**
- Never on content.
- Never glass-on-glass.
- Tint only the single primary action.

**Material behaviour [V]:**
- Larger glass = thicker: more shadow, more lensing.
- Two variants: *regular* (adaptive) and *clear* (needs a dimming layer).
- Scroll-edge effects replace dividers. *Soft* is the default; *hard* is for pinned headers.

**Legibility backlash, and the fix [V/S]:**
- iOS 26.1 added a Clear/Tinted toggle.
- WWDC26 rebuilt glass for readability and added a **user slider from "ultra clear" to "fully tinted"**.
- **Lesson: glass opacity must be a user preference, not a constant.**

**Motion [V, WWDC18]:**
- Springs are defined by response and damping.
- Critically damped by default; bounce only when momentum justifies it.
- Always interruptible.

### Wise (tokens read from `@transferwise/neptune-*` packages, published 2026-10-19) [V]

**Colour**
- Neutrals are tinted toward the brand: text `#0e0f0c`, not black.
- Hairlines are about 12% alpha ink (`#0e0f0c1f`).
- Hover and pressed backgrounds are brand-ink at 8 / 13 / 18% alpha.
- Every interactive token has an explicit `-hover` and `-active` value. Nothing is computed with `opacity`.

**Shape and sizing:** soft radii (10 / 16 / 24 / 32, nothing below 10) and a control ladder of 24–72.

**Type**
- A brand display face (Wise Sans) plus Inter for the UI.
- Type styles cut from 22 to 14.
- Money figures are set in the display face as a trust moment.

**Gap:** no `prefers-reduced-motion` in their CSS. We should beat them here.

### Industry 2025–26 [V unless marked]

- DTCG spec stable (2025.10), including OKLCH / P3 and modes.
- Tailwind v4 and shadcn use OKLCH.
- APCA was dropped from the WCAG 3 draft. **WCAG 2.2 AA stays the bar**; APCA is advisory only.
- Linear's 2026 refresh: warmer neutrals, dimmer chrome, fewer dividers, no coloured icon chips.
- Brand face + Inter-class UI face is the norm (Atlassian Sans, Geist, Mona Sans, Wise).
- Now baseline: View Transitions (same-document), `@starting-style`, container queries. `linear()` easing is likely baseline too [U].

---

## 3. The concept: "Calm Depth"

One sentence: **calm, tonal surfaces for content; a thin layer of adaptive glass for the controls that float above it; motion that feels physical; colour only where it means something.**

### Principles (the tie-breakers for every review)

1. **Content leads, chrome recedes.**
   - Navigation and toolbars are quieter than the content.
   - We remove dividers before adding them.
2. **Hierarchy through tone and layout, not decoration.**
   - Surfaces step through tonal tiers.
   - No gradients or coloured chips in product UI. Brand gradients stay in marketing.
3. **One accent, spent deliberately.**
   - Each view has one emphasised primary action. Everything else is neutral.
   - "Expressive" emphasis is reserved for key moments: confirm, success, empty states.
4. **Physical, interruptible motion.**
   - Springs with no overshoot by default.
   - Bounce only for direct manipulation.
   - Exits are faster than entrances.
5. **Honest numbers and states.**
   - Tabular figures in all data.
   - Explicit hover, pressed, selected and disabled states.
   - Nothing hidden behind opacity tricks.
6. **Accessible by construction.**
   - Contrast is a scheme input, not something we patch afterwards.
   - Every material has a solid fallback.
   - Every user preference is honoured: motion, transparency, contrast and forced colours.

### What makes it ours, not Google's or Apple's

- **No ripple** (reads as Android). We use a state layer plus a 0.97 press-scale spring instead.
- **No shape-morphing "cookie" shapes.** Our shapes are capsule + concentric rounded rectangles.
- **Glass with a user-controlled intensity dial**, wired through ThemeProvider. Apple only shipped this in iOS 27; few web systems have it.
- **Brand-tinted neutrals and tinted alpha states** (Wise) on an M3-style role system.

---

## 4. Foundations — proposed changes

All changes are **additive**. Old token names stay as aliases, which is consistent with the rolling-minor policy (no major).

### 4.1 Color

- **Generate, don't hand-pick.**
  - The token build generates tonal palettes (tones 0–100) for primary, secondary, tertiary (= product accent), neutral, neutral-variant, error, success, warning and info. Each comes from one seed.
  - Output is **OKLCH** with hex fallbacks.
  - Use `@material/material-color-utilities` as a **build-time devDependency only** (zero runtime). We need HCT tone for the contrast guarantee.
- **Role tokens.** M3-shaped, under our own prefix:
  - `--color-primary`, `--color-on-primary`, `--color-primary-container`, `--color-on-primary-container`, and the same set for secondary, tertiary, error, success, warning and info;
  - `--color-surface`, `--color-surface-dim`, `--color-surface-bright`, `--color-surface-container-{lowest,low,default,high,highest}`;
  - `--color-on-surface`, `--color-on-surface-variant`, `--color-outline`, `--color-outline-variant`;
  - `--color-inverse-surface`, `--color-inverse-on-surface`, `--color-inverse-primary`, `--color-scrim`.
  - Existing `text/bg/surface/border/fill` tokens alias onto these, which fixes `text-white` ×38 with `on-*`.
- **Brand-tinted neutrals.** Neutral chroma is about 0.01 toward the brand hue. Text is never pure black.
- **Contrast levels.** `data-contrast="standard|medium|high"` selects pre-generated role sets. `prefers-contrast: more` maps to high automatically.
- **Brands** (leap, bookub, payub, founderub) become seeds for the *tertiary* palette, generated at build time. The 4 brand CSS files then shrink to a few lines each.
- **Hairlines and alpha states, Wise-style:**
  - `--color-outline-variant` is an ink alpha of about 10–12% in light and white at about 14% in dark, not an opaque grey.
- **Keep the primary hue.** Retune `#4099f1` in OKLCH. The palette's T40 (light primary) will be slightly deeper than today's 600.

### 4.2 Interaction: state layers

**Tokens:**
- `--state-hover: .08`
- `--state-focus: .10`
- `--state-pressed: .12`
- `--state-dragged: .16`
- `--state-disabled-content: .38`
- `--state-disabled-container: .12`

**Implementation:**
- One shared utility: a `::before` overlay, `background: currentColor`, `opacity: var(--state-*)`, `border-radius: inherit`.
- The colour comes from the component's `on-*` colour, so it works on every fill, theme, brand and glass surface with no extra tokens.

**Press feedback:** `scale(.97)` on a fast spatial spring, released on pointer-up. No ripple.

### 4.3 Shape

The primitive scale stays as it is, so consumers' own `rounded-md` doesn't shift. Add **semantic shape tokens** (the first step of roadmap R3, token tiers):

| Token | Value | Used by |
|---|---|---|
| `--shape-control` | full (capsule) | Button, IconButton, Chip, SegmentedControl, Switch, Badge |
| `--shape-field` | 12px | Input, Select, Textarea, Combobox |
| `--shape-container` | 16px | Card, Popover, Menu, Toast |
| `--shape-overlay` | 24px | Dialog, Sheet, CommandPalette |
| `--shape-tooltip` | 8px | Tooltip, Kbd |

**Concentric rule:** inner radius = `max(var(--shape-min), calc(outer − padding))`. It ships as a `--radius-inner` helper, used by Card media, Menu items and SegmentedControl thumbs.

### 4.4 Elevation

**In-flow content uses tone, not shadow.**
- Cards sit on `surface-container-low` over `surface`.
- Sidebars sit on `surface-container`.

**Shadows only for floating layers.** Three layered levels, each = a 1px alpha ring + 2 blurred layers:
- `--elevation-1`: menus, cards on hover
- `--elevation-2`: popovers, toasts
- `--elevation-3`: dialogs, sheets

**Dark mode:** shadows are weaker. Use a higher surface tier plus a 1px top highlight instead.

### 4.5 Typography

**Role scale (15 roles), in place of h1–h6.** h1–h6 stay as aliases.

| Role | Size / line height (px) | Tracking | Weight |
|---|---|---|---|
| display L / M / S | 56/60, 44/48, 36/40 | −0.03 / −0.025 / −0.02 em | 700 |
| headline L / M / S | 32/38, 28/34, 24/30 | −0.02 → −0.01 em | 600 |
| title L / M / S | 20/28, 16/24, 14/20 | −0.01 → 0 em | 600 |
| body L / M / S | 18/28, 16/24, 14/20 | −0.011 → 0 em | 400 |
| label L / M / S | 14/20, 13/18, 12/16 | 0 → +0.01 em | 500 |

- Each role has an **emphasized** variant (+100 weight), as in M3 Expressive.
- Global defaults:
  - `font-synthesis: none`
  - `text-wrap: balance` on display and headline; `pretty` on body
  - `text-underline-offset: .3em`
  - `font-variant-numeric: tabular-nums` on Table, DataTable, NumberInput, StatCard and a new `Amount`

**Typeface (decision needed, see §8).** Recommendation: **Inter 4 Variable** for the UI, and **Plus Jakarta Sans** kept for display and headline roles only.
- Inter 4 has an `opsz` axis, tabular figures and is OFL.
- This follows the brand-display + neutral-UI pairing that Wise, Atlassian and Vercel use.

### 4.6 Motion

**Springs as tokens.** The build pre-computes CSS `linear()` easings and settle durations from damping/stiffness:
- `--motion-spatial-{fast,default,slow}`: start from M3 *Standard* (damping 0.9) for product UI.
- `--motion-effects-{fast,default,slow}`: critically damped.
- `--motion-expressive-*`: damping 0.7–0.8, opt-in for toggles, success states and drag release.

**Rules:**
- Exits use the next-faster token.
- Never animate `backdrop-filter`.
- `transition-all` is banned (8 uses today).

**Platform features:**
- `@starting-style` for enter animations; this gradually replaces tailwindcss-animate.
- View Transitions for trigger→popover continuity, as progressive enhancement.
- **Fix:** add the missing `accordion-up/down` keyframes.

**Reduced motion:** keep the global fallback, and also give each component a designed fallback (cross-fade instead of slide/scale), rather than just zeroing durations.

### 4.7 Sizing and density

- Components finally use the size ladder: `--size-control-{xs..xl}` = 24 / 32 / **40** / 48 / 56.
- md moves 36 → 40, matching Apple's comfortable target and M3's buttons.
- `data-density="compact"` shifts every control down one step for data-heavy apps.
- Hit targets are at least 44px through a transparent `::after` on small controls (WCAG 2.5.8 + Apple).

### 4.8 Focus

- One ring for everything: 3px, offset 2px, `--color-primary` at contrast level, `border-radius: inherit` so it follows the capsule or field shape.
- Remove the roughly 30 per-component overrides and 13 `focus:outline-none`.
- `forced-colors`: system `Highlight`.

---

## 5. Glass 2.0 — "Nexub Glass"

It builds on the shipped v1 (a material layer, `surface="glass"`, `data-material`). It stays CSS-first.

### 5.1 Usage rules (in the docs, enforced in review)

- **Glass belongs only to the floating control layer:**
  - top bar, floating toolbar, tab bar, popovers, menus, sheets, dialogs, command palette and toasts.
- Card glass stays, but is documented as "only over imagery or media".
- Never glass on glass. Inside glass, use fills and `on-surface-variant`.
- At most 3 glass layers per viewport.
- Tint only the one primary action.

### 5.2 Recipe

**Thickness scales with size, like Apple:**

| Thickness | Blur | Saturate | Shadow | For |
|---|---|---|---|---|
| `thin` | 8px | 170% | elevation-1 | controls ≤ 48px tall |
| `regular` | 16px | 180% | elevation-2 | bars, popovers, menus |
| `thick` | 28px | 180% | elevation-3 | sheets, dialogs |

**Fill:**
- `color-mix(in oklch, var(--color-surface) calc(var(--glass-opacity) * 100%), transparent)`.
- One variable drives the intensity dial (§5.3).

**Edge:**
- A gradient hairline: top about α .55, bottom about α .12 in light.
- Drawn with a masked `::after` (`mask-composite: exclude`) so it respects the radius.

**Specular:** `inset 0 1px 0 rgb(255 255 255/.5)` plus a faint bottom rim `inset 0 -1px 0 rgb(255 255 255/.08)`. Dark mode uses about a quarter of that.

**Variants:**
- `regular` (default, adaptive).
- `clear`: low opacity plus a built-in dimming scrim, only over media.

**Tint:** `tint="primary"` mixes 35–45% of `--color-primary` into the fill, for the single emphasised action.

**Grain:** optional, off by default.
- Strict CSP: a `data:` noise image needs `img-src data:`, so grain must ship as a file asset.

### 5.3 Glass intensity dial (the headline feature)

**ThemeProvider/ThemeScript gain `glass: 'clear' | 'balanced' | 'tinted' | 'off'`:**
- Persisted like the theme and set pre-paint as `data-glass` on `<html>`.
- Maps to `--glass-opacity` of .35 / .62 / .85 / 1 (`off` = solid, no blur).
- This mirrors iOS 27's clear→tinted slider. The docs and the AppHeader settings pattern get a control for it.

**Automatic fallbacks:**
- `prefers-reduced-transparency` → `off`.
- `prefers-contrast: more` → `off` + 2px `outline` border.
- `forced-colors` → `Canvas` / `CanvasText`.
- `@supports not (backdrop-filter: blur(1px))` → `tinted`.
- Note: Safari support for `prefers-reduced-transparency` is reportedly missing [U], which is another reason for the in-app dial.

### 5.4 Scroll-edge effect

- A `scrollEdge="soft" | "hard"` prop on AppHeader/TopNav/Toolbar.
- `soft`: content fades under the bar via `mask-image` gradient + glass.
- `hard`: an opaque glass band, for pinned table headers.
- This replaces the bottom border on sticky bars.

### 5.5 Refraction (experimental, later)

- SVG `feDisplacementMap` inside `backdrop-filter` gives real lensing, **Chromium-only**.
- Safari doesn't render it, and Firefox passes `@supports` but then draws nothing.
- Ship as an opt-in `refraction` prop on small controls only, behind a JS feature check, with the standard recipe as fallback.
- Defer until 5.1–5.4 have proven out.

### 5.6 Verify before building [U]

- Whether Safari resolves custom properties inside `-webkit-backdrop-filter`. One brief says it doesn't, which would mean hard-coding per thickness.
- Scroll performance on a mid-tier Android device and on Safari with 3 stacked layers. Record a performance trace as proof.

---

## 6. Components

**Restyle every component onto the new foundations:** state layers, semantic shape, control ladder, `on-*` colours and springs.

**Notable redesigns:**

- **Button:**
  - Capsule shape; sizes on the ladder.
  - Variants: `filled`, `tonal` (container colour, new), `outlined`, `text`, `glass`.
  - Old variant names stay as aliases.
- **SegmentedControl / Tabs:** a spring-animated sliding selection thumb (Apple), with a glass thumb when the control sits on glass.
- **Switch:** Apple proportions with a spring thumb. The "on" track uses `--color-primary`, which fixes the 3:1 bug.
- **Inputs:** 40px tall, `--shape-field`. Filled-tonal on `surface-container-highest`, with an outline only on focus/error (M3 filled field). Outlined stays available.
- **Card:** tonal by default with no border; elevation only when interactive.
- **Tooltip:** inverse-surface, `--shape-tooltip`. Fixes the z-index and dark-mode bugs.
- **Toast:** inverse-surface snackbar style, or glass.
- **Dialog / Sheet / Popover / Menu:** glass `thick`/`regular`, concentric item radii, open from the trigger via View Transitions where supported.

**New components (M3 Expressive + Apple + Wise):**

| Component | Why |
|---|---|
| `ButtonGroup` connected + `SplitButton` | M3E pattern for primary + secondary actions |
| `FloatingToolbar` (glass) | Apple/M3E floating control layer for editors and selection actions |
| `NavigationRail` | Medium-width navigation between TopNav and Sidebar |
| `Amount` / `MoneyInput` | Wise-style: tabular figures, currency, display-face hero mode. Nexub is fintech-adjacent (Payub). |
| `ScrollEdge` util | Shared by bars (§5.4) |
| `ListDetail` pattern | M3 canonical layout using container queries, not breakpoints |

**Retire from product UI:** GradientDivider, TextGradient, EyebrowChip gradient, and the primary-gradient button token. They move to a marketing subpath; nothing is deleted.

---

## 7. Plan

**How we build it.** Work lands on `development` phase by phase. **We don't promote to `production` until phases 1–4 are complete**, so no consumer ever gets a half-refreshed look. This costs nothing extra on our existing branch pipeline.

| Phase | Scope | Effort |
|---|---|---|
| **0. Guardrails** ✅ 2026-10-20 | Visual regression (= R1), token contrast test, Storybook Brand toolbar. See [Phase 0 result](#phase-0-result) below. | M |
| **1. Foundations** ✅ 2026-10-20 | OKLCH tonal palette generator + role tokens + contrast levels. State-layer tokens + utility. Semantic shape. Elevation 1–3. Type roles + font decision. Spring `linear()` tokens. Size ladder + density. Unified focus ring. All old names aliased. | L |
| **2. Core controls** ✅ 2026-10-20 | Button family (+ tonal), IconButton, Input/Select/Textarea/Combobox, Checkbox/Radio/Switch, Chip/Badge, SegmentedControl, Tabs, Slider, Toggle. | L |
| **3. Glass 2.0** | Thickness tiers, gradient edge, tint, clear variant, intensity dial in ThemeProvider/ThemeScript, all fallbacks, scroll-edge, perf traces. | M |
| **4. Surfaces & overlays** | Card, Dialog, Sheet/Drawer, Popover, Menus, Tooltip, Toast, TopNav, Sidebar, AppHeader, CommandPalette; View Transitions. Then the **promote-to-production checkpoint**. | L |
| **5. New components** | ButtonGroup (connected), SplitButton, FloatingToolbar, NavigationRail, Amount/MoneyInput, ListDetail. | M–L |
| **6. Docs** | Principles page; Foundations rewritten (colour roles, state layers, shape, elevation, motion, glass); do/don't pairs; before/after gallery. | M |
| **Later** | Refraction (5.5); runtime seed-colour theming (`<ThemeProvider seed="#...">`) if a consumer needs it. | — |

### Phase 0 result

**Visual regression** (`packages/react/visual/`, CI job `visual`)
- Every story × light/dark/payub: 449 baselines, plus 4 skips for stories that pin their own theme.
- Runs with Playwright 1.64.0 in a digest-pinned Linux image. Time and randomness are frozen, so reruns are pixel-identical.
- Glass has no separate dimension. It's a prop, not a global, so its own stories cover it.

**Contrast test**
- 33 token pairs × light/dark × 5 brands, resolved through the real cascade in the browser, checked against WCAG 2.2 AA.
- A ratchet `KNOWN` list holds the 8 failures that exist today. Phase 1 must clear them:
  - light focus ring vs page: 2.98 (default), 2.54 (bookub), 2.15 (founderub);
  - `text-muted` on `bg-muted`: 4.34.
- Dark mode passes everywhere.

**Storybook:** a Brand toolbar was added. The glass-dial, contrast and density toolbars land with those features (Phases 1 and 3).

### Phase 1 result (2026-10-20)

**Generator.** `packages/tokens/scripts/generate.mjs`, with its self-test, produces:
- 12 HCT tonal palettes;
- the role table (light / dark × standard / high);
- spring easings.

The token build adds:
- `--color-palette-*`, `--motion-spring-*`, `--shape-*`, `--elevation-*`, `--state-*` and `--type-*`;
- `@nexub/tokens/css/roles`;
- Tailwind entries: role colours, `rounded-shape-*`, `shadow-elevation-*`, `text-<role>`, `ease-/duration-<spring>`, `h-control-*`.

**Themes.**
- Roles are `light-dark()`, and `data-theme` sets `color-scheme`. Dark works at any depth, so `dark.css` is now empty, kept only so existing imports still work.
- Legacy semantic names alias the roles.
- Fills are palette tone 40 (hover 30).
- One 3px focus ring.
- Inter is the UI face; Jakarta is used for headings and display.
- New `.nx-state-layer`, `.nx-press` and `data-density="compact"`.

**Results.**
- All 8 Phase 0 contrast failures are fixed, and `KNOWN` is empty.
- The browser contrast test now covers 20 contexts: light/dark × standard/high × 5 brands, with role pairs added.
- Visual baselines were re-recorded after a side-by-side review.

**Deviations from §4**
1. **Hex output, not OKLCH.** All values are in the sRGB gamut, so OKLCH adds nothing until we want P3.
2. **Contrast levels are standard + high only.** Medium is deferred.
3. **Primary seed moved from hue 255 to 268 (`#0059c7` at tone 40).** At the brand-mark hue, sRGB caps chroma, which made tone 40 a dull `#0061a6`. Neutrals keep the brand-mark hue.
4. **Legacy alias names resolve at `:root`.** A nested `data-contrast` only affects role names; nested `data-theme` and brands work everywhere.
5. **Browser requirement.** It requires `light-dark()` (Baseline 2024).
6. **Emphasized type weights are not tokenized.** Use the next weight utility.

### Phase 2 result (2026-10-20)

**Shared pieces**
- `utils/control.ts` holds the field chrome, focus, invalid, disabled and pressable class strings.
- `hooks/useSlidingIndicator.ts` drives one indicator that slides to the active item.
- `cn` now understands the token scales. Before, tailwind-merge silently dropped `text-label-*` next to text colours.

**Components**

| Component | Change |
|---|---|
| Button | Capsule, control ladder, roles, state layer + press spring. `filled`/`tonal`/`outlined`/`text`, with legacy aliases. |
| IconButton | Circle, the same system. |
| Input / Textarea / Select / Combobox | 12px fields, 16px text, 2px primary focus border, explicit disabled. |
| Checkbox / Radio / Switch | Outline borders that clear 3:1, primary when on. The Switch thumb uses the expressive spring. |
| Badge / Chip / Toggle | Role pairs. |
| SegmentedControl / Tabs | The sliding indicator; Tabs use a primary underline. |
| Slider | Thin track, primary knob, halo state layer. |

**Fixed along the way**
- Storybook's Tailwind config used `require()` on the ESM-only preset, so **the token preset never applied in Storybook**. Earlier baselines rendered Tailwind defaults.

**Verified**
- In a real browser: state layer at 0 / .08 / .12 for rest / hover / pressed, press `scale(.97)`, a 3px focus ring that follows the capsule, and indicators landing exactly on the clicked item.
- New review stories: `Foundations/Core controls` (every state), the Button gallery, and SegmentedControl with a selection.
- Visual baselines were re-recorded and are stable across reruns. 622 unit tests pass.

**Deferred**
- Filled (M3) text-field variant: the outlined field is kept as the only one for WCAG 1.4.11.
- The `glass` button variant moves to Phase 3.
- A 44px hit area for xs controls: 24px already meets WCAG 2.5.8.

### Quality bar (definition of done for each phase)

- WCAG 2.2 AA for every role pair in every theme × brand × contrast level, checked by the test, not by eye.
- Zero unreviewed visual diffs.
- Every interactive component has hover, focus, pressed, disabled and selected states, plus keyboard tests.
- Reduced motion, reduced transparency, high contrast and forced colours each verified per component.
- Glass scrolls at 60fps with 3 layers (performance trace attached to the PR).
- Motion is interruptible: retargeting mid-animation never jumps.
- CSS size budget: the `@nexub/themes` growth is reported in the PR.

---

## 8. Decisions (approved 2026-10-20)

1. **UI typeface:** Inter 4 Variable for UI roles; Plus Jakarta Sans for display/headline roles.
2. **Shape personality:** capsule controls + soft containers (12–24px).
3. **Default control height:** md = 40px, plus a `compact` density mode.
4. **Rollout:** phases land on `development`; **no promotion to `production` until phases 1–4 are complete.**

---

## Sources

**Google**
- https://blog.google/products/android/material-3-expressive-android-wearos-launch/
- https://design.google/library/expressive-material-design-google-research
- https://github.com/material-foundation/material-color-utilities (`color_spec_2021.ts`, HCT)
- https://developer.android.com/jetpack/androidx/releases/compose-material3 (motion/shape/state token sources)
- https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes
- https://github.com/material-components/material-web (maintenance mode; 2.5.0, 2026-07-14)

**Apple**
- WWDC25 219 "Meet Liquid Glass": https://developer.apple.com/videos/play/wwdc2025/219/
- WWDC25 356 "Get to know the new design system": https://developer.apple.com/videos/play/wwdc2025/356/
- WWDC18 803 "Designing Fluid Interfaces": https://developer.apple.com/videos/play/wwdc2018/803/
- iOS 26.1 Tinted toggle: https://tidbits.com/2025/10/21/ios-26-1-to-add-optional-opacity-to-liquid-glass/
- WWDC26 readability and slider: https://techcrunch.com/2026/06/08/apple-is-tweaking-its-controversial-liquid-glass-design

**Wise**
- `@transferwise/neptune-tokens` / `neptune-css@14.29.6` (npm, 2026-10-19)
- https://type-01.com/wise-sans-the-font-update-shaping-wises-visual-identity/

**Industry**
- DTCG 2025.10: https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/
- APCA status: https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html
- Linear refresh: https://linear.app/now/behind-the-latest-design-refresh
- View Transitions baseline: https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available

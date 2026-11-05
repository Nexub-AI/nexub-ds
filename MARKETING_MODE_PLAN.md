# 3.1: Marketing mode (prompt, reviewed 2026-11-05)

## Goal

Make Nexub DS ready to power the marketing website (nexub.com, repo `nexub-website-v2`) as well as the apps, the way Material Design serves both Google's apps and its marketing pages. The apps' Calm Depth look must not change. Add an opt-in marketing mode, marketing building blocks and server-component support, then release **3.1.0** (lockstep minor via Changesets, after 3.0.0 ships).

Visual target (private, my account; read it with the Artifact tool): https://claude.ai/artifact/UQu9GtrTRumNgaKUqaKUK8

- Artboard 1: the current website. The look and feel to keep.
- Artboard 3: "Nexub DS + proposed marketing mode". The target. Its `<helmet><style>` block holds the proposed tokens and keyframes.

## Website facts (the consumer)

- Next.js 15 App Router, React 19, Tailwind v4.2. Mostly server components, statically rendered for SEO.
- Font: Plus Jakarta Sans via `next/font` (already the DS display font). Container: 1260px. Hero headline: 56–64px / 800 / -0.045em.
- About 20 hand-built sections: Hero, TrustBar/LogoStrip, Stats, Testimonials, Personas, HowItWorks, Features, ProductGrid, PricingSection, FAQ, CTA, Footer with tools marquee, mega-menu Header with country switcher (SG, IN, ID, MY, VN).

## Where the repo stands (checked 2026-11-05)

- All packages are at 2.8.0. 2.9 (migration rules, 3.0 guide) is merged and 3.0 is next, so this is 3.1.
- `@nexub/react` already builds one file per component (`tsup` entry `src/components/*/index.ts`) and has `sideEffects: ["*.css"]`. But `tsup`'s `banner` stamps `'use client'` on **every** output file, and `exports` only exposes `"."`, so the per-component files can't be imported and nothing renders as a server component.
- `--shadow-plans`, `--shadow-glow`, `--shadow-lift` and a `container-nexub` token **don't exist**. `Container size="nexub"` hardcodes `var(--container-nexub, 1440px)`. Only `--gradient-hero-ambient` (in `themes/src/light.css`) and `--gradient-brand-*` exist. So the marketing tokens are new, not promoted.
- 3.0 removes the legacy token aliases. Don't bring old names back.
- Fonts are already a separate file (`themes/src/fonts.css`), but `base.css` imports it, and `base.css` also sets `body { background: var(--gradient-hero-ambient) }`.
- `@nexub/tokens/tailwind.css` (the Tailwind v4 theme) already exists, and the nexub-ds skill already documents v4 next to the v3 preset. It doesn't say v1.9.0.
- Already in the DS: EyebrowChip, NumberTicker, NavigationMenu, TopNav, Flag, CountryBadge, Amount, SegmentedControl, Accordion, Container, Section (`@nexub/react`) and PlanCard (`@nexub/patterns`).
- Missing: Reveal, Float, Marquee.
- Card already reads component tokens (`--card-radius`, `--card-bg`, `--card-border`, since 2.7). Product themes are scoped by `data-product`, so one page can mix product accents.

## Work, in this order

### 1. Server-component readiness (riskiest; do it first, it helps every consumer)

- Remove the `'use client'` banner from `packages/react/tsup.config`. Put `'use client'` at the top of only the component sources that use state, effects, context, refs or Radix. Presentational components (Heading, Text, Card, Badge, EyebrowChip, Container, Section, Logo, the icons, and every static marketing section) stay directive-free.
- Make sure the build keeps each directive on its own output file. Shared chunks from code splitting must not merge client and server code. If tsup can't do that, build unbundled (one output per source file).
- Add subpath exports (`"./*": "./dist/components/*/index.js"`). `sideEffects` is already right.
- Gate: a fresh Next.js 15 app renders Hero, StatBand and CTABand as server components with no warnings, and its client bundle doesn't contain the whole library. Keep the check in CI.

### 2. Marketing tokens (source of truth in `@nexub/tokens`; generated to CSS, the Tailwind v4 theme, JSON and native)

- New `marketing` group:
  - hero ambient background (move `--gradient-hero-ambient` here and keep the old name as an alias)
  - button gradient (#2563eb → #0059c7, built from palette tones rather than raw hex) and its hover version
  - button glow shadow
  - card radius (24px), card shadow at rest and on hover
  - floating-card shadow
  - eyebrow gradient
  - brand accent line
- Type: `display-xl` (64/68, 800, -0.045em) and heavier marketing heading weights.
- Container: add `container-marketing` at **1280px** (decided 2026-11-05; the site moves up from 1260). Turn the existing 1440px into a real `container-nexub` token, and document both.

### 3. `@nexub/themes/marketing`

- Everything applies only under `[data-mode="marketing"]`. Nothing outside it changes.
- Keyframes: rise, float, drift, ping, marquee, bar fill. Use the existing spring easing tokens. Honour `prefers-reduced-motion`.
- Add `@nexub/themes/core`: `base.css` without the font import and without the body gradient. `base.css` becomes core + fonts + body gradient, so current apps see no change. The website loads `core` and supplies fonts through `next/font` by setting `--font-family-sans` and `--font-family-display`.

### 4. Component variants in `@nexub/react` (marketing mode only)

- `Button variant="hero"`: gradient, glow, spring lift on hover. The focus ring stays visible over the gradient.
- `Card variant="showcase"` with `accent="leap|bookub|payub|founderub"`. `accent` sets `data-product` on the card, so it reuses the product themes. It sets the `--card-*` tokens for a coloured top edge and tint, 24px corners, shadow and hover lift.
- `EyebrowChip variant="gradient"`, with an optional pinging "live" dot.
- `NumberTicker`: an option to count up when it scrolls into view.
- New motion helpers: `Reveal` (fade up on scroll; CSS scroll-driven animation with an IntersectionObserver fallback), `Float`, `Marquee`. Reveal and Float should be CSS-only where possible, so they stay server components.

### 5. New `@nexub/marketing` package (built only from DS tokens and components; server components by default)

Hero, SectionHeader, LogoStrip, StatBand + StatCard, TestimonialGrid + TestimonialCard (product accent per card), ProductGrid + ProductCard, HowItWorks, FeatureSplit, CTABand, FAQ (wraps Accordion), PricingTable (reuses PlanCard, SegmentedControl and Amount; client), MarketingNav (TopNav + NavigationMenu mega-menu + country switcher using Flag/CountryBadge; client), MarketingFooter with a tools marquee.

### 6. Tailwind v4 setup and CSS

- Document the v4 setup: `@import "tailwindcss"; @import "@nexub/tokens/tailwind.css";` plus the theme CSS (`@nexub/themes/core`, a theme, `@nexub/themes/marketing`).
- Apps on Tailwind must **not** also load `@nexub/react/styles.css`, which ships its own preflight. Say so in the docs and the skill. No separate no-preflight build is needed: Tailwind apps don't need `styles.css` at all.

### 7. Accessibility

- Check contrast in light, dark and high contrast for:
  - white text on the hero and button gradients
  - the product-accent tints
  - the coloured stat numbers
- Add the cases to the existing token contrast test.
- Check keyboard paths and the focus ring on every new component, and add each one to the a11y tests.

### 8. Docs

- "Marketing mode" guidelines page:
  - gradients only on the hero, the main button and the CTA band
  - at most one glowing button per screen
  - product accents only for product-specific content
  - a motion budget, with reduced motion respected
- A "Next.js / server components" page: what is a server component, subpath imports, fonts through `next/font`.
- Docs-app examples for every new component and section. Add `@nexub/marketing` to `@nexub/mcp`.
- nexub-ds skill: add marketing mode, `@nexub/marketing`, server-component guidance and `themes/core`. If 3.0 drops the Tailwind 3 preset, remove the v3 block.

### 9. Release

- Changeset for **3.1.0** (minor, lockstep). Run typecheck, lint, tests, visual tests and the build across the monorepo.
- Re-sync the "Nexub" design-system artifact with /design-sync.

## Constraints

- No visual change to any app that doesn't set `data-mode="marketing"`. Prove it with the visual regression suite (`packages/react/visual`) and docs screenshots before and after.
- No hardcoded hex in components; tokens only.
- Every new component works in light and dark, under every `data-product`, and at `data-contrast="high"`.
- Backward compatible: deprecate, don't remove. Moving to server components must not break client-only apps (Vite, CRA).

## Done when

- Artboard 3 rebuilt with only `@nexub/marketing` and `@nexub/react` matches visually, motion included.
- A fresh Next.js 15 app renders Hero, StatBand and CTABand as server components with no `'use client'` warnings, and its JS bundle doesn't include the whole library.
- 3.1.0 is published and the docs and skill are updated.

## Start

Read the repo structure, the tokens build (`packages/tokens/scripts`) and `packages/react/tsup.config.ts`. Read artboards 1 and 3. Then propose a plan before changing anything.

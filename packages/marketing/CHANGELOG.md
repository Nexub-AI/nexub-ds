# @nexub/marketing

## 4.0.0

## 3.9.0

## 3.8.0

## 3.7.0

## 3.6.0

## 3.5.0

## 3.4.0

## 3.3.0

## 3.2.0

## 3.1.0

### Minor Changes

- 9bf12bc: Marketing mode and server components.

  - **Server components.** `@nexub/react` is now compiled one file per module, each with its own `'use client'` or none, so presentational components (Heading, Text, Container, Section, Stack, Badge, EyebrowChip, Logo, Float, Marquee) render as React Server Components and interactive ones stay client components. Every component can be imported on its own (`@nexub/react/Button`), and `cn` from `@nexub/react/cn`. In Next.js, import per component or set `optimizePackageImports`: a page with Hero, StatBand and CTABand went from 181 kB to 19.4 kB of page JavaScript. `SplitButton` is a client component. Nothing changes for client-only apps.
  - **New package `@nexub/marketing`**: Hero, SectionHeader, LogoStrip, StatBand and StatBandItem, TestimonialGrid and TestimonialCard, ProductGrid and ProductCard, HowItWorks, FeatureSplit, CTABand, FAQ, PricingTable, MarketingNav (mega-menu, country switcher, mobile sheet) and MarketingFooter (tools marquee). Server components except the nav, pricing and FAQ.
  - **`@nexub/themes/marketing`**: the nexub.com look, only under `data-mode="marketing"`, so apps that don't set it see no change. Heavier headings, the hero backdrop, accent line, motion (rise, reveal, float, drift, ping, marquee, bar fill) on the spring tokens, and nothing moves under reduced motion.
  - **`@nexub/themes/core`**: `base` without the fonts and the page backdrop, for apps that bring their own (Next.js `next/font` sets `--font-family-sans` and `--font-family-display`). `base` is unchanged. `@nexub/themes/fonts` is exported too.
  - **Tokens**: a `marketing` group (hero button gradient on primary tones 45 → 40, glow, eyebrow gradient, 24px showcase card radius and shadows, floating-card shadow, accent line, lifts), the `display-xl` type role (64/68, 800) and `container-marketing` (1280px).
  - **Components**: `Button variant="hero"`, `Card variant="showcase"` with `accent`, `EyebrowChip variant="gradient"` and `live`, `Container size="marketing"`, `NumberTicker countOnView`, and the new `Reveal`, `Float` and `Marquee`. Each looks like its plain variant outside marketing mode.
  - **Patterns**: `PlanCard` takes `ctaHref` to make its button a link.
  - **React Native**: the `display-xl` role maps to `largeTitle`.

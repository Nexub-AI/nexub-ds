# @nexub/marketing

## 8.1.0

## 8.0.0

## 7.9.0

## 7.8.0

## 7.7.0

## 7.6.0

## 7.5.0

## 7.4.0

## 7.3.0

## 7.2.0

### Minor Changes

- 1bfe041: 7.2: secure by default.

  - **New** `safeHref` and `safeSrc` (also `@nexub/react/safeHref`). Every consumer-supplied link and image URL now goes through them: `Breadcrumb`, `MediaCard`, `CardLink`, `Avatar`, and the navs/links in `AppHeader`, `NotificationItem`, `NotificationCenter`, `SettingsPage`, `SettingsLayout`, `PlanCard`, `AppLauncher`, `MarketingNav`, `MarketingFooter`. `javascript:`, `vbscript:`, `data:` and `file:` links are dropped; images allow relative, http(s), `blob:` and `data:image/*`. `safeHref(url, { strict: true })` allows only web, mailto, tel and sms; it becomes the default in 8.0.
  - **New** `NexubProvider` `nonce`: hands your CSP nonce to the `<style>` tags Radix overlays inject, so every overlay works under `style-src-elem 'nonce-…'`.
  - **New** `scrollLock="class"` on `Dialog.Root` and `AlertDialog.Root` (already on Sheet/Drawer and CommandPalette): no `<style>` at all. It becomes the default in 8.0.
  - **New** `FileUpload.Root` `validate(file)`: return a message to reject a file (reason `'custom'`).
  - `PasswordInput`: the reveal button keeps one name ("Show password") and reports its state with `aria-pressed` and `aria-controls`. The `hidePassword` message is deprecated (removed in 9.0).
  - `ThemeScript`: a stored product brand is applied only when it's a known product.

## 7.1.0

## 7.0.1

## 7.0.0

## 6.9.0

## 6.8.0

## 6.7.0

## 6.6.0

## 6.5.0

## 6.4.0

## 6.3.0

## 6.2.0

## 6.1.0

## 6.0.0

## 5.9.0

## 5.8.0

## 5.7.0

## 5.6.0

## 5.5.0

## 5.4.0

## 5.3.0

## 5.2.0

## 5.1.0

## 5.0.1

## 5.0.0

### Minor Changes

- 539443c: 5.0: Vivid by default, React 19.

  - **Vivid is the default expression.** `ThemeProvider` sets `data-expression="vivid"` on `<html>` when the app has not set one. Import `@nexub/themes/vivid` to see it. Keep the 4.x look with `data-expression="calm"` on `<html>` or `<ThemeProvider defaultExpression="calm">`. Calm stays fully supported.
  - **React 19 required.** `react` and `react-dom` peers are now `>=19 <20` in `@nexub/react`, `@nexub/patterns` and `@nexub/marketing`.
  - The 4.9 development warnings are removed. No component API changes. See /getting-started/migrating-to-5.

## 4.9.0

## 4.8.0

## 4.7.0

## 4.6.0

## 4.5.0

## 4.4.0

## 4.3.0

## 4.2.0

## 4.1.0

### Minor Changes

- f808dce: Quality first: full test coverage and interactive charts.

  - **Every component is now covered by the automated accessibility run.** The 24 components and marketing sections that had no Storybook story (the charts, MoneyInput, NavigationRail, Sheet, SplitButton, Float, Marquee, Reveal and every `@nexub/marketing` section) now have one, so axe-core (WCAG 2.2 A/AA, light and dark) and the screenshot suite run on them on every change. `@nexub/react/accessibility.json` reports 116 of 116 components covered.
  - **Charts: negative values.** `BarChart` and `LineChart` take values below zero: the axis spans zero, a zero line is drawn, and bars grow up or down from it (stacked bars stack positives and negatives separately). New `niceDomain(values)` helper.
  - **Charts: hover tooltip.** Hovering a category highlights it and shows every series value, built from CSS over the plot, so the charts stay server components with no JavaScript and no style attributes. Screen readers keep the data table.
  - **Charts: draw-in.** Bars grow from the zero line and lines reveal left to right on first paint (`.nx-chart-bar`, `.nx-chart-line` in `@nexub/themes`), off under reduced motion.
  - **MarketingNav accessibility (WCAG 2.5.3 Label in Name).** The logo link no longer overrides its name with "Home"; it takes the logo's own name ("Nexub"), so it matches the visible wordmark. `logoLabel` still overrides it. The country switcher's name now starts with the visible code ("SG, Choose country: Singapore").

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

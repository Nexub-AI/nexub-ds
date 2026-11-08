---
name: nexub-ds
description: Build SaaS UI with the Nexub Design System (@nexub/react, @nexub/patterns, @nexub/marketing, @nexub/tokens, @nexub/themes, @nexub/icons). Use when building or restyling any React screen, page, dashboard, form, settings page, auth flow, pricing page, marketing or landing page, or component in a project that uses Nexub DS, or when the user asks for Nexub, Calm Depth, marketing mode or Liquid Glass UI.
license: MIT
---

# Nexub Design System

Nexub DS is a token-driven React design system for SaaS products. The visual language is **Calm Depth**: tonal surfaces, one accent per view, spring motion, honest numbers. **Liquid Glass** is an optional material for the floating control layer. **Marketing mode** (`data-mode="marketing"`) is the livelier look for marketing sites, on the same tokens.

Reference files (read only what the task needs):

- [references/components.md](references/components.md): every component and pattern, grouped by category. Start here.
- `references/components/<slug>.md`: props, examples, when to use and accessibility for one component. Read it before using a component you have not used yet in this session.
- [references/tokens.md](references/tokens.md): color roles, type roles, spacing, shape, elevation, motion, z-index.
- [references/react-native.md](references/react-native.md): **mobile apps** (Expo / React Native). Use `@nexub/react-native` and `@nexub/react-native/patterns` there, never `@nexub/react`.

## 1. Check the setup first

Look for `@nexub/react` in `package.json`. If it is missing, set it up:

```bash
npm install @nexub/react @nexub/patterns @nexub/themes @nexub/tokens @nexub/icons
```

```ts
// app entry or global CSS, once
import '@nexub/themes/base';   // resets + token CSS variables
import '@nexub/themes/light';
import '@nexub/themes/glass';  // only if you use Liquid Glass
```

```css
/* Tailwind 4 (Tailwind 3 is not supported from 4.0): no config file. Load the theme CSS here, in the base layer, instead of from JS */
@layer theme, base, components, utilities;
@import "@nexub/themes/base" layer(base);
@import "@nexub/themes/light" layer(base);
@import "tailwindcss";
@import "@nexub/tokens/tailwind.css";
@source "../node_modules/@nexub/react/dist";
@source "../node_modules/@nexub/patterns/dist";
```

**Next.js App Router:** presentational components (Heading, Text, Container, Section, Stack, Badge, EyebrowChip, Logo, Float, Marquee and every `@nexub/marketing` section except `MarketingNav`, `PricingTable` and `FAQ`) are server components. Import per component (`@nexub/react/Button`, `@nexub/marketing/Hero`, `cn` from `@nexub/react/cn`) or set `experimental.optimizePackageImports: ['@nexub/react', '@nexub/marketing', '@nexub/icons']`, or the page ships every client component. Compound components (`Accordion.Root`, `TopNav.Root`) only work inside a `'use client'` file. To use `next/font`, import `@nexub/themes/core` (no fonts, no page backdrop) instead of `base` and name the font variables `--font-family-sans` and `--font-family-display`. With Tailwind, never also import `@nexub/react/styles.css`.

Wrap the app in `<ThemeProvider defaultTheme="system" storageKey="app-theme">` from `@nexub/react`. In server-rendered apps (Next.js), put `<ThemeScript storageKey="app-theme" />` in `<head>` and add `suppressHydrationWarning` to `<html>`. Product brands: set `data-product="leap" | "bookub" | "payub" | "founderub"` on the root. This remaps the `tertiary` role.

## 2. How to build a screen

1. **Start from a pattern.** Check the Patterns sections of `references/components.md` before you compose anything by hand.
2. **Then use components.** Use `@nexub/react` for every control, overlay, layout primitive and piece of typography. Never hand-roll a button, input, dialog, menu or table that the library already has.
3. **Then use tokens, only for the glue.** Use Tailwind utilities from the preset or v4 theme (`bg-surface-container-low`, `text-on-surface-variant`, `p-4`, `gap-6`, `rounded-shape-container`, `text-title-md`) or `var(--…)`.
4. **Never hardcode design values.** That means no hex or rgb colors, no Tailwind palette colors (`bg-blue-500`, `text-gray-600`), no arbitrary px values (`p-[13px]`), no ad-hoc shadows or gradients.

Starting points for typical SaaS screens:

| Screen | Build with |
| --- | --- |
| App frame | `AppShell` (`AppShell.Root/Header/Body/Sidebar/Main`) + `Sidebar` or `NavigationRail` + `AppHeader` or `TopNav` |
| Dashboard | `PageHeader` + a `Grid` of `StatCard` + `BarChart` / `LineChart` + `DataTable` or `Table` + `ActivityFeed` |
| Charts | `BarChart` (compare categories), `LineChart` (trend over time), `DonutChart` (parts of a whole, six slices at most), `Sparkline` (trend inside a stat or table cell). Pass `title`, `data`, `index` and `series`; colours come from the chart palette, never hex |
| List / detail | `ListDetail` + `FilterBar` + `EmptyState` |
| Settings | `SettingsLayout` / `SettingsRow` + `SettingsSection` + `FormField` |
| Sign in / sign up | `AuthCard` + `FormField` + `PasswordInput` |
| Pricing / billing | `PlanCard` + `SegmentedControl` (monthly / yearly) + `Amount` |
| Onboarding | `Stepper` + `CheckList` |
| Search / commands | `CommandPalette` + `KeyboardShortcut` |
| Empty, loading, error | `EmptyState`, `Skeleton`, `ErrorState`, `Toast` |
| Expressive moment (onboarding, hero, success) | `@nexub/themes/vivid` + `data-expression="vivid"` on that area, `Aurora` behind the hero. One expressive moment per screen; keep dense tables and forms Calm |
| White-label / customer brand | `<ThemeProvider seed="#hex">` (native: `<NexubNativeProvider seed>`), plus `createSeedStylesheet(seed)` from `@nexub/tokens/seed` rendered on the server so there is no flash. Never hand-pick brand hex for roles; try colours at nexub.design/foundations/theme-builder |
| Marketing / landing page | `@nexub/marketing` under `data-mode="marketing"`: `MarketingNav`, `Hero`, `LogoStrip`, `StatBand`, `FeatureSplit`, `HowItWorks`, `ProductGrid`, `TestimonialGrid`, `PricingTable`, `FAQ`, `CTABand`, `MarketingFooter` |

Money: use `Amount` and `MoneyInput`. They use tabular figures, the currency's own minor unit and a true minus sign. Icons: import from `@nexub/icons`, not `lucide-react` directly.

## 3. Calm Depth principles

1. **Content leads, chrome recedes.** Navigation is quieter than content. Remove a divider before you add one; let spacing and tone separate regions. Do: a tonal sidebar with no border, where the active item is a soft pill. Don't: a saturated brand-blue sidebar item, or a hard line around every region.
2. **Hierarchy through tone and layout, not decoration.** Surfaces step `surface` → `surface-container-*` → `surface-elevated`. Shadows are only for things that float. Product UI has no gradients, no colored icon tiles and no gradient eyebrow chips (those belong to marketing mode only).
3. **One accent, spent deliberately.** Each view gets one filled (primary) button. Everything else is `tonal`, `outlined` or `text`. Never put two filled buttons side by side.
4. **Physical, interruptible motion.** Use the spring tokens (`ease-spatial-default duration-spatial-default`), not raw durations. Exits are faster than entrances. Honor `prefers-reduced-motion`.
5. **Honest numbers and states.** Use tabular figures in data. Hover, pressed, selected and disabled are explicit component states. Never fake a state with opacity.
6. **Accessible by construction.** Every role pair meets WCAG 2.2 AA in light, dark and high contrast, as long as you pair a role with its `on-` role. Keep visible focus, labelled controls (`FormField` + `Label`) and keyboard support. Use `VisuallyHidden` for icon-only labels.

## 4. Liquid Glass rules

- Glass is for the floating control layer only: top bars, floating toolbars, popovers, menus, sheets, dialogs. Card glass is only for surfaces over imagery or media.
- Turn it on through props: `<TopNav.Root surface="glass" scrollEdge="soft">`, `<Dialog.Content surface="glass">`, `<Button variant="glass">`.
- Never put glass on glass. Show at most three glass layers at a time. Tint only the one primary action (`data-glass-tint="primary"`).
- Never put white text on glass over an unknown background.

## 5. Marketing mode rules

- Turn it on with `data-mode="marketing"` and `@nexub/themes/marketing`. Nothing outside the attribute changes; never use it in product UI.
- Gradients in three places only: the `Hero`, the main button (`Button variant="hero"`) and the `CTABand`.
- At most one `variant="hero"` button per screen; pair it with an outlined button.
- Product accents (`Card variant="showcase" accent="payub"`, `TestimonialCard accent`) only on product-specific content.
- Motion budget: one entrance per section (`Reveal` or the hero's rise), at most two `Float`s in view, one `Marquee` plus the footer's. All of it stops under reduced motion.
- Page width `Container size="marketing"` (1280px); headlines `text-display-xl` on the hero only; one h1 per page (the `Hero` title).

## 6. UI copy

Copy is clear, direct, human and confident. Use sentence case, active voice, contractions and specific verbs ("Save changes", not "Submit"). Errors say what happened and what to do: "Your session expired. Sign in again." No "Oops", no emoji in errors, no "Please be advised".

## 7. Before you finish

- [ ] Every control comes from `@nexub/react` or `@nexub/patterns`. No deprecated component (see the index).
- [ ] There are no hex or rgb colors, Tailwind palette colors, arbitrary px values or custom shadows. Everything is a token utility or `var(--…)`.
- [ ] Every background role is paired with its `on-` role. Secondary text uses `on-surface-variant` or `on-surface-muted`.
- [ ] Each view has at most one filled button (marketing: at most one hero button).
- [ ] In Next.js, server pages import per component and use no compound component outside a `'use client'` file.
- [ ] The screen works in light and dark (`data-theme`) and at `data-contrast="high"`.
- [ ] Every input has a label. Icon-only buttons have an `aria-label`. Keyboard paths work.

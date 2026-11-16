# @nexub/marketing

Marketing sections for the Nexub Design System, built only from `@nexub/react` and the design tokens: the building blocks of nexub.com.

```bash
pnpm add @nexub/marketing @nexub/react @nexub/patterns @nexub/icons @nexub/themes @nexub/tokens
```

| Section | Renders on |
|---|---|
| `Hero`, `SectionHeader`, `LogoStrip`, `StatBand` + `StatBandItem`, `TestimonialGrid` + `TestimonialCard`, `ProductGrid` + `ProductCard`, `HowItWorks`, `FeatureSplit`, `CTABand`, `MarketingFooter` | the server (React Server Components) |
| `MarketingNav`, `PricingTable`, `FAQ` | the client (`'use client'`) |

`StatBandItem` is named apart from `@nexub/patterns`' `StatCard`, so both packages can be used together.

## Marketing mode

The sections take their look from marketing mode: set `data-mode="marketing"` on `<html>` (or any wrapper) and load `@nexub/themes/marketing`. Nothing outside that attribute changes, so an app and its marketing pages can share one stylesheet.

## Next.js (App Router) with Tailwind 4

```css
/* app/globals.css */
@import "tailwindcss";
@import "@nexub/tokens/tailwind.css";
@import "@nexub/themes/core" layer(base);   /* resets, no fonts, no page backdrop */
@import "@nexub/themes/light" layer(base);
@import "@nexub/themes/dark" layer(base);
@import "@nexub/themes/marketing" layer(base);
@source "../node_modules/@nexub/react/dist";
@source "../node_modules/@nexub/patterns/dist";
@source "../node_modules/@nexub/marketing/dist";
```

Add `@import "@nexub/themes/divisions" layer(base);` for the five division colours (`data-division`) and `@import "@nexub/themes/products" layer(base);` for every app key (`data-product`); see [Divisions and apps](#divisions-and-apps).

Don't also import `@nexub/react/styles.css`: it's the prebuilt CSS for apps without Tailwind and brings a second preflight.

Turn on per-component imports, so `import { Button } from '@nexub/react'` pulls in only Button:

```js
// next.config.mjs
export default {
  experimental: { optimizePackageImports: ['@nexub/react', '@nexub/marketing'] },
};
```

Without it, a barrel import from `@nexub/react` in a client component added about 137 KB of client JS to a test page. The per-component entries (`@nexub/react/Button`, `@nexub/marketing/Hero`) never need it.

Fonts come from `next/font`; point the design tokens at them:

```tsx
// app/layout.tsx
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
const sans = Inter({ subsets: ['latin'], variable: '--font-family-sans' });
const display = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-family-display' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="marketing" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/page.tsx: a server component
import { Button } from '@nexub/react';
import { CTABand, Hero, StatBand, StatBandItem } from '@nexub/marketing';

export default function Page() {
  return (
    <main>
      <Hero
        eyebrow="Now in Vietnam"
        title="Run your whole company in one place"
        description="Payroll, bookkeeping and compliance for growing teams."
        actions={<><Button variant="hero" size="lg" asChild><a href="/start">Start free</a></Button><Button variant="outlined" size="lg" asChild><a href="/demo">Book a demo</a></Button></>}
      />
      <StatBand>
        <StatBandItem value={2000} suffix="+" label="Teams" />
        <StatBandItem value={5} label="Countries" tone="success" />
      </StatBand>
      <CTABand title="Start today" actions={<Button variant="filled" tone="neutral" asChild><a href="/start">Create an account</a></Button>} />
    </main>
  );
}
```

Each section is also importable on its own, e.g. `@nexub/marketing/Hero`.

## Server components

`Hero`, `StatBand`, `CTABand`, `MarketingFooter` and the other server sections send no component JS to the browser. The one exception is a `StatBandItem` with a numeric `value`: it counts up when it scrolls into view (`NumberTicker`, a small client component). Pass a formatted string (`value="2,000+"`) for a page with no design system JS at all. CI builds a fresh Next 15 app to check this (`pnpm check:rsc`).

In your own server components, import `Marquee` from `@nexub/react/Marquee`, not `@nexub/react/Motion`: the Motion entry also holds client components, which a bundler then ships with the page.

## Grouped mega-menu

An item with `columns` opens a panel as wide as the container: up to 5 columns (3 + 2 below `xl`), an optional `footer` strip and one `feature` card (beside up to 3 columns, under 4 or 5). In the mobile sheet each column is an accordion section and its title stays a link. Items with `items` keep the small two-column menu.

```tsx
import { MarketingNav, type MarketingNavItem } from '@nexub/marketing';

const country = 'sg';
const items: MarketingNavItem[] = [
  {
    label: 'Products',
    columns: [
      {
        title: 'Nexub OS',
        href: `/${country}/os`, // the heading links to the division page
        accent: 'os',           // tints the heading (data-division)
        links: [
          { label: 'Leap', href: `/${country}/leap` },
          { label: 'People', href: `/${country}/people` },
          { label: 'PayHub', href: `/${country}/payhub` },
          { label: 'Contracts', href: `/${country}/contracts` },
          { label: 'Book Hub', href: `/${country}/book-hub` },
          { label: 'Forms', href: `/${country}/forms`, badge: 'Early access' },
          { label: 'Founder Hub', href: `/${country}/founder-hub` },
        ],
      },
      { title: 'Nexub Commerce', href: `/${country}/commerce`, accent: 'commerce', links: [{ label: 'Commerce', href: `/${country}/commerce/app`, badge: 'Coming to Indonesia' }] },
      {
        title: 'Nexub Fintech',
        href: `/${country}/fintech`,
        accent: 'fintech',
        links: [
          { label: 'Money', href: `/${country}/money`, badge: 'Coming soon' },
          { label: 'Capital', href: `/${country}/capital`, badge: 'Coming soon' },
        ],
      },
      {
        title: 'Nexub Intelligence',
        href: `/${country}/intelligence`,
        accent: 'intelligence',
        links: [
          { label: 'Mind', href: `/${country}/mind` },
          { label: 'Go', href: `/${country}/go` },
          { label: 'Bring your own AI key', href: `/${country}/byok` },
        ],
      },
      {
        title: 'Nexub Autonomous',
        href: `/${country}/autonomous`,
        accent: 'autonomous',
        links: [
          { label: 'Command Hub', href: `/${country}/command-hub` },
          { label: 'Runner', href: `/${country}/runner` },
          { label: 'Robotics & logistics', href: `/${country}/robotics`, badge: 'In research' },
        ],
      },
    ],
    footer: [
      { label: 'All products', href: `/${country}/products` },
      { label: 'Nexub Account', href: `/${country}/account` },
      { label: 'Integrations', href: `/${country}/integrations` },
    ],
  },
  {
    label: 'Resources',
    columns: [
      { title: 'Learn', links: [{ label: 'Guides', href: '/guides' }, { label: 'Blog', href: '/blog' }] },
      { title: 'Tools', links: [{ label: 'Payroll calculator', href: '/tools/payroll' }] },
      { title: 'Help', links: [{ label: 'Help centre', href: '/help' }, { label: 'Contact sales', href: '/sales' }] },
    ],
    feature: <a href="/stories/studio">How a 40-person studio closes its books in two days</a>,
  },
  { label: 'Pricing', href: `/${country}/pricing` },
];

<MarketingNav logo={<Logo size="sm" />} items={items} country="SG" countries={countries} />;
```

A link's `badge` ("Coming soon", "Coming to Indonesia") is read as part of the link's name, on grouped and flat menus alike. Column titles label their lists, and Tab and the arrow keys go column by column. `MarketingNav` stays the only client component of the header.

## Divisions and apps

| `data-division` (`@nexub/themes/divisions`) | `data-product` apps (`@nexub/themes/products`) |
|---|---|
| `os` | `leap`, `people`, `payub` (`payhub`), `contracts`, `bookub` (`book-hub`), `forms`, `founderub` (`founder-hub`) |
| `commerce` | `commerce` |
| `fintech` | `money`, `capital` |
| `intelligence` | `mind`, `go` |
| `autonomous` | `command-hub`, `runner` |

Leap, Book Hub, PayHub and Founder Hub keep their own colours; every other app takes its division's. One division is also importable on its own (`@nexub/themes/divisions/os`).

```tsx
<Hero division="autonomous" eyebrow="Nexub Autonomous" title="Agents that run the routine work" />
<ProductGrid division="autonomous">
  <ProductCard division="autonomous" name="Runner" description="…" href="/sg/runner" />
</ProductGrid>
<Card variant="showcase" accent="intelligence">…</Card>
<CTABand division="autonomous" title="Start today" />
```

`division` sets `data-division` on the section, so its eyebrow, cards, links, focus ring and CTA band take the division's colour. `DivisionKey` and `ProductKey` are exported from `@nexub/react/Card` and `@nexub/core`.

Guidelines: gradients only on the hero, the main button and the CTA band; at most one glowing (`variant="hero"`) button per screen; product accents only on product-specific content. See the Marketing mode page in the docs.

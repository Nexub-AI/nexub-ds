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

Don't also import `@nexub/react/styles.css`: it's the prebuilt CSS for apps without Tailwind and brings a second preflight.

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

Guidelines: gradients only on the hero, the main button and the CTA band; at most one glowing (`variant="hero"`) button per screen; product accents only on product-specific content. See the Marketing mode page in the docs.

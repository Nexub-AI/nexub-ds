---
'@nexub/tokens': minor
'@nexub/themes': minor
'@nexub/core': minor
'@nexub/react': minor
'@nexub/marketing': minor
---

Division mega-menu and division/app themes, for the nexub.com rebuild. Nothing is removed and apps that set neither `data-division` nor a new `data-product` key look the same.

- **MarketingNav**: an item with `columns` opens a grouped mega-menu as wide as the container: up to 5 columns (3 + 2 below `xl`), each a labelled list whose title can link to the division page and take a division tint (`accent`), with an optional `footer` strip and `feature` card. In the mobile sheet each column is an accordion section. Links take a `badge` ("Coming soon") that is part of the link's name, on flat `items` menus too. Menu links now show the focus ring. New types `MarketingNavColumn` and `MarketingNavGroup`.
- **Fix**: with `@nexub/themes/glass` loaded, the header's soft scroll edge was a mask that also hid the open mega-menu. MarketingNav no longer sets it.
- **Tokens**: accent scales for the five divisions (`--color-accent-os-50` … `-950`, `-fill`, `-fill-hover`; also commerce, fintech, intelligence, autonomous) in CSS, Tailwind, JSON and JS; `native.color.divisions` and Figma `division` variables; the division → apps map at `@nexub/tokens/json/divisions`.
- **Themes**: `@nexub/themes/divisions` (and `@nexub/themes/divisions/os` etc.) for `data-division`; `@nexub/themes/products` for every app under `data-product` (people, contracts, forms, commerce, money, capital, mind, go, command-hub, runner, plus the aliases book-hub, payhub, founder-hub). Generated from the token map; the per-product files stay.
- **Components**: Card `accent` accepts `ProductKey | DivisionKey` (exported from `@nexub/react/Card` and `@nexub/core`). `division` on Hero, SectionHeader, ProductGrid, ProductCard and CTABand sets `data-division`; in marketing mode the eyebrow and the CTA band take the division's colour.
- **Server components**: `@nexub/react/Marquee` is a new server-safe entry. LogoStrip and MarketingFooter use it, so they no longer bring the client-side Motion components onto a server-rendered page.

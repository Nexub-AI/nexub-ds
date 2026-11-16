# MarketingNav

The site header: logo, links with mega-menus, a country switcher and actions. Below `lg` the links move into a side sheet.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { MarketingNav } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/marketing-nav

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `logo` (required) | `React.ReactNode` |  | Logo, wrapped in a link to `logoHref`. |
| `items` (required) | `MarketingNavItem[]` |  | Links; an item with `items` opens a mega-menu of links with descriptions; one with `columns` (`MarketingNavColumn[]`: `title`, `href`, `description`, `accent`, `links`) opens a grouped mega-menu, with optional `footer` links and a `feature` card. A link's `badge` shows after its label and is part of its accessible name. |
| `countries` | `MarketingCountry[]` |  | Country sites: `{ code, label, href }`. The switcher shows when there are two or more. |
| `country` | `string` |  | Current country code. |
| `actions` | `React.ReactNode` |  | Sign in / Get started buttons. |
| `logoHref` | `string` | `'/'` | Where the logo links. |
| `menuLabel` | `string` | `'Open menu'` | Accessible name of the mobile menu button. |

## Example: Default

```tsx
import { Button, Logo } from '@nexub/react';
import { MarketingNav } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <MarketingNav
        logo={<Logo size="sm" />}
        items={[
          {
            label: 'Products',
            items: [
              { label: 'Payub', href: '#payub', description: 'Payroll and HR' },
              { label: 'Bookub', href: '#bookub', description: 'Bookkeeping' },
              { label: 'Leap', href: '#leap', description: 'Company formation' },
              { label: 'Founderub', href: '#founderub', description: 'Founder tools' },
            ],
          },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Customers', href: '#customers' },
        ]}
        countries={[
          { code: 'SG', label: 'Singapore', href: '#sg' },
          { code: 'IN', label: 'India', href: '#in' },
          { code: 'ID', label: 'Indonesia', href: '#id' },
          { code: 'MY', label: 'Malaysia', href: '#my' },
          { code: 'VN', label: 'Vietnam', href: '#vn' },
        ]}
        country="SG"
        actions={
          <>
            <Button variant="text" size="sm" asChild><a href="#signin">Sign in</a></Button>
            <Button variant="filled" size="sm" asChild><a href="#start">Get started</a></Button>
          </>
        }
      />
    </div>
  );
}
```

## Example: Grouped mega-menu

An item with `columns` opens a panel as wide as the container: up to 5 columns (3 + 2 below `xl`), each a labelled list whose title can link to the division page, with an optional `footer` strip and `feature` card. In the side sheet each column is an accordion section. `accent` tints a heading with the division colour (load `@nexub/themes/divisions`).

```tsx
import { Button, Card, CardLink, Logo } from '@nexub/react';
import { MarketingNav, type MarketingNavItem } from '@nexub/marketing';

// The nexub.com header: Products (the five divisions), Solutions and Resources.
export const items: MarketingNavItem[] = [
  {
    label: 'Products',
    columns: [
      {
        title: 'Nexub OS',
        href: '#os',
        accent: 'os',
        links: [
          { label: 'Leap', href: '#leap' },
          { label: 'People', href: '#people' },
          { label: 'PayHub', href: '#payhub' },
          { label: 'Contracts', href: '#contracts' },
          { label: 'Book Hub', href: '#book-hub' },
          { label: 'Forms', href: '#forms', badge: 'Early access' },
          { label: 'Founder Hub', href: '#founder-hub' },
        ],
      },
      {
        title: 'Nexub Commerce',
        href: '#commerce',
        accent: 'commerce',
        links: [{ label: 'Commerce', href: '#commerce-app', badge: 'Coming to Indonesia' }],
      },
      {
        title: 'Nexub Fintech',
        href: '#fintech',
        accent: 'fintech',
        links: [
          { label: 'Money', href: '#money', badge: 'Coming soon' },
          { label: 'Capital', href: '#capital', badge: 'Coming soon' },
        ],
      },
      {
        title: 'Nexub Intelligence',
        href: '#intelligence',
        accent: 'intelligence',
        links: [
          { label: 'Mind', href: '#mind' },
          { label: 'Go', href: '#go' },
          { label: 'Bring your own AI key', href: '#byok' },
        ],
      },
      {
        title: 'Nexub Autonomous',
        href: '#autonomous',
        accent: 'autonomous',
        links: [
          { label: 'Command Hub', href: '#command-hub' },
          { label: 'Runner', href: '#runner' },
          { label: 'Robotics & logistics', href: '#robotics', badge: 'In research' },
        ],
      },
    ],
    footer: [
      { label: 'All products', href: '#products' },
      { label: 'Nexub Account', href: '#account' },
      { label: 'Integrations', href: '#integrations' },
    ],
  },
  {
    label: 'Solutions',
    columns: [
      {
        title: 'By stage',
        links: [
          { label: 'Starting up', href: '#starting-up', description: 'Incorporate and open for business' },
          { label: 'Growing', href: '#growing', description: 'Hire, pay and stay compliant' },
          { label: 'Scaling', href: '#scaling', description: 'Many entities, one view' },
        ],
      },
      {
        title: 'By industry',
        links: [
          { label: 'Retail and e-commerce', href: '#retail' },
          { label: 'Professional services', href: '#services' },
          { label: 'Food and beverage', href: '#fnb' },
          { label: 'Logistics', href: '#logistics' },
        ],
      },
      {
        title: 'By need',
        links: [
          { label: 'Payroll', href: '#payroll' },
          { label: 'Bookkeeping', href: '#bookkeeping' },
          { label: 'Company secretary', href: '#cosec' },
          { label: 'Fundraising', href: '#fundraising' },
        ],
      },
    ],
    feature: (
      <Card variant="surface" className="flex h-full flex-col gap-2 p-5">
        <p className="m-0 text-label-md text-[var(--color-on-surface-muted)]">Customer story</p>
        <p className="m-0 text-title-md text-[var(--color-on-surface)]">
          <CardLink href="#story">How a 40-person studio closes its books in two days</CardLink>
        </p>
      </Card>
    ),
  },
  {
    label: 'Resources',
    columns: [
      {
        title: 'Learn',
        links: [
          { label: 'Guides', href: '#guides' },
          { label: 'Blog', href: '#blog' },
          { label: 'Webinars', href: '#webinars' },
        ],
      },
      {
        title: 'Tools',
        links: [
          { label: 'Payroll calculator', href: '#calculator' },
          { label: 'Company name check', href: '#name-check' },
          { label: 'Templates', href: '#templates' },
        ],
      },
      {
        title: 'Help',
        links: [
          { label: 'Help centre', href: '#help' },
          { label: 'Contact sales', href: '#sales' },
          { label: 'System status', href: '#status' },
        ],
      },
    ],
  },
  { label: 'Pricing', href: '#pricing' },
];

export default function Example() {
  // Room for the open panel: the docs preview clips what overflows it.
  return (
    <div data-mode="marketing" className="min-h-[34rem] w-full">
      <MarketingNav
        logo={<Logo size="sm" />}
        items={items}
        countries={[
          { code: 'SG', label: 'Singapore', href: '#sg' },
          { code: 'MY', label: 'Malaysia', href: '#my' },
          { code: 'IN', label: 'India', href: '#in' },
          { code: 'ID', label: 'Indonesia', href: '#id' },
          { code: 'VN', label: 'Vietnam', href: '#vn' },
        ]}
        country="SG"
        actions={
          <>
            <Button variant="text" size="sm" asChild><a href="#signin">Sign in</a></Button>
            <Button variant="filled" size="sm" asChild><a href="#start">Get started</a></Button>
          </>
        }
      />
    </div>
  );
}
```

# MarketingNav

The site header: logo, links with mega-menus, a country switcher and actions. Below `lg` the links move into a side sheet.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { MarketingNav } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/marketing-nav

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `logo` (required) | `React.ReactNode` |  | Logo, wrapped in a link to `logoHref`. |
| `items` (required) | `MarketingNavItem[]` |  | Links; an item with `items` opens a mega-menu of links with descriptions. |
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

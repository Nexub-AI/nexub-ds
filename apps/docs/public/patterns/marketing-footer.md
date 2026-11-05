# MarketingFooter

The site footer: a tools strip, the logo, link columns and the legal line. Server component.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { MarketingFooter } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/marketing-footer

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` (required) | `{ title, links: { label, href }[] }[]` |  | Link columns, each a labelled nav. |
| `logo` | `React.ReactNode` |  | Logo. |
| `tagline` | `React.ReactNode` |  | A line under the logo. |
| `tools` | `React.ReactNode[]` |  | Tools or integrations, scrolling in a strip. |
| `toolsLabel` | `string` | `'Works with'` | Label of the tools strip. |
| `bottom` | `React.ReactNode` |  | Copyright and legal links. |

## Example: Default

```tsx
import { Logo } from '@nexub/react';
import { MarketingFooter } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <MarketingFooter
        logo={<Logo size="sm" />}
        tagline="The operating system for growing companies."
        tools={['Slack', 'Xero', 'Google Workspace', 'Stripe', 'QuickBooks', 'WhatsApp']}
        columns={[
          { title: 'Products', links: [{ label: 'Payub', href: '#payub' }, { label: 'Bookub', href: '#bookub' }, { label: 'Leap', href: '#leap' }] },
          { title: 'Company', links: [{ label: 'About', href: '#about' }, { label: 'Careers', href: '#careers' }] },
          { title: 'Resources', links: [{ label: 'Help centre', href: '#help' }, { label: 'Status', href: '#status' }] },
        ]}
        bottom="© 2026 Nexub Pte. Ltd., Singapore"
      />
    </div>
  );
}
```

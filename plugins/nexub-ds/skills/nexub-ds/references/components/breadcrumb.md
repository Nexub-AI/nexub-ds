# Breadcrumb

Hierarchical navigation trail showing page location.

- Package: `@nexub/react` · Category: Navigation · Status: stable
- Import: `import { Breadcrumb } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/breadcrumb

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Breadcrumb.Root aria-label` | `string` | `'breadcrumb'` | Accessible label for the nav landmark. |
| `Breadcrumb.Link href` | `string` |  | URL the breadcrumb link navigates to. |
| `Breadcrumb.Link asChild` | `boolean` | `false` | Merges props onto the immediate child element, useful for router Link components. |
| `Breadcrumb.Trail items` (required) | `{ label: ReactNode; href?: string }[]` |  | The whole trail from data (5.1), root first; the last item is the current page. |
| `Breadcrumb.Trail maxItems` | `number` | `4` | Longer trails keep the first item and the last `maxItems - 1`, and move the rest into a "More" menu. |
| `Breadcrumb.Separator children` | `React.ReactNode` |  | Custom separator element. Defaults to a chevron icon. |
| `Breadcrumb.Ellipsis aria-label` | `string` | `'More'` | Accessible label for the ellipsis element used to collapse long trails. |

## Example: Default

```tsx
import { Breadcrumb } from '@nexub/react';

export default function Example() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item><Breadcrumb.Link href="/components">Components</Breadcrumb.Link></Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item><Breadcrumb.Page>Button</Breadcrumb.Page></Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
```

## Example: With ellipsis

```tsx
import { Breadcrumb } from '@nexub/react';

export default function Example() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item><Breadcrumb.Ellipsis /></Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item><Breadcrumb.Link href="/components/navigation">Navigation</Breadcrumb.Link></Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item><Breadcrumb.Page>Breadcrumb</Breadcrumb.Page></Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
```

## Example: Auto-collapse

Breadcrumb.Trail moves the middle of a long path into a menu.

```tsx
import { Breadcrumb } from '@nexub/react';

export default function Example() {
  return (
    <Breadcrumb.Trail
      maxItems={3}
      items={[
        { label: 'Home', href: '/' },
        { label: 'Acme', href: '/' },
        { label: 'Billing', href: '/' },
        { label: 'Invoices', href: '/' },
        { label: 'INV-2041' },
      ]}
    />
  );
}
```

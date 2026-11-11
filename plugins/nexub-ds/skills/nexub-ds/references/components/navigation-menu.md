# Navigation Menu

Site navigation links with flyout panels, built on Radix.

- Package: `@nexub/react` · Category: Navigation · Status: stable
- Import: `import { NavigationMenu } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/navigation-menu

## When to use

- Marketing or docs sites whose sections need a flyout of links

## When not to use

- Actions: use `DropdownMenu` or `Menubar`
- App navigation without flyouts: use `TopNav` or `Sidebar`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `NavigationMenu.Root` | `compound` |  | The `<nav>` (`value`, `onValueChange`, `delayDuration`). Renders the panel viewport for you. |
| `NavigationMenu.List / Item` | `compound` |  | The list of top-level entries. |
| `NavigationMenu.Trigger` | `compound` |  | Opens the item’s panel on hover or click. |
| `NavigationMenu.Content` | `compound` |  | The flyout panel for an item. |
| `NavigationMenu.Link` | `compound` |  | A link, top-level or inside a panel (`href`, `active`, `asChild` for router links). |
| `NavigationMenu.Indicator` | `compound` |  | Optional arrow under the open trigger. |

## Example: Default

```tsx
import { NavigationMenu } from '@nexub/react';

const products = [
  { title: 'Analytics', body: 'Track key metrics in real time.' },
  { title: 'Dashboards', body: 'Build and share custom views.' },
  { title: 'Reports', body: 'Export and schedule reports.' },
];

export default function Example() {
  return (
    <NavigationMenu.Root aria-label="Site">
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <ul className="grid w-[280px] gap-1 p-2">
              {products.map((p) => (
                <li key={p.title}>
                  <NavigationMenu.Link href="#">
                    <span className="block text-label-lg">{p.title}</span>
                    <span className="mt-1 block text-body-sm text-[var(--color-on-surface-muted)]">{p.body}</span>
                  </NavigationMenu.Link>
                </li>
              ))}
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Pricing</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Docs</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
```

## Accessibility

- `Tab`: Moves between top-level entries.
- `Enter / Space`: Opens or closes a panel.
- `Escape`: Closes the panel and returns focus to its trigger.
- Give `NavigationMenu.Root` an `aria-label` when the page has more than one navigation landmark.

Related: [top-nav](top-nav.md), [menubar](menubar.md)

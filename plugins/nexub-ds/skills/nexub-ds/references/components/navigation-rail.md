# Navigation Rail

Navigation for medium-width windows: icons over labels, with an active pill behind the icon.

- Package: `@nexub/react` · Category: Navigation · Status: beta
- Import: `import { NavigationRail } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/navigation-rail

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Root header` | `ReactNode` |  | Slot above the items, e.g. a primary action. |
| `Root aria-label` | `string` | `'Main'` | Name of the nav landmark. |
| `Item icon / label` (required) | `ReactNode` |  | Icon in the indicator pill; label below. |
| `Item active` | `boolean` |  | Marks the current page (aria-current="page"). |
| `Item asChild` | `boolean` |  | Use your router link as the item; pass it as the only child. |

## Example: Default

```tsx
<NavigationRail.Root aria-label="Workspace">
  <NavigationRail.Item href="/" icon={<Home />} label="Home" active />
  <NavigationRail.Item href="/files" icon={<Folder />} label="Files" />
  <NavigationRail.Item href="/settings" icon={<Settings />} label="Settings" />
</NavigationRail.Root>
```

Related: [sidebar](sidebar.md), [top-nav](top-nav.md)

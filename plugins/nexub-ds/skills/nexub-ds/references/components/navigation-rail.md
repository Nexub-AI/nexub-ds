# Navigation Rail

Navigation for medium-width windows: icons over labels, with an active pill behind the icon.

- Package: `@nexub/react` · Category: Navigation · Status: beta
- Import: `import { NavigationRail } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/navigation-rail

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Root header` | `ReactNode` |  | Slot above the items, e.g. a primary action. Not shown in the bottom bar. |
| `Root orientation` | `'vertical' \| 'bottom'` | `'vertical'` | 11.5. `bottom` is a phone tab bar: a row that sticks to the bottom of the scroll area, with safe-area padding and 48px targets. Put it after the page content. |
| `Root aria-label` | `string` | `'Main'` | Name of the nav landmark. |
| `Item icon / label` (required) | `ReactNode` |  | Icon in the indicator pill; label below. |
| `Item active` | `boolean` |  | Marks the current page (aria-current="page"). |
| `Item badge` | `number \| boolean` |  | 11.5. A count on the icon (99+ above 99, nothing at 0), or `true` for a dot. Screen readers hear it after the label: "Inbox, 3 unread" or "Feed, New". |
| `Item badgeLabel` | `string` |  | 11.5. Other wording for the badge, e.g. "2 failed builds". |
| `Item asChild` | `boolean` |  | Use your router link as the item; pass it as the only child. |

## Example: Default

```tsx
import { NavigationRail } from '@nexub/react';

export default function Example() {
  const glyph = (d: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
  );
  return (
    <NavigationRail.Root aria-label="Workspace" className="h-auto bg-surface-container-low rounded-shape-overlay">
      <NavigationRail.Item href="#" icon={glyph('M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z')} label="Home" active />
      <NavigationRail.Item href="#" icon={glyph('M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z')} label="Files" />
      <NavigationRail.Item href="#" icon={glyph('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z')} label="Settings" />
    </NavigationRail.Root>
  );
}
```

## Example: Bottom tab bar with badges

For phones: `orientation="bottom"`, with a count and a dot badge.

```tsx
import { NavigationRail } from '@nexub/react';
import { Bell, Home, Inbox, User } from '@nexub/icons';

export default function Example() {
  return (
    <div className="flex h-80 w-full max-w-sm flex-col overflow-auto rounded-shape-overlay border border-outline-variant">
      <main className="flex-1 p-4 text-body-md text-on-surface-variant">Page content scrolls above the tab bar.</main>
      <NavigationRail.Root orientation="bottom" aria-label="Main">
        <NavigationRail.Item href="#" icon={<Home />} label="Home" active />
        <NavigationRail.Item href="#" icon={<Inbox />} label="Inbox" badge={3} />
        <NavigationRail.Item href="#" icon={<Bell />} label="Alerts" badge />
        <NavigationRail.Item href="#" icon={<User />} label="Profile" />
      </NavigationRail.Root>
    </div>
  );
}
```

Related: [sidebar](sidebar.md), [top-nav](top-nav.md)

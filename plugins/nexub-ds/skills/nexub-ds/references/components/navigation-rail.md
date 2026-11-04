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
import { NavigationRail } from '@nexub/react';

export default function Example() {
  const glyph = (d: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
  );
  return (
    <NavigationRail.Root aria-label="Workspace" className="h-auto bg-[var(--color-surface-container-low)] rounded-[24px]">
      <NavigationRail.Item href="#" icon={glyph('M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z')} label="Home" active />
      <NavigationRail.Item href="#" icon={glyph('M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z')} label="Files" />
      <NavigationRail.Item href="#" icon={glyph('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z')} label="Settings" />
    </NavigationRail.Root>
  );
}
```

Related: [sidebar](sidebar.md), [top-nav](top-nav.md)

# Resizable Panels

Panels with draggable separators, for list–detail and editor layouts.

- Package: `@nexub/react` · Category: Layout · Status: beta
- Import: `import { ResizablePanels } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/resizable-panels

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` |  | The panels; a separator goes between each pair. |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Side by side or stacked. |
| `sizes / defaultSizes / onSizesChange` | `number[]` |  | One percentage per panel, adding up to 100. Save them (localStorage, user settings) to restore the layout. |
| `minSizes` | `number[]` | `10 each` | Smallest size per panel, in percent. |
| `handleLabel` | `string` | `"Resize panels"` | Names the separators. |

## Example: List and detail

```tsx
import { ResizablePanels } from '@nexub/react';

export default function Example() {
  return (
    <ResizablePanels defaultSizes={[35, 65]} minSizes={[20, 30]} className="h-64 w-full rounded-shape-container border border-[var(--color-outline-variant)]">
      <ul className="flex flex-col gap-2 p-4 text-body-md">
        <li>Quarterly report</li>
        <li>Launch checklist</li>
        <li>Hiring plan</li>
      </ul>
      <div className="p-4 text-body-md">Drag the line, or focus it with Tab and use the arrow keys.</div>
    </ResizablePanels>
  );
}
```

## Accessibility

- Roles: separator (focusable, with aria-valuenow / min / max and aria-controls)
- `Arrow keys`: Move the focused separator by 5%. Mirrored in RTL.
- `Home / End`: To the smallest or largest size.
- `Enter`: Back to the default split.

Related: [sidebar](sidebar.md), [app-shell](app-shell.md)

# Toolbar

A row of buttons and toggles with one tab stop and arrow-key movement, built on Radix.

- Package: `@nexub/react` · Category: Actions · Status: stable
- Import: `import { Toolbar } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/toolbar

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `floating` | `boolean` |  | A glass capsule for the control layer above content, e.g. editor or selection actions. |
| `placement` | `'bottom'` |  | With `floating`: pin it to the bottom centre of the viewport. |
| `orientation / loop / dir` | `Radix Toolbar props` |  | Arrow-key direction and wrapping. |
| `aria-label` | `string` |  | Name the toolbar, e.g. "Text formatting". |
| `Toolbar.Button` | `compound` |  | An action button. |
| `Toolbar.ToggleGroup / ToggleItem` | `compound` |  | A set of toggles (`type="single" \| "multiple"`, `value`). Icon-only items need `aria-label`. |
| `Toolbar.Separator` | `compound` |  | A divider between groups. |

## Example: Default

```tsx
import { Toolbar } from '@nexub/react';

export default function Example() {
  return (
    <Toolbar.Root aria-label="Text formatting">
      <Toolbar.ToggleGroup type="multiple" aria-label="Text style">
        <Toolbar.ToggleItem value="bold" aria-label="Bold"><strong>B</strong></Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="italic" aria-label="Italic"><em>I</em></Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="underline" aria-label="Underline"><span className="underline">U</span></Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
      <Toolbar.Separator />
      <Toolbar.ToggleGroup type="single" defaultValue="left" aria-label="Alignment">
        <Toolbar.ToggleItem value="left" aria-label="Align left">L</Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="center" aria-label="Align centre">C</Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="right" aria-label="Align right">R</Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
      <Toolbar.Separator />
      <Toolbar.Button>Clear formatting</Toolbar.Button>
    </Toolbar.Root>
  );
}
```

## Example: Floating

```tsx
import { Toolbar } from '@nexub/react';
import { Copy, Pencil, Trash2 } from '@nexub/icons';

export default function Example() {
  return (
    <Toolbar.Root floating aria-label="Selection">
      <Toolbar.Button><Pencil size="sm" aria-hidden="true" />Edit</Toolbar.Button>
      <Toolbar.Button><Copy size="sm" aria-hidden="true" />Duplicate</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button><Trash2 size="sm" aria-hidden="true" />Delete</Toolbar.Button>
    </Toolbar.Root>
  );
}
```

## Accessibility

- Roles: toolbar
- `Tab`: Moves into and out of the toolbar (one tab stop).
- `Arrow Left / Right`: Moves between controls.
- `Enter / Space`: Activates a button or toggles an item.

Related: [toggle-group](toggle-group.md), [button-group](button-group.md), [action-bar](action-bar.md)

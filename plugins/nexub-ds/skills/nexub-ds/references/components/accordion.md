# Accordion

Vertically stacked list of collapsible sections.

- Package: `@nexub/react` · Category: Disclosure · Status: stable
- Import: `import { Accordion } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/accordion

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Accordion.Root type` | `'single' \| 'multiple'` | `'single'` | Whether one or multiple items can be open at the same time. |
| `Accordion.Root collapsible` | `boolean` | `false` | When type is "single", allows the open item to be collapsed by clicking it again. |
| `Accordion.Root defaultValue` | `string \| string[]` |  | The item(s) open by default (uncontrolled). |
| `Accordion.Root value` | `string \| string[]` |  | Controlled open item(s). |
| `Accordion.Root onValueChange` | `(value: string \| string[]) => void` |  | Callback fired when the open state changes. |
| `Accordion.Root disabled` | `boolean` | `false` | Disables all items in the accordion. |
| `Accordion.Item value` (required) | `string` |  | Unique identifier for the item. |
| `Accordion.Item disabled` | `boolean` | `false` | Disables this specific item. |
| `Accordion.Trigger asChild` | `boolean` | `false` | Merges props onto the immediate child element. |
| `Accordion.Content forceMount` | `boolean` | `false` | Keeps content in the DOM even when collapsed. |

## Example: Default

```tsx
<Accordion.Root type="single" collapsible defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>What is Nexub DS?</Accordion.Trigger>
    <Accordion.Content>
      Nexub DS is a design system providing accessible, themeable React components
      built on Radix UI primitives.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes. All components follow WAI-ARIA patterns and are keyboard-navigable
      out of the box.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Trigger>Can I customise the styles?</Accordion.Trigger>
    <Accordion.Content>
      Absolutely. Components expose design tokens via CSS custom properties,
      and every element accepts a className prop.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

## Example: Multiple

```tsx
<Accordion.Root type="multiple" defaultValue={['item-1', 'item-2']}>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>First section</Accordion.Trigger>
    <Accordion.Content>
      This section is open by default. Multiple items can be expanded
      simultaneously when type is set to "multiple".
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Second section</Accordion.Trigger>
    <Accordion.Content>
      Also open by default. Click any trigger to collapse individual sections
      independently.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Trigger>Third section</Accordion.Trigger>
    <Accordion.Content>
      Closed by default. Expanding this does not close the others.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

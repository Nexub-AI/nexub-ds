# Toggle Group

Group of toggle buttons where one or many can be active.

- Package: `@nexub/react` · Category: Interactive · Status: stable
- Import: `import { ToggleGroup } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/toggle-group

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` (required) | `'single' \| 'multiple'` |  | Controls whether one or multiple items can be active at a time. |
| `value` | `string \| string[]` |  | The controlled active value(s). |
| `variant` | `'default' \| 'outline'` |  | Visual style applied to all toggle items in the group. |

## Example: Single

```tsx
<ToggleGroup.Root type="single" defaultValue="left">
  <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
  <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
  <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
</ToggleGroup.Root>
```

## Example: Multiple

```tsx
<ToggleGroup.Root type="multiple" defaultValue={["bold", "italic"]}>
  <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
  <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
</ToggleGroup.Root>
```

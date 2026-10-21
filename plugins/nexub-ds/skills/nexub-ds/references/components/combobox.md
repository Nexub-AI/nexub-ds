# Combobox

Command-palette style searchable dropdown built on cmdk.

- Package: `@nexub/react` · Category: Form Controls · Status: stable
- Import: `import { Combobox } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/combobox

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Combobox.Root` | `compound` |  | Root cmdk command container. |
| `Combobox.Input` | `compound` |  | Search input that filters the list. |
| `Combobox.List` | `compound` |  | Scrollable list container for groups and items. |
| `Combobox.Group` | `compound` |  | Labeled group of items within the list. |
| `Combobox.Item` | `compound` |  | Individual selectable option. |
| `Combobox.Empty` | `compound` |  | Content shown when no items match the search query. |
| `Combobox.Separator` | `compound` |  | Visual separator between groups or items. |

## Example: Default

```tsx
<Combobox.Root>
  <Combobox.Input placeholder="Search..." />
  <Combobox.List>
    <Combobox.Empty>No results found.</Combobox.Empty>
    <Combobox.Group heading="Frameworks">
      <Combobox.Item value="react">React</Combobox.Item>
      <Combobox.Item value="vue">Vue</Combobox.Item>
      <Combobox.Item value="svelte">Svelte</Combobox.Item>
    </Combobox.Group>
    <Combobox.Separator />
    <Combobox.Group heading="Languages">
      <Combobox.Item value="typescript">TypeScript</Combobox.Item>
      <Combobox.Item value="rust">Rust</Combobox.Item>
    </Combobox.Group>
  </Combobox.List>
</Combobox.Root>
```

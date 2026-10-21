# Autocomplete

Type-to-search input with matching options dropdown.

- Package: `@nexub/react` · Category: Form Controls · Status: stable
- Import: `import { Autocomplete } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/autocomplete

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` (required) | `{ value: string; label: string }[]` |  | Array of options available for selection. |
| `value` | `string` |  | The controlled selected value. |
| `onValueChange` | `(value: string) => void` |  | Callback fired when the selected value changes. |
| `placeholder` | `string` |  | Placeholder text shown in the input when empty. |
| `emptyText` | `string` |  | Text shown when no options match the current search query. |
| `loading` | `boolean` |  | Shows a loading indicator while options are being fetched. |

## Example: Default

```tsx
<Autocomplete
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
  ]}
  placeholder="Search framework…"
/>
```

## Example: With loading state

```tsx
<Autocomplete
  options={[]}
  loading
  placeholder="Loading options…"
/>
```

## Example: Custom empty text

```tsx
<Autocomplete
  options={[
    { value: 'nexub', label: 'Nexub' },
    { value: 'acme', label: 'Acme Corp' },
  ]}
  placeholder="Search company…"
  emptyText="No companies found. Try a different search."
/>
```

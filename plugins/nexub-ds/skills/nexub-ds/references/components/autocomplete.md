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
| `inputValue` | `string` |  | Controlled input text (5.1). |
| `onInputChange` | `(text: string) => void` |  | Called as the user types, so you can fetch options (5.1). When set, options are shown as given, without built-in filtering. |

## Example: Default

```tsx
import { Autocomplete } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[260px]">
      <Autocomplete
        options={[
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
          { value: 'angular', label: 'Angular' },
          { value: 'svelte', label: 'Svelte' },
        ]}
        placeholder="Search framework…"
      />
    </div>
  );
}
```

## Example: With loading state

```tsx
import { Autocomplete } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[260px]">
      <Autocomplete options={[]} loading placeholder="Loading options…" />
    </div>
  );
}
```

## Example: Custom empty text

```tsx
import { Autocomplete } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[260px]">
      <Autocomplete
        options={[
          { value: 'nexub', label: 'Nexub' },
          { value: 'acme', label: 'Acme Corp' },
        ]}
        placeholder="Search company…"
        emptyText="No companies found. Try a different search."
      />
    </div>
  );
}
```

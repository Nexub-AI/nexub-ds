# Search Input

A text input pre-wired with a search icon and a clear button for filtering content.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { SearchInput } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/search-input

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | `string` |  | Placeholder text shown when empty. |
| `value` | `string` |  | Controlled value of the search field. |
| `onClear` | `() => void` |  | Called when the user clicks the clear button. |
| `size` | `'sm' \| 'md' \| 'lg'` |  | Controls font size and padding. |

## Example: Default

```tsx
import { SearchInput } from '@nexub/react';

export default function Example() {
  return <div className="w-[280px]"><SearchInput placeholder="Search…" /></div>;
}
```

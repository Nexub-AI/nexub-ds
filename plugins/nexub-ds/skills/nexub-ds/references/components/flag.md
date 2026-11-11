# Flag

A country flag from its ISO code, drawn with the system emoji font.

- Package: `@nexub/react` · Category: Labels & Badges · Status: stable
- Import: `import { Flag } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/flag

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` |  | ISO 3166-1 alpha-2 country code, e.g. `JP`. Also the accessible name unless you pass `aria-label`. |
| `size` | `'sm' \| 'md' \| 'lg'` |  | Font size of the flag. |
| `aria-label` | `string` |  | A readable name, e.g. "Japan". Defaults to the code. |

## Example: Default

```tsx
import { Flag } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex items-center gap-3">
      <Flag code="JP" size="sm" aria-label="Japan" />
      <Flag code="IN" aria-label="India" />
      <Flag code="FR" size="lg" aria-label="France" />
    </div>
  );
}
```

## Accessibility

- Roles: img
- Windows has no flag emoji and shows the two letters instead. Pair the flag with the country name where it matters.

Related: [country-badge](country-badge.md)

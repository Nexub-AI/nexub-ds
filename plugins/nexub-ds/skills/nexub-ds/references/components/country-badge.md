# Country Badge

A pill with a country flag and its name or code.

- Package: `@nexub/react` · Category: Labels & Badges · Status: stable
- Import: `import { CountryBadge } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/country-badge

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` |  | ISO 3166-1 alpha-2 country code, e.g. `SG`. |
| `label` | `string` |  | Text after the flag. Defaults to `code`. |
| `size` | `'sm' \| 'md' \| 'lg'` |  | Size of the pill and flag. |

## Example: Default

```tsx
import { CountryBadge } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <CountryBadge code="SG" label="Singapore" />
      <CountryBadge code="DE" label="Germany" />
      <CountryBadge code="BR" label="Brazil" />
    </div>
  );
}
```

## Example: Sizes

```tsx
import { CountryBadge } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CountryBadge code="JP" size="sm" />
      <CountryBadge code="JP" size="md" />
      <CountryBadge code="JP" size="lg" />
    </div>
  );
}
```

Related: [flag](flag.md), [badge](badge.md)

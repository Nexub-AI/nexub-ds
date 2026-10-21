# Rating

Star rating input, supports controlled and read-only modes.

- Package: `@nexub/react` · Category: Interactive · Status: stable
- Import: `import { Rating } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/rating

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` |  | The controlled rating value. |
| `max` | `number` | `5` | Maximum number of stars. |
| `readOnly` | `boolean` | `false` | Prevents user interaction when true. |
| `size` | `'sm' \| 'md' \| 'lg'` |  | Size of the star icons. |
| `onValueChange` | `(value: number) => void` |  | Callback fired when the user selects a new rating. |

## Example: Default

```tsx
<Rating defaultValue={3} />
```

## Example: Read-only

```tsx
<Rating value={4} readOnly />
```

## Example: Sizes

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <Rating defaultValue={3} size="sm" />
  <Rating defaultValue={3} size="md" />
  <Rating defaultValue={3} size="lg" />
</div>
```

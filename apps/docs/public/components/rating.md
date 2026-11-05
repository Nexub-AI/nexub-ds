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
import * as React from 'react';
import { Rating } from '@nexub/react';

export default function Example() {
  const [val, setVal] = React.useState(3);
  return <Rating value={val} onValueChange={setVal} />;
}
```

## Example: Read-only

```tsx
import { Rating } from '@nexub/react';

export default function Example() {
  return <Rating value={4} readOnly />;
}
```

## Example: Sizes

```tsx
import { Rating } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start">
      <Rating size="sm" value={4} readOnly />
      <Rating size="md" value={4} readOnly />
      <Rating size="lg" value={4} readOnly />
    </div>
  );
}
```

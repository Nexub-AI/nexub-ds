# Button Group

Groups related buttons together with optional attachment and orientation.

- Package: `@nexub/react` · Category: Actions · Status: stable
- Import: `import { ButtonGroup } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/button-group

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Lays out child buttons horizontally or vertically. |
| `attached` | `boolean` | `false` | Removes gap and merges borders between adjacent buttons. |

## Example: Default

```tsx
import { ButtonGroup, Button } from '@nexub/react';

export default function Example() {
  return (
    <ButtonGroup>
      <Button variant="filled">Save</Button>
      <Button variant="outlined">Cancel</Button>
    </ButtonGroup>
  );
}
```

## Example: Attached

```tsx
import { ButtonGroup, Button } from '@nexub/react';

export default function Example() {
  return (
    <ButtonGroup attached>
      <Button variant="outlined">Left</Button>
      <Button variant="outlined">Center</Button>
      <Button variant="outlined">Right</Button>
    </ButtonGroup>
  );
}
```

## Example: Vertical

```tsx
import { ButtonGroup, Button } from '@nexub/react';

export default function Example() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outlined">Option A</Button>
      <Button variant="outlined">Option B</Button>
      <Button variant="outlined">Option C</Button>
    </ButtonGroup>
  );
}
```

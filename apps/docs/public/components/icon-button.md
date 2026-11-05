# Icon Button

A square button designed to hold a single icon, with an accessible label.

- Package: `@nexub/react` · Category: Actions · Status: stable
- Import: `import { IconButton } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/icon-button

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'ghost' \| 'solid' \| 'outline' \| 'subtle'` | `'ghost'` | Visual style of the icon button. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Controls button dimensions. |
| `disabled` | `boolean` |  | Disables the button. |
| `loading` | `boolean` |  | Shows a spinner and disables interaction. |
| `asChild` | `boolean` |  | Merges props onto the immediate child element (Radix Slot). |

## Example: Default

```tsx
import { IconButton } from '@nexub/react';

export default function Example() {
  const icon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>;
  return <IconButton variant="ghost" label="Add item">{icon}</IconButton>;
}
```

## Example: Variants

```tsx
import { IconButton } from '@nexub/react';

export default function Example() {
  const icon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>;
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <IconButton variant="ghost" label="Ghost">{icon}</IconButton>
      <IconButton variant="solid" label="Solid">{icon}</IconButton>
      <IconButton variant="outline" label="Outline">{icon}</IconButton>
      <IconButton variant="subtle" label="Subtle">{icon}</IconButton>
    </div>
  );
}
```

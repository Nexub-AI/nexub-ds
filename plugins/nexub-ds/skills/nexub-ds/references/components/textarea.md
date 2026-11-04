# Textarea

A multi-line text input with configurable resize behaviour, size, and validation states.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { Textarea } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/textarea

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | `string` |  | Placeholder text shown when the field is empty. |
| `disabled` | `boolean` |  | Disables the textarea. |
| `invalid` | `boolean` |  | Applies error styling to indicate a validation failure. |
| `rows` | `number` |  | Initial visible row count. |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Controls resize handle visibility. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls font size and padding. |

## Example: Default

```tsx
import { Textarea } from '@nexub/react';

export default function Example() {
  return <div className="w-[280px]"><Textarea placeholder="Enter your message…" /></div>;
}
```

## Example: Sizes

```tsx
import { Textarea } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start w-[280px]">
      <Textarea size="sm" placeholder="Small" rows={2} />
      <Textarea size="md" placeholder="Medium" rows={3} />
      <Textarea size="lg" placeholder="Large" rows={4} />
    </div>
  );
}
```

## Example: Invalid

```tsx
import { Textarea } from '@nexub/react';

export default function Example() {
  return <div className="w-[280px]"><Textarea invalid placeholder="This field has an error" /></div>;
}
```

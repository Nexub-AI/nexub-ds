# Label

An accessible form label that optionally shows a required asterisk and links to an input via htmlFor.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { Label } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/label

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `htmlFor` | `string` |  | Associates the label with a form control by its id. |
| `required` | `boolean` |  | Renders a required indicator (asterisk) after the label text. |
| `disabled` | `boolean` |  | Applies disabled styling to the label. |
| `size` | `'sm' \| 'md'` | `'md'` | Controls label font size. |

## Example: Default

```tsx
import { Label } from '@nexub/react';

export default function Example() {
  return <Label htmlFor="demo">Full name</Label>;
}
```

## Example: Required

```tsx
import { Label } from '@nexub/react';

export default function Example() {
  return <Label required>Email address</Label>;
}
```

## Example: With input

```tsx
import { Label, Input } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-1 items-start w-[280px]">
      <Label htmlFor="email-ex">Email</Label>
      <Input id="email-ex" type="email" placeholder="you@example.com" />
    </div>
  );
}
```

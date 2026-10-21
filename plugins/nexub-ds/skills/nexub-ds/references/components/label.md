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
<Label htmlFor="name">Full name</Label>
```

## Example: Required

```tsx
<Label required>Email address</Label>
```

## Example: With input

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

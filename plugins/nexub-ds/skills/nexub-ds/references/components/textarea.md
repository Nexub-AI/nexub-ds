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
<Textarea placeholder="Enter your message…" />
```

## Example: Sizes

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <Textarea size="sm" placeholder="Small textarea" />
  <Textarea size="md" placeholder="Medium textarea" />
  <Textarea size="lg" placeholder="Large textarea" />
</div>
```

## Example: Invalid

```tsx
<Textarea invalid placeholder="This field has an error" />
```

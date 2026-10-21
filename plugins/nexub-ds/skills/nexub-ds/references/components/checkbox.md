# Checkbox

Binary checkbox input built on Radix UI.

- Package: `@nexub/react` · Category: Form Controls · Status: stable
- Import: `import { Checkbox } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/checkbox

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` |  | The controlled checked state. |
| `defaultChecked` | `boolean` |  | The initial checked state when uncontrolled. |
| `disabled` | `boolean` |  | Disables the checkbox when true. |
| `required` | `boolean` |  | Marks the checkbox as required in a form. |
| `onCheckedChange` | `(checked: boolean) => void` |  | Callback fired when the checked state changes. |

## Example: Default

```tsx
<Checkbox defaultChecked />
```

## Example: With label

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <Checkbox id="terms" />
  <Label htmlFor="terms">I agree to the terms</Label>
</div>
```

## Example: States

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Checkbox id="checked" defaultChecked />
    <Label htmlFor="checked">Checked</Label>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Checkbox id="unchecked" />
    <Label htmlFor="unchecked">Unchecked</Label>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Checkbox id="disabled" disabled />
    <Label htmlFor="disabled">Disabled</Label>
  </div>
</div>
```

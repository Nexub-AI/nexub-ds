# Switch

Toggle control for binary on/off settings. Built on Radix UI Switch.

- Package: `@nexub/react` · Category: Form Controls · Status: stable
- Import: `import { Switch } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/switch

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` |  | Controlled checked state. |
| `defaultChecked` | `boolean` | `false` | Uncontrolled initial state. |
| `onCheckedChange` | `(checked: boolean) => void` |  | Callback when checked state changes. |
| `disabled` | `boolean` | `false` | Disables interaction. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Switch size. |

## Example: Default

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <Switch id="airplane" />
  <Label htmlFor="airplane">Airplane mode</Label>
</div>
```

## Example: Sizes

```tsx
<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
  <Switch size="sm" />
  <Switch size="md" />
  <Switch size="lg" />
</div>
```

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
import { Switch } from '@nexub/react';

export default function Example() {
  return <div className="flex gap-4 flex-wrap items-center justify-center"><Switch defaultChecked /><Switch /></div>;
}
```

## Example: Sizes

```tsx
import { Switch } from '@nexub/react';

export default function Example() {
  return <div className="flex gap-4 flex-wrap items-center justify-center"><Switch size="sm" defaultChecked /><Switch size="md" defaultChecked /><Switch size="lg" defaultChecked /></div>;
}
```

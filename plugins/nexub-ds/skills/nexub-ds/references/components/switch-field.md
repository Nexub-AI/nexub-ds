# Switch Field

A Switch with its label, description and error, the label clickable.

- Package: `@nexub/react` · Category: Form Controls · Status: alpha
- Import: `import { SwitchField } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/switch-field

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `ReactNode` |  | Names the switch; clicking it toggles. |
| `description / error` | `ReactNode` |  | Help under the label and the error under the row. `error` marks the switch invalid. |
| `layout` | `'end' \| 'start'` | `'end'` | `'end'`: label first, the switch at the row end (settings lists). `'start'`: the switch first, for tight rows. |
| `checked / onCheckedChange` | `boolean / (checked: boolean) => void` |  | As Switch, with `size`, `loading`, `disabled` and `readOnly`. |

## Example: Settings row

```tsx
import { SwitchField } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <SwitchField label="Online store" description="Buyers can see and order from the shop" defaultChecked />
      <SwitchField label="Two-step sign-in" error="Required by your organisation" />
    </div>
  );
}
```

## Example: Compact, before the label

```tsx
import { SwitchField } from '@nexub/react';

export default function Example() {
  return <SwitchField label="Email me a weekly summary" layout="start" size="sm" />;
}
```

## Accessibility

- The label is a `<label for>` on the switch, so it names it and toggles it.
- Description and error are linked with `aria-describedby`.

Related: [switch](switch.md), [checkbox-field](checkbox-field.md), [form-field](form-field.md)

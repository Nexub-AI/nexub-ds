# Radio Group

Group of mutually exclusive radio inputs.

- Package: `@nexub/react` · Category: Form Controls · Status: stable
- Import: `import { RadioGroup } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/radio-group

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `RadioGroup.Root` | `compound` |  | Root provider that manages selection state. |
| `RadioGroup.Item` | `compound` |  | Individual radio option within the group. |
| `value` | `string` |  | The controlled selected value. |
| `defaultValue` | `string` |  | The initial selected value when uncontrolled. |
| `onValueChange` | `(value: string) => void` |  | Callback fired when the selection changes. |
| `disabled` | `boolean` |  | Disables all items in the group. |
| `orientation` | `'horizontal' \| 'vertical'` |  | Layout orientation of the radio items. |

## Example: Default

```tsx
<RadioGroup.Root defaultValue="option-2">
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <RadioGroup.Item value="option-1" id="r1" />
      <Label htmlFor="r1">Option one</Label>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <RadioGroup.Item value="option-2" id="r2" />
      <Label htmlFor="r2">Option two</Label>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <RadioGroup.Item value="option-3" id="r3" />
      <Label htmlFor="r3">Option three</Label>
    </div>
  </div>
</RadioGroup.Root>
```

## Example: Horizontal

```tsx
<RadioGroup.Root defaultValue="monthly" orientation="horizontal">
  <div style={{ display: 'flex', gap: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <RadioGroup.Item value="monthly" id="monthly" />
      <Label htmlFor="monthly">Monthly</Label>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <RadioGroup.Item value="annual" id="annual" />
      <Label htmlFor="annual">Annual</Label>
    </div>
  </div>
</RadioGroup.Root>
```

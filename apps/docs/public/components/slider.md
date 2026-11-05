# Slider

Range slider built on Radix UI Slider.

- Package: `@nexub/react` · Category: Interactive · Status: stable
- Import: `import { Slider } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/slider

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number[]` |  | The controlled value of the slider. |
| `defaultValue` | `number[]` |  | The initial value when uncontrolled. |
| `min` | `number` |  | The minimum value of the slider. |
| `max` | `number` |  | The maximum value of the slider. |
| `step` | `number` |  | The step increment between values. |
| `disabled` | `boolean` |  | Disables slider interaction when true. |
| `onValueChange` | `(value: number[]) => void` |  | Callback fired when the value changes. |

## Example: Default

```tsx
import { Slider } from '@nexub/react';

export default function Example() {
  return <div className="w-[240px]"><Slider defaultValue={[50]} min={0} max={100} /></div>;
}
```

## Example: Range

```tsx
import { Slider } from '@nexub/react';

export default function Example() {
  return <div className="w-[240px]"><Slider defaultValue={[20, 80]} min={0} max={100} /></div>;
}
```

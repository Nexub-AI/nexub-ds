# StepIndicator

> **Deprecated.** Do not use in new code. Deprecated, removed in 7.0: use Stepper (orientation="vertical"). Visual progress indicator for multi-step flows.

- Package: `@nexub/patterns` · Category: Navigation · Status: deprecated
- Import: `import { StepIndicator } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/step-indicator

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` (required) | `StepIndicatorStep[]` |  | Array of step definitions. |
| `currentStep` (required) | `number` |  | Zero-based index of the active step. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |

## Example: Default

```tsx
import { StepIndicator } from '@nexub/patterns';

export default function Example() {
  return (
    <StepIndicator
      currentStep={1}
      steps={[{ label: 'Account' }, { label: 'Profile' }, { label: 'Billing' }, { label: 'Done' }]}
    />
  );
}
```

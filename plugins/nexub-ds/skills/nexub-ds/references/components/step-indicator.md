# StepIndicator

Visual progress indicator for multi-step flows like onboarding or checkout.

- Package: `@nexub/patterns` · Category: Navigation · Status: stable
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
<StepIndicator
  currentStep={1}
  steps={[
    { label: 'Account' },
    { label: 'Profile' },
    { label: 'Payment' },
    { label: 'Review' },
  ]}
/>
```

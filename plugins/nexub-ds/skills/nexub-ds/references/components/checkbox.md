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
import { Checkbox } from '@nexub/react';

export default function Example() {
  return <Checkbox defaultChecked />;
}
```

## Example: With label

```tsx
import { Checkbox, Label } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">I agree to the terms and conditions</Label>
    </div>
  );
}
```

## Example: States

```tsx
import { Checkbox, Label } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-3 items-start">
      <div className="flex items-center gap-2">
        <Checkbox defaultChecked /><Label>Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox /><Label>Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox disabled /><Label>Disabled</Label>
      </div>
    </div>
  );
}
```

## Example: Sizes, invalid and read-only

size follows the shared sm / md / lg scale. invalid draws the error border and sets aria-invalid. readOnly stays focusable but cannot change.

```tsx
import { Checkbox, Label } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-3 items-start">
      <div className="flex items-center gap-4">
        <Checkbox size="sm" defaultChecked aria-label="Small" />
        <Checkbox size="md" defaultChecked aria-label="Medium" />
        <Checkbox size="lg" defaultChecked aria-label="Large" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="terms" invalid /><Label htmlFor="terms">Invalid: accept the terms to continue</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="plan" readOnly defaultChecked /><Label htmlFor="plan">Read-only: set by your plan</Label>
      </div>
    </div>
  );
}
```

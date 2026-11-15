# Fieldset

Groups related fields under a legend; disabling it disables everything inside.

- Package: `@nexub/react` · Category: Form & Input · Status: beta
- Import: `import { Fieldset } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/fieldset

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `legend` (required) | `ReactNode` |  | The group’s name, read before each field inside it. |
| `description` | `ReactNode` |  | Hint under the legend, linked with `aria-describedby`. |
| `disabled` | `boolean` |  | Disables every control inside, natively. |

## Example: Grouped fields

```tsx
import { Fieldset, FormField, Input } from '@nexub/react';

export default function Example() {
  return (
    <Fieldset legend="Billing address" description="Printed on every invoice." className="w-full max-w-sm">
      <FormField.Root name="street">
        <FormField.Label>Street</FormField.Label>
        <FormField.Control>
          <Input autoComplete="street-address" />
        </FormField.Control>
      </FormField.Root>
      <FormField.Root name="city">
        <FormField.Label>City</FormField.Label>
        <FormField.Control>
          <Input autoComplete="address-level2" />
        </FormField.Control>
      </FormField.Root>
    </Fieldset>
  );
}
```

## Accessibility

- Renders a native `<fieldset>` and `<legend>`; screen readers announce the legend on entering the group.

Related: [form](form.md), [form-field](form-field.md)

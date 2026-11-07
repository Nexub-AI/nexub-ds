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

import { FormError, Input, Label } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-[280px] flex-col gap-1">
      <Label htmlFor="fe-email">Email</Label>
      <Input id="fe-email" type="email" defaultValue="jane@" aria-invalid aria-describedby="fe-email-error" />
      <FormError id="fe-email-error">Enter an email address like name@example.com.</FormError>
    </div>
  );
}

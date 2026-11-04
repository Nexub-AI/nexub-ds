import { Label, Input, HelperText } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-1 items-start w-[280px]">
      <Label htmlFor="demo-email">Email address</Label>
      <Input id="demo-email" type="email" placeholder="you@example.com" />
      <HelperText>We&apos;ll never share your email.</HelperText>
    </div>
  );
}

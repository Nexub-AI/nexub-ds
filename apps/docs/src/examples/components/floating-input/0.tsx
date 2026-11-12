'use client'; // docs preview: server pages import every example

import { Button, FloatingInput } from '@nexub/react';

export default function Example() {
  return (
    <form className="flex w-full max-w-sm flex-col gap-3">
      <FloatingInput label="Email" type="email" autoComplete="email" />
      <FloatingInput label="Password" type="password" autoComplete="current-password" />
      <Button type="submit">Sign in</Button>
    </form>
  );
}

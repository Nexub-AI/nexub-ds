'use client';

import * as React from 'react';
import { Button, Form, FormField, Input, useForm } from '@nexub/react';

function Submit() {
  const submitting = useForm()?.submitting;
  return (
    <Button type="submit" className="self-start" disabled={submitting}>
      {submitting ? 'Inviting…' : 'Send invite'}
    </Button>
  );
}

export default function Example() {
  const [sent, setSent] = React.useState('');
  return (
    <Form
      className="w-full max-w-sm"
      validate={(data) => ({
        email: String(data.get('email')).endsWith('@example.com') && 'Use a work address, not example.com',
      })}
      onSubmit={async (data) => {
        await new Promise((r) => setTimeout(r, 600));
        setSent(`Invite sent to ${data.get('email')}`);
      }}
    >
      <FormField.Root name="email" required>
        <FormField.Label>Email</FormField.Label>
        <FormField.Control>
          <Input type="email" autoComplete="email" />
        </FormField.Control>
        <FormField.Error />
      </FormField.Root>
      <Submit />
      <p aria-live="polite" className="text-body-sm text-[var(--color-on-surface-muted)]">{sent}</p>
    </Form>
  );
}

'use client'; // docs preview: server pages import every example

import { Button, EmptyState, Illustration } from '@nexub/react';

export default function Example() {
  return (
    <EmptyState.Root>
      <EmptyState.Illustration>
        <Illustration kind="success" />
      </EmptyState.Illustration>
      <EmptyState.Title>Payment sent</EmptyState.Title>
      <EmptyState.Description>We emailed the receipt to you.</EmptyState.Description>
      <EmptyState.Actions>
        <Button variant="tonal">View receipt</Button>
      </EmptyState.Actions>
    </EmptyState.Root>
  );
}

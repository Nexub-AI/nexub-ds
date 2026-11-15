'use client';

import { AlertDialog, Button } from '@nexub/react';

export default function Example() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="destructive">Delete workspace</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Delete acme-prod?</AlertDialog.Title>
          <AlertDialog.Description>All projects, members and billing history go with it. This can’t be undone.</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Confirm text="acme-prod" />
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action>Delete workspace</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

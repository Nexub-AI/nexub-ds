'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { WelcomeBanner } from '@nexub/patterns';
import { Button, IconChip } from '@nexub/react';
import { Wallet } from '@nexub/icons';

export default function Example() {
  const [open, setOpen] = React.useState(true);
  if (!open) return <Button variant="tonal" onClick={() => setOpen(true)}>Show the banner again</Button>;
  return (
    <div className="w-full max-w-2xl">
      <WelcomeBanner
        title="Finish setting up your account"
        description="Add a bank account to send and receive money."
        actions={
          <>
            <Button>Add account</Button>
            <Button variant="text">Later</Button>
          </>
        }
        media={
          <IconChip category="accent" size="lg" shape="circle">
            <Wallet />
          </IconChip>
        }
        onDismiss={() => setOpen(false)}
      />
    </div>
  );
}

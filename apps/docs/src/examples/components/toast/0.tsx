'use client'; // docs preview: server pages import every example

import { Button, toast } from '@nexub/react';

// The docs root layout already renders <Toaster />; a second one doubles every toast.
export default function Example() {
  return (
    <Button variant="outlined" onClick={() => toast.custom('Changes saved', { description: 'Your profile has been updated.' })}>
      Show toast
    </Button>
  );
}

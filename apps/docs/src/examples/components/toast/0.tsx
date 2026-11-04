import { Button, toast } from '@nexub/react';

// The docs root layout already renders <Toaster />; a second one doubles every toast.
export default function Example() {
  return (
    <Button variant="outline" onClick={() => toast.custom('Changes saved', { description: 'Your profile has been updated.' })}>
      Show toast
    </Button>
  );
}

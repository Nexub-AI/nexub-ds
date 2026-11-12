'use client'; // docs preview: server pages import every example

import { Button, toast } from '@nexub/react';

export default function Example() {
  return (
    <Button
      variant="outlined"
      onClick={() =>
        toast.custom('File deleted', {
          description: 'The file was moved to trash.',
          action: { label: 'Undo', onClick: () => {} },
        })
      }
    >
      Delete with undo
    </Button>
  );
}

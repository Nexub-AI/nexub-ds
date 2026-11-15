'use client'; // docs preview: server pages import every example

import { Button, toast } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Button variant="outlined" size="sm" onClick={() => toast.success('Saved successfully!')}>Success</Button>
      <Button variant="outlined" size="sm" onClick={() => toast.error('Something went wrong.')}>Error</Button>
      <Button variant="outlined" size="sm" onClick={() => toast.warning('Review required.')}>Warning</Button>
      <Button variant="outlined" size="sm" onClick={() => toast.info('New update available.')}>Info</Button>
    </div>
  );
}

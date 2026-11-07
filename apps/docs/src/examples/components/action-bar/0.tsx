'use client';

import * as React from 'react';
import { ActionBar, Button, Input, useUnsavedChanges } from '@nexub/react';

export default function Example() {
  const [saved, setSaved] = React.useState('Acme');
  const [name, setName] = React.useState('Acme');
  const dirty = name !== saved;
  useUnsavedChanges(dirty);
  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <Input aria-label="Company name" value={name} onChange={(e) => setName(e.target.value)} />
      {dirty && (
        <ActionBar message="Unsaved changes">
          <Button variant="text" onClick={() => setName(saved)}>Discard</Button>
          <Button onClick={() => setSaved(name)}>Save</Button>
        </ActionBar>
      )}
    </div>
  );
}

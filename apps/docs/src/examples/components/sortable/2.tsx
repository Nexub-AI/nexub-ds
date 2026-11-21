'use client';

import * as React from 'react';
import { Card, Sortable, SwitchField } from '@nexub/react';

export default function Example() {
  const [columns, setColumns] = React.useState(['Name', 'Owner', 'Status', 'Due date', 'Budget']);
  const [editing, setEditing] = React.useState(true);
  return (
    <Card className="flex w-full max-w-sm flex-col gap-3 p-4">
      <SwitchField checked={editing} onCheckedChange={setEditing} label="Edit order" />
      <Sortable
        aria-label="Table columns"
        variant="flat"
        disabled={!editing}
        isLocked={(c) => c === 'Name'}
        items={columns}
        getLabel={(c) => c}
        onReorder={setColumns}
      >
        {(c) => c}
      </Sortable>
    </Card>
  );
}

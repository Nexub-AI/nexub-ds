'use client';

import * as React from 'react';
import { InlineEdit } from '@nexub/react';

export default function Example() {
  const [name, setName] = React.useState('Q4 launch plan');
  return (
    <InlineEdit
      label="Project name"
      placeholder="Add a name"
      value={name}
      onSave={(next) => {
        if (!next.trim()) return Promise.reject(new Error('Name is required'));
        setName(next.trim());
      }}
    />
  );
}

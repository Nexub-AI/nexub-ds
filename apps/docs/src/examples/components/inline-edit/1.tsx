'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { InlineEdit } from '@nexub/react';

export default function Example() {
  const [title, setTitle] = React.useState('Quarterly roadmap');
  return (
    <InlineEdit
      as="h2"
      size="headline"
      maxLength={40}
      label="Page title"
      value={title}
      onSave={(next) => setTitle(next.trim() || title)}
    />
  );
}

'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { ColorPicker } from '@nexub/react';

const swatches = [
  { value: '#16a34a', label: 'Done' },
  { value: '#d97706', label: 'In review' },
  { value: '#dc2626', label: 'Blocked' },
  { value: '#64748b', label: 'Backlog' },
];

export default function Example() {
  return <ColorPicker aria-label="Status colour" swatches={swatches} defaultValue="#16a34a" />;
}

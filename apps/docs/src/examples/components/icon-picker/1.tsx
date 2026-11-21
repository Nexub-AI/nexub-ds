'use client'; // docs preview: server pages import every example

import { IconPicker } from '@nexub/react';

const categories = [
  { label: 'Files', icons: ['FileText', 'Folder', 'Paperclip', 'Download'] },
  { label: 'People', icons: ['User', 'Users', 'Mail', 'Phone'] },
  { label: 'Time', icons: ['Calendar', 'CalendarDays', 'Clock', 'Bell'] },
];

export default function Example() {
  return <IconPicker aria-label="Category icon" categories={categories} defaultValue="Folder" />;
}

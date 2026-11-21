'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { SavedViews, type SavedView } from '@nexub/react';

// Stands in for a request to your server.
const request = () => new Promise((resolve) => setTimeout(resolve, 800));

export default function Example() {
  const [views, setViews] = React.useState<SavedView[]>([
    { id: 'mine', name: 'My open deals' },
    { id: 'big', name: 'Over $10k' },
  ]);
  const [active, setActive] = React.useState<string>();
  return (
    <SavedViews
      views={views}
      activeId={active}
      onSelect={setActive}
      defaultView="mine"
      maxLength={40}
      confirmDelete
      onSave={async (name) => {
        await request();
        if (views.some((v) => v.name === name)) throw new Error('A view with this name already exists.');
        const id = crypto.randomUUID();
        setViews((v) => [...v, { id, name }]);
        setActive(id);
      }}
      onRename={async (id, name) => {
        await request();
        setViews((v) => v.map((x) => (x.id === id ? { ...x, name } : x)));
      }}
      onDelete={async (id) => {
        await request();
        setViews((v) => v.filter((x) => x.id !== id));
        setActive('mine');
      }}
    />
  );
}

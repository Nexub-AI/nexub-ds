'use client';

import * as React from 'react';
import { SavedViews, type SavedView } from '@nexub/react';

export default function Example() {
  const [views, setViews] = React.useState<SavedView[]>([
    { id: 'mine', name: 'My open deals' },
    { id: 'big', name: 'Over $10k' },
  ]);
  const [active, setActive] = React.useState('mine');
  return (
    <SavedViews
      views={views}
      activeId={active}
      onSelect={setActive}
      onSave={(name) => {
        const id = crypto.randomUUID();
        setViews((v) => [...v, { id, name }]);
        setActive(id);
      }}
      onUpdate={() => {}}
      onDelete={(id) => {
        setViews((v) => v.filter((x) => x.id !== id));
        setActive('');
      }}
    />
  );
}

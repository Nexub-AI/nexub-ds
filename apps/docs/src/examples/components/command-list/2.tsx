'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { CommandList, type CommandListItem } from '@nexub/react';

const all = ['Acme Corp', 'Apex Labs', 'Blue Harbor', 'Cobalt Systems', 'Delta Freight', 'Evergreen Foods'];

export default function Example() {
  const [items, setItems] = React.useState<CommandListItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <div className="w-full max-w-sm rounded-shape-container border border-outline-variant">
      <CommandList
        label="Companies"
        autoFocus={false}
        items={items}
        loading={loading}
        onSearch={(text) => {
          clearTimeout(timer.current);
          setLoading(true);
          timer.current = setTimeout(() => {
            const q = text.toLowerCase();
            setItems(all.filter((c) => c.toLowerCase().includes(q)).map((c) => ({ value: c, label: c })));
            setLoading(false);
          }, 400);
        }}
      />
    </div>
  );
}

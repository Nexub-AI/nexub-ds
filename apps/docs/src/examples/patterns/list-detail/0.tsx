'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button } from '@nexub/react';
import { ListDetail } from '@nexub/patterns';

export default function Example() {
  const [selected, setSelected] = React.useState<number | null>(0);
  const items = ['Quarterly report', 'Design review', 'Invoice #4821'];
  return (
    <div className="w-full h-60 border border-outline-variant rounded-shape-container overflow-hidden">
      <ListDetail
        showDetail={selected !== null}
        onBack={() => setSelected(null)}
        list={
          <ul className="p-2 m-0 list-none">
            {items.map((m, i) => (
              <li key={m}>
                <Button variant={selected === i ? 'tonal' : 'text'} onClick={() => setSelected(i)} className="w-full justify-start">
                  {m}
                </Button>
              </li>
            ))}
          </ul>
        }
        detail={<div className="text-title-md p-5">{selected === null ? 'Nothing selected' : items[selected]}</div>}
      />
    </div>
  );
}

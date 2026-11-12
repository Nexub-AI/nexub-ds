'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { ListDetail } from '@nexub/patterns';

export default function Example() {
  const [selected, setSelected] = React.useState<number | null>(0);
  const items = ['Quarterly report', 'Design review', 'Invoice #4821'];
  return (
    <div className="w-full h-[240px] border border-[var(--color-outline-variant)] rounded-[16px] overflow-hidden">
      <ListDetail
        showDetail={selected !== null}
        onBack={() => setSelected(null)}
        list={
          <ul className="p-2 m-0 list-none">
            {items.map((m, i) => (
              <li key={m}>
                <button type="button" onClick={() => setSelected(i)} className="nx-state-layer relative w-full rounded-shape-container px-3 py-2 text-left text-body-sm">
                  {m}
                </button>
              </li>
            ))}
          </ul>
        }
        detail={<div className="text-title-md p-5">{selected === null ? 'Nothing selected' : items[selected]}</div>}
      />
    </div>
  );
}

'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Avatar, ResourceTimeline, type ResourceCell } from '@nexub/react';

// A fixed fortnight, so the page renders the same on the server and in every time zone.
const range = { from: new Date(2026, 10, 2), to: new Date(2026, 10, 15) };
const people = [
  { id: 'ana', label: 'Ana Lima', description: 'Design' },
  { id: 'ben', label: 'Ben Ode', description: 'Engineering' },
  { id: 'cho', label: 'Cho Park', description: 'Support' },
].map((p) => ({ ...p, avatar: <Avatar size="sm" name={p.label} /> }));
const leave: ResourceCell = { value: 'AL', tone: 'info' };

export default function Example() {
  const [cells, setCells] = React.useState<Record<string, ResourceCell>>({ 'ana-3': leave, 'ana-4': leave, 'ben-10': { value: 'Sick', tone: 'warning' } });
  const count = (match: (key: string) => boolean) => Object.keys(cells).filter(match).length;
  return (
    <div className="w-full">
      <ResourceTimeline
        label="Team leave, November 2026"
        resources={people}
        range={range}
        now={new Date(2026, 10, 9)}
        getCell={(id, date) => cells[`${id}-${date.getDate()}`]}
        onCellActivate={(id, date) =>
          setCells((c) => {
            const key = `${id}-${date.getDate()}`;
            const { [key]: had, ...rest } = c;
            return had ? rest : { ...c, [key]: leave };
          })
        }
        footer={(date) => count((k) => k.endsWith(`-${date.getDate()}`)) || ''}
        rowTotal={(id) => count((k) => k.startsWith(`${id}-`))}
        grandTotal={Object.keys(cells).length}
      />
    </div>
  );
}

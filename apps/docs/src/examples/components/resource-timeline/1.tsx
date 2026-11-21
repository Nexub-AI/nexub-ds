'use client'; // docs preview: server pages import every example

import { ResourceTimeline } from '@nexub/react';

const range = { from: new Date(2026, 10, 9), to: new Date(2026, 10, 15) };
const people = [
  { id: 'ana', label: 'Ana Lima' },
  { id: 'ben', label: 'Ben Ode' },
];
const shifts: Record<string, string> = { 'ana-9': 'Early', 'ana-10': 'Early', 'ben-11': 'Late', 'ben-12': 'Late', 'ben-14': 'On call' };

export default function Example() {
  return (
    <div className="w-full">
      <ResourceTimeline
        label="Support rota"
        resources={people}
        range={range}
        now={new Date(2026, 10, 9)}
        resourceHeader="Agent"
        getCell={(id, date) => {
          const value = shifts[`${id}-${date.getDate()}`];
          return value ? { value, tone: value === 'On call' ? 'warning' : 'neutral' } : undefined;
        }}
      />
    </div>
  );
}

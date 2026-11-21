'use client'; // docs preview: server pages import every example

import { Heatmap } from '@nexub/react';

export default function Example() {
  return (
    <Heatmap
      className="w-full max-w-md"
      title="Deploys by day and week"
      legend
      tableView
      rowLabels={['Mon', 'Wed', 'Fri']}
      columnLabels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6']}
      data={[[2, 5, null, 3, 9, 4], [6, 1, 7, 10, null, 5], [3, 8, 4, 6, 1, null]]}
    />
  );
}

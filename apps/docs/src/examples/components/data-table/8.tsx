'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Button, DataTable, type DataTableColumn } from '@nexub/react';

type Lead = { id: string; company: string; industry: string; seats: number };

const found: Lead[] = [
  { id: '1', company: 'Acme', industry: 'Manufacturing', seats: 120 },
  { id: '2', company: 'Globex', industry: 'Energy', seats: 85 },
  { id: '3', company: 'Initech', industry: 'Software', seats: 40 },
  { id: '4', company: 'Umbrella', industry: 'Health', seats: 310 },
  { id: '5', company: 'Hooli', industry: 'Software', seats: 760 },
  { id: '6', company: 'Stark', industry: 'Manufacturing', seats: 220 },
];

const columns: DataTableColumn<Lead>[] = [
  { accessorKey: 'company', header: 'Company' },
  { accessorKey: 'industry', header: 'Industry' },
  { accessorKey: 'seats', header: 'Seats', meta: { align: 'end' } },
];

export default function Example() {
  const [rows, setRows] = React.useState<Lead[]>(found.slice(0, 2));
  const [streaming, setStreaming] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setInterval>>(undefined);
  React.useEffect(() => () => clearInterval(timer.current), []);

  // Stand-in for an agent: one row every 700 ms.
  const run = () => {
    clearInterval(timer.current);
    setRows([]);
    setStreaming(true);
    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setRows(found.slice(0, n));
      if (n >= found.length) {
        clearInterval(timer.current);
        setStreaming(false);
      }
    }, 700);
  };

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <Button variant="outlined" size="sm" onClick={run} disabled={streaming}>
        Find leads
      </Button>
      <DataTable
        className="w-full"
        caption="Leads"
        captionHidden
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        streaming={streaming}
        enableSorting
        enableRowSelection
      />
    </div>
  );
}

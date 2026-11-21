// 11.3: `tableView` on every chart. A visible "Show as table" disclosure under the
// drawing that lists the same data as a table. A native <details>, so it works in
// server components with no JS, and it is the chart's accessible fallback too.
import * as React from 'react';
import { defaultMessages } from '@nexub/core';
import { cn } from '../../utils/cn.js';

export interface ChartTableViewProps {
  /** The table caption: the chart's title. */
  caption: string;
  /** Column headings; the first one heads the row labels. */
  columns: string[];
  /** One row per category: the row label, then one cell per remaining column. */
  rows: React.ReactNode[][];
  /** The disclosure's label. @default 'Show as table' */
  label?: React.ReactNode;
  /** Open at first. */
  defaultOpen?: boolean;
  className?: string;
}

/** Internal: the "Show as table" part charts render when `tableView` is set. */
export function ChartTableView({ caption, columns, rows, label, defaultOpen, className }: ChartTableViewProps) {
  return (
    <details data-chart-table="" open={defaultOpen} className={cn('group/table text-body-sm', className)}>
      <summary className="nx-state-layer inline-flex cursor-pointer select-none items-center gap-1 rounded-shape-control px-2 py-1 text-label-md text-primary">
        {label ?? defaultMessages.showAsTable}
      </summary>
      <div className="mt-2 w-full overflow-auto">
        <table className="w-full tabular-nums">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-outline-variant">
              {columns.map((c, i) => (
                <th key={i} scope="col" className={cn('px-3 py-2 font-medium text-on-surface-variant', i === 0 ? 'text-start' : 'text-end')}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="border-b border-outline-variant last:border-b-0">
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="px-3 py-2 text-start font-normal text-on-surface">
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className="px-3 py-2 text-end text-on-surface">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

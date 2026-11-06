'use client';

// Imported only from `@nexub/react/DataTableVirtual`, never from the package
// root, so apps that don't use it don't need @tanstack/react-virtual.

import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { DataTable, type DataTableProps, type DataTableRowWindowHook } from '../DataTable/DataTable.js';

const Options = React.createContext({ estimate: 49, overscan: 8, height: 600 });

const useVirtualRows: DataTableRowWindowHook = (count, getScrollElement) => {
  const { estimate, overscan, height } = React.useContext(Options);
  const virtualizer = useVirtualizer({
    count,
    getScrollElement,
    estimateSize: () => estimate,
    overscan,
    // First render (and the server) assumes the full height, so rows show before measuring.
    initialRect: { width: 0, height },
  });
  const items = virtualizer.getVirtualItems();
  const last = items[items.length - 1];
  // ponytail: offsets ignore the header's height (overscan hides it); pass scrollMargin if rows ever jump.
  return {
    indexes: items.map((i) => i.index),
    before: items[0]?.start ?? 0,
    after: last ? virtualizer.getTotalSize() - last.end : 0,
    measure: virtualizer.measureElement,
    virtual: true,
  };
};

export interface DataTableVirtualProps<TData> extends Omit<DataTableProps<TData>, 'pagination' | 'rowWindow'> {
  /** Height of the scrolling area. Required: rows are windowed within it. */
  maxHeight: number | string;
  /** Row height before measuring, in px. Default 49, or 37 when compact. */
  estimateRowHeight?: number;
  /** Rows rendered beyond the visible ones, each way. Default 8. */
  overscan?: number;
}

/**
 * DataTable for thousands of rows: only the rows in view (plus `overscan`)
 * are in the DOM. Rows carry aria-rowindex and the table aria-rowcount, so
 * screen readers still report the full size. Needs `@tanstack/react-virtual`.
 */
export function DataTableVirtual<TData>({ estimateRowHeight, overscan = 8, ...props }: DataTableVirtualProps<TData>) {
  const compact = (props.density ?? props.defaultDensity) === 'compact';
  const estimate = estimateRowHeight ?? (compact ? 37 : 49);
  const height = typeof props.maxHeight === 'number' ? props.maxHeight : 600;
  const options = React.useMemo(() => ({ estimate, overscan, height }), [estimate, overscan, height]);
  return (
    <Options.Provider value={options}>
      <DataTable {...props} rowWindow={useVirtualRows} />
    </Options.Provider>
  );
}

DataTableVirtual.displayName = 'DataTableVirtual';

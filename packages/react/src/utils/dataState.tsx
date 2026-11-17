import * as React from 'react';

/** The three data states every data component takes (10.5). */
export interface DataStateProps {
  /** Shows a skeleton in place of the data and sets aria-busy. */
  loading?: boolean;
  /** Shown when there is no data. Defaults to the "no data" message. */
  emptyState?: React.ReactNode;
  /** Shown in place of the data when a load failed, for example an ErrorState with a retry action. Wins over loading and empty. */
  errorState?: React.ReactNode;
}

const isSet = (node: React.ReactNode) => node != null && node !== false;

/**
 * What to show instead of the data, or `null` to show the data. One order
 * everywhere: error → loading → empty → data. No hooks, so server charts can
 * call it; the caller passes the default empty text from its messages.
 */
export function dataState(
  { loading, emptyState, errorState }: DataStateProps,
  empty: boolean,
  skeleton: React.ReactNode,
  emptyText: React.ReactNode,
): React.ReactNode {
  if (isSet(errorState)) return errorState;
  if (loading) return skeleton;
  if (!empty) return null;
  if (isSet(emptyState)) return emptyState;
  return isSet(emptyText) ? (
    <p className="m-0 flex flex-1 items-center justify-center p-2 text-center text-body-sm text-[var(--color-on-surface-muted)]">
      {emptyText}
    </p>
  ) : null;
}

/** aria-busy for the container: only while the skeleton is what shows. */
export const dataBusy = ({ loading, errorState }: DataStateProps) => (loading && !isSet(errorState)) || undefined;

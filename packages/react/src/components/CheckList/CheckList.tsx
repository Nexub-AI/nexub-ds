import * as React from 'react';
import { defaultMessages } from '@nexub/core';
import { Check } from '@nexub/icons';
import { cn } from '../../utils/cn.js';

/** 11.3: an item's progress. Unset draws the plain check, as before. */
export type CheckListStatus = 'done' | 'pending';

/** 11.3: an `items` entry with a status. */
export interface CheckListEntry {
  label: React.ReactNode;
  status?: CheckListStatus;
}

export interface CheckListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** Plain strings draw the check; 11.3: `{ label, status }` entries show done or pending. */
  items?: (string | CheckListEntry)[];
  children?: React.ReactNode;
}

export const CheckList = React.forwardRef<HTMLUListElement, CheckListProps>(
  ({ className, items, children, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn('flex flex-col gap-2 list-none m-0 p-0', className)}
        {...props}
      >
        {items?.map((item, index) =>
          typeof item === 'string' ? (
            <CheckListItem key={index}>{item}</CheckListItem>
          ) : (
            <CheckListItem key={index} status={item.status}>{item.label}</CheckListItem>
          ),
        )}
        {children}
      </ul>
    );
  },
);

CheckList.displayName = 'CheckList';

export interface CheckListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  /**
   * 11.3: `done` draws the check, `pending` an empty ring with muted text. Either one
   * is also read out after the text ("Done" / "Pending"), so the state is not shape or colour alone.
   */
  status?: CheckListStatus;
  /** 11.3: the words read for `status`. @default "Done" / "Pending" */
  statusLabel?: string;
}

export const CheckListItem = React.forwardRef<HTMLLIElement, CheckListItemProps>(
  ({ className, children, status, statusLabel, ...props }, ref) => {
    const pending = status === 'pending';
    return (
      <li
        ref={ref}
        data-status={status}
        className={cn('flex items-start gap-2 text-[var(--color-on-surface)]', className)}
        {...props}
      >
        {pending ? (
          <span aria-hidden="true" className="shrink-0 mt-0.5 h-4 w-4 rounded-full border border-outline" />
        ) : (
          <span className="shrink-0 inline-flex items-center justify-center mt-0.5 h-4 w-4 rounded-full bg-[color-mix(in_srgb,var(--color-success)_10%,transparent)]">
            <Check
              className="h-3 w-3 text-[var(--color-success)]"
              aria-hidden="true"
            />
          </span>
        )}
        <span className={cn('text-body-sm', pending && 'text-on-surface-variant')}>
          {children}
          {status && <span className="sr-only">{`, ${statusLabel ?? (pending ? defaultMessages.checkPending : defaultMessages.checkDone)}`}</span>}
        </span>
      </li>
    );
  },
);

CheckListItem.displayName = 'CheckListItem';

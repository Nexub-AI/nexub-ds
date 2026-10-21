import * as React from 'react';
import { Check } from '@nexub/icons';
import { cn } from '../../utils/cn.js';

export interface CheckListProps extends React.HTMLAttributes<HTMLUListElement> {
  items?: string[];
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
        {items?.map((item, index) => (
          <CheckListItem key={index}>{item}</CheckListItem>
        ))}
        {children}
      </ul>
    );
  },
);

CheckList.displayName = 'CheckList';

export interface CheckListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

export const CheckListItem = React.forwardRef<HTMLLIElement, CheckListItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn('flex items-start gap-2 text-[var(--color-on-surface)]', className)}
        {...props}
      >
        <span className="shrink-0 inline-flex items-center justify-center mt-0.5 h-4 w-4 rounded-full bg-[color-mix(in_srgb,var(--color-success)_10%,transparent)]">
          <Check
            className="h-3 w-3 text-[var(--color-success)]"
            aria-hidden="true"
          />
        </span>
        <span className="text-sm">{children}</span>
      </li>
    );
  },
);

CheckListItem.displayName = 'CheckListItem';

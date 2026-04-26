import * as React from 'react';
import { cn } from '@nexub/react';

export interface InfoListRootProps extends React.HTMLAttributes<HTMLDListElement> {
  children: React.ReactNode;
}

export interface InfoListItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

const Root = React.forwardRef<HTMLDListElement, InfoListRootProps>(
  ({ className, children, ...props }, ref) => (
    <dl
      ref={ref}
      className={cn('divide-y divide-[var(--color-border-default)]', className)}
      {...props}
    >
      {children}
    </dl>
  ),
);
Root.displayName = 'InfoList.Root';

const Item = ({ label, value, className }: InfoListItemProps) => (
  <div className={cn('flex items-center justify-between py-3 gap-4', className)}>
    <dt className="text-sm text-[var(--color-text-muted)] shrink-0">{label}</dt>
    <dd className="text-sm font-medium text-[var(--color-text-primary)] text-right">{value}</dd>
  </div>
);
Item.displayName = 'InfoList.Item';

export const InfoList = { Root, Item };

import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  /** Heading level of the title. Use 2 or 3 when the page already has an h1. @default 1 */
  level?: 1 | 2 | 3;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, actions, breadcrumb, level = 1, ...props }, ref) => {
    const Heading = `h${level}` as const;
    return (
      <div ref={ref} className={cn('flex flex-col gap-4', className)} {...props}>
        {breadcrumb && <div>{breadcrumb}</div>}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <Heading className="text-2xl font-semibold tracking-tight text-[var(--color-on-surface)] truncate">
              {title}
            </Heading>
            {description && (
              <p className="mt-1 text-sm text-[var(--color-on-surface-muted)]">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      </div>
    );
  },
);
PageHeader.displayName = 'PageHeader';

import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  /** Heading level of the title. Use 2 or 3 when the page already has an h1. @default 1 */
  level?: 1 | 2 | 3;
  /** 10.3: sit the header on a padded, rounded panel. Under `data-expression="vivid"` the panel
   *  carries a soft wash of the accent; otherwise it is a plain tonal surface. One per page. */
  wash?: boolean;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, actions, breadcrumb, level = 1, wash = false, ...props }, ref) => {
    const Heading = `h${level}` as const;
    return (
      <div
        ref={ref}
        // Styling hooks for the expression layers (@nexub/themes/vivid).
        data-nx="page-header"
        data-wash={wash ? '' : undefined}
        className={cn(
          'flex flex-col gap-4',
          wash && 'rounded-shape-container bg-[var(--color-surface-container-low)] p-6',
          className,
        )}
        {...props}
      >
        {breadcrumb && <div>{breadcrumb}</div>}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <Heading className="text-headline-sm leading-8 ![font-weight:var(--page-title-weight,600)] ![letter-spacing:var(--page-title-tracking,-0.025em)] text-[var(--color-on-surface)] truncate">
              {title}
            </Heading>
            {description && (
              <p className="mt-1 text-body-sm text-[var(--color-on-surface-muted)]">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      </div>
    );
  },
);
PageHeader.displayName = 'PageHeader';

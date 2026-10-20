import * as React from 'react';
import { cn } from '../../utils/cn.js';

const Root = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 text-center',
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = 'EmptyState.Root';

const Illustration = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-[var(--color-on-surface-muted)]', className)}
      {...props}
    />
  ),
);
Illustration.displayName = 'EmptyState.Illustration';

const Title = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold text-[var(--color-on-surface)]', className)}
      {...props}
    />
  ),
);
Title.displayName = 'EmptyState.Title';

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('max-w-sm text-sm text-[var(--color-on-surface-muted)]', className)}
    {...props}
  />
));
Description.displayName = 'EmptyState.Description';

const Actions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2', className)} {...props} />
  ),
);
Actions.displayName = 'EmptyState.Actions';

export const EmptyState = { Root, Illustration, Title, Description, Actions };

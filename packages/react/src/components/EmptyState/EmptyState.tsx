import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface EmptyStateRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Scales spacing, icon and text. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Fades in on mount (nx-reveal; reduced motion keeps the crossfade). */
  animate?: boolean;
}

// The parts read the size from the Root's data-size (no context: this stays a server component).
const rootSizes = { sm: 'gap-3 py-8', md: 'gap-4 py-16', lg: 'gap-6 py-24' };

const Root = React.forwardRef<HTMLDivElement, EmptyStateRootProps>(
  ({ className, size = 'md', animate, ...props }, ref) => (
    <div
      ref={ref}
      data-size={size}
      className={cn(
        'group/empty-state flex flex-col items-center justify-center text-center',
        rootSizes[size],
        animate && 'nx-reveal',
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
      className={cn(
        'text-[var(--color-on-surface-muted)]',
        'group-data-[size=sm]/empty-state:[&_svg]:size-8 group-data-[size=lg]/empty-state:[&_svg]:size-16',
        className,
      )}
      {...props}
    />
  ),
);
Illustration.displayName = 'EmptyState.Illustration';

const Title = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-body-lg font-semibold text-[var(--color-on-surface)]',
        'group-data-[size=sm]/empty-state:text-title-md group-data-[size=lg]/empty-state:text-title-lg',
        className,
      )}
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
    className={cn(
      'max-w-sm text-body-sm text-[var(--color-on-surface-muted)]',
      'group-data-[size=sm]/empty-state:text-label-sm group-data-[size=sm]/empty-state:font-normal group-data-[size=lg]/empty-state:text-body-md',
      className,
    )}
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

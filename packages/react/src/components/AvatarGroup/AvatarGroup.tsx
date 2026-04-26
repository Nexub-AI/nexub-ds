import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import { avatarVariants } from '../Avatar/Avatar.js';
import type { AvatarProps } from '../Avatar/Avatar.js';

export const avatarGroupVariants = cva('flex items-center', {
  variants: {
    spacing: {
      sm: '[&>*:not(:first-child)]:-ml-3',
      md: '[&>*:not(:first-child)]:-ml-2',
      lg: '[&>*:not(:first-child)]:-ml-1',
    },
  },
  defaultVariants: {
    spacing: 'md',
  },
});

export interface AvatarGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarGroupVariants> {
  max?: number;
  size?: AvatarProps['size'];
  children: React.ReactNode;
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max, size = 'md', spacing, children, ...props }, ref) => {
    const items = React.Children.toArray(children);
    const visibleItems = max !== undefined ? items.slice(0, max) : items;
    const overflowCount =
      max !== undefined && items.length > max ? items.length - max : 0;

    return (
      <div
        ref={ref}
        className={cn(avatarGroupVariants({ spacing }), className)}
        role="group"
        {...props}
      >
        {visibleItems.map((child, index) => {
          if (!React.isValidElement(child)) return child;
          // Inject size into each Avatar child
          const childWithSize = React.cloneElement(
            child as React.ReactElement<{ size?: AvatarProps['size'] }>,
            { size },
          );
          return (
            <span
              key={index}
              className="ring-2 ring-[var(--color-bg-default)] rounded-full inline-flex"
            >
              {childWithSize}
            </span>
          );
        })}
        {overflowCount > 0 && (
          <span className="ring-2 ring-[var(--color-bg-default)] rounded-full inline-flex">
            <span
              className={cn(avatarVariants({ size }), 'font-medium')}
              role="img"
              aria-label={`${overflowCount} more`}
            >
              <span aria-hidden="true">+{overflowCount}</span>
            </span>
          </span>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = 'AvatarGroup';

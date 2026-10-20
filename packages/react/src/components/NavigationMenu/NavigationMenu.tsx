import * as React from 'react';
import * as RadixNav from '@radix-ui/react-navigation-menu';
import { ChevronDown } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { floatingSurface } from '../../utils/surface.js';

const Root = React.forwardRef<HTMLElement, RadixNav.NavigationMenuProps>(
  ({ className, children, ...props }, ref) => (
    <RadixNav.Root
      ref={ref}
      className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
      {...props}
    >
      {children}
      <Viewport />
    </RadixNav.Root>
  ),
);
Root.displayName = 'NavigationMenu.Root';

const List = React.forwardRef<HTMLUListElement, RadixNav.NavigationMenuListProps>(
  ({ className, ...props }, ref) => (
    <RadixNav.List
      ref={ref}
      className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
      {...props}
    />
  ),
);
List.displayName = 'NavigationMenu.List';

const Item = RadixNav.Item;

const Trigger = React.forwardRef<HTMLButtonElement, RadixNav.NavigationMenuTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <RadixNav.Trigger
      ref={ref}
      className={cn(
        'nx-state-layer group relative inline-flex h-control-sm w-max items-center justify-center rounded-shape-control px-3.5 text-label-lg text-[var(--color-on-surface-variant)]',
        'data-[active]:text-[var(--color-on-surface)] data-[state=open]:bg-[var(--color-secondary-container)] data-[state=open]:text-[var(--color-on-secondary-container)]',
        'disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        size="xs"
        className="relative ml-1 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </RadixNav.Trigger>
  ),
);
Trigger.displayName = 'NavigationMenu.Trigger';

const Content = React.forwardRef<HTMLDivElement, RadixNav.NavigationMenuContentProps>(
  ({ className, ...props }, ref) => (
    <RadixNav.Content
      ref={ref}
      className={cn(
        'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
        className,
      )}
      {...props}
    />
  ),
);
Content.displayName = 'NavigationMenu.Content';

const Link = React.forwardRef<HTMLAnchorElement, RadixNav.NavigationMenuLinkProps>(
  ({ className, ...props }, ref) => (
    <RadixNav.Link
      ref={ref}
      className={cn(
        'nx-state-layer relative block select-none rounded-[10px] p-3 leading-none text-[var(--color-on-surface)] no-underline outline-none',
        className,
      )}
      {...props}
    />
  ),
);
Link.displayName = 'NavigationMenu.Link';

const Viewport = React.forwardRef<HTMLDivElement, RadixNav.NavigationMenuViewportProps>(
  ({ className, ...props }, ref) => (
    <div className="absolute left-0 top-full flex justify-center">
      <RadixNav.Viewport
        ref={ref}
        className={cn(
          'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden', floatingSurface,
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
          className,
        )}
        {...props}
      />
    </div>
  ),
);
Viewport.displayName = 'NavigationMenu.Viewport';

const Indicator = React.forwardRef<HTMLDivElement, RadixNav.NavigationMenuIndicatorProps>(
  ({ className, ...props }, ref) => (
    <RadixNav.Indicator
      ref={ref}
      className={cn(
        'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=visible]:animate-in data-[state=hidden]:fade-out data-[state=visible]:fade-in',
        className,
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-[var(--color-border-default)] shadow-md" />
    </RadixNav.Indicator>
  ),
);
Indicator.displayName = 'NavigationMenu.Indicator';

export const NavigationMenu = { Root, List, Item, Trigger, Content, Link, Viewport, Indicator };

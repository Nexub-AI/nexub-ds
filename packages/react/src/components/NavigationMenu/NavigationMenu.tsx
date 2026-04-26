import * as React from 'react';
import * as RadixNav from '@radix-ui/react-navigation-menu';
import { ChevronDown } from '@nexub/icons';
import { cn } from '../../utils/cn.js';

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
        'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
        'hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)] focus:bg-[var(--color-bg-subtle)] focus:text-[var(--color-text-primary)] focus:outline-none',
        'data-[active]:bg-[var(--color-bg-subtle)]/50 data-[state=open]:bg-[var(--color-bg-subtle)]/50',
        'disabled:pointer-events-none disabled:opacity-50',
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
        'block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)] focus:bg-[var(--color-bg-subtle)] focus:text-[var(--color-text-primary)]',
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
          'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] shadow-md',
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

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { AppShellNavDrawer, AppShellNavProvider, AppShellNavTrigger } from './AppShellNav.js';

export interface AppShellRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 10.6: the mobile navigation drawer (see `AppShell.Sidebar`'s `drawerBelow`), controlled. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Root = React.forwardRef<HTMLDivElement, AppShellRootProps>(
  ({ className, open, onOpenChange, children, ...props }, ref) => {
    // Handed on as one object: this module stays a server component.
    const nav = { open, onOpenChange };
    return (
      <div
        ref={ref}
        className={cn('grid h-screen grid-rows-[auto_1fr] overflow-hidden', className)}
        {...props}
      >
        <AppShellNavProvider {...nav}>{children}</AppShellNavProvider>
      </div>
    );
  },
);
Root.displayName = 'AppShell.Root';

const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('col-span-full row-start-1', className)} {...props} />
  ),
);
Header.displayName = 'AppShell.Header';

const Body = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex overflow-hidden row-start-2', className)} {...props} />
  ),
);
Body.displayName = 'AppShell.Body';

const hideBelow = { sm: 'max-sm:hidden', md: 'max-md:hidden', lg: 'max-lg:hidden' };

export interface AppShellSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 10.6: below this breakpoint the slot leaves the layout and its children open in a left
   * Sheet instead, from `AppShell.NavTrigger`. A link clicked inside closes it.
   */
  drawerBelow?: 'sm' | 'md' | 'lg';
  /** Accessible name of that drawer. @default messages.mainNavigation */
  drawerLabel?: string;
}

const SidebarSlot = React.forwardRef<HTMLDivElement, AppShellSidebarProps>(
  ({ className, drawerBelow, drawerLabel, children, ...props }, ref) => (
    <>
      <div ref={ref} className={cn('shrink-0 overflow-y-auto', drawerBelow && hideBelow[drawerBelow], className)} {...props}>
        {children}
      </div>
      {drawerBelow && (
        <AppShellNavDrawer below={drawerBelow} label={drawerLabel}>
          {children}
        </AppShellNavDrawer>
      )}
    </>
  ),
);
SidebarSlot.displayName = 'AppShell.Sidebar';

const Main = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <main ref={ref} className={cn('relative flex-1 overflow-y-auto p-6', className)} {...props} />
  ),
);
Main.displayName = 'AppShell.Main';

export const AppShell = { Root, Header, Body, Sidebar: SidebarSlot, Main, NavTrigger: AppShellNavTrigger };

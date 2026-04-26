import * as React from 'react';
import { cn } from '../../utils/cn.js';

const Root = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid h-screen grid-rows-[auto_1fr] overflow-hidden', className)}
      {...props}
    />
  ),
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

const SidebarSlot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('shrink-0 overflow-y-auto', className)} {...props} />
  ),
);
SidebarSlot.displayName = 'AppShell.Sidebar';

const Main = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <main ref={ref} className={cn('flex-1 overflow-y-auto p-6', className)} {...props} />
  ),
);
Main.displayName = 'AppShell.Main';

export const AppShell = { Root, Header, Body, Sidebar: SidebarSlot, Main };

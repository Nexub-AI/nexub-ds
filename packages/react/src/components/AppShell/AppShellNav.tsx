'use client';

import * as React from 'react';
import { Menu } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { IconButton, type IconButtonProps } from '../IconButton/IconButton.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

const LazyDrawer = React.lazy(() => import('./AppShellDrawer.js').then((m) => ({ default: m.AppShellDrawer })));

type Breakpoint = 'sm' | 'md' | 'lg';

const NavContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void }>({
  open: false,
  setOpen: () => {},
});

export interface AppShellNavProviderProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

/** Open state of the mobile navigation drawer (controllable from `AppShell.Root`). Renders no element. */
export function AppShellNavProvider({ open: openProp, onOpenChange, children }: AppShellNavProviderProps) {
  const [uncontrolled, setUncontrolled] = React.useState(false);
  const open = openProp ?? uncontrolled;
  const setOpen = React.useCallback(
    (next: boolean) => {
      setUncontrolled(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );
  const value = React.useMemo(() => ({ open, setOpen }), [open, setOpen]);
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

const showBelow = { sm: 'sm:hidden', md: 'md:hidden', lg: 'lg:hidden' };

export interface AppShellNavTriggerProps extends Omit<IconButtonProps, 'children'> {
  /** Match the sidebar slot's `drawerBelow`: the button is hidden from that breakpoint up. @default 'md' */
  drawerBelow?: Breakpoint;
  /** Replaces the menu icon. */
  children?: React.ReactNode;
}

/** Opens the navigation drawer. Place it in the header; `label` is its accessible name. */
export const AppShellNavTrigger = React.forwardRef<HTMLButtonElement, AppShellNavTriggerProps>(
  ({ drawerBelow = 'md', className, onClick, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(NavContext);
    return (
      <IconButton
        ref={ref}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(showBelow[drawerBelow], className)}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setOpen(true);
        }}
        {...props}
      >
        {children ?? <Menu size="md" aria-hidden="true" />}
      </IconButton>
    );
  },
);
AppShellNavTrigger.displayName = 'AppShell.NavTrigger';

export interface AppShellNavDrawerProps {
  below: Breakpoint;
  /** Accessible name of the drawer. @default messages.mainNavigation */
  label?: string;
  children?: React.ReactNode;
}

/** The sidebar slot's children in a Sheet, mounted (and its code loaded) on first open. */
export function AppShellNavDrawer({ below, label, children }: AppShellNavDrawerProps) {
  const { open, setOpen } = React.useContext(NavContext);
  const messages = useNexubMessages();
  // Stays mounted after the first open so the close animation can run.
  const [mounted, setMounted] = React.useState(false);
  if (open && !mounted) setMounted(true);
  if (!mounted) return null;
  return (
    <React.Suspense fallback={null}>
      <LazyDrawer open={open} onOpenChange={setOpen} below={below} label={label ?? messages.mainNavigation}>
        {children}
      </LazyDrawer>
    </React.Suspense>
  );
}

'use client';

import * as React from 'react';
import { Sheet } from '../Drawer/Drawer.js';

const hideFrom = { sm: 'sm:hidden', md: 'md:hidden', lg: 'lg:hidden' };

export interface AppShellDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  below: 'sm' | 'md' | 'lg';
  label: string;
  children?: React.ReactNode;
}

/** The sidebar slot's content in a left Sheet. Its own file so AppShell loads the Sheet only on first open. */
export function AppShellDrawer({ open, onOpenChange, below, label, children }: AppShellDrawerProps) {
  return (
    // Class-based scroll lock: no injected style tag, so strict-CSP apps work.
    <Sheet.Root open={open} onOpenChange={onOpenChange} direction="left" scrollLock="class">
      <Sheet.Portal>
        <Sheet.Overlay className={hideFrom[below]} />
        <Sheet.Content side="left" aria-describedby={undefined} className={hideFrom[below]}>
          <Sheet.Title className="sr-only">{label}</Sheet.Title>
          {/* Navigating closes the drawer: a click on any link inside. */}
          <div
            className="flex min-h-0 flex-1 flex-col overflow-y-auto *:w-full"
            onClick={(e) => {
              if ((e.target as Element).closest('a[href]')) onOpenChange(false);
            }}
          >
            {children}
          </div>
        </Sheet.Content>
      </Sheet.Portal>
    </Sheet.Root>
  );
}

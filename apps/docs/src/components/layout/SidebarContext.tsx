'use client';

import * as React from 'react';

interface SidebarCtx {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = React.createContext<SidebarCtx>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = React.useCallback(() => setIsOpen((v) => !v), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => React.useContext(SidebarContext);

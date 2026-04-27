'use client';

import { useSidebar } from './SidebarContext';

export function DocsOverlay() {
  const { isOpen, close } = useSidebar();
  if (!isOpen) return null;
  return (
    <div
      className="docs-sidebar-overlay"
      onClick={close}
      aria-hidden="true"
    />
  );
}

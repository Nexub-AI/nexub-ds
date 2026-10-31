'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown } from '@nexub/icons';
import { Collapsible, Drawer, Sidebar } from '@nexub/react';
import type { NavGroup } from '@/registry/types';
import { useSidebar } from './SidebarContext';
import { DocsLink } from './DocsLink';
import { ThemeSwitcher } from '../docs/ThemeSwitcher';
import { BrandSwitcher } from '../docs/BrandSwitcher';

const containsPath = (g: NavGroup, path: string): boolean =>
  g.items.some((i) => i.href === path) || (g.children ?? []).some((c) => containsPath(c, path));

/** A collapsible nav section. Opens itself when it holds the current page. */
function NavSection({ group, pathname, depth }: { group: NavGroup; pathname: string; depth: 0 | 1 }) {
  const active = containsPath(group, pathname);
  const [open, setOpen] = React.useState(depth === 0 || active);
  // Sections that are server-rendered open must not play the expand animation
  // on first paint (it starts at height 0 before hydration and shifts the whole
  // nav). Animate only once the visitor toggles a section.
  const [animate, setAnimate] = React.useState(false);
  React.useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={(o) => {
        setAnimate(true);
        setOpen(o);
      }}
    >
      <Collapsible.Trigger
        className={
          'nx-state-layer flex w-full items-center justify-between rounded-shape-control px-3 text-start ' +
          (depth === 0
            ? 'h-control-sm text-label-md font-semibold text-[var(--color-on-surface)]'
            : 'h-control-xs text-label-sm font-medium uppercase tracking-wider text-[var(--color-on-surface-muted)]')
        }
      >
        {group.title}
        <ChevronDown
          size={depth === 0 ? 14 : 12}
          aria-hidden="true"
          className={'shrink-0 transition-transform duration-spatial-fast ease-spatial-fast' + (open ? '' : ' -rotate-90')}
        />
      </Collapsible.Trigger>
      {/* No display utilities on Content itself: they would override the `hidden` attribute Radix sets when closed. */}
      <Collapsible.Content
        className={animate ? undefined : 'data-[state=closed]:animate-none data-[state=open]:animate-none'}
      >
        <div className={depth === 0 ? 'flex flex-col gap-px pb-2' : 'flex flex-col gap-px ps-2'}>
          {group.items.map((item) => (
            <Sidebar.Item key={item.href} asChild active={pathname === item.href} className="h-control-sm text-label-md">
              <DocsLink href={item.href}>{item.title}</DocsLink>
            </Sidebar.Item>
          ))}
          {(group.children ?? []).map((sub) => (
            <NavSection key={sub.title} group={sub} pathname={pathname} depth={1} />
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function NavTree({ navGroups }: { navGroups: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <Sidebar.Root className="!w-full !bg-transparent" aria-label="Documentation">
      {navGroups.map((group) => (
        <Sidebar.Group key={group.title} className="py-1">
          <NavSection group={group} pathname={pathname} depth={0} />
        </Sidebar.Group>
      ))}
    </Sidebar.Root>
  );
}

// `navGroups` is passed from the server layout so the full registry (props,
// code strings, a11y notes) never ships to the client just to draw links.
export function DocsSidebar({ navGroups }: { navGroups: NavGroup[] }) {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  // Close the phone drawer after a navigation.
  React.useEffect(() => close(), [pathname, close]);

  return (
    <>
      <aside aria-label="Documentation navigation" className="docs-sidebar">
        <NavTree navGroups={navGroups} />
      </aside>
      <Drawer.Root open={isOpen} onOpenChange={(o) => { if (!o) close(); }} scrollLock="class">
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content side="left" className="w-[min(320px,86vw)] overflow-y-auto p-0">
            <Drawer.Title className="sr-only">Documentation navigation</Drawer.Title>
            <NavTree navGroups={navGroups} />
            <div className="flex items-center justify-between gap-3 border-t border-[var(--color-outline-variant)] px-5 py-4">
              <BrandSwitcher />
              <ThemeSwitcher />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

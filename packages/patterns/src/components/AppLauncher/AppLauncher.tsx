import * as React from 'react';
import { Avatar, IconButton, Popover, cn } from '@nexub/react';
import { Apps } from '@nexub/icons';

export interface AppLauncherApp {
  id: string;
  name: string;
  href: string;
  /** Tile image URL (e.g. `@nexub/brand/app-icon-account.svg`). Falls back to initials. */
  icon?: string;
  /** The app the user is in now. */
  current?: boolean;
}

export interface AppLauncherProps {
  apps: AppLauncherApp[];
  /** Client-side routing. When set, plain clicks call this instead of following `href`. */
  onNavigate?: (app: AppLauncherApp) => void;
  surface?: 'solid' | 'glass';
  /** Accessible name of the trigger and the menu. */
  label?: string;
  className?: string;
}

const COLUMNS = 3;

function AppIcon({ app }: { app: AppLauncherApp }) {
  const [failed, setFailed] = React.useState(false);
  if (app.icon && !failed) {
    return (
      <img
        src={app.icon}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 rounded-xl object-cover"
        onError={() => setFailed(true)}
      />
    );
  }
  return <Avatar name={app.name} size="md" className="rounded-xl" aria-hidden="true" />;
}

export const AppLauncher = React.forwardRef<HTMLButtonElement, AppLauncherProps>(
  ({ apps, onNavigate, surface = 'solid', label = 'Nexub apps', className }, ref) => {
    const [open, setOpen] = React.useState(false);
    const listRef = React.useRef<HTMLUListElement>(null);
    if (apps.length === 0) return null;

    // Open on the current app's tile (else the first) so arrow keys work at once.
    const onOpenAutoFocus = (e: Event) => {
      e.preventDefault();
      const list = listRef.current;
      (list?.querySelector<HTMLAnchorElement>('a[aria-current]') ?? list?.querySelector('a'))?.focus();
    };

    // Arrow keys move through the 3-column grid; Home/End jump to the ends.
    const onKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
      const links = [...e.currentTarget.querySelectorAll<HTMLAnchorElement>('a')];
      const i = links.indexOf(document.activeElement as HTMLAnchorElement);
      if (i < 0) return;
      const step: Record<string, number> = {
        ArrowRight: 1,
        ArrowLeft: -1,
        ArrowDown: COLUMNS,
        ArrowUp: -COLUMNS,
        Home: -i,
        End: links.length - 1 - i,
      };
      const delta = step[e.key];
      if (delta === undefined) return;
      e.preventDefault();
      links[Math.min(links.length - 1, Math.max(0, i + delta))]?.focus();
    };

    const onClick = (e: React.MouseEvent<HTMLAnchorElement>, app: AppLauncherApp) => {
      const plain = e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
      if (onNavigate && plain) {
        e.preventDefault();
        onNavigate(app);
      }
      if (plain) setOpen(false);
    };

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <IconButton ref={ref} label={label} className={className}>
            <Apps size="md" aria-hidden="true" />
          </IconButton>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            surface={surface}
            aria-label={label}
            onOpenAutoFocus={onOpenAutoFocus}
            className="w-80 max-w-[calc(100vw-2rem)] p-2"
          >
            <ul ref={listRef} className="grid grid-cols-3 gap-1" onKeyDown={onKeyDown}>
              {apps.map((app) => (
                <li key={app.id}>
                  <a
                    href={app.href}
                    aria-current={app.current ? 'page' : undefined}
                    onClick={(e) => onClick(e, app)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-lg px-1 py-3 text-center text-xs text-[var(--color-text-primary)] transition-colors',
                      'hover:bg-[var(--color-bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)]',
                      app.current && 'bg-[var(--color-bg-subtle)] font-semibold',
                    )}
                  >
                    <AppIcon app={app} />
                    <span className="w-full truncate">{app.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

AppLauncher.displayName = 'AppLauncher';

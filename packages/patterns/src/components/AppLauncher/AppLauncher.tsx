import * as React from 'react';
import { Avatar, IconButton, Popover, cn } from '@nexub/react';
import { Apps } from '@nexub/icons';

export interface AppLauncherApp {
  id: string;
  name: string;
  href: string;
  /** Tile image URL (e.g. `@nexub/brand/app-icon-account.svg`). Falls back to initials. */
  icon?: string;
  /** Section heading, e.g. "People & HR". Apps with the same group sit together, in order of first appearance. */
  group?: string;
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

/** Apps by group, in order of each group's first app; `firstRow` numbers the grid rows across sections. */
function groupApps(apps: AppLauncherApp[]) {
  const sections: { group?: string; items: AppLauncherApp[]; firstRow: number }[] = [];
  for (const app of apps) {
    const s = sections.find((x) => x.group === app.group);
    if (s) s.items.push(app);
    else sections.push({ group: app.group, items: [app], firstRow: 0 });
  }
  let row = 0;
  for (const s of sections) {
    s.firstRow = row;
    row += Math.ceil(s.items.length / COLUMNS);
  }
  return sections;
}

function AppIcon({ app }: { app: AppLauncherApp }) {
  const [failed, setFailed] = React.useState(false);
  if (app.icon && !failed) {
    return (
      <img
        src={app.icon}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 rounded-[12px] object-cover"
        onError={() => setFailed(true)}
      />
    );
  }
  return <Avatar name={app.name} size="md" className="rounded-[12px]" aria-hidden="true" />;
}

export const AppLauncher = React.forwardRef<HTMLButtonElement, AppLauncherProps>(
  ({ apps, onNavigate, surface = 'solid', label = 'Nexub apps', className }, ref) => {
    const [open, setOpen] = React.useState(false);
    const listRef = React.useRef<HTMLDivElement>(null);
    if (apps.length === 0) return null;
    const sections = groupApps(apps);

    // Open on the current app's tile (else the first) so arrow keys work at once.
    const onOpenAutoFocus = (e: Event) => {
      e.preventDefault();
      const list = listRef.current;
      (list?.querySelector<HTMLAnchorElement>('a[aria-current]') ?? list?.querySelector('a'))?.focus();
    };

    // Arrow keys move through the 3-column grid, section by section; Home/End jump to the ends.
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const links = [...e.currentTarget.querySelectorAll<HTMLAnchorElement>('a')];
      const i = links.indexOf(document.activeElement as HTMLAnchorElement);
      if (i < 0) return;
      const at = (a: HTMLAnchorElement) => [Number(a.dataset.row), Number(a.dataset.col)] as const;
      // Up/Down: the tile in the row above or below, in the same column or the nearest before it
      const vertical = (dir: 1 | -1) => {
        const [row, col] = at(links[i]!);
        const next = links.filter((a) => at(a)[0] === row + dir);
        return next.length ? links.indexOf(next[Math.min(col, next.length - 1)]!) : i;
      };
      const target: Record<string, () => number> = {
        ArrowRight: () => i + 1,
        ArrowLeft: () => i - 1,
        ArrowDown: () => vertical(1),
        ArrowUp: () => vertical(-1),
        Home: () => 0,
        End: () => links.length - 1,
      };
      const go = target[e.key];
      if (!go) return;
      e.preventDefault();
      links[Math.min(links.length - 1, Math.max(0, go()))]?.focus();
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
            <div ref={listRef} className="flex flex-col gap-2" onKeyDown={onKeyDown}>
              {sections.map(({ group, items, firstRow }) => (
                <div key={group ?? ''}>
                  {group && (
                    <h3 className="px-2 py-1 text-label-sm text-[var(--color-on-surface-variant)]">{group}</h3>
                  )}
                  <ul className="grid grid-cols-3 gap-1" aria-label={group}>
                    {items.map((app, n) => (
                      <li key={app.id}>
                        <a
                          href={app.href}
                          aria-current={app.current ? 'page' : undefined}
                          data-row={firstRow + Math.floor(n / COLUMNS)}
                          data-col={n % COLUMNS}
                          onClick={(e) => onClick(e, app)}
                          className={cn(
                            'flex flex-col items-center gap-1.5 rounded-[8px] px-1 py-3 text-center text-xs text-[var(--color-on-surface)] transition-colors',
                            'hover:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)]',
                            app.current && 'bg-[var(--color-surface-container-low)] font-semibold',
                          )}
                        >
                          <AppIcon app={app} />
                          <span className="w-full truncate">{app.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

AppLauncher.displayName = 'AppLauncher';

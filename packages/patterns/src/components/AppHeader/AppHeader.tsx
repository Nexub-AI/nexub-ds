import * as React from 'react';
import {
  Avatar,
  CommandPalette,
  DropdownMenu,
  IconButton,
  Kbd,
  Logo,
  TopNav,
  cn,
  useTheme,
  type GlassMode,
} from '@nexub/react';
import { Building2, ChevronDown, Moon, Search, Sun } from '@nexub/icons';
import { AppLauncher, type AppLauncherApp } from '../AppLauncher/AppLauncher.js';

export interface AppHeaderSearchItem {
  id: string;
  label: string;
  /** Shown muted on the right, e.g. "Project" or a shortcut. */
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface AppHeaderSearchGroup {
  label: string;
  items: AppHeaderSearchItem[];
}

export interface AppHeaderOrg {
  id: string;
  name: string;
}

export interface AppHeaderUser {
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface AppHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** e.g. "Command Hub". Shown after the Nexub wordmark and in the search field. */
  productName?: string;
  /** Where the logo links. @default '/' */
  homeHref?: string;
  /** Client-side routing for the logo and launcher. When set, plain clicks call this instead of following the link. */
  onNavigate?: (href: string) => void;
  /** The app's own navigation trigger. Shown below `md` only. */
  menu?: React.ReactNode;

  /** @default `Search ${productName}` */
  searchPlaceholder?: string;
  /** Static results, filtered as the user types. */
  searchItems?: AppHeaderSearchGroup[];
  /** Async results (debounced). Takes precedence over `searchItems`. */
  onSearch?: (query: string) => Promise<AppHeaderSearchGroup[]>;

  orgs?: AppHeaderOrg[];
  currentOrgId?: string;
  onOrgChange?: (id: string) => void;

  /** Needs a `ThemeProvider`. @default true */
  showThemeSwitch?: boolean;

  /** Passed to `AppLauncher`. No apps, no launcher. */
  apps?: AppLauncherApp[];

  /** No user, no account menu. */
  user?: AppHeaderUser;
  accountHref?: string;
  privacyHref?: string;
  termsHref?: string;
  /** The menu stays open, with Sign out disabled, until the promise settles. */
  onSignOut?: () => void | Promise<unknown>;
  /** Extra `DropdownMenu.Item`s, shown above Sign out. */
  accountMenuItems?: React.ReactNode;

  surface?: 'solid' | 'glass';
  /** `soft`: page content dissolves under the header instead of meeting a divider. */
  scrollEdge?: 'soft' | 'hard';
}

const SEARCH_DEBOUNCE_MS = 200;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)]';

const isPlainClick = (e: React.MouseEvent) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

const isTextField = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || t.matches('input, textarea, select'));

function HeaderSearch({
  placeholder,
  items,
  onSearch,
}: {
  placeholder: string;
  items?: AppHeaderSearchGroup[];
  onSearch?: AppHeaderProps['onSearch'];
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<AppHeaderSearchGroup[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  // ⌘ by default so the server render matches most clients; corrected after mount.
  const [isMac, setIsMac] = React.useState(true);
  const hintId = React.useId();
  const onSearchRef = React.useRef(onSearch);
  onSearchRef.current = onSearch;
  const isAsync = Boolean(onSearch);

  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !isTextField(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  React.useEffect(() => {
    if (!open || !isAsync) return;
    let stale = false;
    setLoading(true);
    const timer = setTimeout(() => {
      Promise.resolve()
        .then(() => onSearchRef.current!(query))
        .then(
          (groups) => {
            if (stale) return;
            setResults(groups);
            setFailed(false);
          },
          () => {
            if (stale) return;
            setResults([]);
            setFailed(true);
          },
        )
        .finally(() => {
          if (!stale) setLoading(false);
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [open, query, isAsync]);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery('');
  };

  const groups = isAsync ? results : (items ?? []);
  const triggerProps = {
    onClick: () => setOpen(true),
    'aria-keyshortcuts': 'Meta+K Control+K /',
    'aria-describedby': hintId,
    'aria-haspopup': 'dialog' as const,
  };

  return (
    <>
      <span id={hintId} className="sr-only">
        Keyboard shortcut: {isMac ? 'Command' : 'Control'} K
      </span>
      <button
        type="button"
        {...triggerProps}
        className={cn(
          'hidden h-9 w-full max-w-xl items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] px-3 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-muted)] md:flex',
          focusRing,
        )}
      >
        <Search size="sm" aria-hidden="true" className="shrink-0" />
        <span className="min-w-0 flex-1 truncate text-left">{placeholder}</span>
        <Kbd aria-hidden="true" className="shrink-0">
          {isMac ? '⌘K' : 'Ctrl K'}
        </Kbd>
      </button>
      <IconButton label={placeholder} {...triggerProps} className="md:hidden">
        <Search size="md" aria-hidden="true" />
      </IconButton>

      <CommandPalette.Root
        open={open}
        onOpenChange={onOpenChange}
        label={placeholder}
        scrollLock="class"
        shouldFilter={!isAsync}
      >
        <CommandPalette.Input placeholder={placeholder} value={query} onValueChange={setQuery} />
        <CommandPalette.List>
          {loading && (
            <div role="status" className="px-3 py-2 text-sm text-[var(--color-text-muted)]">
              Searching…
            </div>
          )}
          {!loading && (
            <CommandPalette.Empty>
              {failed ? 'Search failed. Try again.' : query ? `No results for “${query}”` : 'Type to search'}
            </CommandPalette.Empty>
          )}
          {groups.map((group) => (
            <CommandPalette.Group key={group.label} heading={group.label}>
              {group.items.map((item) => (
                <CommandPalette.Item
                  key={item.id}
                  value={`${group.label}:${item.id}`}
                  keywords={[item.label]}
                  onSelect={() => {
                    onOpenChange(false);
                    item.onSelect();
                  }}
                >
                  {item.icon && (
                    <span aria-hidden="true" className="mr-2 flex shrink-0 text-[var(--color-text-muted)]">
                      {item.icon}
                    </span>
                  )}
                  <span className="min-w-0 truncate">{item.label}</span>
                  {item.hint && (
                    <span className="ml-auto shrink-0 pl-3 text-xs text-[var(--color-text-muted)]">{item.hint}</span>
                  )}
                </CommandPalette.Item>
              ))}
            </CommandPalette.Group>
          ))}
        </CommandPalette.List>
      </CommandPalette.Root>
    </>
  );
}

const orgLabelClass = 'min-w-0 max-w-[6rem] truncate sm:max-w-[8rem] xl:max-w-[12rem]';

function OrgSwitcher({
  orgs,
  currentOrgId,
  onOrgChange,
}: Pick<AppHeaderProps, 'currentOrgId' | 'onOrgChange'> & { orgs: AppHeaderOrg[] }) {
  const current = orgs.find((o) => o.id === currentOrgId) ?? orgs[0];
  if (!current) return null;
  if (orgs.length === 1) {
    return (
      <span title={current.name} className={cn('px-2 text-sm font-medium text-[var(--color-text-secondary)]', orgLabelClass)}>
        {current.name}
      </span>
    );
  }
  return (
    // modal={false}: Radix's modal menu injects a <style> scroll lock (strict CSP).
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`${current.name}, switch organization`}
          title={current.name}
          className={cn(
            'inline-flex h-9 min-w-0 shrink-0 items-center gap-1 rounded-md px-2 text-sm sm:shrink font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-subtle)]',
            focusRing,
          )}
        >
          {/* Phones: an icon; the name is in the accessible name and the menu. */}
          <Building2 size="md" aria-hidden="true" className="shrink-0 sm:hidden" />
          <span className={cn('hidden sm:inline', orgLabelClass)}>{current.name}</span>
          <ChevronDown size="sm" aria-hidden="true" className="shrink-0 text-[var(--color-text-muted)]" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="max-w-[calc(100vw-1rem)]">
          <DropdownMenu.Label>Organizations</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={current.id} onValueChange={(id) => onOrgChange?.(id)}>
            {orgs.map((org) => (
              <DropdownMenu.RadioItem key={org.id} value={org.id}>
                <span className="truncate">{org.name}</span>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === 'dark';
  return (
    <IconButton label={dark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setTheme(dark ? 'light' : 'dark')}>
      {dark ? <Sun size="md" aria-hidden="true" /> : <Moon size="md" aria-hidden="true" />}
    </IconButton>
  );
}

// The glass intensity dial (ThemeProvider), offered when the header is glass.
const GLASS_LABELS: Record<GlassMode, string> = { clear: 'Clear', balanced: 'Balanced', tinted: 'Tinted', off: 'Solid' };
function GlassItems() {
  const { glass, setGlass } = useTheme();
  return (
    <>
      <DropdownMenu.Separator />
      <DropdownMenu.Label>Glass</DropdownMenu.Label>
      <DropdownMenu.RadioGroup value={glass} onValueChange={(v) => setGlass(v as GlassMode)}>
        {(Object.keys(GLASS_LABELS) as GlassMode[]).map((mode) => (
          <DropdownMenu.RadioItem key={mode} value={mode} onSelect={(e) => e.preventDefault()}>
            {GLASS_LABELS[mode]}
          </DropdownMenu.RadioItem>
        ))}
      </DropdownMenu.RadioGroup>
    </>
  );
}

function AccountMenu({
  user,
  accountHref,
  privacyHref,
  termsHref,
  onSignOut,
  accountMenuItems,
  glassControl,
}: Pick<AppHeaderProps, 'accountHref' | 'privacyHref' | 'termsHref' | 'onSignOut' | 'accountMenuItems'> & {
  user: AppHeaderUser;
  glassControl?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  const signOut = (e: Event) => {
    e.preventDefault(); // keep the menu open while pending
    if (!onSignOut || signingOut) return;
    setSigningOut(true);
    Promise.resolve()
      .then(onSignOut)
      .finally(() => {
        setSigningOut(false);
        setOpen(false);
      });
  };

  const link = (href: string, label: string) => (
    <DropdownMenu.Item asChild>
      <a href={href}>{label}</a>
    </DropdownMenu.Item>
  );
  const legal = (privacyHref || termsHref) && (
    <>
      {privacyHref && link(privacyHref, 'Privacy policy')}
      {termsHref && link(termsHref, 'Terms of service')}
    </>
  );
  const last = (accountMenuItems || onSignOut) && (
    <>
      {accountMenuItems}
      {onSignOut && (
        <DropdownMenu.Item disabled={signingOut} onSelect={signOut}>
          {signingOut ? 'Signing out…' : 'Sign out'}
        </DropdownMenu.Item>
      )}
    </>
  );

  return (
    // modal={false}: Radix's modal menu injects a <style> scroll lock (strict CSP).
    <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenu.Trigger asChild>
        <button type="button" aria-label={`Account: ${user.name}`} className={cn('ml-1 shrink-0 rounded-full', focusRing)}>
          <Avatar name={user.name} src={user.avatarUrl} size="sm" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="w-72 max-w-[calc(100vw-1rem)]">
          <DropdownMenu.Label className="flex flex-col gap-0.5 py-2">
            <span className="truncate text-title-sm text-[var(--color-on-surface)]">{user.name}</span>
            {user.email && <span className="truncate text-body-sm text-[var(--color-on-surface-muted)]">{user.email}</span>}
          </DropdownMenu.Label>
          {accountHref && link(accountHref, 'Manage your Nexub Account')}
          {glassControl && <GlassItems />}
          {legal && <DropdownMenu.Separator />}
          {legal}
          {last && <DropdownMenu.Separator />}
          {last}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

/**
 * The one top header every Nexub app shares. Fixed to the top; renders a
 * spacer of `--app-header-height` after itself, so content starts below it.
 */
export const AppHeader = React.forwardRef<HTMLElement, AppHeaderProps>(
  (
    {
      productName,
      homeHref = '/',
      onNavigate,
      menu,
      searchPlaceholder,
      searchItems,
      onSearch,
      orgs = [],
      currentOrgId,
      onOrgChange,
      showThemeSwitch = true,
      apps,
      user,
      accountHref,
      privacyHref,
      termsHref,
      onSignOut,
      accountMenuItems,
      surface = 'solid',
      className,
      ...props
    },
    ref,
  ) => {
    const placeholder = searchPlaceholder ?? (productName ? `Search ${productName}` : 'Search');

    return (
      <>
        <TopNav.Root
          ref={ref}
          role="banner"
          surface={surface}
          className={cn('fixed inset-x-0 top-0 h-[var(--app-header-height,64px)] px-2 sm:px-4', className)}
          {...props}
        >
          <div className="flex w-full min-w-0 items-center gap-1 sm:gap-2">
            {menu && <div className="flex shrink-0 md:hidden">{menu}</div>}
            <a
              href={homeHref}
              onClick={(e) => {
                if (onNavigate && isPlainClick(e)) {
                  e.preventDefault();
                  onNavigate(homeHref);
                }
              }}
              className={cn('flex min-w-0 shrink items-center rounded-md p-1', focusRing)}
            >
              <Logo size="sm" product={productName} />
            </a>
            {/* Phones: just the icon, pushed right. md+: a centred field. */}
            <div className="ml-auto flex shrink-0 md:ml-0 md:min-w-0 md:flex-1 md:justify-center md:px-2 lg:px-4">
              {(onSearch || searchItems) && (
                <HeaderSearch placeholder={placeholder} items={searchItems} onSearch={onSearch} />
              )}
            </div>
            <nav aria-label="Account and apps" className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              {orgs.length > 0 && <OrgSwitcher orgs={orgs} currentOrgId={currentOrgId} onOrgChange={onOrgChange} />}
              {showThemeSwitch && <ThemeSwitch />}
              {apps && (
                <AppLauncher apps={apps} surface={surface} onNavigate={onNavigate && ((app) => onNavigate(app.href))} />
              )}
              {user && (
                <AccountMenu
                  user={user}
                  accountHref={accountHref}
                  privacyHref={privacyHref}
                  termsHref={termsHref}
                  onSignOut={onSignOut}
                  accountMenuItems={accountMenuItems}
                  glassControl={showThemeSwitch && surface === 'glass'}
                />
              )}
            </nav>
          </div>
        </TopNav.Root>
        <div aria-hidden="true" className="h-[var(--app-header-height,64px)] shrink-0" />
      </>
    );
  },
);
AppHeader.displayName = 'AppHeader';

import * as React from 'react';
import { Card, IconButton, Sheet, Sidebar, TopNav, cn } from '@nexub/react';
import { Menu } from '@nexub/icons';

export interface SettingsLayoutItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href: string;
}

export interface SettingsLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'onSelect'> {
  /** Sections in the sidebar (and the phone menu). Each one is a page. */
  items: SettingsLayoutItem[];
  activeId?: string;
  /** Router hook-in. When set, plain clicks call this instead of following `href`. */
  onSelect?: (item: SettingsLayoutItem) => void;
  /** Top bar, left: usually `<Logo product="Account" />`. */
  logo?: React.ReactNode;
  /** Top bar, right: theme switch, `<AppLauncher>`, account menu. */
  actions?: React.ReactNode;
  /**
   * Replaces the built-in top bar (and `logo`/`actions`), usually with an `AppHeader`.
   * Gets the phone section-menu button to place in it:
   * `header={(menu) => <AppHeader menu={menu} … />}`.
   */
  header?: (menuButton: React.ReactElement) => React.ReactNode;
  /** Page header. */
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Accessible name of the section navigation. */
  navLabel?: string;
}

const isPlainClick = (e: React.MouseEvent) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

function SectionNav({
  items,
  activeId,
  onChoose,
  label,
  className,
}: {
  items: SettingsLayoutItem[];
  activeId?: string;
  onChoose: (e: React.MouseEvent, item: SettingsLayoutItem) => void;
  label: string;
  className?: string;
}) {
  return (
    <Sidebar.Root aria-label={label} className={className}>
      <Sidebar.Group>
        {items.map((item) => (
          <Sidebar.Item
            key={item.id}
            href={item.href}
            icon={item.icon}
            active={item.id === activeId}
            onClick={(e) => onChoose(e, item)}
          >
            {item.label}
          </Sidebar.Item>
        ))}
      </Sidebar.Group>
    </Sidebar.Root>
  );
}

const Root = React.forwardRef<HTMLDivElement, SettingsLayoutProps>(
  (
    { items, activeId, onSelect, logo, actions, header, title, description, navLabel = 'Settings', className, children, ...props },
    ref,
  ) => {
    const [menuOpen, setMenuOpen] = React.useState(false);

    const onChoose = (e: React.MouseEvent, item: SettingsLayoutItem) => {
      if (!isPlainClick(e)) return;
      if (onSelect) {
        e.preventDefault();
        onSelect(item);
      }
      setMenuOpen(false);
    };

    const menuButton = (
      <IconButton label={`Open ${navLabel.toLowerCase()} menu`} className="-ms-2 md:hidden" onClick={() => setMenuOpen(true)}>
        <Menu size="md" aria-hidden="true" />
      </IconButton>
    );

    return (
      <div ref={ref} className={cn('flex min-h-screen flex-col bg-[var(--color-surface)]', className)} {...props}>
        {header ? (
          header(menuButton)
        ) : (
          <TopNav.Root className="h-[var(--app-header-height,64px)]">
            {menuButton}
            {logo && <TopNav.Logo className="min-w-0 shrink">{logo}</TopNav.Logo>}
            {actions && <TopNav.Actions>{actions}</TopNav.Actions>}
          </TopNav.Root>
        )}

        <div className="flex flex-1">
          <SectionNav
            items={items}
            activeId={activeId}
            onChoose={onChoose}
            label={navLabel}
            className="sticky top-[var(--app-header-height,64px)] hidden h-[calc(100vh-var(--app-header-height,64px))] shrink-0 md:flex"
          />
          <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-10">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
              {(title || description) && (
                <header className="flex flex-col gap-1">
                  {title && <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-on-surface)]">{title}</h1>}
                  {description && <p className="text-sm text-[var(--color-on-surface-muted)]">{description}</p>}
                </header>
              )}
              {children}
            </div>
          </main>
        </div>

        {/* Class-based scroll lock: no injected <style>, so strict-CSP apps work. */}
        <Sheet.Root open={menuOpen} onOpenChange={setMenuOpen} direction="left" scrollLock="class">
          <Sheet.Portal>
            <Sheet.Overlay className="md:hidden" />
            <Sheet.Content side="left" aria-describedby={undefined} className="md:hidden">
              <Sheet.Title className="px-5 pb-2 pt-5 text-base">{navLabel}</Sheet.Title>
              <SectionNav items={items} activeId={activeId} onChoose={onChoose} label={navLabel} className="w-full border-e-0" />
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet.Root>
      </div>
    );
  },
);
Root.displayName = 'SettingsLayout';

export interface SettingsLayoutSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

/** A settings Card with an optional heading. Put `SettingsRow`s inside. */
const Section = React.forwardRef<HTMLElement, SettingsLayoutSectionProps>(
  ({ title, description, className, children, ...props }, ref) => (
    <Card asChild className={cn('px-5 py-1', className)}>
      <section ref={ref} {...props}>
        {(title || description) && (
          <div className="flex flex-col gap-1 border-b border-[var(--color-outline-variant)] pb-4 pt-4">
            {title && <h2 className="text-base font-semibold text-[var(--color-on-surface)]">{title}</h2>}
            {description && <p className="text-sm text-[var(--color-on-surface-muted)]">{description}</p>}
          </div>
        )}
        {children}
      </section>
    </Card>
  ),
);
Section.displayName = 'SettingsLayout.Section';

export interface SettingsRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  label: React.ReactNode;
  /** Optional hint under the label. */
  description?: React.ReactNode;
  /** The current value, e.g. an email address. */
  value?: React.ReactNode;
  /** Usually a Button or Switch. */
  action?: React.ReactNode;
}

/** Label | value | action. Stacks on phones. */
export const SettingsRow = React.forwardRef<HTMLDivElement, SettingsRowProps>(
  ({ label, description, value, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-2 border-t border-[var(--color-outline-variant)] py-4 first:border-t-0 sm:flex-row sm:items-center sm:gap-4',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-0.5 sm:w-1/3 sm:shrink-0">
        <span className="text-sm font-medium text-[var(--color-on-surface)]">{label}</span>
        {description && <span className="text-xs text-[var(--color-on-surface-muted)]">{description}</span>}
      </div>
      <div className="min-w-0 flex-1 break-words text-sm text-[var(--color-on-surface-variant)]">{value}</div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  ),
);
SettingsRow.displayName = 'SettingsRow';

export const SettingsLayout = Object.assign(Root, { Section, Row: SettingsRow });

'use client';

import * as React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Command, useCommandState } from 'cmdk';
import { Search } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { overlaySurface, scrim } from '../../utils/surface.js';
import { useClassScrollLock } from '../../hooks/useClassScrollLock.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';
import { Badge } from '../Badge/Badge.js';
import { Spinner } from '../Spinner/Spinner.js';

export interface CommandPaletteRootProps extends RadixDialog.DialogProps {
  className?: string;
  /** Accessible name of the dialog. @default 'Command palette' */
  label?: string;
  /**
   * How page scroll is locked while open.
   * - `'style'` (default): Radix's lock, which injects a `<style>` tag (blocked by `style-src 'self'`).
   * - `'class'`: the `nexub-scroll-lock` class from `@nexub/themes/base`. Strict-CSP safe.
   */
  scrollLock?: 'style' | 'class';
  /** `false` when the items are already filtered (e.g. async search results). @default true */
  shouldFilter?: boolean;
  /**
   * A letter that toggles the palette with Cmd (macOS) or Ctrl, anywhere on
   * the page, e.g. `'k'` for Cmd+K / Ctrl+K. Off by default.
   */
  shortcut?: string;
  /** The open page stack (ids of `CommandPalette.Page`s), deepest last. Empty = the root page. */
  pages?: string[];
  defaultPages?: string[];
  onPagesChange?: (pages: string[]) => void;
  /** Shows a loading row (e.g. while async results arrive) and hides `Empty`. */
  loading?: boolean;
  /**
   * Opt-in recents: the last `recentLimit` items picked on the root page are
   * kept in localStorage under this key and shown as a "Recent" group while
   * the query is empty.
   */
  recentKey?: string;
  /** @default 5 */
  recentLimit?: number;
}

interface Recent { value: string; label: string }

interface PaletteContext {
  pages: string[];
  push: (page: string) => void;
  pop: () => void;
  titles: Record<string, string>;
  setTitle: (page: string, title: string) => void;
  loading?: boolean;
  recents: Recent[];
  record: (recent: Recent) => void;
  /** Item onSelect handlers by cmdk value, so a Recent row can run the real item. */
  handlers: Map<string, (value: string) => void>;
}

const PaletteContext = React.createContext<PaletteContext | null>(null);
const usePalette = () => React.useContext(PaletteContext);

function readRecents(key: string): Recent[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter((r): r is Recent => typeof r?.value === 'string' && typeof r?.label === 'string')
      : [];
  } catch {
    return [];
  }
}

const overlayClasses = cn('fixed inset-0 z-[var(--z-modal)] nx-motion', scrim);

// Radix's scroll lock lives in Dialog.Overlay, so the class-lock overlay is a
// plain element. Focus trap and Escape live in Dialog.Content and still apply.
function ClassLockOverlay() {
  useClassScrollLock();
  return <div data-state="open" className={overlayClasses} />;
}

const Root = React.forwardRef<HTMLDivElement, CommandPaletteRootProps>(
  ({ children, label: labelProp, scrollLock = 'style', shouldFilter, shortcut, open: openProp, defaultOpen, onOpenChange,
    pages: pagesProp, defaultPages, onPagesChange, loading, recentKey, recentLimit = 5, ...props }, ref) => {
  const messages = useNexubMessages();
  const [pages = [], setPages] = useControllableState({ value: pagesProp, defaultValue: defaultPages, onChange: onPagesChange });
  const [open = false, setOpenState] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  // Reopening starts on the root page.
  const setOpen = (next: boolean) => {
    setOpenState(next);
    if (!next && pages.length) setPages([]);
  };
  const [titles, setTitles] = React.useState<Record<string, string>>({});
  const [recents, setRecents] = React.useState<Recent[]>([]);
  const handlers = React.useRef(new Map<string, (value: string) => void>()).current;
  // Read after mount: localStorage isn't there during SSR.
  React.useEffect(() => setRecents(recentKey ? readRecents(recentKey) : []), [recentKey]);
  const ctx: PaletteContext = {
    pages,
    push: (page) => setPages([...pages, page]),
    pop: () => setPages(pages.slice(0, -1)),
    titles,
    setTitle: (page, title) => setTitles((t) => (t[page] === title ? t : { ...t, [page]: title })),
    loading,
    recents,
    record: (recent) => {
      // Root-page items only: a Recent row can only run an item that's mounted next to it.
      if (!recentKey || pages.length) return;
      const next = [recent, ...recents.filter((r) => r.value !== recent.value)].slice(0, recentLimit);
      setRecents(next);
      try {
        localStorage.setItem(recentKey, JSON.stringify(next));
      } catch {
        // Storage full or blocked: recents just don't persist.
      }
    },
    handlers,
  };
  React.useEffect(() => {
    if (!shortcut) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.shiftKey || !(e.metaKey || e.ctrlKey)) return;
      if (e.key.toLowerCase() !== shortcut.toLowerCase()) return;
      e.preventDefault();
      setOpen(!open);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [shortcut, open, setOpen]);
  const label = labelProp ?? messages.commandPalette;
  // Radix returns focus to Dialog.Trigger, which a palette (opened by a shortcut
  // or its own button) doesn't have. Return it to whatever had it before.
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  return (
  <RadixDialog.Root open={open} onOpenChange={setOpen} {...props}>
    <RadixDialog.Portal>
      {scrollLock === 'class' ? <ClassLockOverlay /> : <RadixDialog.Overlay className={overlayClasses} />}
      <RadixDialog.Content
        ref={ref}
        aria-describedby={undefined}
        onOpenAutoFocus={() => {
          returnFocusRef.current = document.activeElement as HTMLElement | null;
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          returnFocusRef.current?.focus();
        }}
        className={cn(
          'fixed left-1/2 top-[20%] z-[var(--z-modal)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2',
          'nx-motion nx-dialog overflow-hidden', overlaySurface,
        )}
      >
        <RadixDialog.Title className="sr-only">{label}</RadixDialog.Title>
        <Command
          label={label}
          shouldFilter={shouldFilter}
          loop
          className="flex h-full w-full flex-col overflow-hidden text-[var(--color-on-surface)]"
        >
          <PaletteContext.Provider value={ctx}>{children}</PaletteContext.Provider>
        </Command>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  </RadixDialog.Root>
  );
});
Root.displayName = 'CommandPalette.Root';

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Command.Input>
>(({ className, value: valueProp, onValueChange, onKeyDown, ...props }, ref) => {
  const palette = usePalette();
  const pages = palette?.pages ?? [];
  // Controlled so a page change can clear the query.
  const [value = '', setValue] = useControllableState({ value: valueProp, defaultValue: '', onChange: onValueChange });
  const depth = pages.length;
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) first.current = false;
    else setValue('');
  }, [depth]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="flex items-center gap-1 border-b border-[var(--color-outline-variant)] px-3">
      <Search size="sm" className="me-1 shrink-0 opacity-50" aria-hidden="true" />
      {pages.map((page) => (
        <Badge key={page} variant="soft" size="sm" className="shrink-0">
          {palette?.titles[page] ?? page}
        </Badge>
      ))}
      <Command.Input
        ref={ref}
        value={value}
        onValueChange={setValue}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          // Backspace on an empty query goes back a page.
          if (!e.defaultPrevented && e.key === 'Backspace' && !e.currentTarget.value && depth) {
            e.preventDefault();
            palette?.pop();
          }
        }}
        className={cn(
          'ms-1 flex h-control-xl w-full bg-transparent text-body-lg outline-none placeholder:text-[var(--color-on-surface-muted)] disabled:cursor-not-allowed disabled:text-[var(--color-text-disabled)]',
          className,
        )}
        {...props}
      />
    </div>
  );
});
Input.displayName = 'CommandPalette.Input';

const List = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Command.List>
>(({ className, children, ...props }, ref) => {
  const palette = usePalette();
  const messages = useNexubMessages();
  const search = useCommandState((state) => state.search);
  const showRecents = palette && !palette.loading && !palette.pages.length && !search && palette.recents.length > 0;
  return (
    <Command.List
      ref={ref}
      className={cn('max-h-[400px] overflow-y-auto overflow-x-hidden p-2', className)}
      {...props}
    >
      {palette?.loading && (
        <Command.Loading label={messages.loading} className={cn(itemClasses, 'text-[var(--color-on-surface-muted)]')}>
          <Spinner size="sm" aria-hidden="true" />
          {messages.loading}
        </Command.Loading>
      )}
      {showRecents && (
        <Group heading={messages.recent}>
          {palette.recents.map((r) => (
            <Command.Item
              key={r.value}
              value={`recent:${r.value}`}
              onSelect={() => palette.handlers.get(r.value)?.(r.value)}
              className={itemClasses}
            >
              {r.label}
            </Command.Item>
          ))}
        </Group>
      )}
      {children}
    </Command.List>
  );
});
List.displayName = 'CommandPalette.List';

const Empty = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Command.Empty>
>(({ className, ...props }, ref) => usePalette()?.loading ? null : (
  <Command.Empty
    ref={ref}
    className={cn(
      'py-8 text-center text-body-sm text-[var(--color-on-surface-muted)]',
      className,
    )}
    {...props}
  />
));
Empty.displayName = 'CommandPalette.Empty';

// Concentric: overlay 24px − 8px padding = 16px.
const itemClasses = cn(
  'relative flex cursor-default select-none items-center gap-2 rounded-shape-container px-3 py-2.5 text-body-sm outline-none',
  'aria-selected:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)]',
  'data-[disabled=true]:pointer-events-none data-[disabled=true]:text-[var(--color-text-disabled)]',
);

const Group = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Command.Group>
>(({ className, ...props }, ref) => (
  <Command.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-2 text-[var(--color-on-surface)]',
      '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-label-sm [&_[cmdk-group-heading]]:text-[var(--color-on-surface-muted)]',
      className,
    )}
    {...props}
  />
));
Group.displayName = 'CommandPalette.Group';

export interface CommandPaletteItemProps extends React.ComponentProps<typeof Command.Item> {
  /** Opens this `CommandPalette.Page` (by id) when selected. */
  page?: string;
}

const Item = React.forwardRef<HTMLDivElement, CommandPaletteItemProps>(
  ({ className, page, onSelect, ...props }, ref) => {
    const palette = usePalette();
    const local = React.useRef<HTMLDivElement>(null);
    const select = (value: string) => {
      onSelect?.(value);
      if (page) palette?.push(page);
      palette?.record({ value, label: local.current?.textContent?.trim() ?? value });
    };
    const selectRef = React.useRef(select);
    selectRef.current = select;
    // Register under cmdk's value (it sets data-value) so a Recent row can run this item.
    React.useEffect(() => {
      const value = local.current?.getAttribute('data-value');
      if (!palette || !value) return;
      const run = (v: string) => selectRef.current(v);
      palette.handlers.set(value, run);
      return () => {
        if (palette.handlers.get(value) === run) palette.handlers.delete(value);
      };
    });
    return (
      <Command.Item
        ref={useMergedRefs(ref, local)}
        onSelect={select}
        className={cn(itemClasses, className)}
        {...props}
      />
    );
  },
);
Item.displayName = 'CommandPalette.Item';

// cmdk hard-codes role="separator", which a listbox may not contain (only options and
// groups): make it presentational. The line is decoration; groups carry the structure.
const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Command.Separator>
>(({ className, ...props }, ref) => (
  <Command.Separator
    ref={useMergedRefs(ref, (el: HTMLDivElement | null) => el?.setAttribute('role', 'none'))}
    className={cn('-mx-1 my-1 h-px bg-[var(--color-outline-variant)]', className)}
    {...props}
  />
));
Separator.displayName = 'CommandPalette.Separator';

export interface CommandPalettePageProps {
  /** Pushed by `<CommandPalette.Item page="id">`. Leave out for the root page. */
  id?: string;
  /** Shown in the input's breadcrumb. Defaults to the id. */
  title?: string;
  children?: React.ReactNode;
}

/** Content shown only while this page is on top of the stack (no id: the root page). */
function Page({ id, title, children }: CommandPalettePageProps) {
  const palette = usePalette();
  const setTitle = palette?.setTitle;
  useIsomorphicLayoutEffect(() => {
    if (id && title) setTitle?.(id, title);
  }, [id, title]); // eslint-disable-line react-hooks/exhaustive-deps
  const pages = palette?.pages ?? [];
  const active = id ? pages[pages.length - 1] === id : pages.length === 0;
  return active ? <>{children}</> : null;
}
Page.displayName = 'CommandPalette.Page';

export const CommandPalette = { Root, Input, List, Empty, Group, Item, Separator, Page };

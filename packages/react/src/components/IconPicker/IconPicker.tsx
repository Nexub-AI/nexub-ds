'use client';

import * as React from 'react';
import type { IconProps } from '@nexub/icons';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import {
  PickerGrid,
  PickerShell,
  useRecent,
  type PickerFieldProps,
  type PickerItem,
  type PickerSection,
} from '../EmojiPicker/pickerShared.js';

type IconComponent = React.ComponentType<IconProps>;
type IconMap = Record<string, IconComponent>;

const RECENT_KEY = 'nx-icon-recent';

let loaded: IconMap | undefined;
let iconsPromise: Promise<IconMap> | undefined;

/**
 * Loads every `@nexub/icons` export, by name. A dynamic import, so the full set stays out of the
 * bundle until a picker opens (or shows a value). Call early, e.g. on hover, to have it ready.
 */
export function loadIcons(): Promise<IconMap> {
  return (iconsPromise ??= import('@nexub/icons').then(
    (mod) => {
      const map: IconMap = {};
      for (const [name, value] of Object.entries(mod)) {
        if (
          /^[A-Z]/.test(name) &&
          value &&
          (typeof value === 'function' || typeof value === 'object')
        )
          map[name] = value as IconComponent;
      }
      loaded = map;
      for (const notify of listeners) notify();
      return map;
    },
    (error: unknown) => {
      iconsPromise = undefined;
      throw error;
    },
  ));
}

const listeners = new Set<() => void>();
const subscribe = (notify: () => void) => {
  listeners.add(notify);
  return () => listeners.delete(notify);
};

/**
 * The icon map once loaded. 12.1: hydration reads the server snapshot (null) whatever this
 * module has cached, so the server HTML (rendered with or without the icons cached) and the
 * first client render always match; a picker mounted later shows the cached icons at once.
 */
function useIcons(enabled = true): IconMap | null {
  const icons = React.useSyncExternalStore(
    subscribe,
    () => loaded ?? null,
    () => null,
  );
  React.useEffect(() => {
    if (icons || !enabled) return;
    loadIcons().catch(() => {});
  }, [icons, enabled]);
  return icons;
}

/** "ArrowUpRight" → "Arrow up right"; acronyms ("ACRA") stay. */
function iconLabel(name: string): string {
  return name
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(' ')
    .map((word, i) => (i && /^[A-Z][a-z]/.test(word) ? word.toLowerCase() : word))
    .join(' ');
}

export interface IconPickerCategory {
  label: string;
  /** Icon names, in order. Names `@nexub/icons` doesn't export are skipped. */
  icons: string[];
}

export interface IconPickerPanelProps {
  /** The picked icon's name, marked in the grid. */
  value?: string | null;
  /** Called with the picked icon's name (an `@nexub/icons` export, e.g. "Calendar"). */
  onValueChange?: (name: string) => void;
  /** Only these icons, in this order. @default every `@nexub/icons` export, A–Z */
  icons?: string[];
  /** Icons under headings, with a category row to jump between them. Overrides `icons`. */
  categories?: IconPickerCategory[];
  /** Recent picks, newest first. When set, they are not read from or saved to localStorage. */
  recent?: string[];
  /** Focus the search box on mount. */
  autoFocus?: boolean;
  /** The listbox's id. */
  listId?: string;
  className?: string;
  /** Names the icon list. @default messages.pickIcon */
  'aria-label'?: string;
}

/**
 * 11.2: the icon grid on its own (search, categories, recent picks) over `@nexub/icons`, for any
 * popover or page. The icon set loads on mount with a dynamic import.
 */
export function IconPickerPanel({
  value,
  onValueChange,
  icons: only,
  categories,
  recent: recentProp,
  autoFocus,
  listId,
  className,
  'aria-label': ariaLabel,
}: IconPickerPanelProps) {
  const messages = useNexubMessages();
  const icons = useIcons();
  const [recent, addRecent] = useRecent(RECENT_KEY, recentProp);

  const sections = React.useMemo<PickerSection[] | null>(() => {
    if (!icons) return null;
    const item = (name: string): PickerItem[] => {
      const Icon = icons[name];
      if (!Icon) return [];
      const label = iconLabel(name);
      return [
        {
          value: name,
          label,
          content: <Icon size="md" />,
          search: `${label} ${name}`.toLowerCase(),
        },
      ];
    };
    const groups: { id: string; label: string; names: string[] }[] = categories
      ? categories.map((c, i) => ({ id: `c${i}`, label: c.label, names: c.icons }))
      : [{ id: 'all', label: messages.allIcons, names: only ?? Object.keys(icons).sort() }];
    const out: PickerSection[] = groups.map((g) => {
      const items = g.names.flatMap(item);
      const First = items[0] && icons[items[0].value];
      return { id: g.id, label: g.label, icon: First ? <First size="sm" /> : undefined, items };
    });
    const recentItems = recent.flatMap(item);
    if (recentItems.length) {
      const Clock = icons.Clock;
      out.unshift({
        id: 'recent',
        label: messages.recentlyUsed,
        icon: Clock ? <Clock size="sm" /> : undefined,
        items: recentItems,
      });
    }
    return out;
  }, [icons, only, categories, recent, messages.allIcons, messages.recentlyUsed]);

  return (
    <PickerGrid
      label={ariaLabel ?? messages.pickIcon}
      sections={sections}
      value={value}
      listId={listId}
      autoFocus={autoFocus}
      className={className}
      onPick={(name) => {
        addRecent(name);
        onValueChange?.(name);
      }}
    />
  );
}

export interface IconPickerProps
  extends PickerFieldProps, Pick<IconPickerPanelProps, 'icons' | 'categories' | 'recent'> {
  /** The picked icon's name; `null` (or `undefined` when uncontrolled) for none. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (name: string) => void;
  /** Shown when nothing is picked. @default messages.pickIcon */
  placeholder?: string;
}

const IconPickerRoot = React.forwardRef<HTMLButtonElement, IconPickerProps>(function IconPicker(
  {
    value: valueProp,
    defaultValue = null,
    onValueChange,
    placeholder,
    icons: only,
    categories,
    recent,
    ...field
  },
  ref,
) {
  const messages = useNexubMessages();
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState<string | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internal;
  // The trigger draws the picked icon, so a value loads the set too.
  const icons = useIcons(Boolean(value) || open);
  const Icon = value ? icons?.[value] : undefined;
  return (
    <PickerShell
      ref={ref}
      {...field}
      value={value}
      open={open}
      onOpenChange={setOpen}
      fallbackLabel={messages.pickIcon}
      display={
        value ? (
          <>
            {Icon && <Icon size="sm" className="shrink-0" />}
            <span className="truncate">{iconLabel(value)}</span>
          </>
        ) : (
          <span className="truncate">{placeholder ?? messages.pickIcon}</span>
        )
      }
    >
      {(listId) => (
        <IconPickerPanel
          listId={listId}
          autoFocus
          value={value}
          icons={only}
          categories={categories}
          recent={recent}
          onValueChange={(name) => {
            if (valueProp === undefined) setInternal(name);
            onValueChange?.(name);
            setOpen(false);
          }}
        />
      )}
    </PickerShell>
  );
});

/**
 * 11.2: a field-styled button that opens a grid of `@nexub/icons` (a bottom sheet on phones):
 * search, categories and recent picks. The value is the icon's export name. The icon set loads
 * on demand. `IconPicker.Panel` is the grid alone.
 */
export const IconPicker = Object.assign(IconPickerRoot, { Panel: IconPickerPanel });

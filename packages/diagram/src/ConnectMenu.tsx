import * as React from 'react';
import { cx } from './cx.js';

export interface ConnectMenuProps {
  /** The menu's name, e.g. "Connect Fetch data to…". */
  label: string;
  emptyLabel: string;
  options: ReadonlyArray<{ id: string; title: string }>;
  onPick: (id: string) => void;
  /** `refocus` is false when focus already left (blur). */
  onClose: (refocus?: boolean) => void;
}

/**
 * The keyboard alternative to dragging a handle: a listbox of the nodes the focused node
 * can connect to. Focus moves into it when it opens (so its name is announced); Up/Down,
 * Home/End and typing a letter move the active option, Enter picks, Escape or Tab closes.
 */
export function ConnectMenu({ label, emptyLabel, options, onPick, onClose }: ConnectMenuProps) {
  const listId = React.useId();
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    listRef.current?.focus();
  }, []);
  const activeIndex = Math.min(active, Math.max(0, options.length - 1));

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    let next: number | undefined;
    if (e.key === 'ArrowDown') next = activeIndex >= last ? 0 : activeIndex + 1;
    else if (e.key === 'ArrowUp') next = activeIndex <= 0 ? last : activeIndex - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      const o = options[activeIndex];
      if (o) onPick(o.id);
      return;
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
      return;
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const ch = e.key.toLowerCase();
      const n = options.length;
      for (let k = 1; k <= n; k++) {
        const i = (activeIndex + k) % n;
        if (options[i]!.title.toLowerCase().startsWith(ch)) {
          next = i;
          break;
        }
      }
    }
    if (next !== undefined) {
      e.preventDefault();
      e.stopPropagation();
      setActive(Math.max(0, next));
    }
  };

  return (
    <div
      data-diagram-connect-menu=""
      className="nx-diagram-menu absolute start-3 top-3 z-10 flex max-h-72 w-64 flex-col gap-1 overflow-hidden rounded-shape-container border border-outline-variant bg-surface-container p-2 text-on-surface shadow-elevation-2"
    >
      <div id={`${listId}-label`} className="px-2 py-1 text-label-md text-on-surface-variant">
        {label}
      </div>
      <div
        ref={listRef}
        id={listId}
        role="listbox"
        tabIndex={0}
        aria-labelledby={`${listId}-label`}
        aria-activedescendant={options.length ? `${listId}-${activeIndex}` : undefined}
        className="nx-diagram-menu-list flex flex-col overflow-auto"
        onKeyDown={onKeyDown}
        onBlur={(e) => {
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node | null)) onClose(false);
        }}
      >
        {options.length === 0 ? (
          <div className="px-2 py-1.5 text-body-sm text-on-surface-variant">{emptyLabel}</div>
        ) : (
          options.map((o, i) => (
            <div
              key={o.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              data-active={i === activeIndex ? '' : undefined}
              className={cx('cursor-pointer truncate rounded-shape-field px-2 py-1.5 text-body-md', i === activeIndex && 'bg-secondary-container text-on-secondary-container')}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => onPick(o.id)}
              onPointerEnter={() => setActive(i)}
            >
              {o.title}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import * as React from 'react';
import { cn } from '@nexub/react';
import { ChevronRight } from '@nexub/icons';
import { PageFrame, usePageMessages, type PageFrameProps, type PageTemplateMessages } from '../PageFrame/PageFrame.js';

export interface SettingsItem {
  title: string;
  subtitle?: string;
  /** Icon or avatar before the title. */
  leading?: React.ReactNode;
  /** Current value, shown at the end (e.g. "English"). */
  value?: React.ReactNode;
  /** A Switch, Select or Button at the end. The row itself stays static. */
  control?: React.ReactNode;
  /** Makes the row a link. */
  href?: string;
  /** Makes the row a button (navigation to a sub-page, a dialog…). */
  onSelect?: () => void;
  /** Destructive row ("Sign out", "Delete account"): error colour. */
  destructive?: boolean;
}

export interface SettingsGroup {
  header?: string;
  footer?: string;
  items: SettingsItem[];
}

export interface SettingsPageProps extends Omit<PageFrameProps, 'title' | 'children'> {
  groups: SettingsGroup[];
  /** Above the groups: a profile card. */
  header?: React.ReactNode;
  /** @default messages.settings */
  title?: React.ReactNode;
  messages?: Partial<PageTemplateMessages>;
}

function Row({ item }: { item: SettingsItem }) {
  const content = (
    <>
      {item.leading && <span className="flex shrink-0 text-[var(--color-on-surface-variant)]">{item.leading}</span>}
      <span className="flex min-w-0 flex-1 flex-col text-start">
        <span
          className={cn(
            'text-body-md font-medium',
            item.destructive ? 'text-[var(--color-error)]' : 'text-[var(--color-on-surface)]',
          )}
        >
          {item.title}
        </span>
        {item.subtitle && <span className="text-body-sm text-[var(--color-on-surface-muted)]">{item.subtitle}</span>}
      </span>
      {item.value != null && <span className="shrink-0 text-body-md text-[var(--color-on-surface-muted)]">{item.value}</span>}
      {(item.href || item.onSelect) && !item.destructive && (
        <ChevronRight size="sm" aria-hidden="true" className="shrink-0 text-[var(--color-on-surface-muted)] rtl:-scale-x-100" />
      )}
    </>
  );
  const row = 'flex min-h-[56px] w-full items-center gap-3 px-4 py-3';
  if (item.href)
    return (
      <a href={item.href} onClick={item.onSelect && ((e) => { e.preventDefault(); item.onSelect?.(); })} className={cn(row, 'nx-state-layer')}>
        {content}
      </a>
    );
  if (item.onSelect)
    return (
      <button type="button" onClick={item.onSelect} className={cn(row, 'nx-state-layer')}>
        {content}
      </button>
    );
  return (
    <div className={row}>
      {content}
      {item.control && <span className="shrink-0">{item.control}</span>}
    </div>
  );
}

/**
 * Grouped settings on one page, inset-grouped like iOS Settings. Web twin of
 * the native `SettingsScreen`. For a multi-section account area with a
 * sidebar, wrap pages in `SettingsLayout`.
 */
export const SettingsPage = React.forwardRef<HTMLElement, SettingsPageProps>(function SettingsPage(
  { groups, header, title, messages, ...props },
  ref,
) {
  const m = usePageMessages(messages);
  return (
    <PageFrame ref={ref} title={title ?? m.settings} {...props}>
      {header}
      {groups.map((g, i) => {
        const id = `settings-group-${i}`;
        return (
          <section key={g.header ?? i} aria-labelledby={g.header ? id : undefined} className="flex flex-col gap-2">
            {g.header && (
              <h2 id={id} className="px-4 text-label-lg text-[var(--color-on-surface-variant)]">
                {g.header}
              </h2>
            )}
            <ul className="overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)]">
              {g.items.map((it) => (
                <li key={it.title} className="border-t border-[var(--color-outline-variant)] first:border-t-0">
                  <Row item={it} />
                </li>
              ))}
            </ul>
            {g.footer && <p className="px-4 text-body-sm text-[var(--color-on-surface-muted)]">{g.footer}</p>}
          </section>
        );
      })}
    </PageFrame>
  );
});

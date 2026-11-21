'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown } from '@nexub/icons';
import { Button, Link, Sheet, Text } from '@nexub/react';
import { readHeadings, tocLinkClass, useActiveHeading, type TocItem } from './useToc';

/**
 * "On this page" for narrow screens, where the right-hand rail is hidden: a button
 * (in the server HTML at every width; CSS shows it below 1024px) that opens the
 * page's headings in a bottom sheet. Headings are read when the sheet opens, so
 * nothing on the page depends on them and nothing moves.
 */
export function MobileTOC() {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<TocItem[]>([]);
  const target = React.useRef<string | null>(null);
  const pathname = usePathname();
  const active = useActiveHeading(items);

  // Another page: the old headings are gone.
  React.useEffect(() => setItems([]), [pathname]);

  const go = () => {
    const el = target.current ? document.getElementById(target.current) : null;
    target.current = null;
    if (!el) return;
    history.replaceState(null, '', `#${el.id}`);
    // Headings are not tab stops; -1 lets focus land there so reading continues from the section.
    el.tabIndex = -1;
    el.focus({ preventScroll: true });
    el.scrollIntoView();
  };

  return (
    <Sheet.Root
      open={open}
      onOpenChange={(next) => {
        if (next) {
          target.current = null;
          setItems(readHeadings());
        }
        setOpen(next);
      }}
      scrollLock="class"
    >
      <Sheet.Trigger asChild>
        <Button variant="outlined" size="sm" trailingIcon={<ChevronDown size={14} aria-hidden="true" />} className="docs-toc-mobile">
          On this page
        </Button>
      </Sheet.Trigger>
      <Sheet.Portal>
        <Sheet.Overlay />
        <Sheet.Content
          side="bottom"
          className="max-h-[80dvh] overflow-y-auto pb-[env(safe-area-inset-bottom)]"
          // Closed by picking a heading: focus goes there, not back to the button.
          onCloseAutoFocus={(e) => {
            if (!target.current) return;
            e.preventDefault();
            go();
          }}
        >
          <Sheet.Header className="pb-2">
            <Sheet.Title>On this page</Sheet.Title>
          </Sheet.Header>
          {items.length === 0 ? (
            <Text size="body-sm" tone="muted" className="px-6 pb-6">
              This page has no sections.
            </Text>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-0.5 px-6 pb-6">
              {items.map((it) => (
                <li key={it.id}>
                  <Link
                    href={`#${it.id}`}
                    variant="muted"
                    aria-current={active === it.id ? 'location' : undefined}
                    className={'rounded-none ' + tocLinkClass(it.level, active === it.id) + ' py-2'}
                    onClick={(e) => {
                      e.preventDefault();
                      target.current = it.id;
                      setOpen(false);
                    }}
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Sheet.Content>
      </Sheet.Portal>
    </Sheet.Root>
  );
}

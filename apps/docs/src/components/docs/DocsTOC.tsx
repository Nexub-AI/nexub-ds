'use client';

import * as React from 'react';
import { Link, Text } from '@nexub/react';
import { tocLinkClass, useActiveHeading, type TocItem } from './useToc';

export type { TocItem };

interface Props {
  items: TocItem[];
}

/** The desktop "On this page" rail. Phones get the same list in a sheet (MobileTOC). */
export function DocsTOC({ items }: Props) {
  const active = useActiveHeading(items);

  if (!items.length) return null;

  return (
    <nav className="docs-toc" aria-label="On this page">
      <Text size="label" weight="semibold" tone="muted" className="mb-2 uppercase tracking-wider">
        On this page
      </Text>
      <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
        {items.map((it) => (
          <li key={it.id}>
            <Link
              href={`#${it.id}`}
              variant="muted"
              aria-current={active === it.id ? 'location' : undefined}
              className={'rounded-none ' + tocLinkClass(it.level, active === it.id)}
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

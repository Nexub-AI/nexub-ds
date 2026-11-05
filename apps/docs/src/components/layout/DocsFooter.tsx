import Link from 'next/link';
import { Text } from '@nexub/react';
import { DS_VERSION } from '../docs/VersionBadge';

// Formatted in Asia/Singapore (not the visitor's zone) so server and client
// render the same string. NEXT_PUBLIC_BUILD_TIME is set once in next.config.mjs.
const built = new Date(process.env.NEXT_PUBLIC_BUILD_TIME ?? Date.now());
const updated = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Singapore',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
}).format(built);

const year = built.getFullYear();
const linkClass = 'font-medium text-[var(--color-primary)] no-underline hover:underline';

/** The site footer, shared by the landing page and every docs page. */
export function DocsFooter() {
  return (
    <footer className="border-t border-[var(--color-outline-variant)] px-6 py-6 text-center">
      <Text size="caption" tone="muted">
        v{DS_VERSION} · Updated {updated} SGT ·{' '}
        <Link href="/changelog" className={linkClass}>
          Changelog
        </Link>{' '}
        ·{' '}
        <a href="https://github.com/Nexub-AI/nexub-ds" target="_blank" rel="noopener noreferrer" className={linkClass}>
          GitHub
        </a>
      </Text>
      <Text size="caption" tone="muted" className="mt-1">
        Built with the Nexub Design System · © {year} Nexub Pte. Ltd., Singapore · Crafted by{' '}
        <a href="https://github.com/sasinex" target="_blank" rel="noopener noreferrer" className={linkClass}>
          Sasidharan
        </a>
      </Text>
    </footer>
  );
}

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
const REPO = 'https://github.com/Nexub-AI/nexub-ds';
const linkClass = 'font-medium text-[var(--color-primary)] no-underline hover:underline';

// Brand marks inline: @nexub/icons (Lucide) ships no brand logos.
const SOCIALS = [
  {
    label: 'Nexub on LinkedIn',
    href: 'https://www.linkedin.com/company/nexub/',
    icon: (
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
      />
    ),
  },
  {
    label: 'Nexub on Instagram',
    href: 'https://www.instagram.com/nexubhq/',
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5.5" />
        <circle cx="12" cy="12" r="4.25" />
        <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  {
    label: 'Nexub on X',
    href: 'https://x.com/nexubHQ',
    icon: (
      <path
        fill="currentColor"
        d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zM17.61 20.64h2.04L6.49 3.24H4.3l13.31 17.4z"
      />
    ),
  },
];

/** The site footer, shared by the landing page and every docs page. */
export function DocsFooter() {
  return (
    <footer className="border-t border-[var(--color-outline-variant)] px-6 py-6 text-center">
      <Text size="caption" tone="muted">
        Open source under the{' '}
        <a href={`${REPO}/blob/development/LICENSE`} target="_blank" rel="noopener noreferrer" className={linkClass}>
          MIT license
        </a>{' '}
        ·{' '}
        <a href={REPO} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <span aria-hidden="true">★ </span>Star on GitHub
        </a>{' '}
        ·{' '}
        <a href={`${REPO}/blob/development/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Contribute
        </a>
      </Text>
      <Text size="caption" tone="muted" className="mt-1">
        v{DS_VERSION} · Updated {updated} SGT ·{' '}
        <Link href="/changelog" target="_blank" rel="noopener noreferrer" className={linkClass}>
          Changelog
        </Link>
      </Text>
      <Text size="caption" tone="muted" className="mt-1">
        Built with the Nexub Design System · © {year} Nexub Pte. Ltd., Singapore · Crafted by{' '}
        <a href="https://www.linkedin.com/in/startupwithsasi/" target="_blank" rel="noopener noreferrer" className={linkClass}>
          Sasidharan
        </a>
      </Text>
      <nav aria-label="Nexub on social media" className="mt-3 flex justify-center gap-1">
        {SOCIALS.map((s) => (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            title={s.label}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-on-surface-muted)] transition-colors hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-on-surface)]"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              {s.icon}
            </svg>
          </a>
        ))}
      </nav>
    </footer>
  );
}

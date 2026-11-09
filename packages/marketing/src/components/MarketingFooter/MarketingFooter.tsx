import * as React from 'react';
import { cn } from '@nexub/react/cn';
import { safeHref } from '@nexub/react/safeHref';
import { Container } from '@nexub/react/Container';
import { Marquee } from '@nexub/react/Motion';

export interface MarketingFooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface MarketingFooterProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  /** A line under the logo. */
  tagline?: React.ReactNode;
  columns: MarketingFooterColumn[];
  /** Tools or integrations scrolling in a strip above the columns. */
  tools?: React.ReactNode[];
  /** @default 'Works with' */
  toolsLabel?: string;
  /** Copyright and legal links. */
  bottom?: React.ReactNode;
}

/** The site footer: tools strip, logo, link columns and the legal line. Server component. */
export const MarketingFooter = React.forwardRef<HTMLElement, MarketingFooterProps>(
  ({ logo, tagline, columns, tools, toolsLabel = 'Works with', bottom, className, ...props }, ref) => (
    <footer ref={ref} className={cn('border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]', className)} {...props}>
      {tools && tools.length > 0 && (
        <div className="border-b border-[var(--color-outline-variant)] py-6">
          <Container size="marketing" className="flex flex-col items-center gap-4 sm:flex-row">
            <p className="m-0 shrink-0 text-label-lg text-[var(--color-on-surface-muted)]">{toolsLabel}</p>
            <Marquee speed="slow" className="w-full" rowClassName="items-center gap-10 pe-10">
              {tools.map((tool, i) => (
                <span key={i} className="inline-flex items-center text-label-lg text-[var(--color-on-surface-variant)]">
                  {tool}
                </span>
              ))}
            </Marquee>
          </Container>
        </div>
      )}
      <Container size="marketing" className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(auto-fit,minmax(9rem,1fr))]">
        {(logo || tagline) && (
          <div className="flex flex-col gap-3">
            {logo}
            {tagline && <p className="m-0 max-w-xs text-body-md text-[var(--color-on-surface-variant)]">{tagline}</p>}
          </div>
        )}
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
            <h2 className="m-0 text-title-sm text-[var(--color-on-surface)]">{col.title}</h2>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {col.links.map((link) => (
                <li key={link.href}>
                  <a href={safeHref(link.href)} className="text-body-md text-[var(--color-on-surface-variant)] no-underline hover:text-[var(--color-on-surface)] hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      {bottom && (
        <div className="border-t border-[var(--color-outline-variant)] py-6">
          <Container size="marketing" className="text-body-sm text-[var(--color-on-surface-muted)]">
            {bottom}
          </Container>
        </div>
      )}
    </footer>
  ),
);
MarketingFooter.displayName = 'MarketingFooter';

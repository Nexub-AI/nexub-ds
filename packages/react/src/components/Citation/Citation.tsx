import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { HoverCard } from '../HoverCard/HoverCard.js';

export interface CitationSource {
  title: string;
  url: string;
  /** Shown instead of the URL's hostname. */
  domain?: string;
  snippet?: string;
  /** Favicon URL (http/https only; anything else falls back to a letter). */
  favicon?: string;
}

export interface CitationMessages {
  /** SourceList heading. */
  sources: string;
  /** Prefix of a citation's accessible name ("Source 1: <title>"). */
  source: (index: number) => string;
}

const fallbackMessages: CitationMessages = {
  sources: 'Sources',
  source: (index) => `Source ${index}`,
};

// Local English fallbacks until NexubMessages carries these keys; provider wins, then props.
function useCitationMessages(overrides?: Partial<CitationMessages>): CitationMessages {
  const provided = useNexubMessages() as unknown as Partial<CitationMessages>;
  return { ...fallbackMessages, sources: provided.sources ?? fallbackMessages.sources, source: provided.source ?? fallbackMessages.source, ...overrides };
}

/** Returns the normalised href for http(s) URLs, otherwise undefined (javascript:, data:, relative…). */
export function safeUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : undefined;
  } catch {
    return undefined;
  }
}

function sourceDomain(source: CitationSource): string {
  if (source.domain) return source.domain;
  const href = safeUrl(source.url);
  return href ? new URL(href).hostname.replace(/^www\./, '') : '';
}

/** Favicon, or the domain's first letter when there is none / it fails to load. */
function Favicon({ source, className }: { source: CitationSource; className?: string }) {
  const src = safeUrl(source.favicon);
  const [failed, setFailed] = React.useState(false);
  const base = cn('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full', className);
  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn(base, 'object-cover')}
      />
    );
  }
  const letter = (sourceDomain(source) || source.title).charAt(0).toUpperCase();
  return (
    <span aria-hidden="true" className={cn(base, 'bg-[var(--color-surface-container-high)] text-label-sm text-[var(--color-on-surface-variant)]')}>
      {letter}
    </span>
  );
}

const linkProps = { target: '_blank', rel: 'noopener noreferrer' } as const;

// ─── Citation ────────────────────────────────────────────────────────────────

export interface CitationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** 1-based number shown in the marker. */
  index: number;
  source: CitationSource;
  messages?: Partial<CitationMessages>;
}

/**
 * Inline numbered source marker for running text. Links to the source (http/https
 * only — anything else renders as plain text) and previews it in a HoverCard on
 * hover or focus.
 */
export const Citation = React.forwardRef<HTMLElement, CitationProps>(
  ({ index, source, messages, className, ...props }, ref) => {
    const m = useCitationMessages(messages);
    const href = safeUrl(source.url);
    const label = `${m.source(index)}: ${source.title}`;
    const domain = sourceDomain(source);
    const marker = cn(
      'mx-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-shape-control px-1.5 align-middle',
      'bg-[var(--color-secondary-container)] text-label-sm leading-none text-[var(--color-on-secondary-container)] no-underline',
      href && 'nx-state-layer',
      className,
    );

    return (
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          {href ? (
            <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...linkProps} aria-label={label} className={marker} {...props}>
              {index}
            </a>
          ) : (
            <span ref={ref as React.Ref<HTMLSpanElement>} className={marker} {...props}>
              <span aria-hidden="true">{index}</span>
              <span className="sr-only">{label}</span>
            </span>
          )}
        </HoverCard.Trigger>
        <HoverCard.Content className="w-72">
          <div className="flex items-center gap-2">
            <Favicon source={source} className="h-4 w-4" />
            <span className="min-w-0 truncate text-label-sm text-[var(--color-on-surface-muted)]">{domain}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-title-sm text-[var(--color-on-surface)]">{source.title}</p>
          {source.snippet && (
            <p className="mt-1 line-clamp-3 text-body-sm text-[var(--color-on-surface-variant)]">{source.snippet}</p>
          )}
        </HoverCard.Content>
      </HoverCard.Root>
    );
  },
);
Citation.displayName = 'Citation';

// ─── SourceChip ──────────────────────────────────────────────────────────────

export interface SourceChipProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  source: CitationSource;
}

/** Compact source row item: favicon, domain and a truncated title, linking to the source. */
export const SourceChip = React.forwardRef<HTMLElement, SourceChipProps>(
  ({ source, className, ...props }, ref) => {
    const href = safeUrl(source.url);
    const cls = cn(
      'inline-flex h-9 max-w-[16rem] items-center gap-2 rounded-shape-control border border-[var(--color-outline-variant)] px-3',
      'bg-[var(--color-surface-container-low)] text-label-md text-[var(--color-on-surface)] no-underline',
      href && 'nx-state-layer',
      className,
    );
    const content = (
      <>
        <Favicon source={source} className="h-4 w-4" />
        <span className="shrink-0 text-[var(--color-on-surface-muted)]">{sourceDomain(source)}</span>
        <span className="min-w-0 truncate">{source.title}</span>
      </>
    );
    return href ? (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...linkProps} className={cls} {...props}>
        {content}
      </a>
    ) : (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={cls} {...props}>
        {content}
      </span>
    );
  },
);
SourceChip.displayName = 'SourceChip';

// ─── SourceList ──────────────────────────────────────────────────────────────

export interface SourceListProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  sources: CitationSource[];
  messages?: Partial<CitationMessages>;
}

/**
 * "Sources" heading plus a row of SourceChips: a horizontal scroll-snap row when
 * narrow, a wrapping grid once its own container is 480px or wider.
 */
export const SourceList = React.forwardRef<HTMLElement, SourceListProps>(
  ({ sources, messages, className, ...props }, ref) => {
    const m = useCitationMessages(messages);
    const id = React.useId();
    return (
      <section ref={ref} aria-labelledby={id} className={cn('[container-type:inline-size]', className)} {...props}>
        <p id={id} className="mb-2 text-label-md text-[var(--color-on-surface-variant)]">
          {m.sources}
        </p>
        <ul
          className={cn(
            'flex snap-x snap-mandatory scroll-px-1 gap-2 overflow-x-auto p-1',
            '[@container(min-width:480px)]:flex-wrap [@container(min-width:480px)]:overflow-x-visible',
          )}
        >
          {sources.map((s, i) => (
            <li key={`${i}-${s.url}`} className="shrink-0 snap-start">
              <SourceChip source={s} />
            </li>
          ))}
        </ul>
      </section>
    );
  },
);
SourceList.displayName = 'SourceList';

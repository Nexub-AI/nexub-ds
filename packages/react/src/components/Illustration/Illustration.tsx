import * as React from 'react';
import { cn } from '../../utils/cn.js';

export type IllustrationKind = 'noData' | 'noResults' | 'noAccess' | 'serverError' | 'offline' | 'notFound' | 'maintenance';

export interface IllustrationProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'> {
  /** Which drawing: one per EmptyState preset, plus notFound and maintenance for full pages. */
  kind: IllustrationKind;
  /** 80, 120 or 160 CSS px wide (5:4). @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Names the drawing (`role="img"`). Without it the drawing is decorative. */
  title?: string;
}

// Colours are roles only, so the drawings follow the theme, dark mode and the product accent.
// Under forced colours the roles may collapse into the page colour: system colours keep every
// shape visible there.
const soft = 'fill-[var(--color-surface-container-high)] forced-colors:fill-[Canvas]';
const shape = 'fill-[var(--color-surface-container-highest)] stroke-[var(--color-outline)] forced-colors:fill-[Canvas] forced-colors:stroke-[CanvasText]';
const line = 'stroke-[var(--color-outline)] forced-colors:stroke-[CanvasText]';
const accent = 'fill-[var(--color-spot-container,var(--color-primary-container))] forced-colors:fill-[Canvas] forced-colors:stroke-[CanvasText]';
const detail = 'stroke-[var(--color-spot,var(--color-primary))] forced-colors:stroke-[CanvasText]';
const dot = 'fill-[var(--color-spot,var(--color-primary))] forced-colors:fill-[CanvasText]';

const backdrop = <ellipse cx="60" cy="50" rx="46" ry="38" className={soft} />;

const art: Record<IllustrationKind, React.ReactNode> = {
  // A sheet in an empty tray.
  noData: (
    <>
      {backdrop}
      <rect x="47" y="10" width="26" height="30" rx="3" className={accent} />
      <path d="M53 17h14M53 23h9" className={detail} />
      <path d="M30 52l10-22h40l10 22v20a4 4 0 0 1-4 4H34a4 4 0 0 1-4-4z" className={shape} />
      <path d="M30 52h18a12 12 0 0 0 24 0h18" className={line} />
    </>
  ),
  // A magnifier over two rows, finding nothing.
  noResults: (
    <>
      {backdrop}
      <rect x="24" y="30" width="40" height="8" rx="4" className={shape} />
      <rect x="24" y="48" width="28" height="8" rx="4" className={shape} />
      <circle cx="70" cy="46" r="17" className={cn(accent, detail)} />
      <path d="M82 58l12 12" strokeWidth="4" className={detail} />
      <path d="M64 40l12 12M76 40L64 52" className={detail} />
    </>
  ),
  // A closed lock.
  noAccess: (
    <>
      {backdrop}
      <path d="M48 44V34a12 12 0 0 1 24 0v10" strokeWidth="4" className={line} />
      <rect x="38" y="44" width="44" height="32" rx="6" className={accent} />
      <circle cx="60" cy="57" r="4" className={dot} />
      <path d="M60 60v7" className={detail} />
    </>
  ),
  // Two servers and a warning.
  serverError: (
    <>
      {backdrop}
      <rect x="28" y="22" width="60" height="20" rx="5" className={shape} />
      <rect x="28" y="48" width="60" height="20" rx="5" className={shape} />
      <path d="M48 32h18M48 58h12" className={line} />
      <circle cx="38" cy="32" r="2.5" className={dot} />
      <circle cx="38" cy="58" r="2.5" className={dot} />
      <circle cx="88" cy="68" r="13" className={accent} />
      <path d="M88 61v8" strokeWidth="3" className={detail} />
      <circle cx="88" cy="74.5" r="1.75" className={dot} />
    </>
  ),
  // A cloud that cannot connect.
  offline: (
    <>
      {backdrop}
      <path d="M40 64a14 14 0 0 1 2-28 20 20 0 0 1 38 4 12 12 0 0 1-2 24z" className={shape} />
      <circle cx="84" cy="66" r="13" className={accent} />
      <path d="M79 61l10 10M89 61L79 71" strokeWidth="3" className={detail} />
    </>
  ),
  // A page with a question mark.
  notFound: (
    <>
      {backdrop}
      <path d="M40 14h26l16 16v48a4 4 0 0 1-4 4H40a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z" className={shape} />
      <path d="M66 14v16h16" className={line} />
      <circle cx="59" cy="56" r="14" className={accent} />
      <path d="M54.5 52a5 5 0 1 1 7 4.5c-1.5 1-2 2-2 3.5" strokeWidth="3" className={detail} />
      <circle cx="59.5" cy="64.5" r="1.75" className={dot} />
    </>
  ),
  // A traffic cone.
  maintenance: (
    <>
      {backdrop}
      <path d="M46 72l10-50h8l10 50z" className={accent} />
      <path d="M53.5 40h13M50 56h20" strokeWidth="5" strokeLinecap="butt" className={detail} />
      <rect x="34" y="70" width="52" height="8" rx="4" className={shape} />
      <path d="M28 44l-7-2M30 33l-5-5M92 44l7-2M90 33l5-5" className={line} />
    </>
  ),
};

const sizes = { sm: 'h-16 w-20', md: 'h-24 w-[7.5rem]', lg: 'h-32 w-40' };

/**
 * A spot illustration for an empty, error or full-page state (10.5). Drawn in code with the
 * colour roles, so it needs no asset and follows the theme. Decorative unless given a `title`.
 */
export const Illustration = React.forwardRef<SVGSVGElement, IllustrationProps>(
  ({ kind, size = 'md', title, className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 120 96"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-nx="illustration"
      data-kind={kind}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
      // nx-illustration: EmptyState.Illustration leaves this svg at its own size.
      className={cn('nx-illustration shrink-0', sizes[size], className)}
      {...props}
    >
      {art[kind]}
    </svg>
  ),
);
Illustration.displayName = 'Illustration';

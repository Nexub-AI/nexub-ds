import * as React from 'react';
import { cn } from '@nexub/react/cn';
import { EyebrowChip } from '@nexub/react/EyebrowChip';

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** A string becomes a gradient EyebrowChip. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'center' | 'start';
  /** Heading level. @default 2 */
  level?: 2 | 3;
}

/** Eyebrow, headline and lead that open a section. Server component. */
export const SectionHeader = React.forwardRef<HTMLElement, SectionHeaderProps>(
  ({ eyebrow, title, description, align = 'center', level = 2, className, ...props }, ref) => {
    const H = `h${level}` as 'h2' | 'h3';
    return (
      <header
        ref={ref}
        className={cn('flex flex-col gap-4', align === 'center' ? 'mx-auto max-w-2xl items-center text-center' : 'max-w-2xl items-start', className)}
        {...props}
      >
        {eyebrow && (typeof eyebrow === 'string' ? <EyebrowChip variant="gradient" tone="info">{eyebrow}</EyebrowChip> : eyebrow)}
        <H className="m-0 text-balance font-display text-display-sm text-[var(--color-on-surface)] sm:text-display-md">{title}</H>
        {description && <p className="m-0 text-pretty text-body-lg text-[var(--color-on-surface-variant)]">{description}</p>}
      </header>
    );
  },
);
SectionHeader.displayName = 'SectionHeader';

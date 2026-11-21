import * as React from 'react';
import { cn } from '@nexub/react';

export interface AuthCardProps {
  logo?: React.ReactNode;
  title: string;
  /** 11.5: any content, e.g. the address the code went to in bold. */
  description?: React.ReactNode;
  /** 11.5: where the logo sits. @default 'center' */
  logoAlign?: 'start' | 'center';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({
  logo,
  title,
  description,
  logoAlign = 'center',
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[25rem] flex flex-col gap-6',
        className,
      )}
    >
      {logo && (
        <div className={cn('flex', logoAlign === 'start' ? 'justify-start' : 'justify-center')}>{logo}</div>
      )}

      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-headline-sm leading-8 font-bold tracking-tight text-[var(--color-on-surface)]">
          {title}
        </h1>
        {description && (
          <div className="text-body-sm text-[var(--color-on-surface-muted)]">{description}</div>
        )}
      </div>

      <div className="rounded-shape-container border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] bg-[var(--color-surface-elevated)] shadow-elevation-1 p-6 flex flex-col gap-4">
        {children}
      </div>

      {footer && (
        <div className="flex flex-col items-center gap-2 text-body-sm text-[var(--color-on-surface-muted)]">
          {footer}
        </div>
      )}
    </div>
  );
}

AuthCard.displayName = 'AuthCard';

import * as React from 'react';
import { cn } from '@nexub/react';

export interface AuthCardProps {
  logo?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({
  logo,
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[400px] flex flex-col gap-6',
        className,
      )}
    >
      {logo && (
        <div className="flex justify-center">{logo}</div>
      )}

      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-on-surface)]">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[var(--color-on-surface-muted)]">{description}</p>
        )}
      </div>

      <div className="rounded-shape-container border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] bg-[var(--color-surface-elevated)] shadow-elevation-1 p-6 flex flex-col gap-4">
        {children}
      </div>

      {footer && (
        <div className="flex flex-col items-center gap-2 text-sm text-[var(--color-on-surface-muted)]">
          {footer}
        </div>
      )}
    </div>
  );
}

AuthCard.displayName = 'AuthCard';

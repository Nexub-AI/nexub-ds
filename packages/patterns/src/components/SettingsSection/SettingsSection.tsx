import * as React from 'react';
import { cn } from '@nexub/react';

export interface SettingsSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const SettingsSection = React.forwardRef<HTMLDivElement, SettingsSectionProps>(
  ({ title, description, actions, children, className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-8', className)} {...props}>
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <div className="md:w-1/3 flex flex-col gap-1">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h2>
          {description && (
            <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {children}
          {actions && <div className="flex justify-end gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  ),
);

SettingsSection.displayName = 'SettingsSection';

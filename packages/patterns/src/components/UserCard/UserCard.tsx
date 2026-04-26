import * as React from 'react';
import { cn, Avatar } from '@nexub/react';

export interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role?: string;
  email?: string;
  avatarSrc?: string;
  avatarFallback?: string;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const UserCard = React.forwardRef<HTMLDivElement, UserCardProps>(
  (
    {
      name,
      role,
      email,
      avatarSrc,
      avatarFallback,
      actions,
      size = 'md',
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] p-4',
          className,
        )}
        {...props}
      >
        <Avatar
          size={size}
          src={avatarSrc}
          name={name}
          fallback={avatarFallback}
        />

        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
            {name}
          </span>
          {role && (
            <span className="text-xs text-[var(--color-text-muted)] truncate">{role}</span>
          )}
          {email && (
            <span className="text-xs text-[var(--color-text-secondary)] truncate">{email}</span>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    );
  },
);

UserCard.displayName = 'UserCard';

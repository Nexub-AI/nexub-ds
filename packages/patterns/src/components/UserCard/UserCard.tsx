import * as React from 'react';
import { cn, Avatar, Skeleton } from '@nexub/react';

const avatarBox = { sm: 'size-8', md: 'size-10', lg: 'size-12' };

export interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role?: string;
  email?: string;
  avatarSrc?: string;
  avatarFallback?: string;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** 10.5: skeletons in place of the avatar and text; the card keeps its size. */
  loading?: boolean;
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
      loading = false,
      className,
      ...props
    },
    ref,
  ) => {
    if (loading)
      return (
        <div
          ref={ref}
          aria-busy="true"
          className={cn(
            'flex items-center gap-3 rounded-shape-container border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] bg-[var(--color-surface-elevated)] p-4',
            className,
          )}
          {...props}
        >
          <Skeleton shape="circle" className={cn('shrink-0', avatarBox[size])} />
          <div aria-hidden="true" className="flex min-w-0 flex-1 flex-col gap-0.5">
            <Skeleton className="my-0.5 h-4 w-32 max-w-full" />
            {role && <Skeleton className="my-0.5 h-3 w-24 max-w-full" />}
            {email && <Skeleton className="my-0.5 h-3 w-40 max-w-full" />}
          </div>
        </div>
      );
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 rounded-shape-container border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] bg-[var(--color-surface-elevated)] p-4',
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
          <span className="text-body-sm font-semibold text-[var(--color-on-surface)] truncate">
            {name}
          </span>
          {role && (
            <span className="text-label-sm font-normal text-[var(--color-on-surface-muted)] truncate">{role}</span>
          )}
          {email && (
            <span className="text-label-sm font-normal text-[var(--color-on-surface-variant)] truncate">{email}</span>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    );
  },
);

UserCard.displayName = 'UserCard';

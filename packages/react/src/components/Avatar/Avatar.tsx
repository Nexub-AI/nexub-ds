import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

export const avatarVariants = cva(
  'relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-muted)] font-medium select-none',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const badgeSizeMap: Record<string, string> = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0] ?? '';
  if (parts.length === 1) return first.charAt(0).toUpperCase();
  const last = parts[parts.length - 1] ?? '';
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  name?: string;
  fallback?: React.ReactNode;
  badge?: boolean;
  badgeColor?: string;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      className,
      size = 'md',
      src,
      name,
      fallback,
      badge,
      badgeColor,
      ...props
    },
    ref,
  ) => {
    const [imgError, setImgError] = React.useState(false);

    const showImage = Boolean(src) && !imgError;
    const initials = name ? getInitials(name) : null;

    return (
      <span
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        aria-label={name ?? undefined}
        role="img"
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={name ?? ''}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : initials ? (
          <span aria-hidden="true">{initials}</span>
        ) : fallback ? (
          fallback
        ) : (
          /* Generic user icon */
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-[55%] w-[55%]"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        )}

        {badge && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full ring-2 ring-[var(--color-surface)]',
              badgeSizeMap[size ?? 'md'],
              badgeColor ?? 'bg-[var(--color-success)]',
            )}
            aria-hidden="true"
          />
        )}
      </span>
    );
  },
);

Avatar.displayName = 'Avatar';

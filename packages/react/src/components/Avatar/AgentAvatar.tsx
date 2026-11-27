'use client';

import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { CategoryColor } from '@nexub/core';
import { cn } from '../../utils/cn.js';
import { safeSrc } from '../../utils/safeHref.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { avatarVariants } from './Avatar.js';

type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>['size']>;

// The AI mark: a sparkle on the primary colour with a surface ring, scaled per Avatar size.
const markSizes: Record<AvatarSize, string> = {
  xs: 'h-2.5 w-2.5 -bottom-0.5 -end-0.5 ring-2',
  sm: 'h-3 w-3 -bottom-0.5 -end-0.5 ring-2',
  md: 'h-3.5 w-3.5 -bottom-0.5 -end-0.5 ring-2',
  lg: 'h-4 w-4 -bottom-1 -end-1 ring-2',
  xl: 'h-5 w-5 -bottom-1 -end-1 ring-2',
};

export interface AgentAvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof avatarVariants> {
  /** The app's glyph, drawn inside the tile (e.g. an `@nexub/icons` icon). */
  icon?: React.ReactNode;
  /** An image for the tile instead of `icon` (e.g. an `@nexub/brand` app tile). Falls back to `icon` if it fails. */
  src?: string;
  /** Who the agent is ("Payhub agent"). Read as "Payhub agent, AI agent" (`messages.aiAgent`). */
  name?: string;
  /** A category colour for the tile. Default: the brand tile look, primary glyph on a surface tile. */
  category?: CategoryColor;
}

/**
 * 12.2: an AI agent's avatar. A rounded-square app tile (like the `@nexub/brand`
 * tiles) with a small sparkle in the bottom inline-end corner, so an agent never
 * looks like a colleague. Same sizes as `Avatar`.
 */
export const AgentAvatar = React.forwardRef<HTMLSpanElement, AgentAvatarProps>(
  ({ className, size = 'md', icon, src: srcProp, name, category, ...props }, ref) => {
    const src = safeSrc(srcProp);
    const [failedSrc, setFailedSrc] = React.useState<string>();
    const messages = useNexubMessages();
    const showImage = Boolean(src) && failedSrc !== src;
    const s: AvatarSize = size ?? 'md';

    return (
      <span
        ref={ref}
        role="img"
        aria-label={messages.aiAgent(name ?? '')}
        data-category={category}
        className={cn(
          avatarVariants({ size: s }),
          'overflow-visible [--avatar-radius:22.5%] [--avatar-fg:var(--color-primary)]',
          category && 'bg-[var(--nx-cat-container)] text-[var(--nx-on-cat-container)]',
          className,
        )}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt=""
            className="h-full w-full rounded-[inherit] object-cover"
            onError={() => setFailedSrc(src)}
          />
        ) : (
          <span aria-hidden="true" className="inline-flex h-[60%] w-[60%] items-center justify-center [&>svg]:h-full [&>svg]:w-full">
            {icon ?? (
              // Default glyph: a bot.
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8M2 14h2M20 14h2M15 13v2M9 13v2" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
              </svg>
            )}
          </span>
        )}
        <span
          data-agent-mark=""
          aria-hidden="true"
          className={cn(
            'absolute inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] ring-[var(--color-surface)]',
            markSizes[s],
          )}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-[72%] w-[72%]">
            <path d="M12 3c.7 5 4 8.3 9 9-5 .7-8.3 4-9 9-.7-5-4-8.3-9-9 5-.7 8.3-4 9-9z" />
          </svg>
        </span>
      </span>
    );
  },
);

AgentAvatar.displayName = 'AgentAvatar';

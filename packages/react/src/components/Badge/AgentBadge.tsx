import * as React from 'react';
import { Sparkles } from '@nexub/icons';
import { Badge, type BadgeProps } from './Badge.js';

const iconSizes = { sm: 12, md: 14, lg: 16 } as const;

export interface AgentBadgeProps extends Omit<BadgeProps, 'variant' | 'leadingIcon' | 'dot' | 'count' | 'max'> {
  /** The leading icon. Default: a sparkle. */
  icon?: React.ReactNode;
}

/**
 * 12.2: a label for an AI agent's chat header ("AI on your own key", "Buttons only").
 * A `Badge variant="soft"` with a leading sparkle; takes Badge's `tone`, `category` and `size`.
 */
export const AgentBadge = React.forwardRef<HTMLSpanElement, AgentBadgeProps>(({ icon, size, ...props }, ref) => (
  <Badge
    ref={ref}
    variant="soft"
    size={size}
    leadingIcon={icon ?? <Sparkles size={iconSizes[size ?? 'md']} />}
    {...props}
  />
));

AgentBadge.displayName = 'AgentBadge';

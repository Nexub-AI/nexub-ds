import { Badge, type BadgeProps } from '@nexub/react';
import type { ComponentStatus } from '@/registry/types';

/** Lifecycle status (GOVERNANCE.md → "Status lifecycle") as a Badge. */
const STATUS: Record<ComponentStatus, { label: string; tone: BadgeProps['tone']; variant: BadgeProps['variant'] }> = {
  alpha: { label: 'Alpha', tone: 'warning', variant: 'outline' },
  beta: { label: 'Beta', tone: 'warning', variant: 'soft' },
  stable: { label: 'Stable', tone: 'success', variant: 'soft' },
  deprecated: { label: 'Deprecated', tone: 'danger', variant: 'soft' },
};

export function StatusBadge({ status, size, className }: { status: ComponentStatus; size?: BadgeProps['size']; className?: string }) {
  const { label, tone, variant } = STATUS[status];
  return (
    <Badge tone={tone} variant={variant} size={size} className={className}>
      {label}
    </Badge>
  );
}

import { forwardRef, type FC, type SVGProps } from 'react';
import { type LucideIcon } from 'lucide-react';
import type { IconProps } from './Icon.js';

const SIZE_MAP = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

const TONE_MAP = {
  current: 'currentColor',
  muted: 'var(--color-text-muted)',
  primary: 'var(--color-text-primary)',
  accent: 'var(--color-accent-500)',
  success: 'var(--color-semantic-success-default)',
  danger: 'var(--color-semantic-error-default)',
  warning: 'var(--color-semantic-warning-default)',
  info: 'var(--color-semantic-info-default)',
} as const;

// Accepts both Lucide icons and custom SVG forwardRef components
export type IconComponent =
  | LucideIcon
  | FC<SVGProps<SVGSVGElement> & { width?: number; height?: number; strokeWidth?: number }>;

export { type LucideIcon };

export function createIcon(Component: IconComponent, displayName: string): FC<IconProps> {
  const NexubIcon = forwardRef<SVGSVGElement, IconProps>(function NexubIcon(
    { size = 'md', strokeWidth = 1.75, tone = 'current', label, className, ...rest },
    ref,
  ) {
    const resolvedSize = typeof size === 'number' ? size : (SIZE_MAP[size] ?? 20);
    const resolvedColor = TONE_MAP[tone] ?? 'currentColor';

    const a11yProps = label
      ? { role: 'img' as const, 'aria-label': label }
      : { 'aria-hidden': true as const };

    const Comp = Component as FC<Record<string, unknown>>;
    return (
      <Comp
        ref={ref}
        width={resolvedSize}
        height={resolvedSize}
        strokeWidth={strokeWidth}
        color={resolvedColor}
        className={className}
        {...a11yProps}
        {...rest}
      />
    );
  });

  NexubIcon.displayName = displayName;
  return NexubIcon as FC<IconProps>;
}

// Shared look for RadioCard and CheckboxCard. The card root is the Radix
// control (button), so it carries data-state / data-disabled; everything
// inside reacts through `group-data-*`. Static strings so Tailwind's JIT sees them.
import * as React from 'react';
import { Check } from '@nexub/icons';
import { cn } from '../../utils/cn.js';

export interface SelectableCardContentProps {
  /** Leading icon. */
  icon?: React.ReactNode;
  /** The card's accessible name. */
  title: React.ReactNode;
  /** Secondary text, exposed as the accessible description. */
  description?: React.ReactNode;
  /** Extra content under the description. Keep it non-interactive: the whole card is the control. */
  children?: React.ReactNode;
}

/** Card surface + selected state (2px primary edge: 1px border + 1px inset, no layout shift). */
export const selectableCardClass = [
  'group nx-state-layer flex w-full items-start gap-3 p-4 text-left',
  'rounded-shape-container bg-[var(--color-surface-elevated)] text-[var(--color-on-surface)]',
  'border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)]',
  'cursor-pointer transition-[border-color,box-shadow] duration-effects-fast ease-effects-fast',
  'data-[state=checked]:border-[var(--color-primary)] data-[state=checked]:shadow-[inset_0_0_0_1px_var(--color-primary)]',
  'data-[disabled]:cursor-not-allowed data-[disabled]:text-[var(--color-text-disabled)]',
  'data-[disabled]:data-[state=checked]:border-[var(--color-text-disabled)] data-[disabled]:data-[state=checked]:shadow-[inset_0_0_0_1px_var(--color-text-disabled)]',
].join(' ');

const slotShape = {
  circle: 'rounded-full',
  square: 'rounded-shape-min',
} as const;

export function SelectableCardContent({
  icon,
  title,
  description,
  children,
  titleId,
  descriptionId,
  shape,
}: SelectableCardContentProps & {
  titleId: string;
  descriptionId: string;
  shape: keyof typeof slotShape;
}) {
  return (
    <>
      {icon != null && (
        <span
          aria-hidden
          className="flex shrink-0 text-[var(--color-on-surface-variant)] group-data-[state=checked]:text-[var(--color-primary)] group-data-[disabled]:text-[var(--color-text-disabled)]"
        >
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span id={titleId} className="text-sm font-medium">
          {title}
        </span>
        {description != null && (
          <span
            id={descriptionId}
            className="text-sm text-[var(--color-on-surface-variant)] group-data-[disabled]:text-[var(--color-text-disabled)]"
          >
            {description}
          </span>
        )}
        {children}
      </span>
      {/* Badge slot: an empty outline reads as radio/checkbox; the check springs in on select. */}
      <span
        aria-hidden
        className={cn(
          'relative h-5 w-5 shrink-0 border border-[var(--color-outline-variant)]',
          slotShape[shape],
        )}
      >
        <span
          className={cn(
            'absolute -inset-px flex items-center justify-center rounded-[inherit]',
            'bg-[var(--color-primary)] text-[var(--color-on-primary)] group-data-[disabled]:bg-[var(--color-text-disabled)] group-data-[disabled]:text-[var(--color-surface)]',
            // Exit: fade on effects-fast; scale resets only after the fade.
            'scale-0 opacity-0 [transition:opacity_var(--motion-spring-effects-fast-duration)_var(--motion-spring-effects-fast-easing),transform_0s_linear_var(--motion-spring-effects-fast-duration)]',
            // Enter: scale 0 -> 1 on the expressive spring, opacity on effects.
            'group-data-[state=checked]:scale-100 group-data-[state=checked]:opacity-100 group-data-[state=checked]:[transition:transform_var(--motion-spring-expressive-fast-duration)_var(--motion-spring-expressive-fast-easing),opacity_var(--motion-spring-effects-fast-duration)_var(--motion-spring-effects-fast-easing)]',
            // Reduced motion: crossfade only.
            'motion-reduce:scale-100',
          )}
        >
          <Check size="xs" />
        </span>
      </span>
    </>
  );
}

/** Ids for aria-labelledby / aria-describedby. */
export function useCardIds(hasDescription: boolean) {
  const id = React.useId();
  return {
    titleId: `${id}-title`,
    descriptionId: `${id}-desc`,
    describedBy: hasDescription ? `${id}-desc` : undefined,
  };
}

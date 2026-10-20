import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import { glassSurfaceClass } from '../../utils/glass.js';
import type { ToneValue } from '../Button/Button.js';
import { usePointerSheen } from '../../hooks/usePointerSheen.js';

export const cardVariants = cva(
  // In-flow content: tone + a soft alpha hairline, no shadow (shadows are for floating layers).
  // A CardLink inside stretches over the card; the card then carries its focus ring.
  'rounded-shape-container bg-[var(--color-surface-elevated)] border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] text-[var(--color-on-surface)] has-[[data-card-link]]:relative has-[[data-card-link]:focus-visible]:outline has-[[data-card-link]:focus-visible]:outline-[3px] has-[[data-card-link]:focus-visible]:outline-offset-2 has-[[data-card-link]:focus-visible]:outline-[var(--color-primary)]',
  {
    variants: {
      variant: {
        flat: '',
        surface: 'bg-[var(--color-surface-elevated)] shadow-elevation-1',
        // Lift on hover (spring, elevation 1 → 2), sink on press, state layer
        // tint; see .nx-lift in themes/base.css.
        interactive:
          'nx-state-layer nx-lift cursor-pointer bg-[var(--color-surface-elevated)] shadow-elevation-1',
      },
      // Material. 'glass' needs data-material="glass" on the element (set in the
      // component) for the --glass-* vars to resolve. Single box-shadow carries
      // both the inset specular highlight and the drop shadow so neither clobbers
      // the other. Listed after `variant` so tailwind-merge lets it win on bg/border.
      surface: {
        solid: '',
        glass: glassSurfaceClass,
      },
    },
    defaultVariants: {
      variant: 'flat',
      surface: 'solid',
    },
  },
);

const toneBorderMap: Record<ToneValue, string> = {
  neutral: '',
  info: 'border-s-4 border-s-[var(--color-info)]',
  success: 'border-s-4 border-s-[var(--color-success)]',
  warning: 'border-s-4 border-s-[var(--color-warning)]',
  danger: 'border-s-4 border-s-[var(--color-error)]',
  leap: 'border-s-4 border-s-[var(--color-leap)]',
  bookub: 'border-s-4 border-s-[var(--color-bookub)]',
  payub: 'border-s-4 border-s-[var(--color-payub)]',
  founderub: 'border-s-4 border-s-[var(--color-founderub)]',
};

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  tone?: ToneValue;
  surface?: 'solid' | 'glass';
  /** `sheen`: a soft light follows the pointer (opt-in; off for touch and reduced motion). */
  effect?: 'none' | 'sheen';
  asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = 'flat', surface = 'solid', effect = 'none', tone, asChild = false, onPointerMove, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'div';
    const toneStyle = tone ? toneBorderMap[tone] : '';
    const sheen = effect === 'sheen';
    const handlePointerMove = usePointerSheen<HTMLDivElement>(sheen, onPointerMove);

    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ variant, surface }), toneStyle, sheen && 'nx-sheen', className)}
        onPointerMove={handlePointerMove}
        data-tone={tone}
        data-material={surface === 'glass' ? 'glass' : undefined}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Card.displayName = 'Card';

export interface CardLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

/**
 * Makes the whole card one link (the "stretched link" pattern): put it around
 * the card's title. Its ::after covers the card, so the link has one
 * accessible name and the focus ring shows on the card. Give other
 * interactive elements inside the card `relative z-[1]` to keep them clickable.
 */
export const CardLink = React.forwardRef<HTMLAnchorElement, CardLinkProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp
        ref={ref}
        data-card-link=""
        className={cn(
          'text-inherit no-underline outline-none after:absolute after:inset-0 after:rounded-[inherit] after:content-[\'\']',
          className,
        )}
        {...props}
      />
    );
  },
);

CardLink.displayName = 'CardLink';

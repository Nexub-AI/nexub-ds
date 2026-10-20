import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from '@nexub/icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import { disabledContainer, disabledText, pressable } from '../../utils/control.js';
import { glassSurfaceClass } from '../../utils/glass.js';

export type ToneValue =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'leap'
  | 'bookub'
  | 'payub'
  | 'founderub';

// Text-only tone for content on surfaces (Heading, Label, HelperText,
// EyebrowChip): accent roles (tone 40 / 80, AA on every surface).
export const toneTextClasses: Record<ToneValue, string> = {
  neutral: 'text-[var(--color-on-surface-variant)]',
  info: 'text-[var(--color-info)]',
  success: 'text-[var(--color-success)]',
  warning: 'text-[var(--color-warning)]',
  danger: 'text-[var(--color-error)]',
  leap: 'text-[var(--color-leap)]',
  bookub: 'text-[var(--color-bookub)]',
  payub: 'text-[var(--color-payub)]',
  founderub: 'text-[var(--color-founderub)]',
};

// Tone overrides the variant colour with a solid role (or brand palette tone
// 40/80) and its on-color. Hover/press come from the state layer. Static
// strings so Tailwind's JIT scans them; appended after the variant classes so
// tailwind-merge lets tone win.
const toneClasses: Record<ToneValue, string> = {
  neutral: 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)]',
  info: 'bg-[var(--color-info)] text-[var(--color-on-info)]',
  success: 'bg-[var(--color-success)] text-[var(--color-on-success)]',
  warning: 'bg-[var(--color-warning)] text-[var(--color-on-warning)]',
  danger: 'bg-[var(--color-error)] text-[var(--color-on-error)]',
  leap: 'bg-[var(--color-leap)] text-[var(--color-on-leap)]',
  bookub: 'bg-[var(--color-bookub)] text-[var(--color-on-bookub)]',
  payub: 'bg-[var(--color-payub)] text-[var(--color-on-payub)]',
  founderub: 'bg-[var(--color-founderub)] text-[var(--color-on-founderub)]',
};

const filled = `bg-[var(--color-primary)] text-[var(--color-on-primary)] ${disabledContainer}`;
const tonal = `bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] ${disabledContainer}`;
const outlined = `bg-transparent border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] ${disabledContainer}`;
const text = `bg-transparent text-[var(--color-on-surface)] ${disabledText}`;

export const buttonVariants = cva(
  [pressable, 'relative inline-flex items-center justify-center gap-2 whitespace-nowrap'],
  {
    variants: {
      variant: {
        filled,
        tonal,
        outlined,
        text,
        // Thin glass: for buttons floating over content/media (toolbars, media controls).
        glass: `border ${glassSurfaceClass} text-[var(--color-on-surface)] ${disabledContainer}`,
        // Legacy names (kept as aliases).
        primary: filled,
        secondary: tonal,
        subtle: `bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] ${disabledContainer}`,
        outline: outlined,
        ghost: text,
        destructive: `bg-[var(--color-error)] text-[var(--color-on-error)] ${disabledContainer}`,
        accent: `bg-[var(--color-tertiary)] text-[var(--color-on-tertiary)] ${disabledContainer}`,
        link: `bg-transparent text-[var(--color-primary)] underline underline-offset-[0.3em] ${disabledText}`,
      },
      // The control ladder (density-aware: data-density="compact" shrinks it).
      size: {
        xs: 'h-control-xs px-2.5 text-label-sm',
        sm: 'h-control-sm px-3.5 text-label-md',
        md: 'h-control-md px-5 text-label-lg',
        lg: 'h-control-lg px-6 text-title-md',
        xl: 'h-control-xl px-7 text-title-md',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  tone?: ToneValue;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      tone,
      loading = false,
      fullWidth,
      leadingIcon,
      trailingIcon,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const sharedProps = {
      className: cn(
        buttonVariants({ variant, size, fullWidth }),
        tone ? toneClasses[tone] : '',
        className,
      ),
      'data-tone': tone,
      ...(variant === 'glass' && { 'data-material': 'glass', 'data-glass-thickness': 'thin' }),
      ...props,
    };

    if (asChild) {
      return (
        <Slot ref={ref} {...sharedProps}>
          {children}
        </Slot>
      );
    }

    return (
      <button ref={ref} disabled={disabled ?? loading} {...sharedProps}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          leadingIcon
        )}
        {children}
        {!loading && trailingIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';

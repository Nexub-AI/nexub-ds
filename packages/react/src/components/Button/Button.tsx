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
  [pressable, 'nx-hit relative inline-flex items-center justify-center gap-2 whitespace-nowrap'],
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

export type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  tone?: ToneValue;
  /** Async feedback. `loading` blocks clicks (aria-disabled, focus kept),
   *  `success` draws a check, `error` shakes once. Not applied with `asChild`. */
  status?: ButtonStatus;
  /** Alias for `status="loading"`. */
  loading?: boolean;
  /** Announced while loading. @default 'Loading' */
  loadingLabel?: string;
  /** Announced on success; when given it also replaces the visible label. @default 'Done' */
  successLabel?: string;
  /** Announced on error. @default 'Something went wrong' */
  errorLabel?: string;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  asChild?: boolean;
}

const CheckIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path className="nx-check-draw" pathLength={1} d="M20 6 9 17l-5-5" />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      tone,
      status: statusProp,
      loading,
      loadingLabel = 'Loading',
      successLabel,
      errorLabel = 'Something went wrong',
      fullWidth,
      leadingIcon,
      trailingIcon,
      asChild = false,
      disabled,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const status: ButtonStatus = statusProp ?? (loading ? 'loading' : 'idle');
    const sharedProps = {
      className: cn(
        buttonVariants({ variant, size, fullWidth }),
        tone ? toneClasses[tone] : '',
        !asChild && status === 'error' && 'nx-shake',
        className,
      ),
      'data-tone': tone,
      ...(variant === 'glass' && { 'data-material': 'glass', 'data-glass-thickness': 'thin' }),
      ...props,
    };

    if (asChild) {
      return (
        <Slot ref={ref} onClick={onClick} {...sharedProps}>
          {children}
        </Slot>
      );
    }

    const busy = status === 'loading';
    const swapLabel = status === 'success' && successLabel !== undefined;
    // Spinner/check overlay the label, which stays in flow (transparent) so the width holds.
    const overlay = busy ? (
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
    ) : status === 'success' && !swapLabel ? (
      <CheckIcon />
    ) : null;
    const announcement =
      status === 'loading' ? loadingLabel
      : status === 'success' ? (successLabel ?? 'Done')
      : status === 'error' ? errorLabel
      : '';

    const button = (
      <button
        ref={ref}
        disabled={disabled}
        aria-busy={busy || undefined}
        aria-disabled={busy || props['aria-disabled'] || undefined}
        onClick={(e) => {
          // aria-disabled (not disabled) keeps focus; block the action ourselves.
          if (busy) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
        }}
        data-status={status === 'idle' ? undefined : status}
        {...sharedProps}
      >
        <span className={cn('contents', overlay && 'text-transparent [&_img]:invisible [&_svg]:invisible')}>
          {swapLabel ? (
            <>
              <CheckIcon />
              {successLabel}
            </>
          ) : (
            <>
              {leadingIcon}
              {children}
              {trailingIcon}
            </>
          )}
        </span>
        {overlay && (
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            {overlay}
          </span>
        )}
      </button>
    );

    // Only async buttons get the live region (a sibling: live regions inside a
    // button aren't announced reliably). Rendered up front so changes announce.
    if (statusProp === undefined && loading === undefined) return button;
    return (
      <>
        {button}
        <span role="status" className="sr-only">
          {announcement}
        </span>
      </>
    );
  },
);

Button.displayName = 'Button';

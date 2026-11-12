'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from '@nexub/icons';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ToneValue } from '@nexub/core';
import { usePointerSheen } from '../../hooks/usePointerSheen.js';
import { cn } from '../../utils/cn.js';
import { disabledContainer, disabledText, pressable } from '../../utils/control.js';
import { glassSurfaceClass } from '../../utils/glass.js';

export type { ToneValue };
export { toneTextClasses } from '../../utils/control.js';

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

const filled = `bg-[var(--button-filled-bg,var(--color-primary))] text-[var(--button-filled-fg,var(--color-on-primary))] ${disabledContainer}`;
const tonal = `bg-[var(--button-tonal-bg,var(--color-secondary-container))] text-[var(--button-tonal-fg,var(--color-on-secondary-container))] ${disabledContainer}`;
const outlined = `bg-transparent border border-[var(--button-outlined-border,var(--color-outline-variant))] text-[var(--button-outlined-fg,var(--color-on-surface))] ${disabledContainer}`;
const text = `bg-transparent text-[var(--button-text-fg,var(--color-on-surface))] ${disabledText}`;

export const buttonVariants = cva(
  [pressable, 'nx-hit relative inline-flex max-w-full items-center justify-center gap-2 whitespace-nowrap'],
  {
    variants: {
      variant: {
        filled,
        tonal,
        outlined,
        text,
        // Thin glass: for buttons floating over content/media (toolbars, media controls).
        glass: `border ${glassSurfaceClass} text-[var(--color-on-surface)] ${disabledContainer}`,
        // Marketing mode (@nexub/themes/marketing): gradient, glow and a spring
        // lift. Without [data-mode="marketing"] it is a filled button.
        hero: `${filled} nx-mkt-hero-button`,
        subtle: `bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] ${disabledContainer}`,
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
      variant: 'filled',
      size: 'md',
    },
  },
);

export type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Visual style. @default 'filled' */
  variant?: VariantProps<typeof buttonVariants>['variant'];
  tone?: ToneValue;
  /** Async feedback. `loading` blocks clicks (aria-disabled, focus kept),
   *  `success` draws a check, `error` shakes once. Not applied with `asChild`. */
  status?: ButtonStatus;
  /** Alias for `status="loading"`. A `type="submit"` button also shows loading
   *  while its parent `<form action>` is pending (React 19 `useFormStatus`). */
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
  /** 4.3: the button drifts a few pixels toward the pointer on hover. For one key action per screen.
   *  Off for touch and reduced motion. */
  magnetic?: boolean;
}

const CheckIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path className="nx-check-draw" pathLength={1} d="M20 6 9 17l-5-5" />
  </svg>
);

// Spinner timing: hidden for loads under 150ms, then shown for at least 400ms (no flicker).
const SPINNER_DELAY = 150;
const SPINNER_MIN = 400;

function useSpinner(busy: boolean): boolean {
  // Mounting already busy shows it at once (nothing to flicker from; SSR-correct).
  const [shown, setShown] = React.useState(busy);
  const shownAt = React.useRef(0);
  React.useEffect(() => {
    if (shown) shownAt.current = Date.now();
  }, [shown]);
  React.useEffect(() => {
    if (busy === shown) return;
    const wait = busy ? SPINNER_DELAY : Math.max(0, SPINNER_MIN - (Date.now() - shownAt.current));
    const t = setTimeout(() => setShown(busy), wait);
    return () => clearTimeout(t);
  }, [busy, shown]);
  return shown;
}

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
      magnetic = false,
      disabled,
      onClick,
      onPointerMove,
      children,
      ...props
    },
    ref,
  ) => {
    // Safe outside a form (pending is false). Only explicit type="submit" opts in.
    const formPending = useFormStatus().pending && props.type === 'submit';
    const status: ButtonStatus = statusProp ?? (loading || formPending ? 'loading' : 'idle');
    const spinner = useSpinner(status === 'loading');
    const handlePointerMove = usePointerSheen<HTMLButtonElement>(magnetic, onPointerMove);
    const sharedProps = {
      className: cn(
        buttonVariants({ variant, size, fullWidth }),
        tone ? toneClasses[tone] : '',
        !asChild && status === 'error' && 'nx-shake',
        magnetic && 'nx-magnetic',
        className,
      ),
      onPointerMove: handlePointerMove,
      'data-tone': tone,
      // Styling hook for opt-in layers (vivid, marketing); no styles depend on it by default.
      'data-variant': variant ?? 'filled',
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
    const overlay = spinner ? (
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
        {successLabel === undefined ? (
          <span className={cn('contents', overlay && 'text-transparent [&_img]:invisible [&_svg]:invisible')}>
            {leadingIcon}
            {/* A text label can shrink and end in an ellipsis, so a long one stays inside its container (9.3). */}
            {typeof children === 'string' ? <span className="min-w-0 truncate">{children}</span> : children}
            {trailingIcon}
          </span>
        ) : (
          // Both labels share one grid cell, so the button is as wide as the wider one
          // whichever shows; the hidden one keeps its space.
          <span className={cn('inline-grid', overlay && 'text-transparent [&_img]:invisible [&_svg]:invisible')}>
            <span className={cn('col-start-1 row-start-1 inline-flex items-center justify-center gap-2', swapLabel && 'invisible')} aria-hidden={swapLabel || undefined}>
              {leadingIcon}
              {children}
              {trailingIcon}
            </span>
            <span className={cn('col-start-1 row-start-1 inline-flex items-center justify-center gap-2', !swapLabel && 'invisible')} aria-hidden={!swapLabel || undefined}>
              {/* Mounted only when shown so the check draws in; a same-size box holds the width. */}
              {swapLabel ? <CheckIcon /> : <span className="h-4 w-4" />}
              {successLabel}
            </span>
          </span>
        )}
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

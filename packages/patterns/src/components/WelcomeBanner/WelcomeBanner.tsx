import * as React from 'react';
import { IconButton, cn, useNexubMessages } from '@nexub/react';
import { X } from '@nexub/icons';

export interface WelcomeBannerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** e.g. "Welcome back, Mei". */
  title: React.ReactNode;
  description?: React.ReactNode;
  /** One or two buttons. Keep the main one `filled`. */
  actions?: React.ReactNode;
  /** Decorative art on the trailing side (an illustration or icon). Hidden on phones. */
  media?: React.ReactNode;
  /** Shows a close button. Keep the dismissed state in your app. */
  onDismiss?: () => void;
  /** Heading level of the title. @default 2 */
  level?: 2 | 3;
}

/**
 * A greeting at the top of a home or dashboard page (10.3): what is new, or the
 * next step for a new account. One per page. Under `data-expression="vivid"` it
 * carries a soft wash of the accent; otherwise it is a plain tonal panel.
 */
export const WelcomeBanner = React.forwardRef<HTMLElement, WelcomeBannerProps>(
  ({ title, description, actions, media, onDismiss, level = 2, className, ...props }, ref) => {
    const id = React.useId();
    const messages = useNexubMessages();
    const Heading = `h${level}` as const;
    return (
      <section
        ref={ref}
        aria-labelledby={id}
        data-nx="welcome-banner"
        className={cn(
          'relative flex items-center gap-6 overflow-hidden rounded-shape-container bg-[var(--color-surface-container-low)] p-6',
          className,
        )}
        {...props}
      >
        <div className={cn('flex min-w-0 flex-1 flex-col gap-2', onDismiss && 'pe-8')}>
          <Heading id={id} className="text-title-lg ![font-weight:var(--page-title-weight,var(--type-title-lg-weight))] text-[var(--color-on-surface)]">
            {title}
          </Heading>
          {description && <p className="text-body-md text-[var(--color-on-surface-variant)]">{description}</p>}
          {actions && <div className="mt-2 flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
        {media && (
          <div aria-hidden="true" className="hidden shrink-0 sm:block">
            {media}
          </div>
        )}
        {onDismiss && (
          <IconButton
            size="sm"
            label={messages.dismissBanner}
            onClick={onDismiss}
            className="absolute end-2 top-2"
          >
            <X />
          </IconButton>
        )}
      </section>
    );
  },
);
WelcomeBanner.displayName = 'WelcomeBanner';

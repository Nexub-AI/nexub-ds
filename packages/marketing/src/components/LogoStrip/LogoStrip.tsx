import * as React from 'react';
import { Container, Marquee, cn } from '@nexub/react';

export interface LogoStripProps extends React.HTMLAttributes<HTMLElement> {
  /** e.g. "Trusted by 2,000+ teams". */
  label?: React.ReactNode;
  /** Scroll the logos sideways (pauses on hover and focus). Off: a wrapped row. @default true */
  scroll?: boolean;
}

/** A row of customer logos under the hero. Give each logo its alt text. Server component. */
export const LogoStrip = React.forwardRef<HTMLElement, LogoStripProps>(
  ({ label, scroll = true, className, children, ...props }, ref) => (
    <section ref={ref} className={cn('py-10', className)} {...props}>
      <Container size="marketing" className="flex flex-col items-center gap-6">
        {label && <p className="m-0 text-label-lg text-[var(--color-on-surface-muted)]">{label}</p>}
        {scroll ? (
          <Marquee className="w-full" rowClassName="items-center gap-14 pe-14">
            {children}
          </Marquee>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">{children}</div>
        )}
      </Container>
    </section>
  ),
);
LogoStrip.displayName = 'LogoStrip';

import * as React from 'react';
import { Button, Illustration, cn, safeHref, useNexubMessages } from '@nexub/react';

export type StatusPageKind = 'notFound' | 'serverError' | 'maintenance' | 'offline' | 'noAccess';

export interface StatusPageProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** notFound (404), serverError (500), maintenance, offline or noAccess (403). */
  kind: StatusPageKind;
  /** Landmark element. Use `div` inside an app shell that already renders `<main>`. @default 'main' */
  as?: 'main' | 'div' | 'section';
  /** Overrides the localised title; the description too. */
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** A small line above the title, e.g. "404". */
  code?: string;
  /** Buttons under the text. Replaces the default Retry or Back to home. */
  actions?: React.ReactNode;
  /** Art above the text. Defaults to the `Illustration` for the kind; `null` hides it. */
  illustration?: React.ReactNode;
  /** serverError and offline: shows a Retry button (when no `actions` are given). */
  onRetry?: () => void;
  /** notFound and noAccess: shows a "Back to home" link (when no `actions` are given). */
  homeHref?: string;
  /** At least as tall as the viewport, for a page with nothing else on it. */
  fullScreen?: boolean;
}

/**
 * A whole page for one state (10.5): not found, server error, maintenance, offline or no
 * access. Centred in its container, with one h1. Server error and offline are announced.
 */
export const StatusPage = React.forwardRef<HTMLElement, StatusPageProps>(function StatusPage(
  { kind, as: Tag = 'main', title, description, code, actions, illustration, onRetry, homeHref, fullScreen, className, ...props },
  ref,
) {
  const m = useNexubMessages();
  const text = m.emptyStates[kind];
  const urgent = kind === 'serverError' || kind === 'offline';
  const buttons =
    actions ??
    (urgent && onRetry ? (
      <Button onClick={onRetry}>{m.retry}</Button>
    ) : (kind === 'notFound' || kind === 'noAccess') && homeHref ? (
      <Button asChild>
        <a href={safeHref(homeHref)}>{m.backToHome}</a>
      </Button>
    ) : null);
  return (
    <Tag
      ref={ref as React.Ref<HTMLElement & HTMLDivElement>}
      data-nx="status-page"
      data-kind={kind}
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-6 px-4 py-12 text-center',
        fullScreen && 'min-h-dvh',
        className,
      )}
      {...props}
    >
      {illustration === undefined ? <Illustration kind={kind} size="lg" /> : illustration}
      <div role={urgent ? 'alert' : undefined} className="flex max-w-md flex-col items-center gap-2">
        {code && <p className="text-label-lg text-[var(--color-on-surface-variant)]">{code}</p>}
        <h1 className="text-headline-sm ![font-weight:var(--page-title-weight,var(--type-headline-sm-weight))] text-[var(--color-on-surface)]">
          {title ?? text.title}
        </h1>
        <p className="text-body-lg text-[var(--color-on-surface-variant)]">{description ?? text.description}</p>
      </div>
      {buttons && <div className="flex flex-wrap items-center justify-center gap-2">{buttons}</div>}
    </Tag>
  );
});

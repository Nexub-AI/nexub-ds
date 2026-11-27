'use client';

import * as React from 'react';
import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { IconButton } from '../IconButton/IconButton.js';
import { Provider as TooltipProvider, Tooltip } from '../Tooltip/Tooltip.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface MessageStrings {
  youSaid: string;
  assistantSaid: string;
  failedToSend: string;
  retry: string;
  copy: string;
  copied: string;
  goodResponse: string;
  badResponse: string;
  regenerate: string;
  /** 12.2: the `collapse` toggle while the message is clamped. */
  readMore: string;
  /** 12.2: the `collapse` (and MessageCard `maxHeight`) toggle while expanded. */
  showLess: string;
  /** 12.2: MessageCard's toggle while its `maxHeight` clips the content. */
  showAll: string;
  /** 12.2: MessageCard's overflow menu button. */
  moreActions: string;
}

// ponytail: local English fallbacks until these keys land in NexubMessages.
export const defaultMessageStrings: MessageStrings = {
  youSaid: 'You said',
  assistantSaid: 'Assistant said',
  failedToSend: 'Failed to send',
  retry: 'Retry',
  copy: 'Copy',
  copied: 'Copied',
  goodResponse: 'Good response',
  badResponse: 'Bad response',
  regenerate: 'Regenerate',
  readMore: 'Read more',
  showLess: 'Show less',
  showAll: 'Show all',
  moreActions: 'More actions',
};

/** 11.5: `other` is a third party in a group conversation (another person or agent). */
export type MessageFrom = 'user' | 'assistant' | 'system' | 'other';

export interface MessageBubbleProps extends React.HTMLAttributes<HTMLElement> {
  /** Who sent it. (Not `role`, which is the ARIA attribute.) */
  from: MessageFrom;
  /** Assistant and other: shown at the inline-start. User (12.2): at the inline-end, same size and spacing. */
  avatar?: React.ReactNode;
  /**
   * Accessible label for the message; defaults to "You said" / "Assistant said".
   * With `from="other"` it is also shown as the header (the sender's name).
   */
  name?: string;
  /** 11.5: header text beside the name, e.g. the time. Not for `system`. */
  meta?: React.ReactNode;
  status?: 'sending' | 'error';
  /** With status="error": renders a Retry text button. */
  onRetry?: () => void;
  messages?: Partial<MessageStrings>;
  /**
   * 12.2: clamp the content to this many lines. When it is taller, a "Read more" / "Show less"
   * toggle appears and the clamped edge fades out. @default false
   */
  collapse?: number | false;
}

// Classes for 1–6 lines (strict-CSP safe, as Truncate and Text); larger counts set the clamp
// through the CSSOM, which a strict CSP allows.
const LINE_CLAMP: Record<number, string> = {
  1: 'line-clamp-1', 2: 'line-clamp-2', 3: 'line-clamp-3', 4: 'line-clamp-4', 5: 'line-clamp-5', 6: 'line-clamp-6',
};
// The fade is a mask (alpha only), so it shows the bubble's own surface in either theme.
const FADE = '[mask-image:linear-gradient(to_bottom,var(--color-surface)_calc(100%-1.5em),transparent)]';

const USER_BUBBLE =
  'whitespace-pre-wrap break-words rounded-shape-container rounded-ee-[0.375rem] bg-[var(--color-primary-container)] px-4 py-2.5 text-body-md text-[var(--color-on-primary-container)]';

export const MessageBubble = React.forwardRef<HTMLElement, MessageBubbleProps>(
  ({ from, avatar, name, meta, status, onRetry, messages, collapse = false, className, children, ...props }, ref) => {
    const m = { ...defaultMessageStrings, ...useNexubMessages(), ...messages };
    const lines = typeof collapse === 'number' && collapse > 0 ? Math.floor(collapse) : 0;
    const contentId = React.useId();
    const [expanded, setExpanded] = React.useState(false);
    const [overflows, setOverflows] = React.useState(false);
    const [contentEl, setContentEl] = React.useState<HTMLDivElement | null>(null);
    const clamped = lines > 0 && !expanded;

    useIsomorphicLayoutEffect(() => {
      if (!contentEl || !lines || LINE_CLAMP[lines]) return;
      const css = contentEl.style;
      if (clamped) {
        css.setProperty('display', '-webkit-box');
        css.setProperty('-webkit-box-orient', 'vertical');
        css.setProperty('-webkit-line-clamp', String(lines));
        css.setProperty('overflow', 'hidden');
      } else {
        for (const k of ['display', '-webkit-box-orient', '-webkit-line-clamp', 'overflow']) css.removeProperty(k);
      }
    }, [contentEl, lines, clamped]);

    React.useEffect(() => {
      if (!contentEl || !lines) return;
      const measure = () => {
        if (!expanded) {
          setOverflows(contentEl.scrollHeight > contentEl.clientHeight + 1);
          return;
        }
        // Expanded: compare the full height with the clamp's height.
        const lineHeight = parseFloat(getComputedStyle(contentEl).lineHeight);
        if (lineHeight > 0) setOverflows(contentEl.scrollHeight > lineHeight * lines + 1);
      };
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(measure);
      ro.observe(contentEl);
      return () => ro.disconnect();
    }, [contentEl, lines, expanded, children]);

    const content = lines ? (
      <div id={contentId} ref={setContentEl} className={cn(clamped && LINE_CLAMP[lines], clamped && overflows && FADE)}>
        {children}
      </div>
    ) : (
      children
    );
    const toggle = lines > 0 && (overflows || expanded) && (
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((e) => !e)}
        className="nx-state-layer -mx-1 mt-1 block rounded-shape-min px-1 text-label-md font-medium underline underline-offset-2"
      >
        {expanded ? m.showLess : m.readMore}
      </button>
    );
    const label = name ?? (from === 'user' ? m.youSaid : from === 'assistant' ? m.assistantSaid : undefined);

    const error = status === 'error' && (
      <p role="alert" className="mt-1 flex items-center gap-2 text-label-sm text-[var(--color-error)]">
        {m.failedToSend}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="nx-state-layer rounded-shape-min px-1 font-medium text-[var(--color-primary)] underline-offset-2 hover:underline"
          >
            {m.retry}
          </button>
        )}
      </p>
    );

    const shownName = from === 'other' ? name : undefined;
    const header = (shownName || meta) && (
      <div className="mb-1 flex items-baseline gap-2 text-label-sm text-[var(--color-on-surface-muted)]">
        {shownName && <span className="font-medium text-[var(--color-on-surface)]">{shownName}</span>}
        {meta && <span>{meta}</span>}
      </div>
    );

    return (
      <article
        ref={ref}
        aria-label={label}
        aria-busy={status === 'sending' || undefined}
        data-from={from}
        className={cn(
          'group flex w-full',
          from === 'user' && (avatar ? 'items-start justify-end gap-3' : 'flex-col items-end'),
          (from === 'assistant' || from === 'other') && 'items-start gap-3',
          from === 'system' && 'justify-center text-center text-label-sm text-[var(--color-on-surface-muted)]',
          className,
        )}
        {...props}
      >
        {from === 'user' && avatar ? (
          // 12.2: the avatar mirrors the assistant's, at the inline-end.
          <>
            <div className="flex min-w-0 max-w-[85%] flex-col items-end">
              {header}
              <div className={cn(USER_BUBBLE, 'max-w-full')}>
                {content}
                {toggle}
              </div>
              {error}
            </div>
            <div className="shrink-0">{avatar}</div>
          </>
        ) : from === 'user' ? (
          <>
            {header}
            <div className={cn(USER_BUBBLE, 'max-w-[85%]')}>
              {content}
              {toggle}
            </div>
            {error}
          </>
        ) : from === 'assistant' ? (
          <>
            {avatar && <div className="shrink-0">{avatar}</div>}
            <div className="min-w-0 flex-1 text-body-md text-[var(--color-on-surface)]">
              {header}
              {content}
              {toggle}
              {error}
            </div>
          </>
        ) : from === 'other' ? (
          <>
            {avatar && <div className="shrink-0">{avatar}</div>}
            <div className="flex min-w-0 max-w-[85%] flex-col items-start">
              {header}
              <div className="whitespace-pre-wrap break-words rounded-shape-container rounded-es-[0.375rem] bg-[var(--color-surface-container-high)] px-4 py-2.5 text-body-md text-[var(--color-on-surface)]">
                {content}
                {toggle}
              </div>
              {error}
            </div>
          </>
        ) : (
          <div>
            {content}
            {toggle}
            {error}
          </div>
        )}
      </article>
    );
  },
);
MessageBubble.displayName = 'MessageBubble';

export type Feedback = 'up' | 'down' | null;

export interface MessageActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Text placed on the clipboard by Copy. */
  text?: string;
  /** Set false to hide Copy. @default true */
  copy?: boolean;
  feedback?: Feedback;
  defaultFeedback?: Feedback;
  /** Shows thumbs up/down when provided. */
  onFeedback?: (feedback: Feedback) => void;
  /** Shows Regenerate when provided. */
  onRegenerate?: () => void;
  /** 11.5: your own actions, after the built-in ones. `children` render after these. */
  actions?: MessageAction[];
  messages?: Partial<MessageStrings>;
}

export interface MessageAction {
  /** The button's accessible name and tooltip. */
  label: string;
  icon: React.ReactNode;
  onSelect: () => void;
  disabled?: boolean;
}

/** Copy / feedback / regenerate row. Fades in on hover or focus of the parent MessageBubble on pointer devices. */
export const MessageActions = React.forwardRef<HTMLDivElement, MessageActionsProps>(
  ({ text = '', copy = true, feedback: feedbackProp, defaultFeedback = null, onFeedback, onRegenerate, actions, messages, className, children, ...props }, ref) => {
    const m = { ...useNexubMessages(), ...messages };
    const [feedback, setFeedback] = useControllableState<Feedback>({
      value: feedbackProp,
      defaultValue: defaultFeedback,
      onChange: onFeedback,
    });
    const [copied, setCopied] = React.useState(false);
    const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    React.useEffect(() => () => clearTimeout(timer.current), []);

    const onCopy = async () => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return; // Clipboard denied: don't claim success.
      }
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    };

    const toggle = (value: 'up' | 'down') => setFeedback(feedback === value ? null : value);

    return (
      <TooltipProvider>
        <div
          ref={ref}
          className={cn(
            'mt-1 flex items-center gap-0.5 transition-opacity duration-effects-fast ease-effects-fast',
            '[@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
            className,
          )}
          {...props}
        >
          {copy && (
            <Tooltip label={copied ? m.copied : m.copy}>
              <IconButton size="sm" label={m.copy} onClick={onCopy}>
                {copied ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path className="nx-check-draw" pathLength={1} d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <Copy size="sm" aria-hidden="true" />
                )}
              </IconButton>
            </Tooltip>
          )}
          {onFeedback && (
            <>
              <Tooltip label={m.goodResponse}>
                <IconButton size="sm" label={m.goodResponse} aria-pressed={feedback === 'up'} onClick={() => toggle('up')}>
                  <ThumbsUp size="sm" aria-hidden="true" className={cn(feedback === 'up' && 'text-[var(--color-primary)]')} />
                </IconButton>
              </Tooltip>
              <Tooltip label={m.badResponse}>
                <IconButton size="sm" label={m.badResponse} aria-pressed={feedback === 'down'} onClick={() => toggle('down')}>
                  <ThumbsDown size="sm" aria-hidden="true" className={cn(feedback === 'down' && 'text-[var(--color-primary)]')} />
                </IconButton>
              </Tooltip>
            </>
          )}
          {onRegenerate && (
            <Tooltip label={m.regenerate}>
              <IconButton size="sm" label={m.regenerate} onClick={onRegenerate}>
                <RefreshCw size="sm" aria-hidden="true" />
              </IconButton>
            </Tooltip>
          )}
          {actions?.map((a) => (
            <Tooltip key={a.label} label={a.label}>
              <IconButton size="sm" label={a.label} disabled={a.disabled} onClick={a.onSelect}>
                {a.icon}
              </IconButton>
            </Tooltip>
          ))}
          {children}
          <span role="status" className="sr-only">
            {copied ? m.copied : ''}
          </span>
        </div>
      </TooltipProvider>
    );
  },
);
MessageActions.displayName = 'MessageActions';

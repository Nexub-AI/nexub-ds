'use client';

import * as React from 'react';
import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { IconButton } from '../IconButton/IconButton.js';
import { Provider as TooltipProvider, Tooltip } from '../Tooltip/Tooltip.js';
import { useControllableState } from '../../hooks/useControllableState.js';
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
};

export type MessageFrom = 'user' | 'assistant' | 'system';

export interface MessageBubbleProps extends React.HTMLAttributes<HTMLElement> {
  /** Who sent it. (Not `role`, which is the ARIA attribute.) */
  from: MessageFrom;
  /** Assistant only: shown at the inline-start. */
  avatar?: React.ReactNode;
  /** Accessible label for the message; defaults to "You said" / "Assistant said". */
  name?: string;
  status?: 'sending' | 'error';
  /** With status="error": renders a Retry text button. */
  onRetry?: () => void;
  messages?: Partial<MessageStrings>;
}

export const MessageBubble = React.forwardRef<HTMLElement, MessageBubbleProps>(
  ({ from, avatar, name, status, onRetry, messages, className, children, ...props }, ref) => {
    const m = { ...useNexubMessages(), ...messages };
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

    return (
      <article
        ref={ref}
        aria-label={label}
        aria-busy={status === 'sending' || undefined}
        data-from={from}
        className={cn(
          'group flex w-full',
          from === 'user' && 'flex-col items-end',
          from === 'assistant' && 'items-start gap-3',
          from === 'system' && 'justify-center text-center text-label-sm text-[var(--color-on-surface-muted)]',
          className,
        )}
        {...props}
      >
        {from === 'user' ? (
          <>
            <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-shape-container rounded-ee-[6px] bg-[var(--color-primary-container)] px-4 py-2.5 text-body-md text-[var(--color-on-primary-container)]">
              {children}
            </div>
            {error}
          </>
        ) : from === 'assistant' ? (
          <>
            {avatar && <div className="shrink-0">{avatar}</div>}
            <div className="min-w-0 flex-1 text-body-md text-[var(--color-on-surface)]">
              {children}
              {error}
            </div>
          </>
        ) : (
          <div>
            {children}
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
  messages?: Partial<MessageStrings>;
}

/** Copy / feedback / regenerate row. Fades in on hover or focus of the parent MessageBubble on pointer devices. */
export const MessageActions = React.forwardRef<HTMLDivElement, MessageActionsProps>(
  ({ text = '', copy = true, feedback: feedbackProp, defaultFeedback = null, onFeedback, onRegenerate, messages, className, ...props }, ref) => {
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
          <span role="status" className="sr-only">
            {copied ? m.copied : ''}
          </span>
        </div>
      </TooltipProvider>
    );
  },
);
MessageActions.displayName = 'MessageActions';

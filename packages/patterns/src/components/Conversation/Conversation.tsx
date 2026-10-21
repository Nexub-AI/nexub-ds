import * as React from 'react';
import { Button, cn, useNexubMessages } from '@nexub/react';
import { ArrowDown } from '@nexub/icons';

export interface ConversationMessages {
  /** Floating button shown when the reader has scrolled up. */
  jumpToLatest: string;
  /** Accessible name of the message list. */
  conversation: string;
}

const fallbackMessages: ConversationMessages = {
  jumpToLatest: 'Jump to latest',
  conversation: 'Conversation',
};

export interface ConversationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The messages. */
  children?: React.ReactNode;
  /** Sticky composer slot under the list, e.g. a PromptInput. */
  composer?: React.ReactNode;
  /** Keep the view pinned to the newest content while the reader is at the bottom. @default true */
  autoScroll?: boolean;
  /**
   * Make the list a polite live log (role="log"). Off by default: token streaming
   * would announce every chunk. Turn on for whole-message updates only.
   * @default false
   */
  announce?: boolean;
  messages?: Partial<ConversationMessages>;
}

/** Within this distance of the bottom counts as "at the bottom". */
export const STICK_THRESHOLD = 48;

function atBottom(el: HTMLElement) {
  return el.scrollHeight - el.scrollTop - el.clientHeight <= STICK_THRESHOLD;
}

/**
 * Chat layout: a scrolling message list (max-w-3xl, centred) with a sticky
 * composer at the bottom. Sticks to the bottom as content streams in while the
 * reader is there; scrolling up stops following and offers "Jump to latest".
 */
export const Conversation = React.forwardRef<HTMLDivElement, ConversationProps>(
  ({ children, composer, autoScroll = true, announce = false, messages, className, ...props }, ref) => {
    const provided = useNexubMessages() as unknown as Partial<ConversationMessages>;
    const m: ConversationMessages = {
      jumpToLatest: messages?.jumpToLatest ?? provided.jumpToLatest ?? fallbackMessages.jumpToLatest,
      conversation: messages?.conversation ?? provided.conversation ?? fallbackMessages.conversation,
    };
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const pinnedRef = React.useRef(true);
    const lastTop = React.useRef(0);
    const [pinned, setPinned] = React.useState(true);

    const setPin = React.useCallback((value: boolean) => {
      pinnedRef.current = value;
      setPinned(value);
    }, []);

    // Follow new content while pinned.
    React.useEffect(() => {
      const scroller = scrollRef.current;
      const content = contentRef.current;
      if (!autoScroll || !scroller || !content) return;
      const follow = () => {
        if (pinnedRef.current) scroller.scrollTop = scroller.scrollHeight;
        lastTop.current = scroller.scrollTop;
      };
      follow();
      const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(follow) : undefined;
      ro?.observe(content);
      const mo = new MutationObserver(follow);
      mo.observe(content, { childList: true, subtree: true, characterData: true });
      return () => {
        ro?.disconnect();
        mo.disconnect();
      };
    }, [autoScroll]);

    const onScroll = () => {
      const el = scrollRef.current;
      if (!el) return;
      // Re-pin at the bottom; unpin only when the reader moves up, so our own
      // smooth scroll down (and content growth) never unpins.
      if (atBottom(el)) {
        if (!pinnedRef.current) setPin(true);
      } else if (el.scrollTop < lastTop.current && pinnedRef.current) {
        setPin(false);
      }
      lastTop.current = el.scrollTop;
    };

    const jump = () => {
      const el = scrollRef.current;
      if (!el) return;
      setPin(true);
      const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const top = el.scrollHeight;
      if (typeof el.scrollTo === 'function') el.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
      else el.scrollTop = top;
    };

    const live = announce
      ? ({ role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions' } as const)
      : ({ role: 'region' } as const);

    return (
      <div ref={ref} className={cn('flex h-full min-h-0 flex-col', className)} {...props}>
        <div className="relative min-h-0 flex-1">
          <div
            ref={scrollRef}
            onScroll={onScroll}
            aria-label={m.conversation}
            tabIndex={0}
            {...live}
            className={cn(
              'h-full overflow-y-auto',
              composer &&
                '[-webkit-mask-image:linear-gradient(to_bottom,black_calc(100%-24px),transparent)] [mask-image:linear-gradient(to_bottom,black_calc(100%-24px),transparent)]',
            )}
          >
            <div ref={contentRef} className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-8 pt-6">
              {children}
            </div>
          </div>
          {autoScroll && !pinned && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
              <Button
                type="button"
                variant="tonal"
                size="sm"
                data-state="open"
                onClick={jump}
                leadingIcon={<ArrowDown size="sm" aria-hidden="true" />}
                className="nx-motion nx-pop pointer-events-auto shadow-elevation-2"
              >
                {m.jumpToLatest}
              </Button>
            </div>
          )}
        </div>
        {composer && <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-4">{composer}</div>}
      </div>
    );
  },
);
Conversation.displayName = 'Conversation';

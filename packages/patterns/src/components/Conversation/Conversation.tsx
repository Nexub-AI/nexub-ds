import * as React from 'react';
import { Button, cn, useMergedRefs, useNexubMessages } from '@nexub/react';
import { ArrowDown } from '@nexub/icons';

export interface ConversationMessages {
  /** Floating button shown when the reader has scrolled up. */
  jumpToLatest: string;
  /** Accessible name of the message list. */
  conversation: string;
  /** 12.2: the floating button's label once new messages arrived while scrolled up. */
  jumpToNewest?: string;
  /** 12.2: announced politely (once per batch) when messages arrive while scrolled up. */
  newMessages?: string;
  /** 12.2: DateSeparator label for the current day. */
  today?: string;
  /** 12.2: DateSeparator label for the day before. */
  yesterday?: string;
}

type ResolvedMessages = Required<Pick<ConversationMessages, 'jumpToLatest' | 'conversation' | 'jumpToNewest' | 'newMessages'>>;

const fallbackMessages: ResolvedMessages = {
  jumpToLatest: 'Jump to latest',
  conversation: 'Conversation',
  jumpToNewest: 'Jump to newest',
  newMessages: 'New messages',
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
  /**
   * 11.5: cap the height (a CSS length, or a number of px) so it works in normal flow without a
   * fixed-height parent: it grows with its messages up to this, then the list scrolls and follows.
   * Without it, it fills its parent's height (`h-full`) as before.
   */
  maxHeight?: number | string;
  /**
   * 12.2: a slot at the end of the list, after the messages, for a `<ThinkingIndicator />`.
   * It sits in a polite `role="status"` region and never moves the scroll: while the reader is at
   * the bottom it stays in view, and while they're scrolled up it neither scrolls nor counts as a
   * new message. Pass the prop (even as `null`) for as long as the slot may be used, so the live
   * region exists before the indicator appears.
   */
  thinking?: React.ReactNode;
}

/** Within this distance of the bottom counts as "at the bottom". */
export const STICK_THRESHOLD = 48;

function atBottom(el: HTMLElement) {
  return el.scrollHeight - el.scrollTop - el.clientHeight <= STICK_THRESHOLD;
}

/**
 * Chat layout: a scrolling message list (max-w-3xl, centred) with a sticky
 * composer at the bottom. Sticks to the bottom as content streams in while the
 * reader is there; scrolling up stops following and offers "Jump to latest", which becomes
 * "Jump to newest" (announced once as "New messages") when messages arrive meanwhile.
 */
export const Conversation = React.forwardRef<HTMLDivElement, ConversationProps>(
  ({ children, composer, autoScroll = true, announce = false, messages, maxHeight, thinking, className, ...props }, ref) => {
    const provided = useNexubMessages() as unknown as Partial<ConversationMessages>;
    const pick = (k: keyof ResolvedMessages) => messages?.[k] ?? provided[k] ?? fallbackMessages[k];
    const m: ResolvedMessages = {
      jumpToLatest: pick('jumpToLatest'),
      conversation: pick('conversation'),
      jumpToNewest: pick('jumpToNewest'),
      newMessages: pick('newMessages'),
    };
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, rootRef);

    // Through the CSSOM, not a style attribute (strict CSP).
    React.useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      if (maxHeight === undefined) el.style.removeProperty('max-height');
      else el.style.setProperty('max-height', typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight);
    }, [maxHeight]);
    const pinnedRef = React.useRef(true);
    const lastTop = React.useRef(0);
    const [pinned, setPinned] = React.useState(true);
    // 12.2: new messages arrived while scrolled up (reset when the reader is back at the bottom).
    const hasNewRef = React.useRef(false);
    const [hasNew, setHasNew] = React.useState(false);
    const [liveText, setLiveText] = React.useState('');
    const announceRef = React.useRef(announce);
    announceRef.current = announce;
    const newMessagesRef = React.useRef(m.newMessages);
    newMessagesRef.current = m.newMessages;

    const setPin = React.useCallback((value: boolean) => {
      pinnedRef.current = value;
      setPinned(value);
      if (value && hasNewRef.current) {
        hasNewRef.current = false;
        setHasNew(false);
        setLiveText('');
      }
    }, []);

    // 12.2: notice messages that arrive (or keep streaming) while the reader is scrolled up.
    // Changes inside the thinking slot don't count. One announcement per batch: the flag stays
    // set until the reader is back at the bottom, so streamed tokens don't announce again.
    React.useEffect(() => {
      const content = contentRef.current;
      if (!autoScroll || !content) return;
      const mo = new MutationObserver((records) => {
        if (pinnedRef.current || hasNewRef.current) return;
        const SLOT = '[data-conversation-thinking]';
        const isSlot = (n: Node) => (n as Element).matches?.(SLOT) === true;
        const inSlot = (r: MutationRecord) => {
          const el = r.target.nodeType === 1 ? (r.target as Element) : r.target.parentElement;
          if (el?.closest(SLOT)) return true;
          // The slot itself mounting or unmounting.
          const nodes = [...r.addedNodes, ...r.removedNodes];
          return r.type === 'childList' && nodes.length > 0 && nodes.every(isSlot);
        };
        if (records.every(inSlot)) return;
        hasNewRef.current = true;
        setHasNew(true);
        // A role="log" list already announces its additions.
        if (!announceRef.current) setLiveText(newMessagesRef.current);
      });
      mo.observe(content, { childList: true, subtree: true, characterData: true });
      return () => mo.disconnect();
    }, [autoScroll]);

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
      <div ref={mergedRef} className={cn('flex h-full min-h-0 flex-col', className)} {...props}>
        {/* A flex column all the way down, so the list scrolls whether the height comes from the
            parent (h-full) or only from maxHeight. */}
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div
            ref={scrollRef}
            onScroll={onScroll}
            aria-label={m.conversation}
            tabIndex={0}
            {...live}
            className={cn(
              // `relative` contains absolutely positioned children (MessageBubble's sr-only
              // "You said" labels) in the scroll box, so they don't stretch the page.
              'relative min-h-0 flex-1 overflow-y-auto',
              composer &&
                '[-webkit-mask-image:linear-gradient(to_bottom,black_calc(100%-24px),transparent)] [mask-image:linear-gradient(to_bottom,black_calc(100%-24px),transparent)]',
            )}
          >
            <div ref={contentRef} className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-8 pt-6">
              {children}
              {thinking !== undefined && (
                // Never a scroll anchor; and an empty slot cancels its flex gap.
                <div
                  role="status"
                  aria-live="polite"
                  data-conversation-thinking=""
                  className="[overflow-anchor:none] empty:-mt-6"
                >
                  {thinking}
                </div>
              )}
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
                {hasNew ? m.jumpToNewest : m.jumpToLatest}
              </Button>
            </div>
          )}
          {autoScroll && !announce && (
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {liveText}
            </div>
          )}
        </div>
        {composer && <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-4">{composer}</div>}
      </div>
    );
  },
);
Conversation.displayName = 'Conversation';

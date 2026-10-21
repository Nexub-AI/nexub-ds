'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';

/** How many freshly appended chunks keep their own fading span; older ones merge into plain text. */
const MAX_ANIMATED = 3;

interface Chunk {
  id: number;
  text: string;
}

interface StreamState {
  source: string;
  settled: string;
  chunks: Chunk[];
  nextId: number;
}

function next(prev: StreamState, text: string, streaming: boolean): StreamState {
  // Not an append (reset, edit, or a whole new message): show it statically.
  if (!text.startsWith(prev.source) || !streaming) {
    return { source: text, settled: text, chunks: [], nextId: prev.nextId };
  }
  const chunks = [...prev.chunks, { id: prev.nextId, text: text.slice(prev.source.length) }];
  let settled = prev.settled;
  while (chunks.length > MAX_ANIMATED) settled += chunks.shift()!.text;
  return { source: text, settled, chunks, nextId: prev.nextId + 1 };
}

export interface StreamingTextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** The full text received so far; grows as tokens arrive. */
  text: string;
  /** True while more text is expected: shows the caret and sets aria-busy. */
  streaming?: boolean;
  as?: 'div' | 'p' | 'span';
  /**
   * Opt-in live announcements. Off by default: screen readers re-read the
   * whole region on every token; announce the finished message instead.
   */
  'aria-live'?: 'off' | 'polite';
}

/**
 * Assistant text as it streams in. Text already shown stays static; each newly
 * appended tail fades in (nx-reveal), and only the last few tails keep their
 * own span, so the DOM stays flat however long the answer gets.
 */
export const StreamingText = React.forwardRef<HTMLElement, StreamingTextProps>(
  ({ text, streaming = false, as: Comp = 'div', className, 'aria-live': ariaLive = 'off', ...props }, ref) => {
    const [state, setState] = React.useState<StreamState>(() => ({ source: text, settled: text, chunks: [], nextId: 0 }));
    // Derive from props during render (React's "previous props" pattern): no flash of un-wrapped text.
    let current = state;
    if (text !== state.source || (!streaming && state.chunks.length > 0)) {
      current = next(state, text, streaming);
      setState(current);
    }

    return (
      <Comp
        ref={ref as React.Ref<HTMLDivElement>}
        aria-busy={streaming}
        aria-live={ariaLive}
        className={cn('whitespace-pre-wrap break-words', className)}
        {...props}
      >
        {current.settled}
        {current.chunks.map((c) => (
          <span key={c.id} className="nx-reveal motion-reduce:animate-none">
            {c.text}
          </span>
        ))}
        {streaming && (
          <span
            aria-hidden="true"
            data-caret=""
            className="nx-caret ms-0.5 inline-block h-[1em] w-[2px] align-text-bottom rounded-full bg-[var(--color-primary)] motion-reduce:animate-none"
          />
        )}
      </Comp>
    );
  },
);
StreamingText.displayName = 'StreamingText';

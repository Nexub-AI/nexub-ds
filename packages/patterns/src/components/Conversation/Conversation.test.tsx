import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Conversation } from './Conversation.js';

// jsdom has no layout: drive scroll metrics by hand.
function metrics(el: HTMLElement, m: { scrollHeight: number; clientHeight: number }) {
  Object.defineProperty(el, 'scrollHeight', { configurable: true, get: () => m.scrollHeight });
  Object.defineProperty(el, 'clientHeight', { configurable: true, get: () => m.clientHeight });
}
function scrollTo(el: HTMLElement, top: number) {
  el.scrollTop = top;
  fireEvent.scroll(el);
}

function Harness({ count }: { count: number }) {
  return (
    <Conversation composer={<textarea aria-label="Message" />}>
      {Array.from({ length: count }, (_, i) => <p key={i}>Message {i}</p>)}
    </Conversation>
  );
}

describe('Conversation', () => {
  it('is a region named "Conversation" by default, a polite log when announce', () => {
    const { rerender } = render(<Conversation>hi</Conversation>);
    const region = screen.getByRole('region', { name: 'Conversation' });
    expect(region).not.toHaveAttribute('aria-live');
    rerender(<Conversation announce>hi</Conversation>);
    const log = screen.getByRole('log', { name: 'Conversation' });
    expect(log).toHaveAttribute('aria-live', 'polite');
    expect(log).toHaveAttribute('aria-relevant', 'additions');
  });

  it('renders the composer slot', () => {
    render(<Harness count={1} />);
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeInTheDocument();
  });

  it('stays pinned to the bottom as content grows', async () => {
    const { rerender } = render(<Harness count={1} />);
    const list = screen.getByRole('region', { name: 'Conversation' });
    metrics(list, { scrollHeight: 1000, clientHeight: 400 });
    rerender(<Harness count={2} />);
    await act(() => Promise.resolve()); // MutationObserver flush
    expect(list.scrollTop).toBe(1000);
    expect(screen.queryByRole('button', { name: 'Jump to latest' })).toBeNull();
  });

  it('stops following when scrolled up, then jumps back and re-pins', async () => {
    const { rerender } = render(<Harness count={1} />);
    const list = screen.getByRole('region', { name: 'Conversation' });
    metrics(list, { scrollHeight: 1000, clientHeight: 400 });
    scrollTo(list, 600); // at bottom
    scrollTo(list, 570); // within 48px: still pinned
    expect(screen.queryByRole('button', { name: 'Jump to latest' })).toBeNull();
    scrollTo(list, 200); // user scrolls up
    const jump = screen.getByRole('button', { name: 'Jump to latest' });

    metrics(list, { scrollHeight: 1400, clientHeight: 400 });
    rerender(<Harness count={2} />);
    await act(() => Promise.resolve());
    expect(list.scrollTop).toBe(200); // not following

    const scrollToSpy = vi.fn((opts: ScrollToOptions) => { list.scrollTop = opts.top!; });
    list.scrollTo = scrollToSpy as unknown as typeof list.scrollTo;
    await userEvent.setup().click(jump);
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 1400, behavior: 'smooth' });
    expect(screen.queryByRole('button', { name: 'Jump to latest' })).toBeNull();

    metrics(list, { scrollHeight: 1800, clientHeight: 400 });
    rerender(<Harness count={3} />);
    await act(() => Promise.resolve());
    expect(list.scrollTop).toBe(1800); // following again
  });

  it('jumps instantly with reduced motion', async () => {
    const mm = vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    render(<Harness count={1} />);
    const list = screen.getByRole('region', { name: 'Conversation' });
    metrics(list, { scrollHeight: 1000, clientHeight: 400 });
    scrollTo(list, 600);
    scrollTo(list, 100);
    const spy = vi.fn();
    list.scrollTo = spy as unknown as typeof list.scrollTo;
    await userEvent.setup().click(screen.getByRole('button', { name: 'Jump to latest' }));
    expect(spy).toHaveBeenCalledWith({ top: 1000, behavior: 'auto' });
    mm.mockRestore();
  });

  it('accepts message overrides', () => {
    render(<Conversation messages={{ conversation: 'Chat' }}>hi</Conversation>);
    expect(screen.getByRole('region', { name: 'Chat' })).toBeInTheDocument();
  });

  it('renders no style attribute (strict CSP)', () => {
    expect(renderToString(<Harness count={2} />)).not.toContain('style="');
  });
});

describe('Conversation 11.5 maxHeight', () => {
  it('caps its height through the CSSOM so it works without a fixed-height parent', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { rerender } = render(<Conversation ref={ref} maxHeight={480}>hi</Conversation>);
    expect(ref.current!.style.maxHeight).toBe('480px');
    rerender(<Conversation ref={ref} maxHeight="60dvh">hi</Conversation>);
    expect(ref.current!.style.maxHeight).toBe('60dvh');
    rerender(<Conversation ref={ref}>hi</Conversation>);
    expect(ref.current!.style.maxHeight).toBe('');
    expect(renderToString(<Conversation maxHeight={480}>hi</Conversation>)).not.toContain('style="');
  });

  it('the list is a shrinking flex item, so it scrolls under maxHeight', () => {
    render(<Conversation maxHeight="20rem">hi</Conversation>);
    expect(screen.getByRole('region', { name: 'Conversation' })).toHaveClass('min-h-0', 'flex-1', 'overflow-y-auto');
  });
});

describe('Conversation 12.2', () => {
  it('the scroller itself is relative, so sr-only labels stay inside the scroll box', () => {
    render(<Conversation>hi</Conversation>);
    expect(screen.getByRole('region', { name: 'Conversation' })).toHaveClass('relative', 'overflow-y-auto');
  });

  it('switches to "Jump to newest" and announces once per batch when messages arrive while scrolled up', async () => {
    const { rerender } = render(<Harness count={1} />);
    const list = screen.getByRole('region', { name: 'Conversation' });
    const live = document.querySelector('.sr-only[aria-live="polite"]')!;
    expect(live).toHaveTextContent('');
    metrics(list, { scrollHeight: 1000, clientHeight: 400 });
    scrollTo(list, 600);
    scrollTo(list, 200);
    expect(screen.getByRole('button', { name: 'Jump to latest' })).toBeInTheDocument();
    expect(live).toHaveTextContent('');

    rerender(<Harness count={2} />);
    await act(() => Promise.resolve());
    expect(screen.getByRole('button', { name: 'Jump to newest' })).toBeInTheDocument();
    expect(live).toHaveTextContent('New messages');

    // More arrivals in the same batch leave the live region alone (no re-announcement).
    const changed = vi.fn();
    const mo = new MutationObserver(changed);
    mo.observe(live, { childList: true, subtree: true, characterData: true });
    rerender(<Harness count={3} />);
    await act(() => Promise.resolve());
    expect(changed).not.toHaveBeenCalled();
    mo.disconnect();
    expect(list.scrollTop).toBe(200);

    list.scrollTo = vi.fn((opts: ScrollToOptions) => {
      list.scrollTop = opts.top!;
    }) as unknown as typeof list.scrollTo;
    await userEvent.setup().click(screen.getByRole('button', { name: 'Jump to newest' }));
    expect(screen.queryByRole('button', { name: /Jump to/ })).toBeNull();
    expect(live).toHaveTextContent('');

    // Scrolling up again starts from "Jump to latest".
    scrollTo(list, 100);
    expect(screen.getByRole('button', { name: 'Jump to latest' })).toBeInTheDocument();
  });

  it('streamed growth of a message while scrolled up also counts', async () => {
    function Stream({ text }: { text: string }) {
      return (
        <Conversation>
          <p>{text}</p>
        </Conversation>
      );
    }
    const { rerender } = render(<Stream text="Hel" />);
    const list = screen.getByRole('region', { name: 'Conversation' });
    metrics(list, { scrollHeight: 1000, clientHeight: 400 });
    scrollTo(list, 600);
    scrollTo(list, 200);
    rerender(<Stream text="Hello" />);
    await act(() => Promise.resolve());
    expect(screen.getByRole('button', { name: 'Jump to newest' })).toBeInTheDocument();
  });

  it('leaves the announcement to the log when announce is on', async () => {
    const { rerender } = render(
      <Conversation announce>
        <p>a</p>
      </Conversation>,
    );
    const list = screen.getByRole('log', { name: 'Conversation' });
    metrics(list, { scrollHeight: 1000, clientHeight: 400 });
    scrollTo(list, 600);
    scrollTo(list, 200);
    rerender(
      <Conversation announce>
        <p>a</p>
        <p>b</p>
      </Conversation>,
    );
    await act(() => Promise.resolve());
    expect(screen.getByRole('button', { name: 'Jump to newest' })).toBeInTheDocument();
    expect(document.querySelector('.sr-only[aria-live]')).toBeNull();
  });

  it('accepts jumpToNewest / newMessages overrides', async () => {
    const msgs = { jumpToNewest: 'Neueste', newMessages: 'Neue Nachrichten' };
    const { rerender } = render(
      <Conversation messages={msgs}>
        <p>a</p>
      </Conversation>,
    );
    const list = screen.getByRole('region', { name: 'Conversation' });
    metrics(list, { scrollHeight: 1000, clientHeight: 400 });
    scrollTo(list, 600);
    scrollTo(list, 200);
    rerender(
      <Conversation messages={msgs}>
        <p>a</p>
        <p>b</p>
      </Conversation>,
    );
    await act(() => Promise.resolve());
    expect(screen.getByRole('button', { name: 'Neueste' })).toBeInTheDocument();
    expect(document.querySelector('.sr-only[aria-live]')).toHaveTextContent('Neue Nachrichten');
  });

  describe('thinking slot', () => {
    function Think({ count = 1, thinking }: { count?: number; thinking?: React.ReactNode }) {
      return (
        <Conversation {...(thinking !== undefined && { thinking })}>
          {Array.from({ length: count }, (_, i) => <p key={i}>Message {i}</p>)}
        </Conversation>
      );
    }

    it('renders after the messages in a polite status region; no wrapper without the prop', () => {
      const { rerender } = render(<Think />);
      expect(screen.queryByRole('status')).toBeNull();
      rerender(<Think thinking={<span>Thinking…</span>} />);
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveTextContent('Thinking…');
      expect(status.previousElementSibling).toHaveTextContent('Message 0');
      expect(status).toHaveClass('[overflow-anchor:none]');
      rerender(<Think thinking={null} />);
      expect(screen.getByRole('status')).toBeEmptyDOMElement();
    });

    it('stays in view while pinned', async () => {
      const { rerender } = render(<Think thinking={null} />);
      const list = screen.getByRole('region', { name: 'Conversation' });
      metrics(list, { scrollHeight: 1000, clientHeight: 400 });
      scrollTo(list, 600);
      metrics(list, { scrollHeight: 1080, clientHeight: 400 });
      rerender(<Think thinking={<span>Thinking…</span>} />);
      await act(() => Promise.resolve());
      expect(list.scrollTop).toBe(1080);
      expect(screen.queryByRole('button', { name: /Jump to/ })).toBeNull();
    });

    it('never scrolls, unpins or counts as new while scrolled up', async () => {
      const { rerender } = render(<Think thinking={null} />);
      const list = screen.getByRole('region', { name: 'Conversation' });
      metrics(list, { scrollHeight: 1000, clientHeight: 400 });
      scrollTo(list, 600);
      scrollTo(list, 200);
      metrics(list, { scrollHeight: 1080, clientHeight: 400 });
      rerender(<Think thinking={<span>Thinking…</span>} />);
      await act(() => Promise.resolve());
      expect(list.scrollTop).toBe(200);
      expect(screen.getByRole('button', { name: 'Jump to latest' })).toBeInTheDocument();

      metrics(list, { scrollHeight: 1000, clientHeight: 400 });
      rerender(<Think thinking={null} />);
      await act(() => Promise.resolve());
      expect(list.scrollTop).toBe(200);
      expect(screen.getByRole('button', { name: 'Jump to latest' })).toBeInTheDocument();
      expect(document.querySelector('.sr-only[aria-live]')).toHaveTextContent('');

      // The slot itself mounting doesn't count either.
      rerender(<Think />);
      await act(() => Promise.resolve());
      rerender(<Think thinking={<span>Thinking…</span>} />);
      await act(() => Promise.resolve());
      expect(screen.getByRole('button', { name: 'Jump to latest' })).toBeInTheDocument();
    });
  });
});

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

import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import axe from 'axe-core';
import { MessageActions, MessageBubble } from './MessageBubble.js';

describe('MessageBubble', () => {
  it('labels and aligns by sender', () => {
    render(
      <>
        <MessageBubble from="user">Hi</MessageBubble>
        <MessageBubble from="assistant">Hello</MessageBubble>
        <MessageBubble from="system">Joined</MessageBubble>
      </>,
    );
    const user = screen.getByRole('article', { name: 'You said' });
    expect(user).toHaveClass('items-end');
    expect(screen.getByText('Hi')).toHaveClass('bg-[var(--color-primary-container)]', 'rounded-ee-[0.375rem]', 'max-w-[85%]');
    const assistant = screen.getByRole('article', { name: 'Assistant said' });
    expect(assistant).toHaveClass('items-start');
    expect(screen.getByText('Joined').closest('article')).toHaveClass('justify-center', 'text-label-sm');
  });

  it('uses name as the label when given', () => {
    render(<MessageBubble from="assistant" name="Nexub said">x</MessageBubble>);
    expect(screen.getByRole('article', { name: 'Nexub said' })).toBeInTheDocument();
  });

  it('shows an error line with retry', () => {
    const onRetry = vi.fn();
    render(<MessageBubble from="user" status="error" onRetry={onRetry}>Hi</MessageBubble>);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to send');
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('marks sending as busy', () => {
    render(<MessageBubble from="user" status="sending">Hi</MessageBubble>);
    expect(screen.getByRole('article')).toHaveAttribute('aria-busy', 'true');
  });

  it('renders no style attribute (strict CSP)', () => {
    const html = renderToString(
      <MessageBubble from="assistant" avatar={<span>A</span>}>
        Hi
        <MessageActions text="Hi" onFeedback={() => {}} onRegenerate={() => {}} />
      </MessageBubble>,
    );
    expect(html).not.toContain('style="');
  });
});

describe('MessageActions', () => {
  afterEach(() => vi.useRealTimers());

  it('renders only actions with handlers', () => {
    const { rerender } = render(<MessageActions text="x" />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    rerender(<MessageActions copy={false} onRegenerate={() => {}} />);
    expect(screen.getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual(['Regenerate']);
  });

  it('copies, swaps to a check, announces, then resets after 1.5s', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const { container } = render(<MessageActions text="answer" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    });
    expect(writeText).toHaveBeenCalledWith('answer');
    expect(screen.getByRole('status')).toHaveTextContent('Copied');
    expect(container.querySelector('.nx-check-draw')).not.toBeNull();
    act(() => vi.advanceTimersByTime(1500));
    expect(screen.getByRole('status')).toHaveTextContent('');
    expect(container.querySelector('.nx-check-draw')).toBeNull();
  });

  it('thumbs are mutually exclusive toggles', () => {
    const onFeedback = vi.fn();
    render(<MessageActions copy={false} onFeedback={onFeedback} />);
    const up = screen.getByRole('button', { name: 'Good response' });
    const down = screen.getByRole('button', { name: 'Bad response' });
    fireEvent.click(up);
    expect(up).toHaveAttribute('aria-pressed', 'true');
    expect(down).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(down);
    expect(up).toHaveAttribute('aria-pressed', 'false');
    expect(down).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(down);
    expect(down).toHaveAttribute('aria-pressed', 'false');
    expect(onFeedback.mock.calls).toEqual([['up'], ['down'], [null]]);
  });

  it('calls onRegenerate', () => {
    const onRegenerate = vi.fn();
    render(<MessageActions onRegenerate={onRegenerate} />);
    fireEvent.click(screen.getByRole('button', { name: 'Regenerate' }));
    expect(onRegenerate).toHaveBeenCalledOnce();
  });
});

describe('MessageBubble 11.5', () => {
  it('from="other" shows the name and meta header and is named by the sender', () => {
    render(
      <MessageBubble from="other" name="Ada Lovelace" meta="09:41" avatar={<span>AL</span>}>
        Sounds good
      </MessageBubble>,
    );
    const article = screen.getByRole('article', { name: 'Ada Lovelace' });
    expect(article).toHaveAttribute('data-from', 'other');
    expect(article).toHaveClass('items-start');
    expect(screen.getByText('Ada Lovelace')).toBeVisible();
    expect(screen.getByText('09:41')).toBeVisible();
    expect(screen.getByText('Sounds good')).toHaveClass('bg-[var(--color-surface-container-high)]');
  });

  it('meta works for user; name stays an accessible label only for user', () => {
    render(<MessageBubble from="user" name="Me" meta="09:42">Hi</MessageBubble>);
    expect(screen.getByText('09:42')).toBeInTheDocument();
    expect(screen.queryByText('Me')).toBeNull();
  });

  it('MessageActions renders custom actions and children', () => {
    const onSelect = vi.fn();
    render(
      <MessageActions copy={false} actions={[{ label: 'Pin', icon: <span aria-hidden="true">*</span>, onSelect }]}>
        <button type="button">More</button>
      </MessageActions>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Pin' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
  });

  it('11.5 is axe-clean', async () => {
    const { container } = render(
      <>
        <MessageBubble from="other" name="Ada" meta="09:41">Hi</MessageBubble>
        <MessageBubble from="assistant" meta="09:42">
          Hello
          <MessageActions actions={[{ label: 'Pin', icon: <span aria-hidden="true">*</span>, onSelect: () => {} }]} />
        </MessageBubble>
      </>,
    );
    const { violations } = await axe.run(container);
    expect(violations).toEqual([]);
  });
});

import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StreamingText } from './StreamingText.js';

describe('StreamingText', () => {
  it('renders initial text statically, without fade spans', () => {
    const { container } = render(<StreamingText text="Hello" streaming />);
    expect(container.firstChild).toHaveTextContent('Hello');
    expect(container.querySelectorAll('.nx-reveal')).toHaveLength(0);
  });

  it('wraps only the newly appended tail in nx-reveal', () => {
    const { container, rerender } = render(<StreamingText text="Hello" streaming />);
    rerender(<StreamingText text="Hello world" streaming />);
    const spans = container.querySelectorAll('.nx-reveal');
    expect(spans).toHaveLength(1);
    expect(spans[0]).toHaveTextContent(/^world$/);
    expect(container.firstChild).toHaveTextContent('Hello world');
  });

  it('caps animated spans at 3 and merges older ones into plain text', () => {
    const { container, rerender } = render(<StreamingText text="a" streaming />);
    let t = 'a';
    for (const ch of ['b', 'c', 'd', 'e', 'f']) {
      t += ch;
      rerender(<StreamingText text={t} streaming />);
    }
    const spans = [...container.querySelectorAll('.nx-reveal')].map((s) => s.textContent);
    expect(spans).toEqual(['d', 'e', 'f']);
    expect(container.firstChild).toHaveTextContent('abcdef');
  });

  it('shows the caret and aria-busy only while streaming', () => {
    const { container, rerender } = render(<StreamingText text="Hi" streaming />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('aria-busy', 'true');
    expect(el.querySelector('[data-caret]')).toHaveAttribute('aria-hidden', 'true');
    rerender(<StreamingText text="Hi there" streaming={false} />);
    expect(el).toHaveAttribute('aria-busy', 'false');
    expect(el.querySelector('[data-caret]')).toBeNull();
    expect(el.querySelectorAll('.nx-reveal')).toHaveLength(0);
    expect(el).toHaveTextContent('Hi there');
  });

  it('replaces text that is not an append', () => {
    const { container, rerender } = render(<StreamingText text="First answer" streaming />);
    rerender(<StreamingText text="Second" streaming />);
    expect(container.firstChild).toHaveTextContent(/^Second$/);
    expect(container.querySelectorAll('.nx-reveal')).toHaveLength(0);
  });

  it('is not a live region unless opted in', () => {
    const { container, rerender } = render(<StreamingText text="x" />);
    expect(container.firstChild).toHaveAttribute('aria-live', 'off');
    rerender(<StreamingText text="x" aria-live="polite" as="p" />);
    expect(container.querySelector('p')).toHaveAttribute('aria-live', 'polite');
  });

  it('renders no style attribute (strict CSP)', () => {
    expect(renderToString(<StreamingText text="Hello" streaming />)).not.toContain('style="');
  });
});

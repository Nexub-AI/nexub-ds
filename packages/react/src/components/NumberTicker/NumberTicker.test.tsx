import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NumberTicker } from './NumberTicker.js';
import { Amount } from '../Amount/Amount.js';

const SHIFT = [
  'translate-y-0',
  '-translate-y-[10%]',
  '-translate-y-[20%]',
  '-translate-y-[30%]',
  '-translate-y-[40%]',
  '-translate-y-[50%]',
  '-translate-y-[60%]',
  '-translate-y-[70%]',
  '-translate-y-[80%]',
  '-translate-y-[90%]',
];
const strip = (el: Element) => el.lastElementChild as HTMLElement;

describe('NumberTicker', () => {
  it('maps each digit 0–9 to its strip offset class', () => {
    const { container } = render(<NumberTicker value="0123456789" />);
    const windows = container.querySelectorAll('[data-digit]');
    expect(windows).toHaveLength(10);
    windows.forEach((w, d) => {
      expect(w.getAttribute('data-digit')).toBe(String(d));
      expect(strip(w)).toHaveClass(SHIFT[d]!);
    });
  });

  it('renders separators, currency and sign as static text', () => {
    const { container } = render(<NumberTicker value={-1234.5} locale="en-US" format={{ style: 'currency', currency: 'USD' }} />);
    expect(container.querySelectorAll('[data-digit]')).toHaveLength(6);
    const statics = Array.from(container.querySelectorAll('[aria-hidden] > span:not([data-digit])')).map((s) => s.textContent);
    expect(statics).toEqual(['-', '$', ',', '.']);
  });

  it('holds the full value in a visually hidden span; strips are aria-hidden', () => {
    const { container, rerender } = render(<NumberTicker value={1234} locale="en-US" />);
    expect(container.querySelector('.sr-only')).toHaveTextContent('1,234');
    expect(container.querySelector('[data-digit]')!.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(container.firstElementChild).toHaveAttribute('aria-live', 'off');
    rerender(<NumberTicker value={1240} locale="en-US" aria-live="polite" />);
    expect(container.querySelector('.sr-only')).toHaveTextContent('1,240');
    expect(container.firstElementChild).toHaveAttribute('aria-live', 'polite');
  });

  it('rolls existing strips in place and fades only digits added after the first render', () => {
    const { container, rerender } = render(<NumberTicker value={99} />);
    expect(container.querySelector('[data-motion]')).toBeNull();
    const ones = container.querySelectorAll('[data-digit]')[1]!;
    rerender(<NumberTicker value={100} />);
    const windows = container.querySelectorAll('[data-digit]');
    expect(windows[2]).toBe(ones); // same element: it rolls, not remounts
    expect(strip(ones)).toHaveClass('translate-y-0');
    expect(windows[0]).toHaveAttribute('data-motion', 'from-fade');
    expect(windows[2]).not.toHaveAttribute('data-motion');
  });

  it('springs the strip and drops the transition under reduced motion', () => {
    const { container } = render(<NumberTicker value={5} />);
    const s = strip(container.querySelector('[data-digit]')!);
    expect(s).toHaveClass('transition-transform', 'duration-spatial-default', 'ease-spatial-default', 'motion-reduce:transition-none');
  });

  it('server-renders the final value with no style attribute and no enter motion', () => {
    const html = renderToString(<NumberTicker value={-98765.43} locale="en-US" />);
    expect(html).not.toMatch(/ style="/);
    expect(html).not.toMatch(/data-motion/);
    expect(html).toContain('-98,765.43');
  });
});

describe('Amount animate', () => {
  it('animate=false renders plain text exactly as before', () => {
    const { container } = render(<Amount value={-1234.5} currency="USD" locale="en-US" size="display" />);
    expect(container.querySelector('[data-digit]')).toBeNull();
    expect(container.textContent).toBe('−$1,234.50');
    expect(container.querySelectorAll('.text-\\[0\\.55em\\]')).toHaveLength(3);
  });

  it('animate=true rolls digits and keeps the muted symbol and minor units', () => {
    const { container } = render(<Amount value={-1234.5} currency="USD" locale="en-US" size="display" animate />);
    expect(container.querySelector('.sr-only')).toHaveTextContent('−$1,234.50');
    expect(container.querySelectorAll('[data-digit]')).toHaveLength(6);
    // $, ".", "5", "0" carry the muted class.
    expect(container.querySelectorAll('[aria-hidden] > .text-\\[0\\.55em\\]')).toHaveLength(4);
    expect(renderToString(<Amount value={12} currency="USD" animate />)).not.toMatch(/ style="/);
  });
});

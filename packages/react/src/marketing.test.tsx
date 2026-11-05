// Marketing mode hooks in @nexub/react: the variants add marker classes that
// @nexub/themes/marketing styles only under [data-mode="marketing"], and the
// scroll helpers never hide content from the first (server) render.
import * as React from 'react';
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button, Card, EyebrowChip, Marquee, NumberTicker, Reveal } from './index.js';

let observed: { cb: IntersectionObserverCallback; el?: Element }[] = [];
const enter = () => act(() => observed.forEach((o) => o.cb([{ isIntersecting: true, target: o.el } as IntersectionObserverEntry], {} as IntersectionObserver)));

beforeEach(() => {
  observed = [];
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      entry: { cb: IntersectionObserverCallback; el?: Element };
      constructor(cb: IntersectionObserverCallback) {
        this.entry = { cb };
        observed.push(this.entry);
      }
      observe(el: Element) {
        this.entry.el = el;
      }
      disconnect() {}
    },
  );
  vi.stubGlobal('CSS', { supports: () => false });
  // Below the fold.
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ top: 5000 } as DOMRect);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('marketing variants', () => {
  it('Button hero is a filled button plus the marketing hook', () => {
    const { getByRole } = render(<Button variant="hero">Start</Button>);
    expect(getByRole('button').className).toContain('nx-mkt-hero-button');
    expect(getByRole('button').className).toContain('--button-filled-bg');
  });

  it('Card showcase takes a product accent as data-product', () => {
    const { container } = render(<Card variant="showcase" accent="payub">c</Card>);
    const card = container.firstElementChild!;
    expect(card.className).toContain('nx-mkt-showcase');
    expect(card.getAttribute('data-product')).toBe('payub');
  });

  it('EyebrowChip gradient with a decorative live dot', () => {
    const { container } = render(<EyebrowChip variant="gradient" live>Live</EyebrowChip>);
    expect(container.firstElementChild!.className).toContain('nx-mkt-eyebrow');
    expect(container.querySelector('.nx-mkt-live-dot')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('Marquee hides its second copy from assistive tech and focus', () => {
    const { container } = render(<Marquee><a href="#a">A</a></Marquee>);
    const rows = container.querySelectorAll('.nx-mkt-marquee-track > div');
    expect(rows).toHaveLength(2);
    expect(rows[1]!.getAttribute('aria-hidden')).toBe('true');
    expect(rows[1]!.hasAttribute('inert')).toBe(true);
  });
});

describe('scroll helpers', () => {
  it('NumberTicker countOnView zeroes digits below the fold, then counts up in view', () => {
    const { container } = render(<NumberTicker value="1,240" countOnView />);
    const digits = () => [...container.querySelectorAll('[data-digit]')].map((d) => d.getAttribute('data-digit')).join('');
    expect(container.querySelector('.sr-only')!.textContent).toBe('1,240');
    expect(digits()).toBe('0000');
    enter();
    expect(digits()).toBe('1240');
  });

  it('Reveal hides below-the-fold content only once JS runs, and shows it in view', () => {
    const { container } = render(<Reveal>Hi</Reveal>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.dataset.reveal).toBe('pending');
    enter();
    expect(el.dataset.reveal).toBe('done');
  });

  it('Reveal leaves content alone when CSS scroll-driven animation is supported', () => {
    vi.stubGlobal('CSS', { supports: () => true });
    const { container } = render(<Reveal>Hi</Reveal>);
    expect((container.firstElementChild as HTMLElement).dataset.reveal).toBeUndefined();
  });
});

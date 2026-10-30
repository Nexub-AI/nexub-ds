import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { Fade } from './Fade.js';
import { Slide } from './Slide.js';
import { Scale } from './Scale.js';
import { ListTransition, SkeletonSwap } from './ListTransition.js';

// jsdom has no AnimationEvent, so React may listen for the webkit-prefixed name.
const end = (el: Element) => {
  fireEvent(el, new Event('animationend', { bubbles: true }));
  fireEvent(el, new Event('webkitAnimationEnd', { bubbles: true }));
};

// ─── Springs ──────────────────────────────────────────────────────────────────

describe('Motion springs', () => {
  it('enters on the spring tokens by default', () => {
    const { container } = render(<Slide in><span>x</span></Slide>);
    const t = (container.firstChild as HTMLElement).style.transition;
    expect(t).toContain('opacity var(--motion-spring-effects-default-duration)');
    expect(t).toContain('transform var(--motion-spring-spatial-default-duration)');
  });

  it('maps duration to spring speed', () => {
    const { container } = render(<Fade in duration="fast"><span>x</span></Fade>);
    expect((container.firstChild as HTMLElement).style.transition).toContain('--motion-spring-effects-fast-duration');
  });

  it('exits faster on the effects spring', () => {
    const { container, rerender } = render(<Scale in><span>x</span></Scale>);
    rerender(<Scale in={false}><span>x</span></Scale>);
    const t = (container.firstChild as HTMLElement).style.transition;
    expect(t).toContain('transform var(--motion-spring-effects-fast-duration)');
  });

  it('keeps the legacy tokens when easing is passed', () => {
    const { container } = render(<Fade in easing="out"><span>x</span></Fade>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.transitionTimingFunction).toBe('var(--ease-out)');
    expect(el.style.transitionDuration).toBe('var(--duration-normal)');
  });

  it('drops travel under reduced motion', () => {
    const original = window.matchMedia;
    window.matchMedia = ((q: string) => ({
      matches: q.includes('reduce'), media: q, onchange: null,
      addEventListener: () => {}, removeEventListener: () => {},
      addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
    })) as typeof window.matchMedia;
    try {
      const { container } = render(<Slide in={false} direction="up"><span>x</span></Slide>);
      const el = container.firstChild as HTMLElement;
      expect(el.style.opacity).toBe('0');
      expect(el.style.transform).toBe('translateY(0)');
    } finally {
      window.matchMedia = original;
    }
  });
});

// ─── ListTransition ───────────────────────────────────────────────────────────

describe('ListTransition', () => {
  const List = ({ items }: { items: string[] }) => (
    <ListTransition as="ul" itemAs="li">
      {items.map((i) => <span key={i}>{i}</span>)}
    </ListTransition>
  );
  const item = (text: string) => screen.getByText(text).closest('li')!;

  it('renders the first items without animating them', () => {
    render(<List items={['a', 'b']} />);
    expect(item('a')).not.toHaveAttribute('data-state');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('animates added items in, then settles them', () => {
    const { rerender } = render(<List items={['a']} />);
    rerender(<List items={['a', 'b']} />);
    expect(item('b')).toHaveAttribute('data-state', 'enter');
    end(item('b'));
    expect(item('b')).not.toHaveAttribute('data-state');
  });

  it('keeps removed items in place while they exit, hidden from AT', () => {
    vi.useFakeTimers();
    try {
      const { rerender } = render(<List items={['a', 'b', 'c']} />);
      rerender(<List items={['a', 'c']} />);
      const items = screen.getAllByRole('listitem', { hidden: true });
      expect(items.map((li) => li.textContent)).toEqual(['a', 'b', 'c']);
      expect(item('b')).toHaveAttribute('data-state', 'exit');
      expect(item('b')).toHaveAttribute('aria-hidden', 'true');
      act(() => { vi.advanceTimersByTime(400); });
      expect(screen.queryByText('b')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('removes an exiting item on animationend', () => {
    const { rerender } = render(<List items={['a', 'b']} />);
    rerender(<List items={['a']} />);
    end(item('b'));
    expect(screen.queryByText('b')).not.toBeInTheDocument();
  });

  it('follows a reorder without losing items', () => {
    const { rerender } = render(<List items={['a', 'b', 'c']} />);
    rerender(<List items={['c', 'a', 'b']} />);
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['c', 'a', 'b']);
  });

  it('brings an exiting item back when it is re-added', () => {
    const { rerender } = render(<List items={['a', 'b']} />);
    rerender(<List items={['a']} />);
    rerender(<List items={['a', 'b']} />);
    expect(item('b')).toHaveAttribute('data-state', 'enter');
    expect(screen.getAllByText('b')).toHaveLength(1);
  });
});

// ─── SkeletonSwap ─────────────────────────────────────────────────────────────

describe('SkeletonSwap', () => {
  it('shows the skeleton and aria-busy while loading', () => {
    const { container } = render(
      <SkeletonSwap loading skeleton={<span>skel</span>}><p>content</p></SkeletonSwap>,
    );
    expect(screen.getByText('skel')).toBeInTheDocument();
    expect(screen.queryByText('content')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
  });

  it('crossfades to the content, then drops the skeleton', () => {
    vi.useFakeTimers();
    try {
      const { rerender, container } = render(
        <SkeletonSwap loading skeleton={<span>skel</span>}><p>content</p></SkeletonSwap>,
      );
      rerender(<SkeletonSwap loading={false} skeleton={<span>skel</span>}><p>content</p></SkeletonSwap>);
      expect(screen.getByText('content').parentElement).toHaveClass('nx-swap-in');
      expect(screen.getByText('skel').parentElement).toHaveClass('nx-swap-out');
      expect(container.firstChild).not.toHaveAttribute('aria-busy');
      act(() => { vi.advanceTimersByTime(400); });
      expect(screen.queryByText('skel')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('renders content directly when not loading at first', () => {
    render(<SkeletonSwap loading={false} skeleton={<span>skel</span>}><p>content</p></SkeletonSwap>);
    expect(screen.queryByText('skel')).not.toBeInTheDocument();
    expect(screen.getByText('content').parentElement).not.toHaveClass('nx-swap-in');
  });
});

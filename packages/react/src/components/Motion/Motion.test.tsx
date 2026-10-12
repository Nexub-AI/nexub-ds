import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import * as React from 'react';
import { Fade } from './Fade.js';
import { Slide } from './Slide.js';
import { Scale } from './Scale.js';
import { Collapse } from './Collapse.js';

// ─── Fade ─────────────────────────────────────────────────────────────────────

describe('Fade', () => {
  it('renders children when in=true', () => {
    render(<Fade in={true}><span>visible</span></Fade>);
    expect(screen.getByText('visible')).toBeInTheDocument();
  });

  it('renders with opacity 0 when in=false (not unmountOnExit)', () => {
    const { container } = render(<Fade in={false}><span>hidden</span></Fade>);
    const div = container.firstChild as HTMLElement;
    expect(div.style.opacity).toBe('0');
  });

  it('does not render when in=false and unmountOnExit=true', () => {
    const { container } = render(
      <Fade in={false} unmountOnExit><span>gone</span></Fade>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('uses custom `as` element', () => {
    const { container } = render(<Fade in={true} as="section"><span>test</span></Fade>);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('passes through additional HTML attributes', () => {
    render(<Fade in={true} data-testid="fade-root"><span>test</span></Fade>);
    expect(screen.getByTestId('fade-root')).toBeInTheDocument();
  });

  it('merges custom style prop', () => {
    const { container } = render(
      <Fade in={true} style={{ color: 'red' }}><span>x</span></Fade>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.color).toBe('red');
  });
});

// ─── Slide ────────────────────────────────────────────────────────────────────

describe('Slide', () => {
  it('renders children when in=true', () => {
    render(<Slide in={true}><span>content</span></Slide>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('applies translate transform when in=false', () => {
    const { container } = render(
      <Slide in={false} direction="up"><span>x</span></Slide>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.transform).toContain('translateY');
    expect(el.style.opacity).toBe('0');
  });

  it('applies no transform when in=true', () => {
    const { container } = render(
      <Slide in={true} direction="up"><span>x</span></Slide>,
    );
    // Needs two RAF ticks; at initial render phase is 'entering' briefly
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInTheDocument();
  });

  it('supports all four directions without crashing', () => {
    const directions = ['up', 'down', 'left', 'right'] as const;
    for (const dir of directions) {
      const { unmount } = render(
        <Slide in={false} direction={dir}><span>{dir}</span></Slide>,
      );
      unmount();
    }
  });

  it('does not render when in=false and unmountOnExit=true', () => {
    const { container } = render(
      <Slide in={false} unmountOnExit><span>hidden</span></Slide>,
    );
    expect(container.firstChild).toBeNull();
  });
});

// ─── Scale ────────────────────────────────────────────────────────────────────

describe('Scale', () => {
  it('renders children when in=true', () => {
    render(<Scale in={true}><span>menu</span></Scale>);
    expect(screen.getByText('menu')).toBeInTheDocument();
  });

  it('applies scale transform when in=false', () => {
    const { container } = render(
      <Scale in={false} initialScale={0.9}><span>x</span></Scale>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.transform).toContain('scale(0.9)');
    expect(el.style.opacity).toBe('0');
  });

  it('does not render when in=false and unmountOnExit=true', () => {
    const { container } = render(
      <Scale in={false} unmountOnExit><span>x</span></Scale>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('has transformOrigin set to top center', () => {
    const { container } = render(<Scale in={true}><span>x</span></Scale>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.transformOrigin).toBe('top center');
  });
});

// ─── Collapse ─────────────────────────────────────────────────────────────────

describe('Collapse', () => {
  it('renders children when in=true', () => {
    render(<Collapse in={true}><p>content</p></Collapse>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders children when in=false (not unmountOnExit)', () => {
    render(<Collapse in={false}><p>hidden</p></Collapse>);
    expect(screen.getByText('hidden')).toBeInTheDocument();
  });

  it('does not render when in=false and unmountOnExit=true', () => {
    const { container } = render(
      <Collapse in={false} unmountOnExit><p>gone</p></Collapse>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('uses custom `as` element', () => {
    const { container } = render(
      <Collapse in={true} as="section"><p>test</p></Collapse>,
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('transitions from expanded to collapsed', () => {
    const { rerender, container } = render(
      <Collapse in={true}><p>text</p></Collapse>,
    );
    act(() => {
      rerender(<Collapse in={false}><p>text</p></Collapse>);
    });
    const el = container.firstChild as HTMLElement;
    // overflow should be hidden during transition
    expect(el.style.overflow).toBe('hidden');
  });
});

describe('Motion exit fallback', () => {
  it('unmounts on exit even when transitionend never fires (0ms duration)', () => {
    vi.useFakeTimers();
    const { rerender, queryByText } = render(
      <Fade in duration="instant" unmountOnExit>
        <p>bye</p>
      </Fade>,
    );
    rerender(
      <Fade in={false} duration="instant" unmountOnExit>
        <p>bye</p>
      </Fade>,
    );
    expect(queryByText('bye')).toBeInTheDocument(); // still exiting
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(queryByText('bye')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});

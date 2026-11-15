import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Avatar } from './Avatar.js';

describe('Avatar', () => {
  it('renders initials from name', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders first initial only when single word name', () => {
    render(<Avatar name="John" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Avatar name="John Doe" className="custom-class" />);
    expect(screen.getByRole('img')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} name="John Doe" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('renders image when src is provided', () => {
    const { container } = render(<Avatar src="https://example.com/photo.jpg" name="John Doe" />);
    expect(container.querySelector('img[src]')).toBeInTheDocument();
  });

  it('falls back on image error and retries when src changes', () => {
    const { container, rerender } = render(<Avatar name="Jane Doe" src="/broken.png" />);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('JD')).toBeInTheDocument();
    rerender(<Avatar name="Jane Doe" src="/fixed.png" />);
    expect(container.querySelector('img')).toHaveAttribute('src', '/fixed.png');
  });

  it('renders fallback when no src or name', () => {
    render(<Avatar fallback={<span data-testid="fallback" />} />);
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('renders badge dot when badge=true', () => {
    const { container } = render(<Avatar name="John Doe" badge />);
    expect(container.querySelector('.absolute')).toBeInTheDocument();
  });

  it('applies aria-label from name', () => {
    render(<Avatar name="Jane Smith" />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Jane Smith');
  });

  it('is decorative without a name (no unlabelled role="img")', () => {
    const { container } = render(<Avatar fallback="N" />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps role="img" when labelled via aria-label', () => {
    render(<Avatar fallback="N" aria-label="Nexub" />);
    expect(screen.getByRole('img', { name: 'Nexub' })).toBeInTheDocument();
  });

  it('fades the image in once it loads', () => {
    const { container } = render(<Avatar name="Ada" src="/a.png" />);
    const img = container.querySelector('img')!;
    // Not loaded yet after hydration: hidden, then fades in.
    expect(img).toHaveClass('opacity-0', 'transition-opacity');
    fireEvent.load(img);
    expect(img).not.toHaveClass('opacity-0');
  });

  it('shows an already-cached image at once', () => {
    const w = vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(40);
    const c = vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
    const { container } = render(<Avatar name="Ada" src="/cached.png" />);
    expect(container.querySelector('img')).not.toHaveClass('opacity-0');
    w.mockRestore();
    c.mockRestore();
  });

  it('status draws a dot and joins the accessible name', () => {
    const { container } = render(<Avatar name="Ada Lovelace" status="away" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace, Away' })).toBeInTheDocument();
    expect(container.querySelector('.bg-\\[var\\(--color-warning\\)\\]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('badge still works without status', () => {
    const { container } = render(<Avatar name="Ada" badge />);
    expect(container.querySelector('.bg-\\[var\\(--color-success\\)\\]')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ada' })).toBeInTheDocument();
  });
});

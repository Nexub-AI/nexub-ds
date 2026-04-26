import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Banner } from './Banner.js';

describe('Banner', () => {
  it('renders children', () => {
    render(<Banner>Banner message</Banner>);
    expect(screen.getByText('Banner message')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<Banner title="System Notice">Details here</Banner>);
    expect(screen.getByText('System Notice')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Banner className="custom-class">Banner</Banner>);
    expect(screen.getByRole('banner')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Banner ref={ref}>Banner</Banner>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders close button when onClose is provided', () => {
    render(<Banner onClose={() => {}}>Banner</Banner>);
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Banner onClose={onClose}>Banner</Banner>);
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has no border-radius (full-width style)', () => {
    render(<Banner>Banner</Banner>);
    // Banner uses no rounded-* class
    expect(screen.getByRole('banner').className).not.toMatch(/rounded-lg/);
  });
});

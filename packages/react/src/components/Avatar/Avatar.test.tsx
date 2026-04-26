import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
});

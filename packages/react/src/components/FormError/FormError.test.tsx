import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormError } from './FormError.js';

describe('FormError', () => {
  it('renders error message', () => {
    render(<FormError>This field is required</FormError>);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<FormError className="custom-class">Error</FormError>);
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<FormError ref={ref}>Error</FormError>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it('has role="alert"', () => {
    render(<FormError>Error</FormError>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

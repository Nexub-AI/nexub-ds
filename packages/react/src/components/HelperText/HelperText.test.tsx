import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HelperText } from './HelperText.js';

describe('HelperText', () => {
  it('renders text content', () => {
    render(<HelperText>This is a hint</HelperText>);
    expect(screen.getByText('This is a hint')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<HelperText className="custom-class">Hint</HelperText>);
    expect(screen.getByText('Hint')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<HelperText ref={ref}>Hint</HelperText>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it('sets data-tone attribute', () => {
    render(<HelperText tone="info">Hint</HelperText>);
    expect(screen.getByText('Hint')).toHaveAttribute('data-tone', 'info');
  });

  it('tints text with the tone colour', () => {
    render(<HelperText tone="danger">Error</HelperText>);
    expect(screen.getByText('Error')).toHaveStyle({ color: 'var(--color-text-danger)' });
  });
});

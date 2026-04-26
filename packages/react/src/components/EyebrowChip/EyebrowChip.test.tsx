import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EyebrowChip } from './EyebrowChip.js';

describe('EyebrowChip', () => {
  it('renders children', () => {
    render(<EyebrowChip>New Feature</EyebrowChip>);
    expect(screen.getByText('New Feature')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<EyebrowChip className="custom-class">New Feature</EyebrowChip>);
    expect(screen.getByText('New Feature')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<EyebrowChip ref={ref}>New Feature</EyebrowChip>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('renders leadingIcon', () => {
    render(
      <EyebrowChip leadingIcon={<span data-testid="icon" />}>
        New Feature
      </EyebrowChip>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies small-caps styling', () => {
    render(<EyebrowChip>New Feature</EyebrowChip>);
    expect(screen.getByText('New Feature')).toHaveClass('uppercase');
  });
});

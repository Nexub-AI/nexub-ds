import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Text } from './Text.js';

describe('Text', () => {
  it('renders children', () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders a <p> by default', () => {
    const { container } = render(<Text>text</Text>);
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Text className="custom">text</Text>);
    expect(screen.getByText('text')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<Text ref={ref}>text</Text>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it('applies truncate class', () => {
    render(<Text truncate>long text</Text>);
    expect(screen.getByText('long text')).toHaveClass('truncate');
  });

  it('renders as child element with asChild', () => {
    const { getByRole } = render(
      <Text asChild>
        <span role="note">note text</span>
      </Text>,
    );
    expect(getByRole('note')).toBeInTheDocument();
  });
});

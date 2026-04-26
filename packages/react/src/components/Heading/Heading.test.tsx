import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Heading } from './Heading.js';

describe('Heading', () => {
  it('renders children', () => {
    render(<Heading>Hello World</Heading>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders h2 by default', () => {
    const { container } = render(<Heading>title</Heading>);
    expect(container.querySelector('h2')).toBeInTheDocument();
  });

  it('renders the correct heading tag for level', () => {
    const { container } = render(<Heading level={4}>title</Heading>);
    expect(container.querySelector('h4')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Heading className="custom">title</Heading>);
    expect(screen.getByText('title')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(<Heading ref={ref}>title</Heading>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it('renders as child element with asChild', () => {
    const { getByRole } = render(
      <Heading asChild>
        <div role="heading" aria-level={2}>title</div>
      </Heading>,
    );
    expect(getByRole('heading')).toBeInTheDocument();
  });
});

import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Container } from './Container.js';

describe('Container', () => {
  it('renders children', () => {
    const { getByText } = render(<Container>content</Container>);
    expect(getByText('content')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Container className="custom">x</Container>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Container ref={ref}>x</Container>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('centers horizontally with mx-auto', () => {
    const { container } = render(<Container>x</Container>);
    expect(container.firstChild).toHaveClass('mx-auto');
  });

  it('renders as child element with asChild', () => {
    const { getByRole } = render(
      <Container asChild>
        <main>content</main>
      </Container>,
    );
    expect(getByRole('main')).toBeInTheDocument();
  });
});

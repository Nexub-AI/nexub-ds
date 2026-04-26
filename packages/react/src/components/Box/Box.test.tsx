import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Box } from './Box.js';

describe('Box', () => {
  it('renders children', () => {
    const { getByText } = render(<Box>content</Box>);
    expect(getByText('content')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Box className="custom">x</Box>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Box ref={ref}>x</Box>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders a <div> by default', () => {
    const { container } = render(<Box>x</Box>);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('renders as child element with asChild', () => {
    const { getByRole } = render(
      <Box asChild>
        <nav>nav</nav>
      </Box>,
    );
    expect(getByRole('navigation')).toBeInTheDocument();
  });
});

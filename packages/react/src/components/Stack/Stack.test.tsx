import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stack } from './Stack.js';

describe('Stack', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Stack>
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    expect(getByText('A')).toBeInTheDocument();
    expect(getByText('B')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Stack className="custom">x</Stack>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Stack ref={ref}>x</Stack>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('defaults to column direction', () => {
    const { container } = render(<Stack>x</Stack>);
    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('applies row direction', () => {
    const { container } = render(<Stack direction="row">x</Stack>);
    expect(container.firstChild).toHaveClass('flex-row');
  });

  it('injects dividers between children', () => {
    const { getAllByText } = render(
      <Stack divider={<hr />}>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </Stack>,
    );
    const { container } = render(
      <Stack divider={<hr />}>
        <span>A</span>
        <span>B</span>
      </Stack>,
    );
    expect(container.querySelectorAll('hr')).toHaveLength(1);
  });
});

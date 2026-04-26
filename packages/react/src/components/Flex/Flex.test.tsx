import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Flex } from './Flex.js';

describe('Flex', () => {
  it('renders children', () => {
    const { getByText } = render(<Flex><span>A</span></Flex>);
    expect(getByText('A')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Flex className="custom">x</Flex>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Flex ref={ref}>x</Flex>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('defaults to row direction', () => {
    const { container } = render(<Flex>x</Flex>);
    expect(container.firstChild).toHaveClass('flex-row');
  });

  it('applies column direction', () => {
    const { container } = render(<Flex direction="column">x</Flex>);
    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('applies wrap class', () => {
    const { container } = render(<Flex wrap>x</Flex>);
    expect(container.firstChild).toHaveClass('flex-wrap');
  });
});

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Code } from './Code.js';

describe('Code', () => {
  it('renders children in inline mode', () => {
    render(<Code>const x = 1;</Code>);
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
  });

  it('renders a <code> element by default (inline=true)', () => {
    const { container } = render(<Code>snippet</Code>);
    expect(container.querySelector('code')).toBeInTheDocument();
    expect(container.querySelector('pre')).not.toBeInTheDocument();
  });

  it('renders a <pre><code> block when inline=false', () => {
    const { container } = render(<Code inline={false}>block</Code>);
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.querySelector('pre > code')).toBeInTheDocument();
  });

  it('forwards className on inline code', () => {
    const { container } = render(<Code className="custom">test</Code>);
    expect(container.querySelector('code')).toHaveClass('custom');
  });

  it('forwards className on block pre', () => {
    const { container } = render(
      <Code inline={false} className="custom">test</Code>,
    );
    expect(container.querySelector('pre')).toHaveClass('custom');
  });

  it('forwards ref in inline mode', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Code ref={ref}>ref test</Code>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('forwards ref in block mode', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Code ref={ref} inline={false}>ref test</Code>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('sets data-language attribute on block code', () => {
    const { container } = render(
      <Code inline={false} language="tsx">code</Code>,
    );
    expect(container.querySelector('code')).toHaveAttribute('data-language', 'tsx');
  });
});

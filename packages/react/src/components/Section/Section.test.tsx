import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Section } from './Section.js';

describe('Section', () => {
  it('renders children', () => {
    const { getByText } = render(<Section>content</Section>);
    expect(getByText('content')).toBeInTheDocument();
  });

  it('renders a <section> element by default', () => {
    const { container } = render(<Section>x</Section>);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Section className="custom">x</Section>);
    expect(container.querySelector('section')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Section ref={ref}>x</Section>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('applies paddingY class', () => {
    const { container } = render(<Section paddingY="lg">x</Section>);
    expect(container.querySelector('section')).toHaveClass('py-32');
  });
});

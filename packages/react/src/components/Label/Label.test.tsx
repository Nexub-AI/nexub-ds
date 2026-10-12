import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from './Label.js';

describe('Label', () => {
  it('renders label text', () => {
    render(<Label>Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Label className="custom-class">Label</Label>);
    expect(screen.getByText('Label').closest('label')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it('renders required asterisk when required is true', () => {
    render(<Label required>Email</Label>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies disabled styling when disabled', () => {
    render(<Label disabled>Label</Label>);
    expect(screen.getByText('Label').closest('label')).toHaveClass('opacity-50');
  });

  it('associates with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('tints text with the tone colour', () => {
    render(<Label tone="danger">Required field</Label>);
    expect(screen.getByText('Required field')).toHaveStyle({ color: 'var(--color-text-danger)' });
  });
});

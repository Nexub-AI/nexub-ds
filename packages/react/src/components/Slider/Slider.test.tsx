import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Slider } from './Slider.js';

describe('Slider', () => {
  it('renders', () => {
    render(<Slider defaultValue={[50]} aria-label="Volume" />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Slider defaultValue={[50]} aria-label="Volume" className="custom-class" />);
    // className is applied to the Root element (container div)
    const slider = screen.getByRole('slider');
    expect(slider.closest('.custom-class')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Slider ref={ref} defaultValue={[50]} aria-label="Volume" />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('renders multiple thumbs for multi-value slider', () => {
    render(<Slider defaultValue={[20, 80]} aria-label="Range" />);
    expect(screen.getAllByRole('slider')).toHaveLength(2);
  });
});

import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('Slider stability & a11y', () => {
  it('keeps the same thumb element (and focus) across controlled value changes', () => {
    const { rerender } = render(<Slider value={[10]} aria-label="Volume" />);
    const thumb = screen.getByRole('slider');
    thumb.focus();
    rerender(<Slider value={[20]} aria-label="Volume" />);
    expect(screen.getByRole('slider')).toBe(thumb);
    expect(document.activeElement).toBe(thumb);
  });

  it('labels each thumb', () => {
    render(<Slider defaultValue={[20, 80]} thumbLabels={['Minimum', 'Maximum']} />);
    expect(screen.getByRole('slider', { name: 'Minimum' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Maximum' })).toBeInTheDocument();
  });

  it('uses aria-label as the thumb name', () => {
    render(<Slider defaultValue={[50]} aria-label="Volume" />);
    expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
  });
});

describe('Slider marks and value', () => {
  it('renders a tick per mark, with labels', () => {
    const { container } = render(
      <Slider defaultValue={[50]} aria-label="Volume" marks={[0, { value: 50, label: 'Half' }, 100]} />,
    );
    expect(container.querySelectorAll('[data-mark]')).toHaveLength(3);
    expect(screen.getByText('Half')).toBeInTheDocument();
    expect((container.querySelector('[data-mark="0"]') as HTMLElement).style.insetInlineStart).toContain('0%');
  });

  it('shows the formatted value and keeps aria-valuetext in sync', () => {
    render(<Slider defaultValue={[40]} aria-label="Volume" showValue formatValue={(v) => `${v}%`} />);
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuetext', '40%');
    expect(thumb).toHaveTextContent('40%');
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(thumb).toHaveAttribute('aria-valuetext', '41%');
    expect(thumb).toHaveTextContent('41%');
  });

  it('hides the value until hover/focus with showValue="hover"', () => {
    render(<Slider defaultValue={[40]} aria-label="Volume" showValue="hover" />);
    expect(screen.getByText('40')).toHaveClass('opacity-0');
  });
});

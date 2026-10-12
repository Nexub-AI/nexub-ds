import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Rating } from './Rating.js';

describe('Rating', () => {
  it('renders 5 stars by default', () => {
    render(<Rating />);
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('renders custom max stars', () => {
    render(<Rating max={3} />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('forwards className', () => {
    render(<Rating className="custom-class" />);
    expect(screen.getByRole('radiogroup')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Rating ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('calls onValueChange when a star is clicked', () => {
    const onValueChange = vi.fn();
    render(<Rating onValueChange={onValueChange} />);
     
    fireEvent.click(screen.getAllByRole('radio')[2]!);
    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it('does not call onValueChange in readOnly mode', () => {
    const onValueChange = vi.fn();
    render(<Rating readOnly onValueChange={onValueChange} />);
     
    fireEvent.click(screen.getAllByRole('radio')[2]!);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('stars are disabled in readOnly mode', () => {
    render(<Rating readOnly />);
    screen.getAllByRole('radio').forEach((star) => {
      expect(star).toBeDisabled();
    });
  });

  it('reflects controlled value', () => {
    render(<Rating value={3} readOnly />);
    const stars = screen.getAllByRole('radio');
    expect(stars[2]).toHaveAttribute('aria-checked', 'true');
  });
});

describe('Rating keyboard', () => {
  it('exposes a single tab stop', () => {
    render(<Rating value={3} />);
    const stars = screen.getAllByRole('radio');
    expect(stars.filter((s) => s.tabIndex === 0)).toEqual([stars[2]]);
  });

  it('arrow keys move selection and focus; Home/End jump', () => {
    const onValueChange = vi.fn();
    render(<Rating onValueChange={onValueChange} />);
    const stars = screen.getAllByRole('radio');
    expect(stars[0]!.tabIndex).toBe(0); // nothing checked → first star
    stars[0]!.focus();
    fireEvent.keyDown(stars[0]!, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    expect(document.activeElement).toBe(stars[1]);
    fireEvent.keyDown(stars[1]!, { key: 'End' });
    expect(onValueChange).toHaveBeenLastCalledWith(5);
    fireEvent.keyDown(stars[4]!, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenLastCalledWith(5);
    fireEvent.keyDown(stars[4]!, { key: 'Home' });
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });
});

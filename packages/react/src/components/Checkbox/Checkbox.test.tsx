import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from './Checkbox.js';

describe('Checkbox', () => {
  it('renders', () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Checkbox aria-label="Accept terms" className="custom-class" />);
    expect(screen.getByRole('checkbox')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} aria-label="Accept terms" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('toggles checked state on click', () => {
    render(<Checkbox aria-label="Accept terms" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('renders in indeterminate state', () => {
    render(<Checkbox aria-label="Select all" checked="indeterminate" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
  });
});

describe('Checkbox 10.4 consistent controls', () => {
  it('sizes: md stays 18px (in rem), sm and lg scale the box and the check', () => {
    const { rerender } = render(<Checkbox aria-label="Accept" defaultChecked />);
    const box = screen.getByRole('checkbox');
    expect(box).toHaveClass('h-[1.125rem]', 'w-[1.125rem]');
    expect(box.querySelector('svg')).toHaveAttribute('width', '12');
    rerender(<Checkbox aria-label="Accept" defaultChecked size="sm" />);
    expect(box).toHaveClass('h-4', 'w-4');
    rerender(<Checkbox aria-label="Accept" defaultChecked size="lg" />);
    expect(box).toHaveClass('h-5', 'w-5');
    expect(box.querySelector('svg')).toHaveAttribute('width', '14');
  });

  it('invalid sets aria-invalid and does not leak to the DOM', () => {
    render(<Checkbox aria-label="Accept" invalid />);
    const box = screen.getByRole('checkbox');
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box).not.toHaveAttribute('invalid');
    expect(box).toHaveClass('aria-invalid:border-[var(--color-error)]');
  });

  it('readOnly: aria-readonly, focusable, click does not toggle but onClick runs', () => {
    const onClick = vi.fn();
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept" readOnly onClick={onClick} onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole('checkbox');
    expect(box).toHaveAttribute('aria-readonly', 'true');
    expect(box).not.toBeDisabled();
    fireEvent.click(box);
    expect(onClick).toHaveBeenCalled();
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(box).toHaveAttribute('data-state', 'unchecked');
  });
});

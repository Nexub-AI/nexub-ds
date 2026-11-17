import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from './Switch.js';

describe('Switch', () => {
  it('renders', () => {
    render(<Switch aria-label="Toggle setting" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Switch aria-label="Toggle setting" className="custom-class" />);
    expect(screen.getByRole('switch')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Switch ref={ref} aria-label="Toggle setting" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('toggles on click', () => {
    render(<Switch aria-label="Toggle setting" />);
    const switchEl = screen.getByRole('switch');
    expect(switchEl).toHaveAttribute('data-state', 'unchecked');
    fireEvent.click(switchEl);
    expect(switchEl).toHaveAttribute('data-state', 'checked');
  });

  it('loading: aria-busy, a thumb spinner, and clicks do not toggle', () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Toggle setting" loading onCheckedChange={onCheckedChange} />);
    const switchEl = screen.getByRole('switch');
    expect(switchEl).toHaveAttribute('aria-busy', 'true');
    expect(switchEl.querySelector('.animate-spin')).not.toBeNull();
    fireEvent.click(switchEl);
    expect(switchEl).toHaveAttribute('data-state', 'unchecked');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('renders thumb icons for each state', () => {
    render(
      <Switch
        aria-label="Toggle setting"
        checkedIcon={<svg data-testid="on" />}
        uncheckedIcon={<svg data-testid="off" />}
      />,
    );
    expect(screen.getByTestId('on').parentElement).toHaveClass('hidden', 'group-data-[state=checked]/thumb:flex');
    expect(screen.getByTestId('off').parentElement).toHaveClass('group-data-[state=unchecked]/thumb:flex');
    expect(screen.getByRole('switch')).toHaveAccessibleName('Toggle setting');
  });

  it('exposes the Signature hooks: classes and the per-size thumb travel', () => {
    render(<Switch aria-label="Toggle setting" size="lg" />);
    const root = screen.getByRole('switch');
    expect(root).toHaveClass('nx-switch', '[--nx-switch-travel:1.5rem]');
    expect(root.firstElementChild).toHaveClass('nx-switch-thumb');
  });
});

describe('Switch 10.4 consistent controls', () => {
  it('invalid sets aria-invalid and does not leak to the DOM', () => {
    render(<Switch aria-label="Toggle setting" invalid />);
    const el = screen.getByRole('switch');
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).not.toHaveAttribute('invalid');
    expect(el).toHaveClass('aria-invalid:data-[state=unchecked]:border-[var(--color-error)]');
  });

  it('readOnly: aria-readonly, focusable, click does not toggle', () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Toggle setting" readOnly onCheckedChange={onCheckedChange} />);
    const el = screen.getByRole('switch');
    expect(el).toHaveAttribute('aria-readonly', 'true');
    expect(el).not.toBeDisabled();
    fireEvent.click(el);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(el).toHaveAttribute('data-state', 'unchecked');
  });
});

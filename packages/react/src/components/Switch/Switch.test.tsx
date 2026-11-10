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
});

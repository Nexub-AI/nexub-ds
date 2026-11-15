import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MultiSelect } from './MultiSelect.js';

const options = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'pink', label: 'Pink' },
];

describe('MultiSelect', () => {
  it('opens on typing, toggles options into chips and stays open', async () => {
    const onValueChange = vi.fn();
    render(<MultiSelect options={options} onValueChange={onValueChange} aria-label="Colours" />);
    const input = screen.getByRole('combobox', { name: 'Colours' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.type(input, 'gr');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(screen.getByRole('option', { name: 'Green' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['green']);
    expect(screen.getByRole('button', { name: 'Remove Green' })).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Green' })).toHaveAttribute('aria-checked', 'true');
  });

  it('Backspace in an empty field removes the last chip', async () => {
    const onValueChange = vi.fn();
    render(<MultiSelect options={options} defaultValue={['red', 'blue']} onValueChange={onValueChange} aria-label="Colours" />);
    await userEvent.type(screen.getByRole('combobox'), '{Backspace}');
    expect(onValueChange).toHaveBeenLastCalledWith(['red']);
  });

  it('collapses extra chips into "+N more"', () => {
    render(<MultiSelect options={options} defaultValue={['red', 'green', 'blue', 'pink']} maxVisibleChips={2} aria-label="Colours" />);
    expect(screen.getByText('+2 more')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove Blue' })).toBeNull();
  });

  it('offers to create an option that matches nothing', async () => {
    const onCreate = vi.fn();
    render(<MultiSelect options={options} onCreate={onCreate} aria-label="Colours" />);
    await userEvent.type(screen.getByRole('combobox'), 'Teal');
    await userEvent.click(screen.getByRole('option', { name: /Create “Teal”/ }));
    expect(onCreate).toHaveBeenCalledWith('Teal');
  });

  it('keeps labels for selected values missing from async options', () => {
    const { rerender } = render(<MultiSelect options={options} value={['pink']} aria-label="Colours" />);
    rerender(<MultiSelect options={[]} value={['pink']} aria-label="Colours" />);
    expect(screen.getByText('Pink')).toBeInTheDocument();
  });

  it('Backspace during IME composition does not remove a chip (9.3)', () => {
    const onValueChange = vi.fn();
    render(<MultiSelect options={options} defaultValue={['red', 'blue']} onValueChange={onValueChange} aria-label="Colours" />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Backspace', isComposing: true });
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Backspace', keyCode: 229 });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

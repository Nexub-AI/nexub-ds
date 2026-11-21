import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Autocomplete } from './Autocomplete.js';

const people = [
  { value: 'u1', label: 'Aisha Rahman', description: 'aisha@nexub.test' },
  { value: 'u2', label: 'Ben Ong', description: 'ben@nexub.test' },
  { value: 'u3', label: 'Chen Wei', disabled: true },
];

describe('Autocomplete (11.2)', () => {
  it('has a visible label, finds by description, and shows it as a second line', async () => {
    render(<Autocomplete label="Owner" options={people} />);
    const input = screen.getByRole('combobox', { name: 'Owner' });
    await userEvent.type(input, 'ben@');
    const option = screen.getByRole('option', { name: /Ben Ong/ });
    expect(option).toHaveTextContent('ben@nexub.test');
    expect(screen.queryByRole('option', { name: /Aisha/ })).not.toBeInTheDocument();
  });

  it('clearOnSelect empties the text after a pick (add mode)', async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete aria-label="Add person" clearOnSelect options={people} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Add person' });
    await userEvent.type(input, 'ais');
    await userEvent.click(screen.getByRole('option', { name: /Aisha/ }));
    expect(onValueChange).toHaveBeenCalledWith('u1');
    expect(input).toHaveValue('');
  });

  it('onClear fires from the clear button and when the text is deleted', async () => {
    const onClear = vi.fn();
    render(<Autocomplete aria-label="Owner" options={people} value="u2" onClear={onClear} />);
    const input = screen.getByRole('combobox', { name: 'Owner' });
    expect(input).toHaveValue('Ben Ong');
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    await userEvent.type(input, 'a');
    await userEvent.type(input, '{Backspace}');
    expect(onClear).toHaveBeenCalledTimes(2);
  });

  it('a disabled option cannot be picked', async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete aria-label="Owner" options={people} onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Owner' }), 'chen');
    const option = screen.getByRole('option', { name: /Chen/ });
    expect(option).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(option);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

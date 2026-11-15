import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Autocomplete } from './Autocomplete.js';

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
];

// The list opens in a popover once the person types.
const typeIn = (text: string) => userEvent.type(screen.getByRole('combobox'), text);

describe('Autocomplete', () => {
  it('renders the input with placeholder and className', () => {
    render(<Autocomplete options={options} placeholder="Type to search" className="custom-autocomplete" />);
    expect(screen.getByPlaceholderText('Type to search')).toBeInTheDocument();
    expect(document.querySelector('.custom-autocomplete')).toBeInTheDocument();
  });

  it('shows the selected option label, not its id', () => {
    render(<Autocomplete options={options} value="vue" />);
    expect(screen.getByRole('combobox')).toHaveValue('Vue');
  });

  it('opens a list under the field, filters by label, and closes on select', async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete options={options} onValueChange={onValueChange} aria-label="Framework" />);
    const input = screen.getByRole('combobox', { name: 'Framework' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('option')).toBeNull();
    await typeIn('sve');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByRole('option', { name: 'React' })).toBeNull();
    await userEvent.click(screen.getByRole('option', { name: 'Svelte' }));
    expect(onValueChange).toHaveBeenCalledWith('svelte');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows skeleton rows with a status and a real ellipsis while loading', async () => {
    render(<Autocomplete options={options} loading />);
    await typeIn('r');
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('passes the typed text out and shows async options unfiltered', async () => {
    const onInputChange = vi.fn();
    // Server results that don't contain the typed text must still show.
    render(<Autocomplete options={[{ value: 'nyc', label: 'New York' }]} onInputChange={onInputChange} />);
    await typeIn('big apple');
    expect(onInputChange).toHaveBeenLastCalledWith('big apple');
    expect(screen.getByRole('option', { name: 'New York' })).toBeInTheDocument();
  });

  it('follows a controlled inputValue', () => {
    render(<Autocomplete options={options} inputValue="Rea" onInputChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveValue('Rea');
  });

  it('offers a create option for new text', async () => {
    const onCreate = vi.fn();
    render(<Autocomplete options={options} onCreate={onCreate} />);
    await typeIn('Solid');
    await userEvent.click(screen.getByRole('option', { name: /Create “Solid”/ }));
    expect(onCreate).toHaveBeenCalledWith('Solid');
  });
});

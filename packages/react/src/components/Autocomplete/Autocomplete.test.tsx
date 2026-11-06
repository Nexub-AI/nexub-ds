import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Autocomplete } from './Autocomplete.js';

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
];

describe('Autocomplete', () => {
  it('renders without crashing', () => {
    render(<Autocomplete options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the input with placeholder', () => {
    render(<Autocomplete options={options} placeholder="Type to search" />);
    expect(screen.getByPlaceholderText('Type to search')).toBeInTheDocument();
  });

  it('renders option items', () => {
    render(<Autocomplete options={options} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
    expect(screen.getByText('Svelte')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Autocomplete options={options} loading />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Autocomplete options={options} className="custom-autocomplete" />);
    expect(document.querySelector('.custom-autocomplete')).toBeInTheDocument();
  });
});

describe('Autocomplete behaviour', () => {
  it('shows the selected option label, not its id', () => {
    render(<Autocomplete options={options} value="vue" />);
    expect(screen.getByRole('combobox')).toHaveValue('Vue');
  });

  it('filters by label as the user types', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    render(<Autocomplete options={options} />);
    await userEvent.type(screen.getByRole('combobox'), 'sve');
    expect(screen.getByText('Svelte')).toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('renders a real ellipsis while loading', () => {
    render(<Autocomplete options={options} loading />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('passes the typed text out and shows async options unfiltered', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const onInputChange = vi.fn();
    // Server results that don't contain the typed text must still show.
    render(<Autocomplete options={[{ value: 'nyc', label: 'New York' }]} onInputChange={onInputChange} />);
    await userEvent.type(screen.getByRole('combobox'), 'big apple');
    expect(onInputChange).toHaveBeenLastCalledWith('big apple');
    expect(screen.getByText('New York')).toBeInTheDocument();
  });

  it('follows a controlled inputValue', () => {
    render(<Autocomplete options={options} inputValue="Rea" onInputChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveValue('Rea');
  });

  it('popover mode opens a list under the field and closes on select', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const onValueChange = vi.fn();
    render(<Autocomplete mode="popover" options={options} onValueChange={onValueChange} aria-label="Framework" />);
    const input = screen.getByRole('combobox', { name: 'Framework' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('option')).toBeNull();
    await userEvent.type(input, 'sve');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(screen.getByRole('option', { name: 'Svelte' }));
    expect(onValueChange).toHaveBeenCalledWith('svelte');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows skeleton rows with a status while loading', () => {
    render(<Autocomplete options={options} loading />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });

  it('offers a create option for new text', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const onCreate = vi.fn();
    render(<Autocomplete options={options} onCreate={onCreate} />);
    await userEvent.type(screen.getByRole('combobox'), 'Solid');
    await userEvent.click(screen.getByRole('option', { name: /Create “Solid”/ }));
    expect(onCreate).toHaveBeenCalledWith('Solid');
  });
});

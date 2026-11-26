import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ComboboxField, ComboboxPicker, type ComboboxOption } from './ComboboxField.js';

const people: ComboboxOption[] = [
  { value: 'u1', label: 'Aisha Rahman', description: 'aisha@nexub.test', keywords: ['Finance lead'], group: 'Finance' },
  { value: 'u2', label: 'Ben Ong', description: 'ben@nexub.test', group: 'Finance' },
  { value: 'u3', label: 'Chen Wei', description: 'chen@nexub.test', group: 'Sales' },
  { value: 'u4', label: 'Dana Lee', disabled: true, group: 'Sales' },
];

describe('ComboboxField (11.1)', () => {
  it('is a labelled combobox showing the picked label, with description and error', () => {
    render(<ComboboxField label="Manager" description="Who approves leave" error="Pick a manager" options={people} value="u2" onValueChange={() => {}} />);
    const trigger = screen.getByRole('combobox', { name: 'Manager' });
    expect(trigger).toHaveTextContent('Ben Ong');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAccessibleDescription(/Who approves leave/);
    expect(trigger).toHaveAccessibleDescription(/Pick a manager/);
  });

  it('opens a search list with groups, finds by keyword and description, and picks', async () => {
    const onValueChange = vi.fn();
    render(<ComboboxField label="Manager" options={people} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Manager' }));
    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getByText('Finance')).toBeInTheDocument();
    expect(within(listbox).getByText('Sales')).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'finance lead');
    expect(screen.getByRole('option', { name: /Aisha Rahman/ })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Ben Ong/ })).not.toBeInTheDocument();
    await userEvent.clear(screen.getByPlaceholderText('Search…'));
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'chen@');
    await userEvent.click(screen.getByRole('option', { name: /Chen Wei/ }));
    expect(onValueChange).toHaveBeenCalledWith('u3');
    expect(screen.getByRole('combobox', { name: 'Manager' })).toHaveTextContent('Chen Wei');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('disabled options cannot be picked', async () => {
    const onValueChange = vi.fn();
    render(<ComboboxPicker aria-label="Person" options={people} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Person' }));
    expect(screen.getByRole('option', { name: /Dana Lee/ })).toHaveAttribute('aria-disabled', 'true');
  });

  it('a "none" option clears the value to null', async () => {
    const onValueChange = vi.fn();
    render(<ComboboxPicker aria-label="Manager" noneOption="No manager" options={people} defaultValue="u1" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Manager' }));
    await userEvent.click(screen.getByRole('option', { name: 'No manager' }));
    expect(onValueChange).toHaveBeenCalledWith(null);
    expect(screen.getByRole('combobox', { name: 'Manager' })).toHaveTextContent('No manager');
  });

  it('async: onSearch gets the text, the list is not filtered locally, selectedOption labels the value', async () => {
    const onSearch = vi.fn();
    const { rerender } = render(
      <ComboboxPicker aria-label="Company" options={[]} onSearch={onSearch} loading value="c9" selectedOption={{ value: 'c9', label: 'Nexub Pte Ltd' }} />,
    );
    expect(screen.getByRole('combobox', { name: 'Company' })).toHaveTextContent('Nexub Pte Ltd');
    await userEvent.click(screen.getByRole('combobox', { name: 'Company' }));
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true');
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'acm');
    expect(onSearch).toHaveBeenLastCalledWith('acm');
    rerender(
      <ComboboxPicker
        aria-label="Company"
        options={[{ value: 'c1', label: 'Zeta Holdings' }]}
        onSearch={onSearch}
        value="c9"
        selectedOption={{ value: 'c9', label: 'Nexub Pte Ltd' }}
      />,
    );
    // Shown although "acm" doesn't match it: the server decided.
    expect(screen.getByRole('option', { name: 'Zeta Holdings' })).toBeInTheDocument();
  });

  it('name posts the value with a plain form; read-only does not open', async () => {
    const { container, rerender } = render(<ComboboxPicker aria-label="Country" name="country" options={people} value="u1" />);
    expect(container.querySelector('input[type=hidden][name=country]')).toHaveValue('u1');
    rerender(<ComboboxPicker aria-label="Country" name="country" options={people} value="u1" readOnly />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Country' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('placeholder shows when nothing is picked', () => {
    render(<ComboboxPicker aria-label="Owner" options={people} />);
    expect(screen.getByRole('combobox', { name: 'Owner' })).toHaveTextContent('Select…');
  });
});

describe('ComboboxPicker 12.1: long lists render only the rows in view', () => {
  const many = Array.from({ length: 400 }, (_, i) => ({ value: `c${i + 1}`, label: `City ${i + 1}` }));

  it('windows the list; End, Home (to the none option) and Enter work over all of it', async () => {
    const onValueChange = vi.fn();
    render(<ComboboxPicker options={many} noneOption="No city" aria-label="City" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'City' }));
    expect(screen.getAllByRole('option').length).toBeLessThan(40);
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-setsize', '401');
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('option', { name: 'City 400' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('option', { name: 'No city' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{End}{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('c400');
  });

  it('search ranks the whole list', async () => {
    render(<ComboboxPicker options={many} aria-label="City" />);
    await userEvent.click(screen.getByRole('combobox', { name: 'City' }));
    await userEvent.keyboard('City 321');
    expect(screen.getAllByRole('option')[0]).toHaveAccessibleName('City 321');
  });
});

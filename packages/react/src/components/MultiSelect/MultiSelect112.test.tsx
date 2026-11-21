import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MultiSelect, type MultiSelectOption } from './MultiSelect.js';

const avatar = (initials: string) => <span data-testid={`avatar-${initials}`}>{initials}</span>;
const people: MultiSelectOption[] = [
  { value: 'u1', label: 'Aisha Rahman', description: 'Finance', avatar: avatar('AR') },
  { value: 'u2', label: 'Ben Ong', description: 'Sales', avatar: avatar('BO') },
  { value: 'u3', label: 'Chen Wei', disabled: true },
];

describe('MultiSelect (11.2)', () => {
  it('shows avatars in the list and on chips, and a description line that is searched', async () => {
    const onValueChange = vi.fn();
    render(<MultiSelect aria-label="Reviewers" options={people} onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Reviewers' }), 'sales');
    const option = screen.getByRole('option', { name: /Ben Ong/ });
    expect(option).toHaveTextContent('Sales');
    expect(screen.getByTestId('avatar-BO')).toBeInTheDocument();
    await userEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith(['u2']);
  });

  it('does not pick a disabled option', async () => {
    const onValueChange = vi.fn();
    render(<MultiSelect aria-label="Reviewers" options={people} onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Reviewers' }), 'chen');
    await userEvent.click(screen.getByRole('option', { name: /Chen/ }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('onSearch turns off local filtering and keeps picked labels and avatars when they leave options', async () => {
    const onSearch = vi.fn();
    const { rerender } = render(<MultiSelect aria-label="Reviewers" options={people} value={['u1']} onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Reviewers' }), 'zz');
    expect(onSearch).toHaveBeenLastCalledWith('zz');
    expect(screen.getAllByRole('option')).toHaveLength(3);
    rerender(<MultiSelect aria-label="Reviewers" options={[]} value={['u1']} onSearch={onSearch} loading />);
    expect(screen.getByText('Aisha Rahman')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-AR')).toBeInTheDocument();
  });
});

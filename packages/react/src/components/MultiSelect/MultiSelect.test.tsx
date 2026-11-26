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
    render(
      <MultiSelect
        options={options}
        defaultValue={['red', 'blue']}
        onValueChange={onValueChange}
        aria-label="Colours"
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), '{Backspace}');
    expect(onValueChange).toHaveBeenLastCalledWith(['red']);
  });

  it('collapses extra chips into "+N more"', () => {
    render(
      <MultiSelect
        options={options}
        defaultValue={['red', 'green', 'blue', 'pink']}
        maxVisibleChips={2}
        aria-label="Colours"
      />,
    );
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
    const { rerender } = render(
      <MultiSelect options={options} value={['pink']} aria-label="Colours" />,
    );
    rerender(<MultiSelect options={[]} value={['pink']} aria-label="Colours" />);
    expect(screen.getByText('Pink')).toBeInTheDocument();
  });

  it('Backspace during IME composition does not remove a chip (9.3)', () => {
    const onValueChange = vi.fn();
    render(
      <MultiSelect
        options={options}
        defaultValue={['red', 'blue']}
        onValueChange={onValueChange}
        aria-label="Colours"
      />,
    );
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Backspace', isComposing: true });
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Backspace', keyCode: 229 });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('MultiSelect 10.4', () => {
  it('size sets the field min-height (md by default)', () => {
    const { rerender } = render(<MultiSelect options={options} aria-label="Colours" />);
    const field = () => screen.getByRole('combobox').parentElement!;
    expect(field()).toHaveClass('min-h-control-md');
    rerender(<MultiSelect options={options} aria-label="Colours" size="lg" />);
    expect(field()).toHaveClass('min-h-control-lg');
  });

  it('readOnly: cannot open, chips are not removable, Backspace keeps them', async () => {
    const onValueChange = vi.fn();
    render(
      <MultiSelect
        readOnly
        options={options}
        defaultValue={['red']}
        onValueChange={onValueChange}
        aria-label="Colours"
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Colours' });
    expect(input).toHaveAttribute('aria-readonly', 'true');
    expect(screen.queryByRole('button', { name: 'Remove Red' })).not.toBeInTheDocument();
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}{Backspace}');
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('MultiSelect sheet (10.6)', () => {
  const sheetAttr = () =>
    document.querySelector('[data-nx-sheet]')?.getAttribute('data-nx-sheet') ?? null;
  const sheetOptions = [{ value: 'one', label: 'One' }];

  it('sheet={false} keeps the popover (11.0)', async () => {
    render(<MultiSelect options={sheetOptions} aria-label="Sheet field" sheet={false} />);
    await userEvent.type(screen.getByRole('combobox'), 'o');
    expect(await screen.findByRole('option', { name: 'One' })).toBeInTheDocument();
    expect(sheetAttr()).toBeNull();
  });

  it('marks the list popover with data-nx-sheet="auto" by default (11.0)', async () => {
    const { unmount } = render(<MultiSelect options={sheetOptions} aria-label="Sheet field" />);
    await userEvent.type(screen.getByRole('combobox'), 'o');
    expect(await screen.findByRole('option', { name: 'One' })).toBeInTheDocument();
    expect(sheetAttr()).toBe('auto');
    unmount();

    render(<MultiSelect options={sheetOptions} aria-label="Sheet field" sheet="auto" />);
    await userEvent.type(screen.getByRole('combobox'), 'o');
    expect(
      (await screen.findByRole('option', { name: 'One' })).closest('[data-nx-sheet]'),
    ).toHaveAttribute('data-nx-sheet', 'auto');
  });
});

describe('MultiSelect 12.1: long lists render only the rows in view', () => {
  const many = Array.from({ length: 500 }, (_, i) => ({
    value: `v${i + 1}`,
    label: `Option ${i + 1}`,
    disabled: i === 1,
  }));
  const open = async () => {
    const input = screen.getByRole('combobox', { name: 'Many' });
    await userEvent.click(input); // opens with the first option active
    return input;
  };

  it('renders a window, and each row says where it is in the whole list', async () => {
    render(<MultiSelect options={many} aria-label="Many" />);
    await open();
    const rows = screen.getAllByRole('option');
    expect(rows.length).toBeGreaterThan(5);
    expect(rows.length).toBeLessThan(40);
    expect(rows[0]).toHaveAttribute('aria-setsize', '500');
    expect(rows[0]).toHaveAttribute('aria-posinset', '1');
  });

  it('keys move over every option, skip disabled ones, and End reaches the last', async () => {
    const onValueChange = vi.fn();
    render(<MultiSelect options={many} aria-label="Many" onValueChange={onValueChange} />);
    const input = await open();
    await userEvent.keyboard('{ArrowDown}'); // Option 2 is disabled: skipped
    expect(screen.getByRole('option', { name: 'Option 3' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Option 3' }).id,
    );
    await userEvent.keyboard('{End}');
    const last = screen.getByRole('option', { name: 'Option 500' });
    expect(last).toHaveAttribute('aria-selected', 'true');
    expect(last).toHaveAttribute('aria-posinset', '500');
    expect(input).toHaveAttribute('aria-activedescendant', last.id);
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-activedescendant', last.id);
    expect(screen.queryByRole('option', { name: 'Option 1' })).toBeNull(); // scrolled out of the window
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(['v500']);
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('search ranks the whole list the way cmdk does', async () => {
    render(<MultiSelect options={many} aria-label="Many" />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Many' }), 'Option 499');
    const rows = screen.getAllByRole('option');
    expect(rows[0]).toHaveAccessibleName('Option 499');
    expect(rows[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('virtualizeAbove raises the threshold', async () => {
    render(<MultiSelect options={many} virtualizeAbove={1000} aria-label="Many" />);
    await open();
    expect(screen.getAllByRole('option')).toHaveLength(500);
  });
});

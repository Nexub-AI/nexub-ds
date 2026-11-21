import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Select } from './Select.js';

describe('Select', () => {
  it('renders without crashing', () => {
    render(
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Option A</Select.Item>
          <Select.Item value="b">Option B</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('forwards className on Trigger', () => {
    render(
      <Select.Root>
        <Select.Trigger className="custom-trigger">
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
      </Select.Root>,
    );
    expect(screen.getByRole('combobox')).toHaveClass('custom-trigger');
  });

  it('clearable: resets to the placeholder and calls onValueChange("")', () => {
    const onValueChange = vi.fn();
    render(
      <Select.Root clearable defaultValue="a" onValueChange={onValueChange}>
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Option A</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('Option A');
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onValueChange).toHaveBeenCalledWith('');
    expect(screen.getByRole('combobox')).toHaveTextContent('Pick one');
    expect(screen.getByRole('combobox')).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Clear selection' })).not.toBeInTheDocument();
  });

  it('item description is the accessible description, not the name', () => {
    render(
      <Select.Root defaultOpen>
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a" description="The first one">Option A</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    const option = screen.getByRole('option');
    expect(option).toHaveAccessibleName('Option A');
    expect(option).toHaveAccessibleDescription('The first one');
  });

  it('searchable: filters items by text', () => {
    render(
      <Select.Root defaultOpen>
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Content searchable>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: 'ban' } });
    expect(screen.getByRole('option', { name: 'Banana' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Apple', hidden: true })).toHaveClass('hidden');
  });

  it('searchable: typing on an item moves into the filter field', () => {
    render(
      <Select.Root defaultOpen>
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Content searchable>
          <Select.Item value="apple">Apple</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    fireEvent.keyDown(screen.getByRole('option'), { key: 'p' });
    const search = screen.getByRole('textbox', { name: 'Search' });
    expect(search).toHaveValue('p');
    expect(search).toHaveFocus();
  });
});

describe('Select 10.4', () => {
  const renderSelect = (trigger: React.ComponentProps<typeof Select.Trigger>, onValueChange = vi.fn()) =>
    render(
      <Select.Root defaultValue="a" onValueChange={onValueChange}>
        <Select.Trigger {...trigger}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Option A</Select.Item>
          <Select.Item value="b">Option B</Select.Item>
        </Select.Content>
      </Select.Root>,
    );

  it('size: md is the default; sm and lg use the Input heights', () => {
    const { unmount } = renderSelect({});
    expect(screen.getByRole('combobox')).toHaveClass('h-control-md', 'px-3.5', 'text-body-md');
    unmount();
    renderSelect({ size: 'sm' });
    expect(screen.getByRole('combobox')).toHaveClass('h-control-sm', 'text-body-sm');
  });

  it('readOnly: aria-readonly, focusable, and the list cannot open or change', () => {
    const onValueChange = vi.fn();
    renderSelect({ readOnly: true }, onValueChange);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-readonly', 'true');
    expect(trigger).not.toBeDisabled();
    trigger.focus();
    expect(trigger).toHaveFocus();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.keyDown(trigger, { key: 'o' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger).toHaveTextContent('Option A');
  });
});

describe('Select sheet (10.6)', () => {
  const sheetAttr = () => document.querySelector('[data-nx-sheet]')?.getAttribute('data-nx-sheet') ?? null;
  const Open = ({ sheet }: { sheet?: boolean | 'auto' }) => (
    <Select.Root open>
      <Select.Trigger aria-label="Letter">
        <Select.Value placeholder="Pick one" />
      </Select.Trigger>
      <Select.Content sheet={sheet}>
        <Select.Item value="a">Option A</Select.Item>
      </Select.Content>
    </Select.Root>
  );

  it('sheet={false} keeps the popover (11.0)', () => {
    render(<Open sheet={false} />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(sheetAttr()).toBeNull();
  });

  it('marks the content with data-nx-sheet="auto" by default (11.0)', () => {
    const { unmount } = render(<Open />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(sheetAttr()).toBe('auto');
    unmount();
    render(<Open sheet="auto" />);
    expect(screen.getByRole('listbox')).toHaveAttribute('data-nx-sheet', 'auto');
  });
});

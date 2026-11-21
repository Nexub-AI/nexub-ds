import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { EmojiPicker, withSkinTone } from './EmojiPicker.js';

beforeEach(() => localStorage.clear());

describe('EmojiPicker (11.2)', () => {
  it('applies a skin tone after the first code point, dropping a variation selector', () => {
    expect(withSkinTone('👍', 3)).toBe('👍\u{1F3FD}');
    expect(withSkinTone('✌️', 1)).toBe('✌\u{1F3FB}');
    expect(withSkinTone('🧑‍💻', 5)).toBe('🧑\u{1F3FF}‍💻');
    expect(withSkinTone('👍', 0)).toBe('👍');
  });

  it('opens a lazily loaded grid, searches by name and keyword, and picks', async () => {
    const onValueChange = vi.fn();
    const { container } = render(<EmojiPicker aria-label="Space icon" name="icon" onValueChange={onValueChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Space icon' });
    expect(trigger).toHaveTextContent('Pick an emoji');
    await userEvent.click(trigger);
    const listbox = await screen.findByRole('listbox', { name: 'Pick an emoji' });
    expect(within(listbox).getByRole('group', { name: 'Smileys & emotion' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Search…' })).toHaveFocus();
    await userEvent.type(screen.getByRole('searchbox'), 'rocket');
    expect(within(screen.getByRole('listbox')).getAllByRole('option')).toHaveLength(1);
    await userEvent.clear(screen.getByRole('searchbox'));
    await userEvent.type(screen.getByRole('searchbox'), 'tada');
    await userEvent.click(screen.getByRole('option', { name: 'party popper' }));
    expect(onValueChange).toHaveBeenCalledWith('🎉');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent('🎉');
    expect(container.querySelector('input[type=hidden][name=icon]')).toHaveValue('🎉');
    expect(JSON.parse(localStorage.getItem('nx-emoji-recent')!)).toEqual(['🎉']);
  });

  it('shows recent picks first and finds nothing gracefully', async () => {
    render(<EmojiPicker.Panel recent={['🎉', '👍🏽']} />);
    const recent = await screen.findByRole('group', { name: 'Recently used' });
    expect(within(recent).getByRole('option', { name: 'party popper' })).toBeInTheDocument();
    expect(within(recent).getByRole('option', { name: 'thumbs up' })).toBeInTheDocument();
    await userEvent.type(screen.getByRole('searchbox'), 'zzzqqq');
    expect(screen.getByRole('status')).toHaveTextContent('No results found.');
  });

  it('moves through the grid with arrow keys and picks with Enter', async () => {
    const onValueChange = vi.fn();
    render(<EmojiPicker.Panel recent={[]} onValueChange={onValueChange} />);
    await screen.findByRole('listbox');
    await userEvent.click(screen.getByRole('searchbox'));
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'grinning face' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('option', { name: 'grinning face with big eyes' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    // 8 per row: index 1 + 8 = 9
    expect(screen.getByRole('option', { name: 'upside-down face' })).toHaveFocus();
    expect(screen.getByRole('option', { name: 'upside-down face' })).toHaveAttribute('tabindex', '0');
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getByRole('searchbox')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('😃');
  });

  it('category buttons jump to a section', async () => {
    render(<EmojiPicker.Panel recent={[]} />);
    await screen.findByRole('listbox');
    const categories = screen.getByRole('group', { name: 'Categories' });
    await userEvent.click(within(categories).getByRole('button', { name: 'Food & drink' }));
    expect(screen.getByRole('option', { name: 'red apple' })).toHaveFocus();
  });

  it('skin tone applies to toned emoji and is remembered', async () => {
    const onValueChange = vi.fn();
    render(<EmojiPicker.Panel recent={[]} onValueChange={onValueChange} />);
    await screen.findByRole('listbox');
    await userEvent.click(screen.getByRole('button', { name: 'Skin tone: Default' }));
    await userEvent.click(within(screen.getByRole('group', { name: 'Skin tone' })).getByRole('button', { name: 'Medium' }));
    expect(screen.getByRole('button', { name: 'Skin tone: Medium' })).toHaveFocus();
    expect(localStorage.getItem('nx-emoji-skin')).toBe('3');
    await userEvent.click(screen.getByRole('option', { name: 'thumbs up' }));
    expect(onValueChange).toHaveBeenLastCalledWith('👍\u{1F3FD}');
    await userEvent.click(screen.getByRole('option', { name: 'red heart' }));
    expect(onValueChange).toHaveBeenLastCalledWith('❤️');
  });

  it('read-only does not open; the selected emoji is marked', async () => {
    const { rerender } = render(<EmojiPicker aria-label="Icon" value="🚀" readOnly />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Icon' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    rerender(<EmojiPicker aria-label="Icon" value="🚀" />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Icon' }));
    expect(await screen.findByRole('option', { name: 'rocket' })).toHaveAttribute('aria-selected', 'true');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <EmojiPicker aria-label="Space icon" value="🚀" />
        <EmojiPicker.Panel recent={['🎉']} />
      </div>,
    );
    await screen.findByRole('listbox');
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

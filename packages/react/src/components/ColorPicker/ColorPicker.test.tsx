import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, it, expect, vi } from 'vitest';
import { ColorPicker } from './ColorPicker.js';
import { contrastRatio, parseHex } from './contrast.js';

describe('ColorPicker helpers', () => {
  it('parseHex normalises short, bare and upper-case hex; rejects the rest', () => {
    expect(parseHex('#ABC')).toBe('#aabbcc');
    expect(parseHex('abc')).toBe('#aabbcc');
    expect(parseHex(' #1A2b3C ')).toBe('#1a2b3c');
    expect(parseHex('#abcd')).toBeNull();
    expect(parseHex('red')).toBeNull();
  });

  it('contrastRatio follows WCAG 2.x', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 2);
    expect(contrastRatio('#fff', '#fff')).toBe(1);
    expect(contrastRatio('nope', '#fff')).toBeNull();
  });
});

describe('ColorPicker (11.2)', () => {
  it('shows the colour on a named trigger and posts it with a plain form', () => {
    const { container } = render(<ColorPicker aria-label="Brand colour" name="brand" defaultValue="#2563EB" />);
    const trigger = screen.getByRole('combobox', { name: 'Brand colour' });
    expect(trigger).toHaveTextContent('#2563eb');
    expect(container.querySelector('input[type=hidden][name=brand]')).toHaveValue('#2563eb');
  });

  it('picks a swatch by click and moves with arrow keys (roving focus)', async () => {
    const onValueChange = vi.fn();
    render(<ColorPicker aria-label="Colour" swatches={['#000000', { value: '#ff0000', label: 'Red' }, '#00ff00']} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Colour' }));
    const group = screen.getByRole('radiogroup', { name: 'Swatches' });
    expect(group).toBeInTheDocument();
    const black = screen.getByRole('radio', { name: '#000000' });
    expect(black).toHaveAttribute('aria-checked', 'true');
    expect(black).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('tabindex', '-1');
    black.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('#ff0000');
    await userEvent.click(screen.getByRole('radio', { name: '#00ff00' }));
    expect(onValueChange).toHaveBeenLastCalledWith('#00ff00');
    expect(screen.getByRole('combobox', { name: 'Colour' })).toHaveTextContent('#00ff00');
  });

  it('hex input normalises on Enter; invalid input keeps the last value and marks the input', async () => {
    const onValueChange = vi.fn();
    render(<ColorPicker aria-label="Colour" defaultValue="#000000" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Colour' }));
    const hex = screen.getByRole('textbox', { name: 'Hex' });
    await userEvent.clear(hex);
    await userEvent.type(hex, 'F0A{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('#ff00aa');
    expect(hex).toHaveValue('#ff00aa');
    await userEvent.clear(hex);
    await userEvent.type(hex, 'zzz{Enter}');
    expect(hex).toHaveAttribute('aria-invalid', 'true');
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('combobox', { name: 'Colour' })).toHaveTextContent('#ff00aa');
  });

  it('shows the contrast ratio and the AA hint against a background', async () => {
    const { rerender } = render(<ColorPicker aria-label="Text colour" value="#777777" contrastAgainst="#ffffff" />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Text colour' }));
    expect(screen.getByText('Contrast 4.4:1')).toBeInTheDocument();
    expect(screen.getByText(/Fails AA/)).toBeInTheDocument();
    rerender(<ColorPicker aria-label="Text colour" value="#000" contrastAgainst="#fff" />);
    expect(screen.getByText('Contrast 21.0:1')).toBeInTheDocument();
    expect(screen.getByText('Passes AA for text')).toBeInTheDocument();
  });

  it('read-only does not open; invalid marks the trigger', async () => {
    render(<ColorPicker aria-label="Colour" readOnly invalid />);
    const trigger = screen.getByRole('combobox', { name: 'Colour' });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(trigger);
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
  });

  it('has no axe violations when open', async () => {
    const { baseElement } = render(<ColorPicker aria-label="Colour" contrastAgainst="#ffffff" />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Colour' }));
    expect(screen.getByRole('dialog', { name: 'Colour' })).toBeInTheDocument();
    const { violations } = await axe.run(baseElement, {
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    });
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`)).toEqual([]);
  });
});

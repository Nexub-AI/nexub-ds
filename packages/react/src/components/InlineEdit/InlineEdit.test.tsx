import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { InlineEdit } from './InlineEdit.js';

function Harness({ onSave }: { onSave: (v: string) => void | Promise<unknown> }) {
  const [value, setValue] = React.useState('Acme');
  return (
    <InlineEdit
      label="Company"
      value={value}
      onSave={(v) => {
        const r = onSave(v);
        return r instanceof Promise ? r.then(() => setValue(v)) : setValue(v);
      }}
    />
  );
}

describe('InlineEdit', () => {
  it('Enter saves, Escape reverts, focus returns to the text', async () => {
    const onSave = vi.fn();
    render(<Harness onSave={onSave} />);
    await userEvent.click(screen.getByRole('button', { name: 'Edit Company, Acme' }));
    const input = screen.getByRole('textbox', { name: 'Company' });
    await userEvent.clear(input);
    await userEvent.type(input, 'Globex{Enter}');
    expect(onSave).toHaveBeenCalledWith('Globex');
    expect(screen.getByRole('button', { name: 'Edit Company, Globex' })).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await userEvent.type(screen.getByRole('textbox'), 'XX{Escape}');
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Edit Company, Globex' })).toHaveFocus();
  });

  it('a rejected save stays open and invalid', async () => {
    render(<Harness onSave={() => Promise.reject(new Error('nope'))} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.type(screen.getByRole('textbox'), '!{Enter}');
    await vi.waitFor(() => expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true'));
  });

  it('Enter and Escape during IME composition belong to the IME (9.3)', async () => {
    const onSave = vi.fn();
    render(<Harness onSave={onSave} />);
    await userEvent.click(screen.getByRole('button', { name: 'Edit Company, Acme' }));
    const input = screen.getByRole('textbox', { name: 'Company' });
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
    fireEvent.keyDown(input, { key: 'Escape', isComposing: true });
    expect(onSave).not.toHaveBeenCalled();
    expect(input).toBeInTheDocument(); // still editing
  });
});

import * as React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AlertDialog, usePrompt } from './AlertDialog.js';

describe('AlertDialog.Prompt (11.2)', () => {
  it('refuses an empty or short answer, then submits the trimmed answer and closes', async () => {
    const onSubmit = vi.fn();
    const onOpenChange = vi.fn();
    render(<AlertDialog.Prompt defaultOpen title="Reject claim" label="Reason" minLength={5} onSubmit={onSubmit} onOpenChange={onOpenChange} />);
    const field = screen.getByRole('textbox', { name: 'Reason' });
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required.');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    await userEvent.type(field, 'no');
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter at least 5 characters.');
    await userEvent.type(field, ' receipt  ');
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onSubmit).toHaveBeenCalledWith('no receipt');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('runs validate, and stays open showing the error when onSubmit rejects', async () => {
    let fail!: (e: Error) => void;
    const onSubmit = vi.fn(() => new Promise((_, reject) => (fail = reject)));
    render(
      <AlertDialog.Prompt
        defaultOpen
        title="Rename"
        label="Name"
        defaultValue="Q3"
        validate={(v) => (v === 'Q3' ? 'Pick a new name' : null)}
        onSubmit={onSubmit}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Pick a new name');
    await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), ' plan');
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('alertdialog').querySelector('form')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await act(async () => fail(new Error('Name taken')));
    expect(screen.getByRole('alert')).toHaveTextContent('Name taken');
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('can be multiline', () => {
    render(<AlertDialog.Prompt defaultOpen title="Note" label="Note" multiline />);
    expect(screen.getByRole('textbox', { name: 'Note' }).tagName).toBe('TEXTAREA');
  });
});

function Asker({ onAnswer }: { onAnswer: (v: string | null) => void }) {
  const [prompt, element] = usePrompt();
  return (
    <>
      <button onClick={async () => onAnswer(await prompt({ title: 'Archive space', label: 'Why?' }))}>Ask</button>
      {element}
    </>
  );
}

describe('usePrompt (11.2)', () => {
  it('resolves with the answer', async () => {
    const onAnswer = vi.fn();
    render(<Asker onAnswer={onAnswer} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ask' }));
    await userEvent.type(screen.getByRole('textbox', { name: 'Why?' }), 'Merged into Ops');
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await waitFor(() => expect(onAnswer).toHaveBeenCalledWith('Merged into Ops'));
  });

  it('resolves null when cancelled', async () => {
    const onAnswer = vi.fn();
    render(<Asker onAnswer={onAnswer} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ask' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(onAnswer).toHaveBeenCalledWith(null));
  });
});

import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axe from 'axe-core';
import { PromptInput } from './PromptInput.js';

const field = () => screen.getByRole('textbox', { name: 'Message' });

describe('PromptInput', () => {
  it('labels the field and describes the shortcut', () => {
    render(<PromptInput />);
    expect(field()).toHaveAccessibleDescription('Press Enter to send, Shift+Enter for a new line');
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
  });

  it('Enter submits and clears (uncontrolled); Shift+Enter does not', () => {
    const onSubmit = vi.fn();
    render(<PromptInput defaultValue="hi" onSubmit={onSubmit} />);
    fireEvent.keyDown(field(), { key: 'Enter', shiftKey: true });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.keyDown(field(), { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledWith('hi');
    expect(field()).toHaveValue('');
  });

  it('ignores Enter during IME composition', () => {
    const onSubmit = vi.fn();
    render(<PromptInput defaultValue="日本" onSubmit={onSubmit} />);
    fireEvent.keyDown(field(), { key: 'Enter', isComposing: true });
    fireEvent.keyDown(field(), { key: 'Enter', keyCode: 229 });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('cannot submit whitespace; Send is aria-disabled, not disabled', () => {
    const onSubmit = vi.fn();
    render(<PromptInput defaultValue="  " onSubmit={onSubmit} />);
    const send = screen.getByRole('button', { name: 'Send message' });
    expect(send).toHaveAttribute('aria-disabled', 'true');
    expect(send).not.toBeDisabled();
    fireEvent.click(send);
    fireEvent.keyDown(field(), { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('controlled: reports changes and keeps the value on submit', () => {
    const onValueChange = vi.fn();
    const onSubmit = vi.fn();
    render(<PromptInput value="draft" onValueChange={onValueChange} onSubmit={onSubmit} />);
    fireEvent.change(field(), { target: { value: 'draft!' } });
    expect(onValueChange).toHaveBeenCalledWith('draft!');
    expect(field()).toHaveValue('draft');
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(onSubmit).toHaveBeenCalledWith('draft');
    expect(field()).toHaveValue('draft');
  });

  it('streaming: Stop button and Escape call onStop; Enter does not submit', () => {
    const onStop = vi.fn();
    const onSubmit = vi.fn();
    render(<PromptInput status="streaming" defaultValue="next" onStop={onStop} onSubmit={onSubmit} />);
    expect(screen.queryByRole('button', { name: 'Send message' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Stop generating' }));
    fireEvent.keyDown(field(), { key: 'Escape' });
    expect(onStop).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(field(), { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submitting holds Send', () => {
    const onSubmit = vi.fn();
    render(<PromptInput status="submitting" defaultValue="x" onSubmit={onSubmit} />);
    expect(screen.getByRole('button', { name: 'Send message' })).toHaveAttribute('aria-disabled', 'true');
    fireEvent.keyDown(field(), { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('renders slots, custom label and messages', () => {
    render(
      <PromptInput
        label="Ask Nexub"
        messages={{ sendMessage: 'Send' }}
        attachments={<span>file.pdf</span>}
        actions={<button type="button">Attach</button>}
      />,
    );
    expect(screen.getByRole('textbox', { name: 'Ask Nexub' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    expect(screen.getByText('file.pdf')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Attach' })).toBeInTheDocument();
  });

  it('sets max rows through the CSSOM and renders no style attribute', () => {
    const { container } = render(<PromptInput maxRows={4} surface="glass" />);
    expect(container.querySelector('.grid')!.getAttribute('style')).toContain('--nx-max-rows: 4');
    expect(container.firstElementChild).toHaveAttribute('data-material', 'glass');
    expect(renderToString(<PromptInput maxRows={4} attachments="a" actions="b" />)).not.toMatch(/ style="/);
    expect(renderToString(<PromptInput status="streaming" />)).not.toMatch(/ style="/);
  });

  it('11.5 sendLabel puts visible text on Send', () => {
    const onSubmit = vi.fn();
    render(<PromptInput defaultValue="hi" sendLabel="Send" onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).toHaveBeenCalledWith('hi');
  });

  it('11.5 submitOn="mod-enter": Enter is a new line, Cmd/Ctrl+Enter sends, hint shown', () => {
    const onSubmit = vi.fn();
    render(<PromptInput defaultValue="hi" submitOn="mod-enter" onSubmit={onSubmit} />);
    expect(field()).toHaveAccessibleDescription('Press Ctrl+Enter to send, Enter for a new line');
    expect(screen.getByText('Press Ctrl+Enter to send, Enter for a new line')).toBeVisible();
    fireEvent.keyDown(field(), { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.keyDown(field(), { key: 'Enter', ctrlKey: true });
    fireEvent.keyDown(field(), { key: 'Enter', metaKey: true });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('11.5 hint and error are described; error marks the field invalid', () => {
    const { rerender } = render(<PromptInput hint="Replies use your workspace data" aria-describedby="ext" />);
    expect(field()).not.toHaveAttribute('aria-invalid');
    expect(field().getAttribute('aria-describedby')!.split(' ')).toHaveLength(3);
    rerender(<PromptInput hint="Replies use your workspace data" error="Too long" />);
    expect(field()).toHaveAttribute('aria-invalid', 'true');
    expect(field()).toHaveAccessibleDescription(
      'Too long Replies use your workspace data Press Enter to send, Shift+Enter for a new line',
    );
  });

  it('11.5 is axe-clean with a label, hint and error', async () => {
    const { container } = render(<PromptInput sendLabel="Send" submitOn="mod-enter" hint="Hint" error="Error" defaultValue="x" />);
    const { violations } = await axe.run(container);
    expect(violations).toEqual([]);
  });
});

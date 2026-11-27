import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axe from 'axe-core';
import { PromptInput, parseSlashCommand } from './PromptInput.js';
import type { CommandListItem } from '../CommandList/CommandList.js';

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

  describe('12.2 slash commands', () => {
    const commands: CommandListItem[] = [
      { value: 'remind', label: 'Remind me', description: 'Set a reminder', shortcut: ['⌘', 'R'] },
      { value: 'summarize', label: 'Summarize', keywords: ['tldr'] },
      { value: 'archive', label: 'Archive', disabled: true },
      { value: 'translate', label: 'Translate' },
    ];
    const input = () => screen.getByLabelText('Message');
    const type = (text: string) => fireEvent.change(input(), { target: { value: text } });
    const options = () => screen.getAllByRole('option');
    const activeOption = () => document.getElementById(input().getAttribute('aria-activedescendant')!);

    it('parses the id and the args', () => {
      expect(parseSlashCommand('hello')).toBeNull();
      expect(parseSlashCommand('/')).toEqual({ id: '', args: '', hasArgs: false });
      expect(parseSlashCommand('/rem')).toEqual({ id: 'rem', args: '', hasArgs: false });
      expect(parseSlashCommand('/remind ')).toEqual({ id: 'remind', args: '', hasArgs: true });
      expect(parseSlashCommand('/remind  tomorrow 9am ')).toEqual({ id: 'remind', args: 'tomorrow 9am', hasArgs: true });
      expect(parseSlashCommand('/remind\nline two')).toEqual({ id: 'remind', args: 'line two', hasArgs: true });
    });

    it('without the list open the field is a plain textbox (no combobox ARIA)', () => {
      render(<PromptInput commands={commands} defaultValue="hello" />);
      expect(field()).not.toHaveAttribute('aria-expanded');
      expect(field()).not.toHaveAttribute('aria-controls');
      expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('opens on "/" with combobox/listbox ARIA, filters, and ↑/↓ move the active option', async () => {
      render(<PromptInput commands={commands} />);
      type('/');
      const list = await screen.findByRole('listbox', { name: 'Commands' });
      const box = screen.getByRole('combobox', { name: 'Message' });
      expect(box).toHaveAttribute('aria-expanded', 'true');
      expect(box).toHaveAttribute('aria-controls', list.id);
      expect(box).toHaveAttribute('aria-autocomplete', 'list');
      expect(options()).toHaveLength(4);
      expect(activeOption()).toBe(options()[0]);
      expect(options()[0]).toHaveAttribute('aria-selected', 'true');
      expect(options()[2]).toHaveAttribute('aria-disabled', 'true');
      // ↓ skips the disabled option; ↓ from the last wraps to the first, ↑ back.
      fireEvent.keyDown(box, { key: 'ArrowDown' });
      expect(activeOption()).toHaveTextContent('summarize');
      fireEvent.keyDown(box, { key: 'ArrowDown' });
      expect(activeOption()).toHaveTextContent('translate');
      fireEvent.keyDown(box, { key: 'ArrowDown' });
      expect(activeOption()).toHaveTextContent('remind');
      fireEvent.keyDown(box, { key: 'ArrowUp' });
      expect(activeOption()).toHaveTextContent('translate');
      // Filtering by id, label or keywords; a new query starts at the top.
      type('/tld');
      expect(options()).toHaveLength(1);
      expect(activeOption()).toHaveTextContent('summarize');
      // Shortcut keys are shown but hidden from the accessible name.
      type('/rem');
      expect(options()[0]).toHaveTextContent('⌘R');
      expect(options()[0]).toHaveAccessibleName('/remind Remind me Set a reminder');
    });

    it('Enter picks the active command with no args and clears the field', async () => {
      const onCommand = vi.fn();
      const onSubmit = vi.fn();
      render(<PromptInput commands={commands} onCommand={onCommand} onSubmit={onSubmit} />);
      type('/su');
      await screen.findByRole('listbox');
      fireEvent.keyDown(input(), { key: 'Enter' });
      expect(onCommand).toHaveBeenCalledWith('summarize', '');
      expect(onSubmit).not.toHaveBeenCalled();
      expect(input()).toHaveValue('');
      expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('Tab picks; a click on an option picks; Shift+Tab is left alone', async () => {
      const onCommand = vi.fn();
      render(<PromptInput commands={commands} onCommand={onCommand} />);
      type('/');
      await screen.findByRole('listbox');
      fireEvent.keyDown(input(), { key: 'ArrowDown' });
      fireEvent.keyDown(input(), { key: 'Tab' });
      expect(onCommand).toHaveBeenLastCalledWith('summarize', '');
      type('/');
      fireEvent.click(screen.getByRole('option', { name: /translate/ }));
      expect(onCommand).toHaveBeenLastCalledWith('translate', '');
      type('/');
      fireEvent.keyDown(input(), { key: 'Tab', shiftKey: true });
      expect(onCommand).toHaveBeenCalledTimes(2);
    });

    it('a full command with args: Enter passes the text after the id', async () => {
      const onCommand = vi.fn();
      render(<PromptInput commands={commands} onCommand={onCommand} />);
      type('/remind tomorrow 9am');
      await screen.findByRole('listbox');
      expect(options()).toHaveLength(1);
      fireEvent.keyDown(input(), { key: 'Enter' });
      expect(onCommand).toHaveBeenCalledWith('remind', 'tomorrow 9am');
      expect(input()).toHaveValue('');
    });

    it('with no matching command, Enter submits as usual', async () => {
      const onCommand = vi.fn();
      const onSubmit = vi.fn();
      render(<PromptInput commands={commands} onCommand={onCommand} onSubmit={onSubmit} />);
      type('/');
      await screen.findByRole('listbox');
      type('/unknown thing');
      expect(screen.queryByRole('listbox')).toBeNull();
      expect(screen.getByRole('textbox', { name: 'Message' })).toBeInTheDocument();
      fireEvent.keyDown(input(), { key: 'Enter' });
      expect(onCommand).not.toHaveBeenCalled();
      expect(onSubmit).toHaveBeenCalledWith('/unknown thing');
    });

    it('Esc closes the list and keeps the text; typing reopens it; Shift+Enter does not pick', async () => {
      const onSubmit = vi.fn();
      const onCommand = vi.fn();
      render(<PromptInput commands={commands} onSubmit={onSubmit} onCommand={onCommand} />);
      type('/re');
      await screen.findByRole('listbox');
      fireEvent.keyDown(input(), { key: 'Enter', shiftKey: true });
      expect(onCommand).not.toHaveBeenCalled();
      fireEvent.keyDown(input(), { key: 'Escape' });
      expect(screen.queryByRole('listbox')).toBeNull();
      expect(input()).toHaveValue('/re');
      expect(input()).not.toHaveAttribute('aria-expanded');
      // Closed: Enter submits the text.
      fireEvent.keyDown(input(), { key: 'Enter' });
      expect(onSubmit).toHaveBeenCalledWith('/re');
      type('/rem');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('controlled: the pick is reported and the value is left to the parent', async () => {
      const onCommand = vi.fn();
      const onValueChange = vi.fn();
      const { rerender } = render(
        <PromptInput commands={commands} value="/" onValueChange={onValueChange} onCommand={onCommand} />,
      );
      await screen.findByRole('listbox');
      fireEvent.keyDown(input(), { key: 'Enter' });
      expect(onCommand).toHaveBeenCalledWith('remind', '');
      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.queryByRole('listbox')).toBeNull();
      rerender(<PromptInput commands={commands} value="/t" onValueChange={onValueChange} onCommand={onCommand} />);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('normal typing and submit are unaffected by commands', () => {
      const onSubmit = vi.fn();
      render(<PromptInput commands={commands} defaultValue="hi /remind" onSubmit={onSubmit} />);
      fireEvent.keyDown(field(), { key: 'ArrowDown' });
      fireEvent.keyDown(field(), { key: 'Enter' });
      expect(onSubmit).toHaveBeenCalledWith('hi /remind');
      expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('is axe-clean with the list open', async () => {
      const { container } = render(<PromptInput commands={commands} />);
      type('/');
      await screen.findByRole('listbox');
      // role="combobox" on a <textarea> is what the ARIA combobox pattern asks for while the list
      // is open; axe's HTML best-practice rule (aria-allowed-role) only lists it for <input>.
      const { violations } = await axe.run(container, { rules: { 'aria-allowed-role': { enabled: false } } });
      expect(violations).toEqual([]);
    });
  });

  describe('12.2 chips', () => {
    it('renders a labelled, Tab-reachable row above the field', () => {
      render(
        <PromptInput
          chips={
            <>
              <button type="button">Yes</button>
              <button type="button">No</button>
            </>
          }
        />,
      );
      const row = screen.getByRole('group', { name: 'Suggestions' });
      expect(row).toContainElement(screen.getByRole('button', { name: 'Yes' }));
      expect(row.compareDocumentPosition(field()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      screen.getByRole('button', { name: 'Yes' }).focus();
      expect(screen.getByRole('button', { name: 'Yes' })).toHaveFocus();
      expect(row).not.toHaveAttribute('data-nx-overflow');
    });

    it('takes a custom label; without chips the DOM is as before', () => {
      const { container, rerender } = render(<PromptInput />);
      expect(container.firstElementChild).toHaveAttribute('data-status', 'idle');
      rerender(<PromptInput chips={<button type="button">Hi</button>} messages={{ promptSuggestions: 'Quick replies' }} />);
      expect(screen.getByRole('group', { name: 'Quick replies' })).toBeInTheDocument();
    });
  });
});

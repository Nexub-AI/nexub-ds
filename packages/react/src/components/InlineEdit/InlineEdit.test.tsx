import axe from 'axe-core';
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

describe('InlineEdit 11.5', () => {
  it('size maps to a type role on the text and the input', async () => {
    render(<InlineEdit label="Title" value="Roadmap" onSave={() => {}} size="headline" />);
    const button = screen.getByRole('button', { name: 'Edit Title, Roadmap' });
    expect(button.className).toContain('text-headline-sm');
    await userEvent.click(button);
    expect(screen.getByRole('textbox', { name: 'Title' }).className).toContain('text-headline-sm');
  });

  it('as wraps the text and the input in a heading, which stays while editing', async () => {
    render(<InlineEdit label="Title" value="Roadmap" onSave={() => {}} as="h2" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toContainElement(screen.getByRole('button', { name: 'Edit Title, Roadmap' }));
    // No size: the text takes the heading's type.
    expect(screen.getByRole('button').className).not.toContain('text-body-md');
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('heading', { level: 2 })).toContainElement(screen.getByRole('textbox'));
  });

  it('as takes a component, e.g. a dialog title', () => {
    const Title = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>((props, ref) => (
      <h3 ref={ref} data-title="" {...props} />
    ));
    render(<InlineEdit label="Title" value="Roadmap" onSave={() => {}} as={Title} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveAttribute('data-title');
  });

  it('maxLength caps the input and shows a counter', async () => {
    render(<InlineEdit label="Name" value="Acme" onSave={() => {}} maxLength={6} />);
    await userEvent.click(screen.getByRole('button'));
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('maxLength', '6');
    expect(screen.getByText('4/6')).toBeInTheDocument();
    await userEvent.type(input, 'Corp');
    expect(input).toHaveValue('AcmeCo');
  });

  it('without the new props it renders as before', () => {
    render(<InlineEdit label="Name" value="Acme" onSave={() => {}} />);
    expect(screen.getByRole('button').className).toContain('text-body-md');
    expect(screen.queryByRole('heading')).toBeNull();
  });
});

it('InlineEdit in a heading has no axe violations, editing or not', async () => {
  const { container } = render(<InlineEdit label="Title" value="Roadmap" onSave={() => {}} as="h2" size="title" maxLength={40} />);
  const run = async () => (await axe.run(container, { rules: { region: { enabled: false }, 'color-contrast': { enabled: false } } })).violations.map((v) => v.id);
  expect(await run()).toEqual([]);
  await userEvent.click(screen.getByRole('button'));
  expect(await run()).toEqual([]);
});

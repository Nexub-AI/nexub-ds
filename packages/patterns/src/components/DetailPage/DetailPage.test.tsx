import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Badge, Input } from '@nexub/react';
import { DetailPage, type DetailSection } from './index.js';

// No pause between keystrokes: on a busy CI runner the default delay let a long
// type() pass the test timeout and leak keys into the next test.
const type = (el: Element, text: string) => userEvent.setup({ delay: null }).type(el, text);

const sections: DetailSection[] = [
  {
    id: 'contact',
    title: 'Contact',
    description: 'How we reach this customer.',
    fields: [
      { name: 'name', label: 'Name', value: 'Ada Park', input: <Input defaultValue="Ada Park" required /> },
      { name: 'email', label: 'Email', value: 'ada@harbour.test', input: <Input type="email" defaultValue="ada@harbour.test" />, span: 2 },
      { name: 'id', label: 'Customer ID', value: 'CUS-1042', span: 2 },
      { name: 'note', label: 'Note', value: 'None', input: 'Edited elsewhere' },
    ],
  },
  { id: 'billing', title: 'Billing', fields: [{ name: 'plan', label: 'Plan', value: 'Team' }] },
];

describe('DetailPage', () => {
  it('view mode: h1, back link, status, sections as description lists and the aside', () => {
    render(
      <DetailPage
        title="Ada Park"
        subtitle="Customer since 2024"
        status={<Badge tone="success">Active</Badge>}
        backHref="/customers"
        sections={sections}
        aside={<p>Activity</p>}
      />,
    );
    expect(screen.getByRole('main', { name: 'Ada Park' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Ada Park' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/customers');
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Contact' })).toHaveTextContent('ada@harbour.test');
    expect(screen.getByRole('region', { name: 'Billing' })).toHaveTextContent('Team');
    expect(screen.getByRole('complementary')).toHaveTextContent('Activity');
    // Nothing to save with: no Edit button.
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull();
  });

  it('edits and saves: FormData reaches onSave, then the page returns to view mode', async () => {
    const onSave = vi.fn(async (_data: FormData) => {});
    const onEditingChange = vi.fn();
    const onBack = vi.fn();
    render(<DetailPage title="Ada Park" onBack={onBack} sections={sections} onSave={onSave} onEditingChange={onEditingChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEditingChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole('heading', { level: 2, name: 'Contact' })).toHaveFocus();
    expect(screen.getByText('CUS-1042')).toBeInTheDocument();
    expect(screen.getByText('Edited elsewhere')).toBeInTheDocument();
    const name = screen.getByRole('textbox', { name: /Name/ });
    await userEvent.clear(name);
    await type(name, 'Ada P.');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onEditingChange).toHaveBeenLastCalledWith(false));
    expect(onSave.mock.calls[0]![0].get('name')).toBe('Ada P.');
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('lists invalid fields in an error summary and shows a failed save', async () => {
    const onSave = vi.fn().mockRejectedValueOnce(new Error('Could not save')).mockRejectedValueOnce('offline');
    render(<DetailPage title="Ada Park" sections={sections} onSave={onSave} defaultEditing />);
    const name = screen.getByRole('textbox', { name: /Name/ });
    await userEvent.clear(name);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
    await type(name, 'Ada');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Could not save')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('offline')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Name/ })).toBeInTheDocument();
  });

  it('guards unsaved changes: Cancel asks first when dirty, leaves at once when clean', async () => {
    const onCancel = vi.fn();
    const onEditingChange = vi.fn();
    render(<DetailPage title="Ada Park" sections={sections} onSave={() => {}} editing onCancel={onCancel} onEditingChange={onEditingChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onEditingChange).toHaveBeenLastCalledWith(false);

    await type(screen.getByRole('textbox', { name: /Name/ }), '!');
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Discard your changes?' });
    expect(dialog).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Keep editing' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Discard' }));
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('data states: loading sets aria-busy and hides Edit; the error wins', () => {
    const { rerender } = render(<DetailPage title="Ada Park" sections={sections} onSave={() => {}} loading />);
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull();
    expect(screen.queryByRole('region', { name: 'Contact' })).toBeNull();
    rerender(<DetailPage title="Ada Park" sections={sections} loading errorState={<p role="alert">Could not load</p>} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Could not load');
    expect(screen.getByRole('main')).not.toHaveAttribute('aria-busy');
  });
});

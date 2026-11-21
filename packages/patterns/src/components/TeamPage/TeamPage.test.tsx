import * as React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TeamPage, type TeamMember, type TeamRole } from './index.js';

// No pause between keystrokes: on a busy CI runner the default delay let a long
// type() pass the test timeout and leak keys into the next test.
const type = (el: Element, text: string) => userEvent.setup({ delay: null }).type(el, text);

const roles: TeamRole[] = [
  { id: 'admin', label: 'Admin', description: 'Everything, including billing.' },
  { id: 'member', label: 'Member' },
];
const members: TeamMember[] = [
  { id: 'u1', name: 'Ada Park', email: 'ada@harbour.test', role: 'admin', status: 'active', lastActive: 'Today', you: true },
  { id: 'u2', name: 'Idris Cole', email: 'idris@harbour.test', role: 'member', status: 'suspended' },
  { id: 'u3', name: 'Mina Sato', email: 'mina@harbour.test', role: 'member' },
];
// The table (wide) and the cards (narrow) are both in the DOM; CSS shows one. Tests use the table.
const table = () => screen.getByRole('table', { name: 'Team' });

describe('TeamPage', () => {
  it('is a main landmark with a members table, status as text and seat usage', () => {
    render(<TeamPage members={members} roles={roles} seats={{ used: 3, total: 5 }} actions={<button type="button">Export</button>} />);
    expect(screen.getByRole('main', { name: 'Team' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Team' })).toBeInTheDocument();
    expect(within(table()).getByRole('row', { name: /Ada Park/ })).toHaveTextContent('You');
    expect(within(table()).getByText('Suspended')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: '3 of 5 seats used' })).toBeInTheDocument();
    expect(screen.getByText('3 of 5 seats used')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
    // The narrow layout: one card per member.
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    // No callbacks: nothing to manage.
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Invite people' })).toBeNull();
  });

  it('changes a role, but not your own, and not without canManage', async () => {
    const onRoleChange = vi.fn();
    const { rerender } = render(<TeamPage members={members} roles={roles} onRoleChange={onRoleChange} onRemove={() => {}} onInvite={() => {}} />);
    expect(within(table()).queryByRole('combobox', { name: 'Role for Ada Park' })).toBeNull();
    const select = within(table()).getByRole('combobox', { name: 'Role for Idris Cole' });
    select.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(await screen.findByRole('option', { name: /Admin/ }));
    expect(onRoleChange).toHaveBeenCalledWith('u2', 'admin');
    rerender(<TeamPage members={members} roles={roles} onRoleChange={onRoleChange} onRemove={() => {}} onInvite={() => {}} canManage={false} />);
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(screen.queryByRole('button', { name: /Remove/ })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Invite people' })).toBeNull();
  });

  it('removes a member after a confirm that names them', async () => {
    const onRemove = vi.fn();
    render(<TeamPage members={members} roles={roles} onRemove={onRemove} />);
    expect(within(table()).queryByRole('button', { name: 'Remove Ada Park' })).toBeNull();
    await userEvent.click(within(table()).getByRole('button', { name: 'Remove Idris Cole' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Remove Idris Cole from the team?' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(onRemove).not.toHaveBeenCalled();
    await userEvent.click(within(table()).getByRole('button', { name: 'Remove Idris Cole' }));
    await userEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledWith('u2');
  });

  it('invites: addresses become chips, bad ones are flagged, and the role goes along', async () => {
    const onInvite = vi.fn().mockRejectedValueOnce(new Error('Seat limit reached')).mockRejectedValueOnce('offline').mockResolvedValue(undefined);
    render(<TeamPage members={members} roles={roles} onInvite={onInvite} />);
    await userEvent.click(screen.getByRole('button', { name: 'Invite people' }));
    const dialog = await screen.findByRole('dialog', { name: 'Invite people' });
    const send = within(dialog).getByRole('button', { name: 'Send invites' });
    await userEvent.click(send);
    expect(within(dialog).getByText('Add at least one email address')).toBeInTheDocument();
    const field = within(dialog).getByRole('textbox', { name: 'Email addresses' });
    await type(field, 'Kai@harbour.test,');
    expect(within(dialog).getByText('kai@harbour.test')).toBeInTheDocument();
    expect(field).toHaveValue('');
    await type(field, 'nope{Enter}');
    expect(within(dialog).getByText('nope is not a valid email address')).toBeInTheDocument();
    expect(field).toHaveValue('nope');
    await userEvent.click(send);
    expect(onInvite).not.toHaveBeenCalled();
    await userEvent.clear(field);
    await userEvent.click(field);
    await userEvent.paste('lee@harbour.test; kai@harbour.test\nsam@harbour.test');
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(3);
    await userEvent.click(within(dialog).getByRole('button', { name: 'Remove sam@harbour.test' }));
    // A single pasted address stays in the field until it is committed (here: by blur).
    await userEvent.click(field);
    await userEvent.paste('ola@harbour.test');
    await userEvent.tab();
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(3);
    await type(field, 'zed@harbour.test');

    await userEvent.click(send);
    expect(await within(dialog).findByText('Seat limit reached')).toBeInTheDocument();
    await userEvent.click(send);
    expect(await within(dialog).findByText('offline')).toBeInTheDocument();
    await userEvent.click(send);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(onInvite).toHaveBeenLastCalledWith({ emails: ['kai@harbour.test', 'lee@harbour.test', 'ola@harbour.test', 'zed@harbour.test'], roleId: 'admin' });
  });

  it('lists pending invites with resend and revoke', async () => {
    const onResendInvite = vi.fn();
    const onRevokeInvite = vi.fn();
    const invites = [
      { id: 'i1', email: 'kai@harbour.test', role: 'member', sent: 'Sent 2 days ago' },
      { id: 'i2', email: 'lee@harbour.test' },
    ];
    const { rerender } = render(<TeamPage members={members} roles={roles} pendingInvites={invites} onResendInvite={onResendInvite} onRevokeInvite={onRevokeInvite} />);
    const group = screen.getByRole('region', { name: 'Pending invites' });
    expect(group).toHaveTextContent('Member · Sent 2 days ago');
    await userEvent.click(within(group).getByRole('button', { name: 'Resend the invite to kai@harbour.test' }));
    expect(onResendInvite).toHaveBeenCalledWith('i1');
    await userEvent.click(within(group).getByRole('button', { name: 'Revoke the invite to lee@harbour.test' }));
    expect(onRevokeInvite).toHaveBeenCalledWith('i2');
    rerender(<TeamPage members={members} roles={roles} pendingInvites={invites} onResendInvite={onResendInvite} />);
    expect(screen.queryByRole('button', { name: /Revoke/ })).toBeNull();
    rerender(<TeamPage members={members} roles={roles} pendingInvites={invites} onRevokeInvite={onRevokeInvite} canManage={false} />);
    expect(screen.queryByRole('button', { name: /Revoke/ })).toBeNull();
  });

  it('searches, and shows the data states (error wins)', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<TeamPage members={members} roles={roles} search={{ value: 'a', onChange, placeholder: 'Search members' }} />);
    const box = screen.getByRole('searchbox', { name: 'Search members' });
    await type(box, 'd');
    expect(onChange).toHaveBeenCalledWith('ad');
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onChange).toHaveBeenCalledWith('');
    rerender(<TeamPage members={[]} roles={roles} search={{ value: 'zzz', onChange }} />);
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getAllByText('No results').length).toBeGreaterThan(0);
    rerender(<TeamPage members={[]} roles={roles} emptyState={<p>No one yet</p>} />);
    expect(screen.getAllByText('No one yet')).toHaveLength(2);
    rerender(<TeamPage members={[]} roles={roles} />);
    expect(screen.queryByText('No one yet')).toBeNull();
    rerender(<TeamPage members={members} roles={roles} loading pendingInvites={[{ id: 'i', email: 'kai@harbour.test' }]} />);
    expect(table()).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('region', { name: 'Pending invites' })).toBeNull();
    rerender(<TeamPage members={members} roles={roles} loading errorState={<p role="alert">Could not load</p>} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('table')).toBeNull();
  });
});

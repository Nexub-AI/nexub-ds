import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TeamPage, type TeamMember, type TeamPageProps } from './TeamPage.js';

const meta: Meta<typeof TeamPage> = {
  title: 'Patterns/Pages/TeamPage',
  component: TeamPage,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof TeamPage>;

const roles = [
  { id: 'admin', label: 'Admin', description: 'Everything, including billing.' },
  { id: 'editor', label: 'Editor', description: 'Create and change content.' },
  { id: 'viewer', label: 'Viewer', description: 'Read only.' },
];
const people: TeamMember[] = [
  { id: 'u1', name: 'Ada Park', email: 'ada@harbour.test', role: 'admin', status: 'active', lastActive: 'Today', you: true },
  { id: 'u2', name: 'Idris Cole', email: 'idris@harbour.test', role: 'editor', status: 'active', lastActive: 'Yesterday' },
  { id: 'u3', name: 'Mina Sato', email: 'mina@harbour.test', role: 'viewer', status: 'suspended', lastActive: '3 weeks ago' },
];
const noop = () => {};

function Demo(props: Partial<TeamPageProps>) {
  const [members, setMembers] = React.useState(people);
  const [query, setQuery] = React.useState('');
  return (
    <TeamPage
      as="div"
      description="People who can work in this workspace."
      members={members.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))}
      roles={roles}
      onRoleChange={(id, role) => setMembers((list) => list.map((p) => (p.id === id ? { ...p, role } : p)))}
      onRemove={(id) => setMembers((list) => list.filter((p) => p.id !== id))}
      onInvite={noop}
      pendingInvites={[{ id: 'i1', email: 'kai@harbour.test', role: 'editor', sent: 'Sent 2 days ago' }]}
      onResendInvite={noop}
      onRevokeInvite={noop}
      search={{ value: query, onChange: setQuery, placeholder: 'Search members' }}
      seats={{ used: 4, total: 5 }}
      {...props}
    />
  );
}

/** A table with room, member cards on a phone; roles, removal, invites and seats. */
export const Default: Story = { render: () => <Demo /> };

/** Without permission to manage: roles read as text and there is nothing to remove or invite. */
export const ReadOnly: Story = { render: () => <Demo canManage={false} /> };

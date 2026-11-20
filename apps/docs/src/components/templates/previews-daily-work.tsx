'use client';

import * as React from 'react';
import {
  BookingPage,
  DetailPage,
  InvoicePage,
  NotificationsPage,
  SearchResultsPage,
  StatusSteps,
  TablePage,
  TeamPage,
} from '@nexub/patterns';
import { Badge, Button, FormField, Input, type DataTableColumn } from '@nexub/react';
import { FileText, Receipt, User } from '@nexub/icons';

const noop = () => {};
// One fixed "now" for every preview, so screenshots are stable.
const NOW = new Date(2026, 10, 17, 15, 0);

interface Project {
  id: string;
  name: string;
  owner: string;
  status: 'Active' | 'Paused';
  budget: string;
}
const projects: Project[] = [
  { id: 'p1', name: 'Northwind renewal', owner: 'Ada Park', status: 'Active', budget: '$18,000' },
  { id: 'p2', name: 'Harbour onboarding', owner: 'Idris Cole', status: 'Active', budget: '$6,400' },
  { id: 'p3', name: 'Lumen audit', owner: 'Mina Sato', status: 'Paused', budget: '$9,200' },
  { id: 'p4', name: 'Tidewater migration', owner: 'Kai Brandt', status: 'Active', budget: '$31,000' },
];
const projectColumns: DataTableColumn<Project>[] = [
  { accessorKey: 'name', header: 'Project' },
  { accessorKey: 'owner', header: 'Owner' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge tone={row.original.status === 'Active' ? 'success' : 'neutral'} variant="soft" dot>
        {row.original.status}
      </Badge>
    ),
  },
  { accessorKey: 'budget', header: 'Budget', meta: { align: 'end' } },
];

function Table() {
  return (
    <TablePage
      as="div"
      title="Projects"
      description="Everything your team has in flight."
      actions={<Button>New project</Button>}
      columns={projectColumns}
      data={projects}
      getRowId={(p) => p.id}
      tabs={[
        { id: 'all', label: 'All', count: 4 },
        { id: 'active', label: 'Active', count: 3 },
        { id: 'paused', label: 'Paused', count: 1 },
      ]}
      tab="all"
      onTabChange={noop}
      search={{ value: '', onChange: noop, placeholder: 'Search projects…' }}
      onRowOpen={noop}
      rowActions={(p) => (
        <Button variant="text" size="sm" aria-label={`Edit ${p.name}`}>
          Edit
        </Button>
      )}
    />
  );
}

function Detail() {
  return (
    <DetailPage
      as="div"
      title="Ada Park"
      subtitle="Customer since March 2024"
      status={
        <Badge tone="success" variant="soft" dot>
          Active
        </Badge>
      }
      onBack={noop}
      sections={[
        {
          id: 'contact',
          title: 'Contact',
          description: 'How your team reaches this customer.',
          fields: [
            { name: 'name', label: 'Name', value: 'Ada Park', input: <Input defaultValue="Ada Park" required /> },
            { name: 'phone', label: 'Phone', value: '+1 555 0142', input: <Input type="tel" defaultValue="+1 555 0142" /> },
            { name: 'email', label: 'Email', value: 'ada@harbour.test', input: <Input type="email" defaultValue="ada@harbour.test" required />, span: 2 },
          ],
        },
        {
          id: 'account',
          title: 'Account',
          fields: [
            { name: 'id', label: 'Customer ID', value: 'CUS-1042' },
            { name: 'plan', label: 'Plan', value: 'Team, yearly' },
          ],
        },
      ]}
      onSave={noop}
      aside={
        <StatusSteps
          aria-label="Onboarding"
          steps={[
            { title: 'Account created', status: 'done' },
            { title: 'Billing set up', status: 'done' },
            { title: 'Team invited', status: 'current' },
          ]}
        />
      }
    />
  );
}

function Booking() {
  return (
    <BookingPage
      as="div"
      service={{ title: 'Intro call', duration: '30 minutes, video', price: 'Free', description: 'A first conversation about what you need.' }}
      defaultDate={new Date(2026, 10, 20)}
      minDate={new Date(2026, 10, 17)}
      slots={[
        { value: '09:00', label: '9:00 am' },
        { value: '09:30', label: '9:30 am' },
        { value: '11:00', label: '11:00 am', disabled: true },
        { value: '14:00', label: '2:00 pm' },
        { value: '15:30', label: '3:30 pm' },
        { value: '18:00', label: '6:00 pm' },
      ]}
      defaultSlot="14:00"
      holdUntil={NOW.getTime() + 299_000}
      now={() => NOW.getTime()}
      details={
        <FormField.Root name="name">
          <FormField.Label>Your name</FormField.Label>
          <FormField.Control>
            <Input defaultValue="Ada Park" />
          </FormField.Control>
        </FormField.Root>
      }
      onConfirm={noop}
      confirmation={{ description: 'We sent the details to ada@harbour.test.', reference: 'BK-7731' }}
    />
  );
}

function Invoice() {
  return (
    <InvoicePage
      as="div"
      number="INV-2041"
      status="due"
      issuedOn="2026-11-03"
      dueOn="2026-11-17"
      from={{ name: 'Harbour Studio', lines: ['12 Quay Street', 'Port Ellis'], taxId: 'HS-204-881' }}
      to={{ name: 'Northwind Traders', lines: ['4 Mill Lane', 'Eastbrook'] }}
      items={[
        { id: 'sprint', description: 'Design sprint', detail: 'October, two weeks', quantity: 2, unitPrice: 2400 },
        { id: 'research', description: 'User interviews', quantity: 6, unitPrice: 180 },
        { id: 'hosting', description: 'Prototype hosting', detail: 'Monthly', quantity: 1, unitPrice: 45 },
      ]}
      currency="USD"
      locale="en-US"
      discount={200}
      taxes={[{ label: 'Sales tax 8%', amount: 458 }]}
      notes="Thank you for working with us."
      payment="Pay by bank transfer within 14 days, quoting the invoice number."
      actions={
        <>
          <Button variant="outlined">Download</Button>
          <Button>Pay now</Button>
        </>
      }
    />
  );
}

function Team() {
  return (
    <TeamPage
      as="div"
      description="People who can work in this workspace."
      members={[
        { id: 'u1', name: 'Ada Park', email: 'ada@harbour.test', role: 'admin', status: 'active', lastActive: 'Today', you: true },
        { id: 'u2', name: 'Idris Cole', email: 'idris@harbour.test', role: 'editor', status: 'active', lastActive: 'Yesterday' },
        { id: 'u3', name: 'Mina Sato', email: 'mina@harbour.test', role: 'viewer', status: 'suspended', lastActive: '3 weeks ago' },
      ]}
      roles={[
        { id: 'admin', label: 'Admin', description: 'Everything, including billing.' },
        { id: 'editor', label: 'Editor', description: 'Create and change content.' },
        { id: 'viewer', label: 'Viewer', description: 'Read only.' },
      ]}
      onRoleChange={noop}
      onRemove={noop}
      onInvite={noop}
      pendingInvites={[{ id: 'i1', email: 'kai@harbour.test', role: 'editor', sent: 'Sent 2 days ago' }]}
      onResendInvite={noop}
      onRevokeInvite={noop}
      seats={{ used: 4, total: 5 }}
    />
  );
}

function Notifications() {
  return (
    <NotificationsPage
      as="div"
      now={NOW}
      notifications={[
        { id: '1', title: 'Invoice INV-2041 was paid', description: 'Northwind Traders paid $6,183.00.', timestamp: '2:10 pm', date: new Date(2026, 10, 17, 14, 10) },
        { id: '2', title: 'Idris Cole mentioned you', description: '“Can you check the audit notes before Friday?”', timestamp: '9:42 am', date: new Date(2026, 10, 17, 9, 42) },
        { id: '3', title: 'Your export is ready', description: 'Projects, 214 rows.', timestamp: '4:30 pm', date: new Date(2026, 10, 16, 16, 30), read: true },
        { id: '4', title: 'Mina Sato joined the team', timestamp: '11:05 am', date: new Date(2026, 10, 12, 11, 5), read: true },
      ]}
      onOpen={noop}
      onMarkRead={noop}
      onMarkAllRead={noop}
      onDismiss={noop}
      onOpenSettings={noop}
      onLoadMore={noop}
      hasMore
    />
  );
}

function SearchResults() {
  return (
    <SearchResultsPage
      as="div"
      query="invoice"
      onQueryChange={noop}
      results={[
        { id: '1', title: 'Invoice INV-2041', href: '#', excerpt: 'Northwind Traders, design sprint and user interviews. Due 17 Nov.', meta: 'Billing · 3 Nov 2026', kind: 'Invoice', icon: <Receipt size={18} aria-hidden="true" /> },
        { id: '2', title: 'How invoice reminders work', href: '#', excerpt: 'A reminder goes out three days before an invoice is due, and again on the day.', meta: 'Help · Updated in October', kind: 'Article', icon: <FileText size={18} aria-hidden="true" /> },
        { id: '3', title: 'Idris Cole', href: '#', excerpt: 'Editor. Owns the invoice templates for Harbour Studio.', meta: 'Team', kind: 'Person', icon: <User size={18} aria-hidden="true" /> },
      ]}
      total={24}
      page={1}
      pageSize={10}
      onPageChange={noop}
      kinds={[
        { id: 'all', label: 'All', count: 24 },
        { id: 'invoice', label: 'Invoices', count: 14 },
        { id: 'article', label: 'Articles', count: 7 },
        { id: 'person', label: 'People', count: 3 },
      ]}
      kind="all"
      onKindChange={noop}
    />
  );
}

export const dailyWorkPreviews = {
  'table-page': Table,
  'detail-page': Detail,
  booking: Booking,
  invoice: Invoice,
  team: Team,
  notifications: Notifications,
  'search-results': SearchResults,
} as const;

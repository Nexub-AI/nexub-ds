/**
 * 10.8 page templates for daily work: the screens most apps need after sign-in.
 * Same entry shape as templates.ts, which spreads this list into `templateEntries`.
 */
import type { NativeTwin } from './native';

export const dailyWorkTemplates = [
  {
    slug: 'table-page',
    title: 'Table page',
    web: 'TablePage',
    description: 'The standard list of records: saved segments, search and filters, a data table with row and bulk actions, paging, and the loading, empty and error states.',
    code: `<TablePage
  title="Projects"
  actions={<Button onClick={create}>New project</Button>}
  columns={columns}
  data={projects}
  getRowId={(p) => p.id}
  tabs={[{ id: 'all', label: 'All', count: 42 }, { id: 'active', label: 'Active' }]}
  tab={tab}
  onTabChange={setTab}
  search={{ value: query, onChange: setQuery, placeholder: 'Search projects…' }}
  activeFilterCount={filters.length}
  onClearFilters={clear}
  onRowOpen={(p) => router.push(\`/projects/\${p.id}\`)}
  rowActions={(p) => <RowMenu project={p} />}
  bulkActions={(rows, done) => <Button onClick={() => archive(rows).then(done)}>Archive</Button>}
  pagination={{ pageSize: 20 }}
  loading={isLoading}
/>`,
  },
  {
    slug: 'detail-page',
    title: 'Detail page',
    web: 'DetailPage',
    description: 'One record with view and edit modes: sections of labelled values that become a form in place, a sticky Save and Cancel bar, an unsaved-changes guard, and an aside for activity or progress.',
    code: `<DetailPage
  title="Ada Park"
  subtitle="Customer since March 2024"
  status={<Badge tone="success">Active</Badge>}
  backHref="/customers"
  sections={[
    {
      id: 'contact',
      title: 'Contact',
      fields: [
        { name: 'name', label: 'Name', value: customer.name, input: <Input defaultValue={customer.name} required /> },
        { name: 'email', label: 'Email', value: customer.email, input: <Input type="email" defaultValue={customer.email} />, span: 2 },
      ],
    },
  ]}
  onSave={(data) => save(Object.fromEntries(data))}
  aside={<ActivityFeed.Root>…</ActivityFeed.Root>}
/>`,
  },
  {
    slug: 'booking',
    title: 'Booking',
    web: 'BookingPage',
    description: 'Booking in three steps: pick a date, pick a time, confirm. Side by side with room, one step at a time on a phone, with a hold countdown and a confirmed view.',
    code: `<BookingPage
  service={{ title: 'Intro call', duration: '30 minutes', price: 'Free' }}
  date={date}
  onDateChange={setDate}
  minDate={today}
  isDateDisabled={isWeekend}
  slots={slots}
  slotsLoading={isLoading}
  slot={slot}
  onSlotChange={setSlot}
  holdUntil={hold?.expiresAt}
  onHoldExpire={releaseHold}
  details={<NameField />}
  onConfirm={({ date, slot, formData }) => book(date, slot, formData)}
  confirmation={{ reference: booking?.reference, actions: <Button variant="tonal">Add to calendar</Button> }}
/>`,
  },
  {
    slug: 'invoice',
    title: 'Invoice',
    web: 'InvoicePage',
    description: 'An invoice or a receipt: both parties, line items in a real table, the arithmetic down to the total, status as text, and how to pay.',
    code: `<InvoicePage
  number="INV-2041"
  status="due"
  issuedOn="2026-11-03"
  dueOn="2026-11-17"
  from={{ name: 'Harbour Studio', lines: ['12 Quay Street'], taxId: 'HS-204-881' }}
  to={{ name: 'Northwind Traders' }}
  items={[{ description: 'Design sprint', quantity: 2, unitPrice: 2400 }]}
  currency="USD"
  taxes={[{ label: 'Sales tax 8%', amount: 384 }]}
  actions={<Button onClick={pay}>Pay now</Button>}
/>

// A receipt after payment
<InvoicePage variant="receipt" status="paid" {...invoice} />`,
  },
  {
    slug: 'team',
    title: 'Team',
    web: 'TeamPage',
    description: 'Team and roles: members in a table (cards on a phone), a role per person, removal with a confirm that names them, invites by email, pending invites and seat usage.',
    code: `<TeamPage
  members={members}
  roles={[{ id: 'admin', label: 'Admin' }, { id: 'editor', label: 'Editor' }]}
  onRoleChange={(memberId, roleId) => setRole(memberId, roleId)}
  onRemove={removeMember}
  onInvite={({ emails, roleId }) => invite(emails, roleId)}
  pendingInvites={invites}
  onResendInvite={resend}
  onRevokeInvite={revoke}
  seats={{ used: 4, total: 5 }}
  canManage={me.role === 'admin'}
/>`,
  },
  {
    slug: 'notifications',
    title: 'Notifications',
    web: 'NotificationsPage',
    description: 'The full-page inbox: All and Unread tabs, notifications grouped by day, read and unread toggles, mark all as read, and Load more.',
    code: `<NotificationsPage
  notifications={items}
  now={new Date()}
  onOpen={open}
  onMarkRead={(id, read) => setRead(id, read)}
  onMarkAllRead={markAll}
  onDismiss={dismiss}
  onLoadMore={loadMore}
  hasMore={hasMore}
  settingsHref="/settings/notifications"
/>`,
    native: {
      name: 'NotificationsInbox',
      preview: 'pattern/inbox',
      differences: [
        { aspect: 'Grouping', web: 'Grouped by day, with All and Unread tabs.', mobile: 'One list, newest first.' },
        { aspect: 'Read state', web: 'A toggle per row (`onMarkRead`) and "Mark all as read".', mobile: '"Mark all read" only.' },
        { aspect: 'Paging', web: 'A "Load more" button.', mobile: 'The list scrolls; page in your data layer.' },
      ],
      code: `import { NotificationsInbox } from '@nexub/react-native/patterns';

<NotificationsInbox notifications={items} onPress={open} onMarkAllRead={markAll} />`,
    },
  },
  {
    slug: 'search-results',
    title: 'Search results',
    web: 'SearchResultsPage',
    description: 'Search results: the query field, result types as tabs, a count that is announced, the query marked in titles and excerpts, paging, and suggestions when nothing matches.',
    code: `<SearchResultsPage
  query={query}
  onQueryChange={setQuery}
  onSubmit={search}
  results={results}
  total={total}
  page={page}
  pageSize={10}
  onPageChange={setPage}
  kinds={[{ id: 'all', label: 'All', count: total }, { id: 'people', label: 'People' }]}
  kind={kind}
  onKindChange={setKind}
  suggestions={['invoice', 'invoice template']}
  loading={isLoading}
/>`,
    native: {
      name: 'SearchScreen',
      preview: 'pattern/search',
      differences: [
        { aspect: 'Results', web: 'A fixed result card: title link, excerpt, meta and type.', mobile: 'You render each row (`renderResult`).' },
        { aspect: 'Before typing', web: 'The page starts from a query.', mobile: 'Recent searches show until there is a query (`recent`).' },
        { aspect: 'Paging', web: 'Numbered pages.', mobile: 'One scrolling list.' },
      ],
      code: `import { SearchScreen } from '@nexub/react-native/patterns';

<SearchScreen query={query} onQueryChange={setQuery} results={results} renderResult={(r: Result) => <ResultRow result={r} />} keyOf={(r: Result) => r.id} recent={recent} />`,
    },
  },
] satisfies ReadonlyArray<{ slug: string; title: string; web: string; description: string; code: string; native?: NativeTwin }>;

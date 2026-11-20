import * as React from 'react';
import {
  Alert,
  AlertDialog,
  Avatar,
  Badge,
  Button,
  Chip,
  DataTable,
  Dialog,
  EmptyStatePreset,
  FormField,
  Input,
  Progress,
  SearchInput,
  Select,
  useNexubMessages,
  type DataTableColumn,
} from '@nexub/react';
import { UserCard } from '../UserCard/index.js';
import { PageFrame, usePageMessages, type PageFrameProps, type PageTemplateMessages } from '../PageFrame/PageFrame.js';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarSrc?: string;
  /** A `roles[].id`. */
  role: string;
  status?: 'active' | 'invited' | 'suspended';
  lastActive?: React.ReactNode;
  /** The signed-in person: their own role and removal are locked. */
  you?: boolean;
}

export interface TeamRole {
  id: string;
  label: string;
  description?: string;
}

export interface TeamInvite {
  id: string;
  email: string;
  /** A `roles[].id`. */
  role?: string;
  /** e.g. "Sent 2 days ago". */
  sent?: React.ReactNode;
}

export interface TeamPageProps extends Omit<PageFrameProps, 'title' | 'children'> {
  /** @default messages.team */
  title?: React.ReactNode;
  members: TeamMember[];
  roles: TeamRole[];
  onRoleChange?: (memberId: string, roleId: string) => void;
  /** Called after the confirm dialog. */
  onRemove?: (memberId: string) => void;
  /** Shows "Invite people". A rejected promise shows its message and keeps the dialog open. */
  onInvite?: (invite: { emails: string[]; roleId: string }) => void | Promise<unknown>;
  pendingInvites?: TeamInvite[];
  onResendInvite?: (inviteId: string) => void;
  onRevokeInvite?: (inviteId: string) => void;
  /** A search field. Your app filters `members`. */
  search?: { value: string; onChange: (value: string) => void; placeholder?: string };
  /** False: roles, removal and inviting are read-only. @default true */
  canManage?: boolean;
  seats?: { used: number; total: number };
  loading?: boolean;
  /** @default the "no data" preset, or "no results" while searching */
  emptyState?: React.ReactNode;
  /** Shown in place of the members; wins over `loading` and the empty state. */
  errorState?: React.ReactNode;
  messages?: Partial<PageTemplateMessages>;
}

const statusTone = { active: 'success', invited: 'info', suspended: 'warning' } as const;
const EMAIL = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;

function InviteDialog({
  roles,
  onInvite,
  m,
}: {
  roles: TeamRole[];
  onInvite: NonNullable<TeamPageProps['onInvite']>;
  m: PageTemplateMessages;
}) {
  const t = useNexubMessages();
  const [open, setOpen] = React.useState(false);
  const [emails, setEmails] = React.useState<string[]>([]);
  const [draft, setDraft] = React.useState('');
  const [roleId, setRoleId] = React.useState(roles[0]?.id ?? '');
  const [fieldError, setFieldError] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  const [busy, setBusy] = React.useState(false);

  /** Moves the valid addresses in the draft into chips; the first invalid one stays in the field. */
  const commit = (text: string) => {
    const parts = text.split(/[\s,;]+/).filter(Boolean);
    const bad = parts.find((p) => !EMAIL.test(p));
    const next = [...new Set([...emails, ...parts.filter((p) => EMAIL.test(p)).map((p) => p.toLowerCase())])];
    setEmails(next);
    setDraft(bad ?? '');
    setFieldError(bad ? m.invalidEmail(bad) : undefined);
    return bad ? null : next;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const list = commit(draft);
    if (!list) return;
    if (!list.length) return setFieldError(m.emailRequired);
    setBusy(true);
    setError(undefined);
    try {
      await onInvite({ emails: list, roleId });
      setOpen(false);
      setEmails([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>{m.invitePeople}</Button>
      </Dialog.Trigger>
      <Dialog.Content sheet="auto">
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <Dialog.Header>
            <Dialog.Title>{m.invitePeople}</Dialog.Title>
            <Dialog.Description>{m.inviteDescription}</Dialog.Description>
          </Dialog.Header>
          {error && (
            <Alert tone="danger" role="alert">
              {error}
            </Alert>
          )}
          <FormField.Root invalid={!!fieldError}>
            <FormField.Label>{m.emailAddresses}</FormField.Label>
            {emails.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {emails.map((email) => (
                  <li key={email} className="max-w-full">
                    <Chip onRemove={() => setEmails(emails.filter((x) => x !== email))} removeLabel={`${t.remove} ${email}`}>
                      {email}
                    </Chip>
                  </li>
                ))}
              </ul>
            )}
            <FormField.Control>
              <Input
                type="email"
                inputMode="email"
                autoComplete="off"
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setFieldError(undefined);
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && draft.trim()) {
                    e.preventDefault();
                    commit(draft);
                  }
                }}
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text');
                  if (/[\s,;]/.test(text.trim())) {
                    e.preventDefault();
                    commit(`${draft} ${text}`);
                  }
                }}
                onBlur={() => draft.trim() && commit(draft)}
              />
            </FormField.Control>
            <FormField.Description>{m.emailAddressesHint}</FormField.Description>
            <FormField.Error>{fieldError}</FormField.Error>
          </FormField.Root>
          <FormField.Root>
            <FormField.Label>{m.role}</FormField.Label>
            <Select.Root value={roleId} onValueChange={setRoleId}>
              <FormField.Control>
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
              </FormField.Control>
              <Select.Content sheet="auto">
                {roles.map((r) => (
                  <Select.Item key={r.id} value={r.id} description={r.description}>
                    {r.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </FormField.Root>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button type="button" variant="text" disabled={busy}>
                {t.cancel}
              </Button>
            </Dialog.Close>
            <Button type="submit" loading={busy}>
              {m.sendInvites}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

/**
 * Team and roles: a table with room (a 48rem container), stacked member cards when
 * narrow. Both are rendered and CSS shows one, so server and client output match.
 */
export const TeamPage = React.forwardRef<HTMLElement, TeamPageProps>(function TeamPage(
  {
    title,
    actions,
    members,
    roles,
    onRoleChange,
    onRemove,
    onInvite,
    pendingInvites = [],
    onResendInvite,
    onRevokeInvite,
    search,
    canManage = true,
    seats,
    loading,
    emptyState,
    errorState,
    messages,
    ...props
  },
  ref,
) {
  const m = usePageMessages(messages);
  const t = useNexubMessages();
  const [removing, setRemoving] = React.useState<TeamMember>();
  const roleLabel = (id?: string) => roles.find((r) => r.id === id)?.label ?? id;

  const roleControl = (member: TeamMember) =>
    onRoleChange && canManage && !member.you ? (
      <Select.Root value={member.role} onValueChange={(roleId) => onRoleChange(member.id, roleId)}>
        <Select.Trigger size="sm" aria-label={m.roleFor(member.name)} className="w-36 max-w-full">
          <Select.Value />
        </Select.Trigger>
        <Select.Content sheet="auto">
          {roles.map((r) => (
            <Select.Item key={r.id} value={r.id} description={r.description}>
              {r.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    ) : (
      <span className="text-body-md text-[var(--color-on-surface)]">{roleLabel(member.role)}</span>
    );
  const statusBadge = (member: TeamMember) =>
    member.status && (
      <Badge tone={statusTone[member.status]} variant="soft" dot size="sm">
        {m.memberStatus(member.status)}
      </Badge>
    );
  const removeButton = (member: TeamMember) =>
    onRemove &&
    canManage &&
    !member.you && (
      <Button variant="text" size="sm" aria-label={m.removeMember(member.name)} onClick={() => setRemoving(member)}>
        {t.remove}
      </Button>
    );

  const columns: DataTableColumn<TeamMember>[] = [
      {
        id: 'member',
        header: m.member,
        accessorFn: (r) => r.name,
        cell: ({ row: { original: r } }) => (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={r.name} src={r.avatarSrc} size="sm" category="auto" />
            <div className="flex min-w-0 flex-col">
              <span className="flex items-center gap-2 font-medium text-[var(--color-on-surface)]">
                {r.name}
                {r.you && (
                  <Badge size="sm" variant="outline">
                    {m.you}
                  </Badge>
                )}
              </span>
              <span className="text-body-sm text-[var(--color-on-surface-muted)]">{r.email}</span>
            </div>
          </div>
        ),
      },
      { id: 'role', header: m.role, accessorFn: (r) => r.role, cell: ({ row }) => roleControl(row.original), enableSorting: false },
      { id: 'status', header: m.status, accessorFn: (r) => r.status, cell: ({ row }) => statusBadge(row.original), enableSorting: false },
      { id: 'lastActive', header: m.lastActive, cell: ({ row }) => row.original.lastActive, enableSorting: false },
      {
        id: 'actions',
        header: () => <span className="sr-only">{m.rowActions}</span>,
        cell: ({ row }) => <div className="flex justify-end">{removeButton(row.original)}</div>,
        enableSorting: false,
        meta: { align: 'end' },
      },
  ];

  const empty = emptyState ?? <EmptyStatePreset kind={search?.value ? 'noResults' : 'noData'} />;
  const failed = errorState != null;

  return (
    <PageFrame
      ref={ref}
      width="lg"
      title={title ?? m.team}
      actions={
        (actions || (onInvite && canManage)) && (
          <>
            {actions}
            {onInvite && canManage && <InviteDialog roles={roles} onInvite={onInvite} m={m} />}
          </>
        )
      }
      {...props}
    >
      {seats && (
        <div className="flex flex-col gap-2">
          <Progress value={seats.used} max={seats.total} aria-label={m.seatsUsed(seats.used, seats.total)} />
          <p className="text-body-sm text-[var(--color-on-surface-muted)]">{m.seatsUsed(seats.used, seats.total)}</p>
        </div>
      )}
      {search && (
        <SearchInput
          aria-label={search.placeholder ?? t.search}
          placeholder={search.placeholder ?? t.searchPlaceholder}
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
          onClear={() => search.onChange('')}
          wrapperClassName="w-full @xl:w-72"
        />
      )}

      {failed ? (
        errorState
      ) : (
        <>
          <div className="hidden @[48rem]:block">
            <DataTable
              caption={title ?? m.team}
              captionHidden
              columns={columns}
              data={members}
              getRowId={(r) => r.id}
              loading={loading}
              emptyState={empty}
            />
          </div>
          <div className="@[48rem]:hidden" aria-busy={loading || undefined}>
            {loading ? (
              <div className="flex flex-col gap-3">
                {[0, 1, 2].map((i) => (
                  <UserCard key={i} name="" role=" " email=" " loading />
                ))}
              </div>
            ) : members.length === 0 ? (
              empty
            ) : (
              <ul className="flex flex-col gap-3">
                {members.map((member) => (
                  <li key={member.id} className="flex flex-col gap-3 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)] p-4">
                    <UserCard
                      name={member.you ? `${member.name} (${m.you})` : member.name}
                      email={member.email}
                      avatarSrc={member.avatarSrc}
                      className="border-0 bg-transparent p-0"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {roleControl(member)}
                        {statusBadge(member)}
                      </div>
                      {removeButton(member)}
                    </div>
                    {member.lastActive != null && (
                      <p className="text-body-sm text-[var(--color-on-surface-muted)]">
                        {m.lastActive}: {member.lastActive}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {pendingInvites.length > 0 && !loading && (
            <section aria-label={m.pendingInvites} className="flex flex-col gap-3">
              <h2 className="text-title-md text-[var(--color-on-surface)]">{m.pendingInvites}</h2>
              <ul className="overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)]">
                {pendingInvites.map((invite) => (
                  <li key={invite.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-outline-variant)] px-4 py-3 first:border-t-0">
                    <div className="flex min-w-0 flex-col">
                      <span className="break-all text-body-md font-medium text-[var(--color-on-surface)]">{invite.email}</span>
                      <span className="text-body-sm text-[var(--color-on-surface-muted)]">
                        {roleLabel(invite.role)}
                        {invite.role && invite.sent != null && ' · '}
                        {invite.sent}
                      </span>
                    </div>
                    {canManage && (onResendInvite || onRevokeInvite) && (
                      <div className="flex gap-1">
                        {onResendInvite && (
                          <Button variant="text" size="sm" aria-label={m.inviteResend(invite.email)} onClick={() => onResendInvite(invite.id)}>
                            {m.inviteResendLabel}
                          </Button>
                        )}
                        {onRevokeInvite && (
                          <Button variant="text" size="sm" aria-label={m.inviteRevoke(invite.email)} onClick={() => onRevokeInvite(invite.id)}>
                            {m.inviteRevokeLabel}
                          </Button>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <AlertDialog.Root open={!!removing} onOpenChange={(open) => !open && setRemoving(undefined)}>
        <AlertDialog.Content sheet="auto">
          <AlertDialog.Header>
            <AlertDialog.Title>{removing && m.removeMemberTitle(removing.name)}</AlertDialog.Title>
            <AlertDialog.Description>{m.removeMemberDescription}</AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>{t.cancel}</AlertDialog.Cancel>
            <AlertDialog.Action onClick={() => removing && onRemove?.(removing.id)}>{t.remove}</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </PageFrame>
  );
});

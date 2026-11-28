'use client';

// ApprovalCard (4.8): the agent asks before it acts. Says what will happen,
// then Approve / Deny. After a choice the buttons are replaced by the outcome,
// announced politely.
// 12.4: an optional edit path (`args` + `onEdit`: approve, edit then approve, or
// deny), a pending state while an async callback (or the app's `pending`) runs,
// a controlled `outcome`, and focus that lands on the card once it resolves.
import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Button } from '../Button/Button.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

/** 12.4: how an approval ended. `edited` = approved with changed arguments. */
export type ApprovalOutcome = 'approved' | 'edited' | 'denied';

type Result = void | Promise<unknown>;

export interface ApprovalCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** What the agent wants to do, e.g. "Send 3 invoices to Acme". */
  title: string;
  /** Details: who, how much, what changes. */
  children?: React.ReactNode;
  /** Called once with the choice. 12.4: return a promise to show the pending state until it settles (a rejection returns to the choice). */
  onApprove?: () => Result;
  onDeny?: () => Result;
  approveLabel?: string;
  denyLabel?: string;
  /** 12.4: the action's arguments, shown as JSON (or as given, for a string). With `onEdit` they can be edited before approving. */
  args?: unknown;
  /** 12.4: adds Edit. Called with the edited arguments text when the user approves with changes. */
  onEdit?: (args: string) => Result;
  /** 12.4: label for the Edit button. @default 'Edit' */
  editLabel?: string;
  /** 12.4: controlled outcome. `null` keeps the choice open (e.g. while your request runs); omit it to let the card track the choice. */
  outcome?: ApprovalOutcome | null;
  /** 12.4: the action is being carried out: the buttons are disabled and "Working…" is announced. */
  pending?: boolean;
}

const json = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const isThenable = (r: unknown): r is Promise<unknown> => !!r && typeof (r as Promise<unknown>).then === 'function';

export function ApprovalCard({
  title,
  children,
  onApprove,
  onDeny,
  approveLabel,
  denyLabel,
  args,
  onEdit,
  editLabel,
  outcome,
  pending,
  className,
  ...props
}: ApprovalCardProps) {
  const m = useNexubMessages();
  const titleId = React.useId();
  const argsId = React.useId();
  const [choice, setChoice] = React.useState<ApprovalOutcome | null>(null);
  const [clicked, setClicked] = React.useState<ApprovalOutcome | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const root = React.useRef<HTMLDivElement>(null);
  const area = React.useRef<HTMLTextAreaElement>(null);
  const editButton = React.useRef<HTMLButtonElement>(null);
  const acted = React.useRef(false);
  const resolved = outcome !== undefined ? outcome : choice;
  const isPending = !resolved && (busy || !!pending);

  // After a choice resolves the buttons go away: keep keyboard focus on the card, not the page.
  React.useEffect(() => {
    if (resolved && acted.current) root.current?.focus();
  }, [resolved]);

  const act = (kind: ApprovalOutcome, fn?: () => Result) => {
    if (isPending) return;
    acted.current = true;
    setClicked(kind);
    const r = fn?.();
    if (isThenable(r)) {
      setBusy(true);
      r.then(
        () => (setBusy(false), setChoice(kind)),
        () => setBusy(false),
      );
    } else setChoice(kind);
  };

  const startEdit = () => {
    setDraft(json(args));
    setEditing(true);
  };
  React.useEffect(() => {
    if (editing) area.current?.focus();
  }, [editing]);
  const cancelEdit = () => {
    setEditing(false);
    requestAnimationFrame(() => editButton.current?.focus());
  };

  const canEdit = !!onEdit && args !== undefined;
  const actionProps = (kind: ApprovalOutcome) => ({ loading: isPending && clicked === kind, disabled: isPending && clicked !== kind });

  return (
    <div
      ref={root}
      role="group"
      aria-labelledby={titleId}
      tabIndex={resolved ? -1 : undefined}
      className={cn(
        'flex flex-col gap-3 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)] p-4',
        className,
      )}
      {...props}
    >
      <p id={titleId} className="m-0 text-title-sm text-[var(--color-on-surface)]">{title}</p>
      {children && <div className="text-body-sm text-[var(--color-on-surface-variant)]">{children}</div>}
      {args !== undefined &&
        (editing && !resolved ? (
          <div className="flex flex-col gap-1">
            <label htmlFor={argsId} className="text-label-sm text-[var(--color-on-surface-variant)]">{m.approvalArgs}</label>
            <textarea
              id={argsId}
              ref={area}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              readOnly={isPending}
              rows={Math.min(12, Math.max(3, draft.split('\n').length))}
              spellCheck={false}
              className="w-full resize-y rounded-shape-field border border-[var(--color-outline)] bg-[var(--color-surface)] p-2 font-mono text-body-sm text-[var(--color-on-surface)]"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <p className="m-0 text-label-sm text-[var(--color-on-surface-variant)]">{m.approvalArgs}</p>
            <pre className="m-0 overflow-auto rounded-shape-field bg-[var(--color-surface)] p-2 text-body-sm">
              <code>{choice === 'edited' && outcome === undefined ? draft : json(args)}</code>
            </pre>
          </div>
        ))}
      <div role="status" aria-live="polite" className="text-label-md text-[var(--color-on-surface-variant)]">
        {isPending ? m.approvalPending : resolved ? m.approvalOutcome[resolved] : ''}
      </div>
      {!resolved &&
        (editing ? (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" {...actionProps('edited')} onClick={() => act('edited', () => onEdit?.(draft))}>{m.approvalApproveEdited}</Button>
            <Button size="sm" variant="outlined" disabled={isPending} onClick={cancelEdit}>{m.cancel}</Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" {...actionProps('approved')} onClick={() => act('approved', onApprove)}>{approveLabel ?? m.approvalApprove}</Button>
            {canEdit && (
              <Button ref={editButton} size="sm" variant="outlined" disabled={isPending} onClick={startEdit}>{editLabel ?? m.approvalEdit}</Button>
            )}
            <Button size="sm" variant="outlined" {...actionProps('denied')} onClick={() => act('denied', onDeny)}>{denyLabel ?? m.approvalDeny}</Button>
          </div>
        ))}
    </div>
  );
}

'use client';

// ApprovalCard (4.8): the agent asks before it acts. Says what will happen,
// then Approve / Deny. After a choice the buttons are replaced by the outcome,
// announced politely.
import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Button } from '../Button/Button.js';

export interface ApprovalCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** What the agent wants to do, e.g. "Send 3 invoices to Acme". */
  title: string;
  /** Details: who, how much, what changes. */
  children?: React.ReactNode;
  onApprove?: () => void;
  onDeny?: () => void;
  approveLabel?: string;
  denyLabel?: string;
}

export function ApprovalCard({ title, children, onApprove, onDeny, approveLabel = 'Approve', denyLabel = 'Deny', className, ...props }: ApprovalCardProps) {
  const [choice, setChoice] = React.useState<'approved' | 'denied' | null>(null);
  return (
    <div className={cn('flex flex-col gap-3 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)] p-4', className)} {...props}>
      <p className="m-0 text-title-sm text-[var(--color-on-surface)]">{title}</p>
      {children && <div className="text-body-sm text-[var(--color-on-surface-variant)]">{children}</div>}
      <div role="status" aria-live="polite" className="text-label-md text-[var(--color-on-surface-variant)]">
        {choice === 'approved' ? 'Approved' : choice === 'denied' ? 'Denied' : ''}
      </div>
      {!choice && (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => { setChoice('approved'); onApprove?.(); }}>{approveLabel}</Button>
          <Button size="sm" variant="outlined" onClick={() => { setChoice('denied'); onDeny?.(); }}>{denyLabel}</Button>
        </div>
      )}
    </div>
  );
}

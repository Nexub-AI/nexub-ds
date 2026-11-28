'use client';

// DiffReview (12.4): review an agent's changes file by file. Each file is a
// collapsible DiffView with Accept / Reject toggles; a polite summary counts
// the decisions. Decisions are controlled (`decisions`) or tracked here.
import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Button } from '../Button/Button.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { DiffView, parseDiff } from './AgentKit.js';

export interface DiffReviewFile {
  /** File path; also the key in `decisions`. */
  file: string;
  /** Unified diff for this file. */
  diff: string;
}

export type DiffDecision = 'accepted' | 'rejected';

export interface DiffReviewProps extends React.HTMLAttributes<HTMLDivElement> {
  files: DiffReviewFile[];
  /** Controlled decisions, keyed by file path. A file with no entry is still to review. */
  decisions?: Record<string, DiffDecision>;
  /** Starting decisions when uncontrolled. */
  defaultDecisions?: Record<string, DiffDecision>;
  onAccept?: (file: DiffReviewFile) => void;
  onReject?: (file: DiffReviewFile) => void;
  /** Called with the whole record after each decision. */
  onDecisionsChange?: (decisions: Record<string, DiffDecision>) => void;
  /** Show old and new line numbers in each diff. @default true */
  lineNumbers?: boolean;
  /** Files start expanded. @default true */
  defaultOpen?: boolean;
}

function FileRow({
  f,
  decision,
  open,
  onToggle,
  onDecide,
  lineNumbers,
}: {
  f: DiffReviewFile;
  decision: DiffDecision | undefined;
  open: boolean;
  onToggle: () => void;
  onDecide: (d: DiffDecision) => void;
  lineNumbers: boolean;
}) {
  const m = useNexubMessages();
  const panelId = React.useId();
  const lines = React.useMemo(() => parseDiff(f.diff), [f.diff]);
  const added = lines.filter((l) => l.kind === 'add').length;
  const removed = lines.filter((l) => l.kind === 'del').length;
  return (
    <li className="overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)]">
      <div className="flex flex-wrap items-center gap-2 bg-[var(--color-surface-container-low)] px-2 py-1.5">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="nx-state-layer flex min-w-0 flex-1 items-center gap-2 rounded-shape-control px-1 py-1 text-start"
        >
          <span aria-hidden="true" className={cn('shrink-0 transition-transform rtl:-scale-x-100', open && 'rotate-90')}>›</span>
          <span className="truncate font-mono text-label-md text-[var(--color-on-surface)]">{f.file}</span>
          <span className="shrink-0 font-mono text-label-sm tabular-nums">
            <span aria-hidden="true" dir="ltr">
              <span className="text-[var(--color-success)]">+{added}</span> <span className="text-[var(--color-error)]">−{removed}</span>
            </span>
            <span className="sr-only">{`, ${m.diffLineCounts(added, removed)}`}</span>
          </span>
        </button>
        {decision && <span className="text-label-sm text-[var(--color-on-surface-variant)]">{m.diffDecision[decision]}</span>}
        <div className="flex gap-1">
          <Button size="sm" variant={decision === 'accepted' ? 'tonal' : 'outlined'} aria-pressed={decision === 'accepted'} aria-label={m.diffAcceptFile(f.file)} onClick={() => onDecide('accepted')}>
            {m.diffAccept}
          </Button>
          <Button size="sm" variant={decision === 'rejected' ? 'tonal' : 'outlined'} aria-pressed={decision === 'rejected'} aria-label={m.diffRejectFile(f.file)} onClick={() => onDecide('rejected')}>
            {m.diffReject}
          </Button>
        </div>
      </div>
      <div id={panelId} hidden={!open}>
        <DiffView diff={f.diff} lineNumbers={lineNumbers} messages={m} className="rounded-none border-0 border-t" />
      </div>
    </li>
  );
}

/** Review an agent's changes file by file: expand a diff, accept or reject it, see what's left. */
export function DiffReview({
  files,
  decisions: controlled,
  defaultDecisions,
  onAccept,
  onReject,
  onDecisionsChange,
  lineNumbers = true,
  defaultOpen = true,
  className,
  ...props
}: DiffReviewProps) {
  const m = useNexubMessages();
  const [own, setOwn] = React.useState<Record<string, DiffDecision>>(defaultDecisions ?? {});
  const decisions = controlled ?? own;
  const [openFiles, setOpenFiles] = React.useState<Record<string, boolean>>({});

  const decide = (f: DiffReviewFile, d: DiffDecision) => {
    if (decisions[f.file] === d) return;
    const next = { ...decisions, [f.file]: d };
    if (!controlled) setOwn(next);
    (d === 'accepted' ? onAccept : onReject)?.(f);
    onDecisionsChange?.(next);
  };

  const accepted = files.filter((f) => decisions[f.file] === 'accepted').length;
  const rejected = files.filter((f) => decisions[f.file] === 'rejected').length;

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <p role="status" aria-live="polite" className="m-0 text-label-md text-[var(--color-on-surface-variant)]">
        {m.diffReviewSummary(accepted, rejected, files.length - accepted - rejected)}
      </p>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {files.map((f) => (
          <FileRow
            key={f.file}
            f={f}
            decision={decisions[f.file]}
            open={openFiles[f.file] ?? defaultOpen}
            onToggle={() => setOpenFiles((o) => ({ ...o, [f.file]: !(o[f.file] ?? defaultOpen) }))}
            onDecide={(d) => decide(f, d)}
            lineNumbers={lineNumbers}
          />
        ))}
      </ul>
    </div>
  );
}

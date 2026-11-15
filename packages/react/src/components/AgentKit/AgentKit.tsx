// AgentKit (4.8): building blocks for agent UI. PlanTracker, ToolCall and
// DiffView are server components (ToolCall uses native <details>, so it opens
// with the keyboard and needs no JavaScript); ApprovalCard is in
// ApprovalCard.tsx because it takes callbacks.
import * as React from 'react';
import { cn } from '../../utils/cn.js';

export type PlanStepStatus = 'done' | 'active' | 'pending' | 'failed';
export interface PlanStep { title: string; status: PlanStepStatus; detail?: React.ReactNode }

const STATUS_TEXT: Record<PlanStepStatus, string> = { done: 'Done', active: 'In progress', pending: 'Not started', failed: 'Failed' };

function StepIcon({ status }: { status: PlanStepStatus }) {
  const ring = 'flex size-5 shrink-0 items-center justify-center rounded-full';
  if (status === 'done')
    return (
      <span className={cn(ring, 'bg-[var(--color-primary)] text-[var(--color-on-primary)]')}>
        <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
      </span>
    );
  if (status === 'failed')
    return <span className={cn(ring, 'bg-[var(--color-error)] text-label-sm font-bold text-[var(--color-on-error)]')}>!</span>;
  if (status === 'active')
    return (
      <span className={cn(ring, 'border-2 border-[var(--color-primary)]')}>
        <span className="size-2 rounded-full bg-[var(--color-primary)] motion-safe:animate-pulse" />
      </span>
    );
  return <span className={cn(ring, 'border-2 border-[var(--color-outline-variant)]')} />;
}

export interface PlanTrackerProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: PlanStep[];
}

/** An agent's plan: ordered steps with their status, announced in text. */
export function PlanTracker({ steps, className, ...props }: PlanTrackerProps) {
  return (
    <ol className={cn('m-0 flex list-none flex-col gap-3 p-0', className)} {...props}>
      {steps.map((s, i) => (
        <li key={i} aria-current={s.status === 'active' ? 'step' : undefined} className="flex gap-3">
          <span aria-hidden="true"><StepIcon status={s.status} /></span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className={cn('text-body-md', s.status === 'pending' ? 'text-[var(--color-on-surface-variant)]' : 'text-[var(--color-on-surface)]')}>
              {s.title}
              <span className="sr-only">{`, ${STATUS_TEXT[s.status]}`}</span>
            </span>
            {s.detail && <span className="text-body-sm text-[var(--color-on-surface-variant)]">{s.detail}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export interface ToolCallProps extends Omit<React.DetailsHTMLAttributes<HTMLDetailsElement>, 'title'> {
  /** Tool name, e.g. "search_invoices". */
  name: string;
  status: 'running' | 'done' | 'failed';
  /** Arguments, shown as JSON. */
  input?: unknown;
  /** Result, shown as given (string) or as JSON. */
  output?: unknown;
}

const json = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v, null, 2));

/** One tool call: name and status, expandable to its input and output. */
export function ToolCall({ name, status, input, output, className, ...props }: ToolCallProps) {
  return (
    <details className={cn('group rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]', className)} {...props}>
      <summary className="nx-state-layer flex cursor-pointer list-none items-center gap-2 rounded-shape-container px-3 py-2 text-label-lg">
        <span aria-hidden="true" className="transition-transform group-open:rotate-90">›</span>
        <code className="font-mono text-label-md">{name}</code>
        <span className={cn('ms-auto rounded-full px-2 text-label-sm', status === 'failed' ? 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]' : status === 'done' ? 'bg-[var(--color-success-container)] text-[var(--color-on-success-container)]' : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]')}>
          {status === 'running' ? 'Running' : status === 'done' ? 'Done' : 'Failed'}
        </span>
      </summary>
      <div className="flex flex-col gap-2 border-t border-[var(--color-outline-variant)] p-3">
        {input !== undefined && (
          <div>
            <p className="m-0 mb-1 text-label-sm text-[var(--color-on-surface-variant)]">Input</p>
            <pre className="m-0 overflow-auto rounded-shape-field bg-[var(--color-surface)] p-2 text-body-sm"><code>{json(input)}</code></pre>
          </div>
        )}
        {output !== undefined && (
          <div>
            <p className="m-0 mb-1 text-label-sm text-[var(--color-on-surface-variant)]">Output</p>
            <pre className="m-0 overflow-auto rounded-shape-field bg-[var(--color-surface)] p-2 text-body-sm"><code>{json(output)}</code></pre>
          </div>
        )}
      </div>
    </details>
  );
}

export interface DiffViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A unified diff (lines starting with "+", "-" or " "); "@@" lines become headers. */
  diff: string;
  /** File name shown above the diff. */
  file?: string;
}

/** A unified diff, with added and removed lines spelled out for screen readers. */
export function DiffView({ diff, file, className, ...props }: DiffViewProps) {
  const lines = diff.replace(/\n$/, '').split('\n');
  return (
    <div className={cn('overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)]', className)} {...props}>
      {file && <div className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-3 py-1.5 font-mono text-label-md">{file}</div>}
      <pre className="m-0 overflow-auto bg-[var(--color-surface)] py-1 text-body-sm">
        {lines.map((line, i) => {
          const kind = line.startsWith('@@') ? 'hunk' : line.startsWith('+') ? 'add' : line.startsWith('-') ? 'del' : 'ctx';
          return (
            <div
              key={i}
              className={cn(
                'flex px-3 font-mono',
                kind === 'add' && 'bg-[color-mix(in_oklab,var(--color-success)_14%,transparent)]',
                kind === 'del' && 'bg-[color-mix(in_oklab,var(--color-error)_12%,transparent)]',
                kind === 'hunk' && 'text-[var(--color-on-surface-variant)]',
              )}
            >
              <span aria-hidden="true" className="w-4 shrink-0 select-none">{kind === 'add' ? '+' : kind === 'del' ? '−' : ''}</span>
              {kind === 'add' && <span className="sr-only">Added: </span>}
              {kind === 'del' && <span className="sr-only">Removed: </span>}
              <span className="whitespace-pre">{kind === 'hunk' ? line : line.slice(1)}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

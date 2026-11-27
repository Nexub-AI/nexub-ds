// AgentKit (4.8): building blocks for agent UI. PlanTracker, ToolCall and
// DiffView are server components (ToolCall uses native <details>, so it opens
// with the keyboard and needs no JavaScript); ApprovalCard and DiffReview (12.4)
// are in their own files because they keep state. Server parts read strings
// from @nexub/core's defaults plus their `messages` prop (no provider context).
import * as React from 'react';
import { defaultMessages, type NexubMessages } from '@nexub/core';
import { cn } from '../../utils/cn.js';
import { ToolCallRetry } from './ToolCallRetry.js';

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

type AgentKitMessages = Pick<
  NexubMessages,
  'toolCallStatus' | 'toolCallInput' | 'toolCallOutput' | 'toolCallError' | 'toolCallDuration' | 'retry'
>;

export interface ToolCallProps extends Omit<React.DetailsHTMLAttributes<HTMLDetailsElement>, 'title'> {
  /** Tool name, e.g. "search_invoices". */
  name: string;
  status: 'running' | 'done' | 'failed';
  /** Arguments, shown as JSON. */
  input?: unknown;
  /** Result, shown as given (string) or as JSON. */
  output?: unknown;
  /** 12.4: how long the call took, in milliseconds; shown formatted ("1.2 s") beside the status. */
  duration?: number;
  /** 12.4: why the call failed, shown as text in the failed state. A failed call with an `error` starts open. */
  error?: React.ReactNode;
  /**
   * 12.4: shows a Retry button in the failed state (a small client island). Without it
   * ToolCall renders no client code and stays server-safe.
   */
  onRetry?: () => void;
  /** 12.4: open on first render (`open` still wins). */
  defaultOpen?: boolean;
  /**
   * 12.4: strings for this card. ToolCall renders on the server, so it reads the English
   * defaults from `@nexub/core`, not NexubProvider; pass translations here.
   */
  messages?: Partial<AgentKitMessages>;
}

const json = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const block = 'm-0 overflow-auto rounded-shape-field bg-[var(--color-surface)] p-2 text-body-sm';
const heading = 'm-0 mb-1 text-label-sm text-[var(--color-on-surface-variant)]';

/** One tool call: name and status, expandable to its input and output. */
export function ToolCall({ name, status, input, output, duration, error, onRetry, defaultOpen, messages, open, className, ...props }: ToolCallProps) {
  const m = { ...defaultMessages, ...messages };
  const failed = status === 'failed';
  const showError = failed && error != null && error !== false;
  return (
    <details
      open={open ?? defaultOpen ?? (showError || undefined)}
      className={cn('group rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]', className)}
      {...props}
    >
      <summary className="nx-state-layer flex cursor-pointer list-none items-center gap-2 rounded-shape-container px-3 py-2 text-label-lg">
        <span aria-hidden="true" className="transition-transform group-open:rotate-90">›</span>
        <code className="font-mono text-label-md">{name}</code>
        {duration !== undefined && (
          <span className="ms-auto text-label-sm tabular-nums text-[var(--color-on-surface-variant)]"><bdi>{m.toolCallDuration(duration)}</bdi></span>
        )}
        {/* 12.4: status changes (Running → Done) are announced politely; focus never moves. */}
        <span
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            'rounded-full px-2 text-label-sm',
            duration === undefined && 'ms-auto',
            failed
              ? 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]'
              : status === 'done'
                ? 'bg-[var(--color-success-container)] text-[var(--color-on-success-container)]'
                : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]',
          )}
        >
          {m.toolCallStatus[status]}
        </span>
      </summary>
      <div className="flex flex-col gap-2 border-t border-[var(--color-outline-variant)] p-3">
        {input !== undefined && (
          <div>
            <p className={heading}>{m.toolCallInput}</p>
            <pre dir="ltr" className={block}><code>{json(input)}</code></pre>
          </div>
        )}
        {output !== undefined && (
          <div>
            <p className={heading}>{m.toolCallOutput}</p>
            <pre dir="ltr" className={block}><code>{json(output)}</code></pre>
          </div>
        )}
        {showError && (
          <div>
            <p className={heading}>{m.toolCallError}</p>
            <pre dir="auto" className={cn(block, 'whitespace-pre-wrap bg-[var(--color-error-container)] text-[var(--color-on-error-container)]')}>{error}</pre>
          </div>
        )}
        {failed && onRetry && (
          <div>
            <ToolCallRetry retry={onRetry}>{m.retry}</ToolCallRetry>
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
  /** 12.4: old and new line numbers in the gutter, counted from each `@@ -a,b +c,d @@` header. Hidden from screen readers. */
  lineNumbers?: boolean;
  /** 12.4: the screen-reader prefixes ("Added: ", "Removed: "). DiffView renders on the server, so translate here. */
  messages?: Partial<Pick<NexubMessages, 'diffAdded' | 'diffRemoved'>>;
}

export type DiffLineKind = 'hunk' | 'add' | 'del' | 'ctx';
export interface DiffLine {
  kind: DiffLineKind;
  text: string;
  /** Line number in the old file (context and removed lines inside a hunk). */
  old?: number;
  /** Line number in the new file (context and added lines inside a hunk). */
  new?: number;
}

const HUNK = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/;

/** 12.4: each line of a unified diff with its kind and, inside a hunk, its old and new line numbers. */
export function parseDiff(diff: string): DiffLine[] {
  let a = 0;
  let b = 0;
  let inHunk = false;
  return diff
    .replace(/\n$/, '')
    .split('\n')
    .map((line): DiffLine => {
      if (line.startsWith('@@')) {
        const h = HUNK.exec(line);
        inHunk = !!h;
        if (h) {
          a = Number(h[1]);
          b = Number(h[2]);
        }
        return { kind: 'hunk', text: line };
      }
      const kind: DiffLineKind = line.startsWith('+') ? 'add' : line.startsWith('-') ? 'del' : 'ctx';
      const text = line.slice(1);
      if (!inHunk) return { kind, text };
      if (kind === 'add') return { kind, text, new: b++ };
      if (kind === 'del') return { kind, text, old: a++ };
      return { kind, text, old: a++, new: b++ };
    });
}

const gutter = 'w-8 shrink-0 select-none pe-2 text-end tabular-nums text-[var(--color-on-surface-variant)]';

/** A unified diff, with added and removed lines spelled out for screen readers. */
export function DiffView({ diff, file, lineNumbers, messages, className, ...props }: DiffViewProps) {
  const m = { ...defaultMessages, ...messages };
  return (
    <div className={cn('overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)]', className)} {...props}>
      {file && <div className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-3 py-1.5 font-mono text-label-md">{file}</div>}
      <pre dir="ltr" className="m-0 overflow-auto bg-[var(--color-surface)] py-1 text-body-sm">
        {parseDiff(diff).map(({ kind, text, old, new: next }, i) => (
          <div
            key={i}
            className={cn(
              'flex px-3 font-mono',
              kind === 'add' && 'bg-[color-mix(in_oklab,var(--color-success)_14%,transparent)]',
              kind === 'del' && 'bg-[color-mix(in_oklab,var(--color-error)_12%,transparent)]',
              kind === 'hunk' && 'text-[var(--color-on-surface-variant)]',
            )}
          >
            {lineNumbers && (
              <>
                <span aria-hidden="true" className={gutter}>{old ?? ''}</span>
                <span aria-hidden="true" className={gutter}>{next ?? ''}</span>
              </>
            )}
            <span aria-hidden="true" className="w-4 shrink-0 select-none">{kind === 'add' ? '+' : kind === 'del' ? '−' : ''}</span>
            {kind === 'add' && <span className="sr-only">{m.diffAdded}</span>}
            {kind === 'del' && <span className="sr-only">{m.diffRemoved}</span>}
            <span className="whitespace-pre">{text}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

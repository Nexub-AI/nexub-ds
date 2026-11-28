import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { ApprovalCard, DiffReview, DiffView, PlanTracker, ToolCall } from './index.js';

describe('AgentKit', () => {
  it('PlanTracker announces each status and marks the current step', () => {
    render(<PlanTracker steps={[{ title: 'Read invoices', status: 'done' }, { title: 'Match payments', status: 'active' }, { title: 'Send', status: 'pending' }]} />);
    expect(screen.getByText(', Done')).toBeTruthy();
    const items = screen.getAllByRole('listitem');
    expect(items[1]!.getAttribute('aria-current')).toBe('step');
  });

  it('ToolCall is a native disclosure with input and output', () => {
    const { container } = render(<ToolCall name="search_invoices" status="done" input={{ q: 'acme' }} output="3 found" />);
    expect(container.querySelector('details > summary')!.textContent).toContain('search_invoices');
    expect(container.textContent).toContain('"q": "acme"');
  });

  it('DiffView spells out added and removed lines', () => {
    render(<DiffView file="a.ts" diff={'@@ -1 +1 @@\n-old\n+new\n same'} />);
    expect(screen.getByText('Added:')).toBeTruthy();
    expect(screen.getByText('Removed:')).toBeTruthy();
  });

  it('ApprovalCard calls back once and announces the outcome', () => {
    const onApprove = vi.fn();
    render(<ApprovalCard title="Send 3 invoices" onApprove={onApprove} />);
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(onApprove).toHaveBeenCalledOnce();
    expect(screen.getByRole('status').textContent).toBe('Approved');
    expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull();
  });

  it('server parts render without style attributes', () => {
    const html = renderToString(<><PlanTracker steps={[{ title: 'a', status: 'done' }]} /><ToolCall name="t" status="running" /><DiffView diff="+a" /></>);
    expect(html).not.toContain('style=');
  });
});

describe('AgentKit 12.4', () => {
  it('ToolCall shows the duration, a polite status and stays closed by default', () => {
    const { container } = render(<ToolCall name="t" status="running" duration={1234} />);
    expect(container.textContent).toContain('1.2 s');
    expect(screen.getByText('Running').getAttribute('aria-live')).toBe('polite');
    expect(container.querySelector('details')!.open).toBe(false);
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it('ToolCall failed: the error is shown as text, the card starts open, Retry calls back', () => {
    const onRetry = vi.fn();
    const { container } = render(<ToolCall name="t" status="failed" error="Timed out after 30 s" onRetry={onRetry} />);
    expect(container.querySelector('details')!.open).toBe(true);
    expect(screen.getByText('Error')).toBeTruthy();
    expect(screen.getByText('Timed out after 30 s')).toBeTruthy();
    expect(container.querySelector('[role="alert"]')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('ToolCall shows Retry only when failed, honours defaultOpen and translated messages', () => {
    const { container } = render(
      <ToolCall name="t" status="done" onRetry={() => {}} defaultOpen messages={{ toolCallStatus: { running: 'En cours', done: 'Terminé', failed: 'Échec' } }} />,
    );
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
    expect(container.querySelector('details')!.open).toBe(true);
    expect(screen.getByText('Terminé')).toBeTruthy();
  });

  it('ToolCall without callbacks renders on the server', () => {
    const html = renderToString(<ToolCall name="t" status="failed" error="boom" duration={80} />);
    expect(html).toContain('boom');
    expect(html).toContain('80 ms');
    expect(html).not.toContain('<button');
  });

  it('DiffView lineNumbers counts old and new lines from the hunk header', () => {
    const { container } = render(<DiffView lineNumbers diff={'@@ -10,3 +20,3 @@\n same\n-old\n+new\n tail'} />);
    const rows = [...container.querySelectorAll('pre > div')].map((r) =>
      [...r.querySelectorAll('[aria-hidden="true"]')].slice(0, 2).map((g) => g.textContent),
    );
    expect(rows).toEqual([['', ''], ['10', '20'], ['11', ''], ['', '21'], ['12', '22']]);
  });

  it('ApprovalCard edit path: edit, then approve with changes; focus moves to the card', () => {
    const onEdit = vi.fn();
    render(<ApprovalCard title="Send invoice" args={{ amount: 10 }} onEdit={onEdit} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    const area = screen.getByRole('textbox', { name: 'Arguments' });
    expect(document.activeElement).toBe(area);
    fireEvent.change(area, { target: { value: '{"amount": 12}' } });
    fireEvent.click(screen.getByRole('button', { name: 'Approve with changes' }));
    expect(onEdit).toHaveBeenCalledWith('{"amount": 12}');
    expect(screen.getByRole('status').textContent).toBe('Approved with changes');
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(document.activeElement).toBe(screen.getByRole('group', { name: 'Send invoice' }));
  });

  it('ApprovalCard edit can be cancelled, returning focus to Edit', async () => {
    render(<ApprovalCard title="Send" args="a" onEdit={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('textbox')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Edit' })));
  });

  it('ApprovalCard async callback: pending disables the actions, then shows the outcome', async () => {
    let done!: () => void;
    const onDeny = vi.fn(() => new Promise<void>((r) => (done = r)));
    render(<ApprovalCard title="Delete" onDeny={onDeny} />);
    fireEvent.click(screen.getByRole('button', { name: 'Deny' }));
    expect(screen.getAllByRole('status')[0]!.textContent).toBe('Working…');
    expect((screen.getByRole('button', { name: 'Approve' }) as HTMLButtonElement).disabled).toBe(true);
    await act(async () => done());
    expect(screen.getByRole('status').textContent).toBe('Denied');
    expect(onDeny).toHaveBeenCalledOnce();
  });

  it('ApprovalCard controlled outcome and pending', () => {
    const { rerender } = render(<ApprovalCard title="Pay" outcome={null} pending />);
    expect(screen.getAllByRole('status')[0]!.textContent).toBe('Working…');
    rerender(<ApprovalCard title="Pay" outcome="denied" />);
    expect(screen.getByRole('status').textContent).toBe('Denied');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('DiffReview: per-file accept and reject, a summary and collapsible files', () => {
    const onAccept = vi.fn();
    const files = [{ file: 'a.ts', diff: '@@ -1 +1 @@\n-a\n+b' }, { file: 'b.ts', diff: '+c' }];
    render(<DiffReview files={files} onAccept={onAccept} />);
    expect(screen.getByRole('status').textContent).toBe('0 accepted, 0 rejected, 2 to review');
    const accept = screen.getByRole('button', { name: 'Accept a.ts' });
    expect(accept.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(accept);
    expect(onAccept).toHaveBeenCalledWith(files[0]);
    expect(accept.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Reject b.ts' }));
    expect(screen.getByRole('status').textContent).toBe('1 accepted, 1 rejected, 0 to review');
    const toggle = screen.getByRole('button', { name: /^a\.ts/ });
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById(toggle.getAttribute('aria-controls')!)!.hidden).toBe(true);
  });

  it('DiffReview is controlled by decisions', () => {
    const onReject = vi.fn();
    render(<DiffReview files={[{ file: 'a.ts', diff: '+a' }]} decisions={{ 'a.ts': 'accepted' }} onReject={onReject} />);
    fireEvent.click(screen.getByRole('button', { name: 'Reject a.ts' }));
    expect(onReject).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Accept a.ts' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('12.4 parts are axe-clean', async () => {
    const { container } = render(
      <>
        <ToolCall name="t" status="failed" error="boom" onRetry={() => {}} duration={10} />
        <ApprovalCard title="Send" args={{ a: 1 }} onEdit={() => {}} />
        <DiffReview files={[{ file: 'a.ts', diff: '@@ -1 +1 @@\n-a\n+b' }]} />
      </>,
    );
    const { violations } = await axe.run(container);
    expect(violations).toEqual([]);
  });
});

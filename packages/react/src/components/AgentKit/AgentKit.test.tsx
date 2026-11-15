import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ApprovalCard, DiffView, PlanTracker, ToolCall } from './index.js';

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

import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect, vi } from 'vitest';
import axe from 'axe-core';
import { MessageCard } from './MessageCard.js';
import { MessageBubble } from './MessageBubble.js';

const fields = [
  { label: 'Amount', value: '€1,240.00' },
  { label: 'Vendor', value: 'Acme GmbH' },
];

describe('MessageCard', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders title, status, fields as a dl, and body', () => {
    render(
      <MessageCard title="Expense report" status={<span>Pending</span>} fields={fields} body="Submitted for Q4." />,
    );
    expect(screen.getByText('Expense report')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    const dl = document.querySelector('dl')!;
    expect(dl.parentElement!.className).toContain('@container');
    expect(within(dl).getAllByRole('term').map((t) => t.textContent)).toEqual(['Amount', 'Vendor']);
    expect(within(dl).getAllByRole('definition').map((d) => d.textContent)).toEqual(['€1,240.00', 'Acme GmbH']);
    expect(screen.getByText('Submitted for Q4.')).toBeInTheDocument();
  });

  it('one filled action at most; the first without a variant is primary', () => {
    const approve = vi.fn();
    render(
      <MessageCard
        actions={[
          { label: 'Approve', onSelect: approve },
          { label: 'Reject', onSelect: () => {} },
        ]}
      />,
    );
    const approveBtn = screen.getByRole('button', { name: 'Approve' });
    expect(approveBtn.className).toContain('--button-filled-bg');
    expect(screen.getByRole('button', { name: 'Reject' }).className).not.toContain('--button-filled-bg');
    fireEvent.click(approveBtn);
    expect(approve).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: 'More actions' })).toBeNull();
  });

  it('warns in development for more than one filled action', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <MessageCard
        actions={[
          { label: 'A', onSelect: () => {}, variant: 'filled' },
          { label: 'B', onSelect: () => {}, variant: 'filled' },
        ]}
      />,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('more than one action'));
    expect(screen.getByRole('button', { name: 'B' }).className).not.toContain('--button-filled-bg');
  });

  it('past two actions, the rest go into a "More actions" menu; the filled one stays visible', async () => {
    const archive = vi.fn();
    render(
      <MessageCard
        actions={[
          { label: 'Reject', onSelect: () => {}, variant: 'text' },
          { label: 'Edit', onSelect: () => {} },
          { label: 'Archive', onSelect: archive },
          { label: 'Approve', onSelect: () => {}, variant: 'filled' },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull();
    const more = screen.getByRole('button', { name: 'More actions' });
    expect(more).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.click(more);
    const menu = await screen.findByRole('menu');
    expect(within(menu).getAllByRole('menuitem').map((i) => i.textContent)).toEqual(['Edit', 'Archive']);
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Archive' }));
    expect(archive).toHaveBeenCalledOnce();
  });

  it('raw ReactNode actions render as given', () => {
    render(<MessageCard actions={<button type="button">Custom</button>} />);
    expect(screen.getByRole('button', { name: 'Custom' })).toBeInTheDocument();
  });

  it('done replaces the actions with a status line and a check', () => {
    render(
      <MessageCard
        actions={[{ label: 'Approve', onSelect: () => {} }]}
        done="Approved by you · 2:14 pm"
      />,
    );
    expect(screen.queryByRole('button')).toBeNull();
    const line = screen.getByRole('status');
    expect(line).toHaveTextContent('Approved by you · 2:14 pm');
    expect(line.querySelector('.nx-success-check')).not.toBeNull();
  });

  it('maxHeight clips with a Show all toggle (CSSOM, no style attribute)', () => {
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(120);
    render(<MessageCard fields={fields} body="Long" maxHeight={120} messages={{ showAll: 'Show all' }} />);
    const toggle = screen.getByRole('button', { name: 'Show all' });
    const region = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(region.style.maxHeight).toBe('120px');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAccessibleName('Show less');
    expect(region.style.maxHeight).toBe('');
  });

  it('no Show all when the content fits', () => {
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(80);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(80);
    render(<MessageCard body="Short" maxHeight="10rem" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders no style attribute on the server (strict CSP)', () => {
    const html = renderToString(<MessageCard title="T" fields={fields} maxHeight={100} actions={[{ label: 'Go', onSelect: () => {} }]} />);
    expect(html).not.toContain('style="');
  });

  it('is axe-clean inside a bubble', async () => {
    const { container } = render(
      <MessageBubble from="assistant">
        <MessageCard
          title="Expense report"
          fields={fields}
          actions={[
            { label: 'Approve', onSelect: () => {} },
            { label: 'Reject', onSelect: () => {} },
            { label: 'Archive', onSelect: () => {} },
          ]}
        />
      </MessageBubble>,
    );
    const { violations } = await axe.run(container);
    expect(violations).toEqual([]);
  });
});

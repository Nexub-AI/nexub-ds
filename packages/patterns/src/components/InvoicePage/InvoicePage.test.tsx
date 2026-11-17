import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NexubProvider } from '@nexub/react';
import { InvoicePage, type InvoicePageProps } from './index.js';

const base: InvoicePageProps = {
  number: 'INV-2041',
  issuedOn: '2026-11-03',
  from: { name: 'Harbour Studio', lines: ['12 Quay Street', 'billing@harbour.test'], taxId: 'GB123' },
  to: { name: 'Northwind Traders' },
  items: [
    { id: 'design', description: 'Design sprint', detail: 'October', quantity: 2, unitPrice: 400 },
    { description: 'Hosting', quantity: 1, unitPrice: 50, amount: 45 },
  ],
  currency: 'USD',
  locale: 'en-US',
};

describe('InvoicePage', () => {
  it('names the page, shows both parties and a real items table with computed totals', () => {
    render(
      <InvoicePage
        {...base}
        status="due"
        dueOn={new Date(2026, 10, 17)}
        discount={45}
        taxes={[{ label: 'VAT 20%', amount: 160 }]}
        notes="Thank you."
        payment={<p>Pay by bank transfer.</p>}
        actions={<button type="button">Download</button>}
        logo={<span>Logo</span>}
      />,
    );
    expect(screen.getByRole('main', { name: 'Invoice INV-2041' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Invoice INV-2041' })).toBeInTheDocument();
    // Status is text, not colour alone.
    expect(within(screen.getByRole('main')).getAllByText('Due').length).toBeGreaterThan(0);
    expect(screen.getByText('Nov 3, 2026')).toBeInTheDocument();
    expect(screen.getByText('Nov 17, 2026')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'From' })).toHaveTextContent('Tax ID GB123');
    expect(screen.getByRole('region', { name: 'Billed to' })).toHaveTextContent('Northwind Traders');
    const table = screen.getByRole('table', { name: 'Line items' });
    expect(within(table).getAllByRole('columnheader')).toHaveLength(4);
    expect(within(table).getByRole('row', { name: /Design sprint/ })).toHaveTextContent('$800.00');
    // An explicit amount wins over quantity × unit price.
    expect(within(table).getByRole('row', { name: /Hosting/ })).toHaveTextContent('$45.00');
    expect(within(table).getByRole('row', { name: /Subtotal/ })).toHaveTextContent('$845.00');
    expect(screen.getByText('-$45.00')).toBeInTheDocument();
    expect(screen.getByText('$160.00')).toBeInTheDocument();
    // 845 − 45 + 160
    expect(screen.getByText('$960.00')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Notes' })).toHaveTextContent('Thank you.');
    expect(screen.getByText('Pay by bank transfer.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('takes explicit subtotal and total, and renders without status, actions or extras', () => {
    render(<InvoicePage {...base} subtotal={900} total={1000} discount={0} issuedOn={new Date(2026, 10, 3)} />);
    expect(screen.getByText('$900.00')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.queryByText('Discount')).toBeNull();
    expect(screen.queryByRole('region', { name: 'Notes' })).toBeNull();
  });

  it('receipt: success mark, the amount as the hero, paid badge and actions', () => {
    render(
      <NexubProvider locale="en-GB">
        <InvoicePage {...base} locale={undefined} variant="receipt" status="paid" issuedOn="2026-11-03T10:00:00" actions={<button type="button">Done</button>} logo={<span>Logo</span>} notes="Kept for your records." />
      </NexubProvider>,
    );
    expect(screen.getByRole('main', { name: 'Receipt INV-2041' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Receipt INV-2041');
    expect(screen.getByText('Paid')).toBeInTheDocument();
    expect(screen.getByText(/Northwind Traders · 3 Nov 2026/)).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Line items' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'From' })).toBeNull();
  });

  it('every status has a text label, and the page renders on the server', () => {
    for (const status of ['draft', 'due', 'paid', 'overdue', 'void'] as const) {
      const { unmount } = render(<InvoicePage {...base} status={status} as="div" />);
      expect(screen.getByText({ draft: 'Draft', due: 'Due', paid: 'Paid', overdue: 'Overdue', void: 'Void' }[status])).toBeInTheDocument();
      unmount();
    }
    expect(renderToString(<InvoicePage {...base} />)).toContain('Design sprint');
    expect(renderToString(<InvoicePage {...base} variant="receipt" />)).toContain('Receipt INV-2041');
  });
});

import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { NexubProvider } from '@nexub/react/NexubProvider';
import { GenUI, catalog } from './index.js';

const announcer = () => document.querySelector('[data-genui-announce]');

const plans = {
  version: '1.0',
  title: 'Plans that fit your team',
  root: {
    type: 'Card',
    props: { title: 'Team', description: '€8 per seat, monthly', tone: 'info', variant: 'surface' },
    children: [
      'Billed monthly.',
      { type: 'Badge', props: { text: 'Recommended', tone: 'success' } },
      { type: 'Alert', props: { title: 'Heads up', text: 'Prices exclude VAT.', tone: 'warning' } },
      { type: 'StreamingText', props: { text: 'Two plans fit a team of 12.' } },
      { type: 'DescriptionList', props: { items: [{ label: 'Seats', value: '12' }, { label: 'Total', value: '€96', emphasis: true }] } },
      { type: 'Table', props: { caption: 'Invoices', columns: [{ label: 'Invoice' }, { label: 'Amount', align: 'end' }], rows: [['INV-1', 120], ['INV-2', null], [true, false]] } },
      { type: 'Card', props: { title: 'Nested' }, children: ['Inside'] },
      { type: 'Button', key: 'team', props: { label: 'Choose Team', variant: 'filled', action: { name: 'choosePlan', payload: { plan: 'team' } } } },
    ],
  },
};

describe('GenUI', () => {
  it('renders every catalog component inside one named region', () => {
    render(<GenUI document={plans} actions={['choosePlan']} onAction={() => {}} />);
    const region = screen.getByRole('region', { name: 'Plans that fit your team' });
    expect(within(region).getByRole('heading', { level: 3, name: 'Team' })).toBeInTheDocument();
    expect(within(region).getByRole('heading', { level: 4, name: 'Nested' })).toBeInTheDocument();
    expect(within(region).getByText('€8 per seat, monthly')).toBeInTheDocument();
    expect(within(region).getByText('Billed monthly.')).toBeInTheDocument();
    expect(within(region).getByText('Recommended')).toBeInTheDocument();
    expect(within(region).getByRole('alert')).toHaveTextContent('Heads upPrices exclude VAT.');
    expect(within(region).getByText('Two plans fit a team of 12.')).toBeInTheDocument();
    expect(within(region).getByText('Seats').closest('dl')).toBeInTheDocument();
    const table = within(region).getByRole('table', { name: 'Invoices' });
    expect(within(table).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Invoice', 'Amount']);
    expect(within(table).getAllByRole('cell').map((c) => c.textContent)).toEqual(['INV-1', '120', 'INV-2', '', 'true', 'false']);
    expect(within(region).getByRole('button', { name: 'Choose Team' })).toBeEnabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<GenUI document={plans} actions={['choosePlan']} onAction={() => {}} />);
    const { violations } = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(violations.map((v) => v.id)).toEqual([]);
  });

  it('names the region from aria-label, then the title, then the messages', () => {
    const badge = { version: '1.0', root: { type: 'Badge', props: { text: 'x' } } };
    const { rerender } = render(<GenUI document={badge} aria-label="Assistant answer" />);
    expect(screen.getByRole('region', { name: 'Assistant answer' })).toBeInTheDocument();
    rerender(<GenUI document={badge} />);
    expect(screen.getByRole('region', { name: 'Generated answer' })).toBeInTheDocument();
    rerender(
      <NexubProvider messages={{ genuiRegion: 'Réponse générée' }}>
        <GenUI document={badge} />
      </NexubProvider>,
    );
    expect(screen.getByRole('region', { name: 'Réponse générée' })).toBeInTheDocument();
  });

  it('sends a named action once per press, and shows the button busy while the host works', async () => {
    let finish: () => void = () => {};
    const onAction = vi.fn(() => new Promise<void>((r) => (finish = r)));
    render(<GenUI document={plans} actions={['choosePlan']} onAction={onAction} />);
    const button = screen.getByRole('button', { name: /Choose Team/ });
    await userEvent.click(button);
    await userEvent.click(button);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith({ name: 'choosePlan', payload: { plan: 'team' }, key: 'team' });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    await act(async () => finish());
    expect(button).not.toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(button);
    expect(onAction).toHaveBeenCalledTimes(2);
  });

  it('works from the keyboard', async () => {
    const onAction = vi.fn();
    render(<GenUI document={plans} actions={['choosePlan']} onAction={onAction} />);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Choose Team' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onAction).toHaveBeenCalledTimes(2);
  });

  it('renders no buttons unless the host accepts their action', () => {
    const onIssues = vi.fn();
    render(<GenUI document={plans} onIssues={onIssues} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(onIssues).toHaveBeenCalledWith([expect.objectContaining({ code: 'unknown-action', path: '/root/children/7/props/action' })]);
  });

  it('disables a button without onAction', () => {
    render(<GenUI document={plans} actions={['choosePlan']} />);
    expect(screen.getByRole('button', { name: 'Choose Team' })).toBeDisabled();
  });

  it('shows the fallback and reports issues when a document is rejected', () => {
    const onIssues = vi.fn();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = render(<GenUI document={{ version: '9.0', root: {} }} onIssues={onIssues} />);
    expect(screen.getByText('This answer couldn’t be shown')).toBeInTheDocument();
    expect(onIssues).toHaveBeenCalledWith([expect.objectContaining({ code: 'unsupported-version' })]);
    expect(warn).toHaveBeenCalled();
    rerender(<GenUI document={{ version: '1.0', root: { type: 'Badge', props: { text: 'x', tone: 'nope' } } }} onInvalid="reject" fallback={<p>Custom fallback</p>} />);
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    warn.mockRestore();
  });

  it('narrows the catalog and lowers limits', () => {
    const onIssues = vi.fn();
    const { rerender } = render(<GenUI document={plans} catalog={catalog.only(['Card', 'Badge'])} onIssues={onIssues} />);
    expect(screen.getByText('Recommended')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('table')).toBeNull();
    rerender(<GenUI document={plans} limits={{ maxNodes: 3 }} />);
    expect(screen.getByText('This answer couldn’t be shown')).toBeInTheDocument();
  });

  it('shifts heading levels by headingLevel, clamped to 1–6', () => {
    const { rerender } = render(<GenUI document={plans} headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Team' })).toBeInTheDocument();
    rerender(<GenUI document={plans} headingLevel={6} />);
    expect(screen.getByRole('heading', { level: 6, name: 'Nested' })).toBeInTheDocument();
  });

  it('streams JSON text: busy region, skeletons for nodes still arriving, disabled buttons, one announcement', () => {
    const full = JSON.stringify(plans);
    const cut = full.indexOf('"Choose Team"') - 10;
    const onIssues = vi.fn();
    const { rerender, container } = render(<GenUI document={full.slice(0, cut)} streaming actions={['choosePlan']} onAction={() => {}} onIssues={onIssues} />);
    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelector('[data-genui-pending]')).not.toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    expect(announcer()).toHaveTextContent('');

    rerender(<GenUI document={full} streaming actions={['choosePlan']} onAction={() => {}} onIssues={onIssues} />);
    expect(screen.getByRole('button', { name: 'Choose Team' })).toBeDisabled();
    expect(onIssues).not.toHaveBeenCalled();

    rerender(<GenUI document={full} actions={['choosePlan']} onAction={() => {}} onIssues={onIssues} />);
    expect(region).not.toHaveAttribute('aria-busy');
    expect(screen.getByRole('button', { name: 'Choose Team' })).toBeEnabled();
    expect(announcer()).toHaveTextContent('Answer ready');
    expect(onIssues).not.toHaveBeenCalled();
  });

  it('shows a skeleton before anything arrives, and rejects streamed text that can never be JSON', () => {
    const { rerender, container } = render(<GenUI document="" streaming />);
    expect(container.querySelector('[data-genui-pending]')).not.toBeNull();
    rerender(<GenUI document="{oops" streaming />);
    expect(screen.getByText('This answer couldn’t be shown')).toBeInTheDocument();
  });

  it('keeps keyed nodes mounted while later siblings stream in', () => {
    const doc = (n: number) => ({ version: '1.0', root: { type: 'Card', children: Array.from({ length: n }, (_, i) => ({ type: 'Badge', key: `b${i}`, props: { text: `Badge ${i}` } })) } });
    const { rerender } = render(<GenUI document={doc(1)} streaming />);
    const first = screen.getByText('Badge 0');
    rerender(<GenUI document={doc(3)} streaming />);
    expect(screen.getByText('Badge 0')).toBe(first);
  });

  it('tolerates duplicate keys', () => {
    const doc = { version: '1.0', root: { type: 'Card', children: [{ type: 'Badge', key: 'a', props: { text: 'One' } }, { type: 'Badge', key: 'a', props: { text: 'Two' } }] } };
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<GenUI document={doc} />);
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});

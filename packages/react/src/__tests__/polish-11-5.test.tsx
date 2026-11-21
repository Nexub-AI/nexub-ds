import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Alert } from '../components/Alert/Alert.js';
import { Breadcrumb } from '../components/Breadcrumb/Breadcrumb.js';
import { PageHeader } from '../components/PageHeader/PageHeader.js';
import { Dialog } from '../components/Dialog/Dialog.js';
import { Collapsible } from '../components/Collapsible/Collapsible.js';

describe('layout polish (11.5)', () => {
  it('Alert title takes any content', () => {
    render(<Alert title={<span>Card <strong>ending 4242</strong> expired</span>}>Update it to keep paying.</Alert>);
    expect(screen.getByText('ending 4242').tagName).toBe('STRONG');
  });

  it('Breadcrumb.Trail renders a middle item without href as a plain section', () => {
    render(<Breadcrumb.Trail items={[{ label: 'Home', href: '/' }, { label: 'Settings' }, { label: 'Billing' }]} />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toHaveAttribute('aria-current', 'page');
  });

  it('Breadcrumb.Section is plain text', () => {
    render(<Breadcrumb.Section>Settings</Breadcrumb.Section>);
    expect(screen.getByText('Settings').tagName).toBe('SPAN');
    expect(screen.getByText('Settings')).not.toHaveAttribute('role');
  });

  it('PageHeader eyebrow is a row above the title', () => {
    render(<PageHeader title="Invoice 1042" eyebrow={<><span>Overdue</span><span>Sent</span></>} />);
    const heading = screen.getByRole('heading', { name: 'Invoice 1042' });
    expect(screen.getByText('Overdue').parentElement!.nextElementSibling).toBe(heading);
  });

  it('Dialog.Content maxHeight sets the scroll height through CSSOM', () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content maxHeight="20rem" aria-describedby={undefined}>
          <Dialog.Title>Terms</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.getByRole('dialog').style.maxHeight).toBe('20rem');
  });

  it('Collapsible.Trigger variant="default" is a styled row with a chevron', async () => {
    render(
      <Collapsible.Root>
        <Collapsible.Trigger variant="default">Advanced</Collapsible.Trigger>
        <Collapsible.Content>Hidden settings</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = screen.getByRole('button', { name: 'Advanced' });
    expect(trigger.querySelector('svg')).not.toBeNull();
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Hidden settings')).toBeInTheDocument();
  });
});

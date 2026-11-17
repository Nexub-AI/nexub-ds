import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { KycPage, type KycValues } from './index.js';

const file = (name: string, type = 'image/png') => new File(['x'], name, { type });
const h1 = () => screen.getByRole('heading', { level: 1 });
const next = () => userEvent.click(screen.getByRole('button', { name: 'Continue' }));
const personal: Partial<KycValues> = { legalName: 'Mei Tan', dateOfBirth: new Date(1990, 0, 15), phone: '+6591234567', country: 'SG' };

describe('KycPage', () => {
  it('lists what is missing in personal details and links to each field', async () => {
    render(<KycPage onSubmit={() => {}} />);
    expect(h1()).toHaveTextContent('Personal details');
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Step 1 of 3' })).toBeInTheDocument();
    await next();
    const summary = screen.getByRole('alert', { name: 'There is a problem' });
    expect(summary).toHaveFocus();
    expect(within(summary).getAllByRole('link').map((a) => a.textContent)).toEqual([
      'Enter your full legal name',
      'Enter your date of birth',
      'Enter a valid phone number',
      'Choose your country of residence',
    ]);
    expect(h1()).toHaveTextContent('Personal details');
    const name = screen.getByLabelText(/Full legal name/);
    expect(name).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(within(summary).getByRole('link', { name: 'Enter your full legal name' }));
    expect(name).toHaveFocus();
    // Editing a field clears its message.
    await userEvent.type(name, 'Mei Tan');
    expect(name).not.toHaveAttribute('aria-invalid');
  });

  it('takes typed details, then a document, a review with edit links, and submits', async () => {
    const onSubmit = vi.fn<(v: KycValues) => Promise<void>>(() => Promise.resolve());
    render(<KycPage as="div" onSubmit={onSubmit} defaultValues={{ country: 'SG' }} defaultCountry="SG" countries={['SG', 'IN']} />);
    await userEvent.type(screen.getByLabelText(/Full legal name/), ' Mei Tan ');
    await userEvent.type(screen.getByLabelText(/Date of birth/), '01/15/1990');
    await userEvent.tab();
    await userEvent.type(screen.getByLabelText(/Phone number/), '91234567');
    await next();
    expect(h1()).toHaveTextContent('Document');
    expect(h1()).toHaveFocus();
    expect(screen.getByText('Make sure all four corners are in the photo.')).toBeInTheDocument();

    await next();
    const summary = screen.getByRole('alert', { name: 'There is a problem' });
    expect(within(summary).getAllByRole('link').map((a) => a.textContent)).toEqual(['Choose a document type', 'Upload the front of the document']);

    await userEvent.click(screen.getByRole('radio', { name: 'National ID' }));
    await userEvent.upload(screen.getByLabelText('Front of the document'), file('front.png'));
    await next();
    expect(within(screen.getByRole('alert', { name: 'There is a problem' })).getByRole('link')).toHaveTextContent('Upload the back of the document');
    await userEvent.upload(screen.getByLabelText('Back of the document'), file('back.png'));
    await next();

    expect(h1()).toHaveTextContent('Review');
    const personalSection = screen.getByRole('region', { name: 'Personal details' });
    expect(personalSection).toHaveTextContent('Mei Tan');
    expect(personalSection).toHaveTextContent('Jan 15, 1990');
    expect(personalSection).toHaveTextContent('+6591234567');
    expect(personalSection).toHaveTextContent('Singapore');
    const doc = screen.getByRole('region', { name: 'Document' });
    expect(doc).toHaveTextContent('National ID');
    expect(doc).toHaveTextContent('front.png');
    expect(doc).toHaveTextContent('back.png');

    // Edit goes back to the step; the picked file is still there.
    await userEvent.click(screen.getByRole('button', { name: 'Edit: Document' }));
    expect(h1()).toHaveTextContent('Document');
    expect(screen.getByText('front.png')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: 'Passport' }));
    await next();
    expect(screen.getByRole('region', { name: 'Document' })).not.toHaveTextContent('back.png');
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(h1()).toHaveTextContent('Document');
    await next();

    await userEvent.click(screen.getByRole('button', { name: 'Submit for verification' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const sent = onSubmit.mock.calls[0]![0];
    expect(sent).toMatchObject({ legalName: 'Mei Tan', phone: '+6591234567', country: 'SG', documentType: 'passport', back: undefined });
    expect(sent.dateOfBirth).toEqual(new Date(1990, 0, 15));
    expect(sent.front?.name).toBe('front.png');

    expect(await screen.findByRole('heading', { level: 1, name: 'Verification status' })).toHaveFocus();
    const steps = within(screen.getByRole('list', { name: 'Verification status' })).getAllByRole('listitem');
    expect(steps.map((li) => li.getAttribute('data-status'))).toEqual(['current', 'upcoming', 'upcoming']);
  });

  it('picks the country from the list', async () => {
    Element.prototype.hasPointerCapture ??= () => false;
    Element.prototype.releasePointerCapture ??= () => {};
    render(<KycPage onSubmit={() => {}} countries={['SG', 'IN']} />);
    const trigger = screen.getByRole('combobox', { name: /Country of residence/ });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(await screen.findByRole('option', { name: 'India' }));
    expect(trigger).toHaveTextContent('India');
  });

  it('shows a failed submit on review and an error from outside', async () => {
    const all = { ...personal, documentType: 'passport', front: file('p.pdf', 'application/pdf') };
    render(
      <KycPage
        onSubmit={() => Promise.reject(new Error('Upload failed'))}
        defaultValues={all}
        error="We are offline"
        documentTypes={[{ id: 'passport', label: 'Passport', description: 'Photo page' }]}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('We are offline');
    await next();
    expect(screen.getByText('Photo page')).toBeInTheDocument();
    await next();
    await userEvent.click(screen.getByRole('button', { name: 'Submit for verification' }));
    expect(await screen.findByText('Upload failed')).toBeInTheDocument();
    expect(h1()).toHaveTextContent('Review');
  });

  it('follows the status from the app, and reopens the form from a rejection', async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    const all = { ...personal, documentType: 'passport', front: file('p.png') };
    const statuses = () => within(screen.getByRole('list')).getAllByRole('listitem').map((li) => li.getAttribute('data-status'));
    const { rerender } = render(<KycPage onSubmit={onSubmit} status="review" defaultValues={all} />);
    expect(statuses()).toEqual(['done', 'current', 'upcoming']);
    rerender(<KycPage onSubmit={onSubmit} status="approved" defaultValues={all} />);
    expect(statuses()).toEqual(['done', 'done', 'done']);
    rerender(<KycPage onSubmit={onSubmit} status="submitted" defaultValues={all} />);
    expect(statuses()).toEqual(['current', 'upcoming', 'upcoming']);
    rerender(<KycPage onSubmit={onSubmit} status="rejected" rejectionReason="The photo is blurred." defaultValues={all} loading />);
    expect(statuses()).toEqual(['done', 'error', 'upcoming']);
    expect(screen.getByText('The photo is blurred.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Fix and resubmit' }));
    expect(h1()).toHaveTextContent('Personal details');
    expect(screen.getByRole('button', { name: /Continue/ })).toHaveAttribute('aria-busy', 'true');
    rerender(<KycPage onSubmit={onSubmit} status="rejected" defaultValues={all} />);
    await next();
    await next();
    await userEvent.click(screen.getByRole('button', { name: 'Submit for verification' }));
    // Sent again: "submitted" until the app reports a new status.
    expect(await screen.findByRole('heading', { level: 1, name: 'Verification status' })).toBeInTheDocument();
    expect(statuses()).toEqual(['current', 'upcoming', 'upcoming']);
    rerender(<KycPage onSubmit={onSubmit} status="review" defaultValues={all} />);
    expect(statuses()).toEqual(['done', 'current', 'upcoming']);
  });

  it('renders on the server', () => {
    expect(renderToString(<KycPage onSubmit={() => {}} />)).toContain('Personal details');
  });
});

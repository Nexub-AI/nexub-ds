import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Accordion } from './Accordion.js';

function TestAccordion() {
  return (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Section One</Accordion.Trigger>
        <Accordion.Content>Content One</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Section Two</Accordion.Trigger>
        <Accordion.Content>Content Two</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

describe('Accordion', () => {
  it('renders all accordion items', () => {
    render(<TestAccordion />);
    expect(screen.getByRole('button', { name: /Section One/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Section Two/i })).toBeInTheDocument();
  });

  it('content is hidden by default', () => {
    render(<TestAccordion />);
    expect(screen.queryByText('Content One')).not.toBeInTheDocument();
  });

  it('clicking a trigger opens its content', async () => {
    const user = userEvent.setup();
    render(<TestAccordion />);

    await user.click(screen.getByRole('button', { name: /Section One/i }));
    expect(screen.getByText('Content One')).toBeVisible();
  });

  it('pressing Enter on a focused trigger toggles the content', async () => {
    const user = userEvent.setup();
    render(<TestAccordion />);

    const trigger = screen.getByRole('button', { name: /Section One/i });
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Content One')).toBeInTheDocument();

    await user.keyboard('{Enter}');
    expect(screen.queryByText('Content One')).not.toBeInTheDocument();
  });

  it('forwards className on Root', () => {
    render(
      <Accordion.Root type="single" className="custom-accordion">
        <Accordion.Item value="a">
          <Accordion.Trigger>A</Accordion.Trigger>
          <Accordion.Content>A content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(document.querySelector('.custom-accordion')).toBeInTheDocument();
  });
});

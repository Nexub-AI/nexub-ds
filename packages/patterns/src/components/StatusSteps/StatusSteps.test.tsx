import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import * as React from 'react';
import { StatusSteps, type StatusStep } from './StatusSteps.js';

const steps: StatusStep[] = [
  { id: 'submitted', title: 'Submitted', status: 'done', timestamp: <time dateTime="2026-03-12">12 Mar</time> },
  { id: 'review', title: 'Under review', status: 'current', description: 'Usually takes two working days.' },
  { id: 'approved', title: 'Approved', status: 'upcoming' },
];

describe('StatusSteps', () => {
  it('is a named ordered list with the steps in order', () => {
    render(<StatusSteps aria-label="Application progress" steps={steps} />);
    const list = screen.getByRole('list', { name: 'Application progress' });
    expect(list.tagName).toBe('OL');
    const items = within(list).getAllByRole('listitem');
    expect(items.map((li) => li.getAttribute('data-status'))).toEqual(['done', 'current', 'upcoming']);
    expect(items[0]).toHaveTextContent('Submitted');
    expect(items[1]).toHaveTextContent('Usually takes two working days.');
    expect(within(items[0]!).getByText('12 Mar').tagName).toBe('TIME');
  });

  it('marks only the current step with aria-current', () => {
    render(<StatusSteps aria-label="Progress" steps={steps} />);
    const items = screen.getAllByRole('listitem');
    expect(items.map((li) => li.getAttribute('aria-current'))).toEqual([null, 'step', null]);
  });

  it('says each status in visually hidden text; markers and lines are decorative', () => {
    render(<StatusSteps aria-label="Progress" steps={steps} />);
    const items = screen.getAllByRole('listitem');
    expect(items.map((li) => li.querySelector('.sr-only')!.textContent)).toEqual(['completed: ', 'current: ', 'upcoming: ']);
    // Every item but the last has a marker and a line to the next step.
    expect(items.map((li) => li.querySelector('[aria-hidden="true"]')!.children.length)).toEqual([2, 2, 1]);
  });

  it('shows a problem in the error colours, with its action; size="sm" is tighter', () => {
    render(
      <StatusSteps
        aria-labelledby="h"
        size="sm"
        steps={[
          { title: 'Submitted', status: 'done' },
          { title: 'Documents rejected', status: 'error', action: <button type="button">Upload again</button> },
        ]}
      />,
    );
    const [first, problem] = screen.getAllByRole('listitem') as [HTMLElement, HTMLElement];
    expect(problem.querySelector('.sr-only')!.textContent).toBe('problem: ');
    expect(screen.getByText('Documents rejected').className).toContain('--color-error');
    expect(problem.querySelector('[aria-hidden="true"] > span')!.className).toContain('bg-[var(--color-error)]');
    expect(within(problem).getByRole('button', { name: 'Upload again' })).toBeInTheDocument();
    expect(problem.hasAttribute('aria-current')).toBe(false);
    expect(first.className).toContain('gap-2');
  });
});

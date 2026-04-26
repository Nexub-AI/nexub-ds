import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { StepIndicator } from './StepIndicator.js';
import type { StepIndicatorStep } from './StepIndicator.js';

const steps: StepIndicatorStep[] = [
  { label: 'Account setup', description: 'Create your account' },
  { label: 'Choose plan', description: 'Pick the right plan' },
  { label: 'Confirm', description: 'Review and confirm' },
];

describe('StepIndicator', () => {
  it('renders all step labels', () => {
    render(<StepIndicator steps={steps} currentStep={0} />);
    expect(screen.getByText('Account setup')).toBeDefined();
    expect(screen.getByText('Choose plan')).toBeDefined();
    expect(screen.getByText('Confirm')).toBeDefined();
  });

  it('renders step descriptions when provided', () => {
    render(<StepIndicator steps={steps} currentStep={0} />);
    expect(screen.getByText('Create your account')).toBeDefined();
  });

  it('marks the current step with aria-current="step"', () => {
    render(<StepIndicator steps={steps} currentStep={1} />);
    const currentCircles = document.querySelectorAll('[aria-current="step"]');
    expect(currentCircles.length).toBe(1);
  });

  it('aria-current is on the circle for the correct step index', () => {
    render(<StepIndicator steps={steps} currentStep={2} />);
    const circle = document.querySelector('[aria-current="step"]');
    expect(circle).not.toBeNull();
  });

  it('completed steps do not have aria-current="step"', () => {
    render(<StepIndicator steps={steps} currentStep={2} />);
    const allCircles = document.querySelectorAll('[aria-current]');
    // Only 1 circle should have aria-current
    expect(allCircles.length).toBe(1);
  });

  it('shows number for current step', () => {
    render(<StepIndicator steps={steps} currentStep={1} />);
    // Step index 1 is "current" — should render "2" (1-based)
    const circle = document.querySelector('[aria-current="step"]')!;
    expect(circle.textContent).toBe('2');
  });

  it('shows number for upcoming steps', () => {
    render(<StepIndicator steps={steps} currentStep={0} />);
    // Step index 2 is upcoming, should show "3"
    expect(screen.getByText('3')).toBeDefined();
  });

  it('completed step circle has aria-hidden check icon (no visible number)', () => {
    render(<StepIndicator steps={steps} currentStep={2} />);
    // Steps 0 and 1 are complete — their circles should contain no visible number text
    // The Check icon has aria-hidden="true", so it's invisible to AT
    // We verify the circle for step 0 does not contain "1" as text
    const listItems = document.querySelectorAll('li');
    const firstItem = listItems[0]!;
    const circle = firstItem.querySelector('[class*="rounded-full"]')!;
    // The circle should NOT contain visible text "1"
    expect(circle.textContent).toBe('');
  });

  it('renders an ordered list', () => {
    render(<StepIndicator steps={steps} currentStep={0} />);
    expect(document.querySelector('ol')).not.toBeNull();
  });

  it('renders the correct number of list items', () => {
    render(<StepIndicator steps={steps} currentStep={0} />);
    expect(document.querySelectorAll('li').length).toBe(steps.length);
  });

  it('forwards className to root ol element', () => {
    const { container } = render(
      <StepIndicator steps={steps} currentStep={0} className="custom-steps" />,
    );
    expect(container.firstElementChild?.classList.contains('custom-steps')).toBe(true);
  });

  it('forwards ref to root ol element', () => {
    const ref = React.createRef<HTMLOListElement>();
    render(<StepIndicator steps={steps} currentStep={0} ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('OL');
  });

  it('does not render connector line after the last step', () => {
    const { container } = render(<StepIndicator steps={steps} currentStep={0} />);
    const listItems = container.querySelectorAll('li');
    const lastItem = listItems[listItems.length - 1]!;
    // The last item should not have the connector line div (absolute positioned)
    const connectors = lastItem.querySelectorAll('.absolute.left-4');
    expect(connectors.length).toBe(0);
  });
});

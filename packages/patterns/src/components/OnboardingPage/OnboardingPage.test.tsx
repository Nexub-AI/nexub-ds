import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OnboardingPage, type OnboardingStep } from './index.js';

const steps = (over: Partial<OnboardingStep>[] = []): OnboardingStep[] =>
  [
    { id: 'use', title: 'What will you use it for?', description: 'Pick one.', content: <p>Use content</p> },
    { id: 'team', title: 'Invite your team', optional: true, content: <p>Team content</p> },
    { id: 'alerts', title: 'Choose your alerts', content: <p>Alerts content</p> },
  ].map((s, i) => ({ ...s, ...over[i] }));

describe('OnboardingPage', () => {
  it('moves through the steps, saying where it is and moving focus to each heading', async () => {
    const onComplete = vi.fn();
    const onStepChange = vi.fn();
    render(<OnboardingPage steps={steps()} onComplete={onComplete} onStepChange={onStepChange} />);
    const h1 = () => screen.getByRole('heading', { level: 1 });
    expect(h1()).toHaveTextContent('What will you use it for?');
    expect(h1()).not.toHaveFocus();
    expect(screen.getByText('Pick one.')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Step 1 of 3' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Step 1 of 3' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Skip' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(h1()).toHaveTextContent('Invite your team');
    expect(h1()).toHaveFocus();
    expect(onStepChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByText('Team content')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(h1()).toHaveTextContent('What will you use it for?');
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Finish' }));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('You are all set');
    expect(h1()).toHaveFocus();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('keeps the user on a step that fails its check and announces why', async () => {
    const validate = vi
      .fn<() => boolean | string | Promise<boolean | string>>()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce('Pick one to continue')
      .mockImplementationOnce(() => Promise.reject(new Error('Could not save')))
      .mockImplementationOnce(() => Promise.reject('plain'))
      .mockResolvedValue(true);
    render(<OnboardingPage steps={steps([{ validate }])} onComplete={() => {}} />);
    const next = screen.getByRole('button', { name: 'Continue' });
    await userEvent.click(next);
    expect(screen.getByRole('alert')).toHaveTextContent('Check this step before you continue.');
    await userEvent.click(next);
    expect(screen.getByRole('alert')).toHaveTextContent('Pick one to continue');
    await userEvent.click(next);
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save');
    await userEvent.click(next);
    expect(screen.getByRole('alert')).toHaveTextContent('plain');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('What will you use it for?');
    await userEvent.click(next);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Invite your team');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('skips an optional step without checking it', async () => {
    const validate = vi.fn(() => false);
    const onSkip = vi.fn();
    const all = steps([{}, { validate }]);
    render(<OnboardingPage steps={all} defaultStep={1} onComplete={() => {}} onSkip={onSkip} />);
    await userEvent.click(screen.getByRole('button', { name: 'Skip' }));
    expect(validate).not.toHaveBeenCalled();
    expect(onSkip).toHaveBeenCalledWith(all[1]);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Choose your alerts');
  });

  it('skips without onSkip, and stays on the last step when completing fails', async () => {
    const all = steps([{}, {}, { optional: true }]);
    render(<OnboardingPage steps={all} defaultStep={2} onComplete={() => Promise.reject(new Error('Try again'))} />);
    await userEvent.click(screen.getByRole('button', { name: 'Skip' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Try again');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Choose your alerts');
  });

  it('can be controlled, gives the step its context, and shows outside loading and error', async () => {
    const onStepChange = vi.fn();
    const content = vi.fn((ctx: { index: number; total: number; next: () => void; goTo: (i: number) => void; back: () => void }) => (
      <>
        <button type="button" onClick={ctx.next}>
          Inner next
        </button>
        <button type="button" onClick={() => ctx.goTo(99)}>
          Jump
        </button>
      </>
    ));
    const all = steps([{ content }]);
    const { rerender } = render(<OnboardingPage steps={all} step={0} onStepChange={onStepChange} onComplete={() => {}} error="We are offline" />);
    expect(content).toHaveBeenCalledWith(expect.objectContaining({ index: 0, total: 3 }));
    expect(screen.getByRole('alert')).toHaveTextContent('We are offline');
    await userEvent.click(screen.getByRole('button', { name: 'Inner next' }));
    expect(onStepChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('What will you use it for?');
    await userEvent.click(screen.getByRole('button', { name: 'Jump' }));
    expect(onStepChange).toHaveBeenLastCalledWith(2);
    rerender(<OnboardingPage steps={all} step={1} onComplete={() => {}} loading />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Invite your team');
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Continue/ })).toHaveAttribute('aria-busy', 'true');
  });

  it('shows the completion view with its own copy and actions', async () => {
    render(
      <OnboardingPage
        as="div"
        width="md"
        steps={steps().slice(0, 1)}
        onComplete={() => Promise.resolve()}
        completeTitle="Welcome aboard"
        completeDescription="Your workspace is ready."
        completeActions={<button type="button">Go to dashboard</button>}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Finish' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Welcome aboard' })).toBeInTheDocument();
    expect(screen.getByText('Your workspace is ready.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to dashboard' })).toBeInTheDocument();
  });

  it('renders on the server, and the completion view when there are no steps', () => {
    expect(renderToString(<OnboardingPage steps={steps()} onComplete={() => {}} />)).toContain('What will you use it for?');
    render(<OnboardingPage steps={[]} onComplete={() => {}} />);
    expect(screen.getByRole('status')).toHaveTextContent('You are all set');
  });
});

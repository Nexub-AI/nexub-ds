import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FormField } from './FormField.js';
import { Input } from '../Input/Input.js';
import { NexubProvider } from '../NexubProvider/NexubProvider.js';

function TestField({
  invalid = false,
  required = false,
}: {
  invalid?: boolean;
  required?: boolean;
}) {
  return (
    <FormField.Root id="email" name="email" invalid={invalid} required={required}>
      <FormField.Label>Email</FormField.Label>
      <FormField.Control>
        <Input />
      </FormField.Control>
      <FormField.Description>We will never share your email.</FormField.Description>
      <FormField.Error>Invalid email address.</FormField.Error>
    </FormField.Root>
  );
}

describe('FormField', () => {
  it('renders label associated with control', () => {
    render(<TestField />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<TestField />);
    expect(screen.getByText('We will never share your email.')).toBeInTheDocument();
  });

  it('does not render error when not invalid', () => {
    render(<TestField />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders error message when invalid', () => {
    render(<TestField invalid />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Invalid email address.')).toBeInTheDocument();
  });

  it('wires aria-describedby on control', () => {
    render(<TestField />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('sets aria-required on control when required', () => {
    render(<TestField required />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-required', 'true');
  });
});

describe('FormField 12.4: streaming and generated', () => {
  function AgentField({
    streaming,
    generated,
    onAccept,
    onClear,
    initial = 'Refund approved',
  }: {
    streaming?: boolean;
    generated?: boolean;
    onAccept?: () => void;
    onClear?: () => void;
    initial?: string;
  }) {
    const [value, setValue] = React.useState(initial);
    return (
      <FormField.Root
        id="summary"
        streaming={streaming}
        generated={generated}
        onAcceptSuggestion={onAccept}
        onClearSuggestion={
          onClear &&
          (() => {
            setValue('');
            onClear();
          })
        }
      >
        <FormField.Label>Summary</FormField.Label>
        <FormField.Control>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </FormField.Control>
        <FormField.Description>One line.</FormField.Description>
      </FormField.Root>
    );
  }

  it('is off by default: no busy state, no mark', () => {
    render(<AgentField />);
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('aria-busy');
    expect(input).not.toHaveClass('nx-skeleton-shimmer');
    expect(screen.queryByText('Suggested')).not.toBeInTheDocument();
    expect(input).toHaveAccessibleDescription('One line.');
  });

  it('streaming: aria-busy and a shimmer on the control, still editable', async () => {
    const user = userEvent.setup();
    render(<AgentField streaming initial="Ref" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-busy', 'true');
    expect(input).toHaveClass('nx-skeleton-shimmer');
    expect(input).not.toHaveAttribute('readonly');
    await user.type(input, 'und');
    expect(input).toHaveValue('Refund');
  });

  it('keeps the control\'s own className while streaming', () => {
    render(
      <FormField.Root streaming>
        <FormField.Label>Title</FormField.Label>
        <FormField.Control>
          <Input className="w-40" />
        </FormField.Control>
      </FormField.Root>,
    );
    expect(screen.getByRole('textbox')).toHaveClass('w-40', 'nx-skeleton-shimmer');
  });

  it('generated: "Suggested" is read as part of the description, not a live region', () => {
    const { container } = render(<AgentField generated />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleDescription('One line. Suggested');
    expect(container.querySelector('[aria-live]')).toBeNull();
    // No handlers, no buttons.
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('editing the value clears the mark', async () => {
    const user = userEvent.setup();
    render(<AgentField generated />);
    const input = screen.getByRole('textbox');
    await user.type(input, '!');
    expect(input).toHaveValue('Refund approved!');
    expect(screen.queryByText('Suggested')).not.toBeInTheDocument();
    expect(input).toHaveAccessibleDescription('One line.');
  });

  it('accept: calls onAcceptSuggestion and clears the mark, value kept', async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();
    render(<AgentField generated onAccept={onAccept} />);
    await user.click(screen.getByRole('button', { name: 'Accept suggestion' }));
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Suggested')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('Refund approved');
  });

  it('clear: calls onClearSuggestion and clears the mark', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<AgentField generated onClear={onClear} />);
    // The buttons sit beside the label, before the control.
    await user.tab();
    expect(screen.getByRole('button', { name: 'Clear suggestion' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.queryByText('Suggested')).not.toBeInTheDocument();
    // The button went with the mark: focus moves on to the control.
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('a new suggestion shows the mark again', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<AgentField generated />);
    await user.type(screen.getByRole('textbox'), '!');
    expect(screen.queryByText('Suggested')).not.toBeInTheDocument();
    rerender(<AgentField generated={false} />);
    rerender(<AgentField generated />);
    expect(screen.getByText('Suggested')).toBeInTheDocument();
  });

  it('strings go through messages', () => {
    render(
      <NexubProvider messages={{ suggested: 'Sugerido', acceptSuggestion: 'Aceptar sugerencia' }}>
        <AgentField generated onAccept={() => {}} />
      </NexubProvider>,
    );
    expect(screen.getByText('Sugerido')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aceptar sugerencia' })).toBeInTheDocument();
  });
});

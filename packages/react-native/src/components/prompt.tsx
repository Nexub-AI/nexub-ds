import * as React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from './actions';
import { Dialog } from './feedback';
import { TextField } from './inputs';

export interface PromptDialogProps {
  /** Shows the dialog. */
  open: boolean;
  /** Called with `false` when it closes: cancelled, dismissed, or after a successful submit. */
  onOpenChange: (open: boolean) => void;
  /** The dialog's heading, e.g. "Reject claim". */
  title: string;
  /** A line under the title. */
  description?: string;
  /** The field's label, e.g. "Reason". */
  label: string;
  /** The field's placeholder. */
  placeholder?: string;
  /** The answer the field starts with each time the dialog opens. @default '' */
  defaultValue?: string;
  /** An empty answer is refused. @default true */
  required?: boolean;
  /** Shortest answer allowed (an empty one is left to `required`). */
  minLength?: number;
  /** Longest answer allowed; typing stops there. */
  maxLength?: number;
  /** Return an error message to refuse the answer (checked on submit, after `required` and `minLength`). */
  validate?: (value: string) => string | null | undefined | void;
  /** A multi-line field instead of a one-line one. */
  multiline?: boolean;
  /** The confirm button's text. @default 'Continue' */
  confirmLabel?: string;
  /** The cancel button's text. @default 'Cancel' */
  cancelLabel?: string;
  /** `destructive` for a reason that goes with a delete or a reject: a red confirm button. @default 'default' */
  tone?: 'default' | 'destructive';
  /**
   * Called with the trimmed answer. While a returned promise runs, the dialog is busy (it cannot
   * be closed); if it rejects, its message is shown and the dialog stays open; when it resolves,
   * the dialog closes.
   */
  onSubmit?: (value: string) => unknown;
}

const errorText = (e: unknown) => (e instanceof Error ? e.message : typeof e === 'string' ? e : String(e));

/**
 * Asks for one line of text (a reason, a name) in a Dialog: the native twin of web
 * `AlertDialog.Prompt`. Use `usePrompt()` to await the answer.
 */
export function PromptDialog({
  open,
  onOpenChange,
  title,
  description,
  label,
  placeholder,
  defaultValue = '',
  required = true,
  minLength,
  maxLength,
  validate,
  multiline,
  confirmLabel,
  cancelLabel,
  tone = 'default',
  onSubmit,
}: PromptDialogProps) {
  const { messages } = useTheme();
  const [value, setValue] = React.useState(defaultValue);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  // Each opening starts from the default answer.
  const [wasOpen, setWasOpen] = React.useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValue(defaultValue);
      setError(null);
    }
  }

  const close = () => {
    if (!busy) onOpenChange(false);
  };

  const check = (answer: string) => {
    if (required && !answer) return messages.fieldRequired;
    if (minLength !== undefined && answer.length > 0 && answer.length < minLength) return messages.textTooShort(minLength);
    return validate?.(answer) || null;
  };

  const submit = async () => {
    if (busy) return;
    const answer = value.trim();
    const problem = check(answer);
    setError(problem);
    if (problem) return;
    setBusy(true);
    try {
      await onSubmit?.(answer);
      setBusy(false);
      onOpenChange(false);
    } catch (err) {
      setBusy(false);
      setError(errorText(err));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
      title={title}
      description={description}
      dismissible={!busy}
      actions={
        <>
          <Button variant="text" disabled={busy} onPress={close}>
            {cancelLabel ?? messages.cancel}
          </Button>
          <Button tone={tone === 'destructive' ? 'danger' : undefined} loading={busy} onPress={submit}>
            {confirmLabel ?? messages.promptConfirm}
          </Button>
        </>
      }
    >
      <TextField
        label={label}
        value={value}
        onChangeText={(t) => {
          setValue(t);
          if (error) setError(null);
        }}
        placeholder={placeholder}
        maxLength={maxLength}
        multiline={multiline}
        error={error ?? undefined}
        readOnly={busy}
        autoFocus
        autoComplete="off"
        returnKeyType={multiline ? 'default' : 'done'}
        onSubmitEditing={multiline ? undefined : submit}
      />
    </Dialog>
  );
}

/** Everything `prompt()` takes: the PromptDialog props without the open state. */
export type PromptOptions = Omit<PromptDialogProps, 'open' | 'onOpenChange'>;

/**
 * `const [prompt, promptElement] = usePrompt()`. Render `promptElement` once in the screen, then
 * `const reason = await prompt({ title: 'Reject claim', label: 'Reason' })` resolves to the trimmed
 * answer, or `null` when cancelled. With `onSubmit`, it resolves after that succeeds. The same
 * shape as web `usePrompt()`.
 */
export function usePrompt(): [(options: PromptOptions) => Promise<string | null>, React.ReactElement] {
  const [request, setRequest] = React.useState<{ options: PromptOptions; resolve: (v: string | null) => void } | null>(null);
  const [open, setOpen] = React.useState(false);
  const answered = React.useRef<string | null>(null);

  const prompt = React.useCallback(
    (options: PromptOptions) =>
      new Promise<string | null>((resolve) => {
        answered.current = null;
        setRequest((previous) => {
          previous?.resolve(null);
          return { options, resolve };
        });
        setOpen(true);
      }),
    [],
  );

  // Anything still waiting when the host unmounts resolves as cancelled.
  const pending = React.useRef(request);
  React.useEffect(() => {
    pending.current = request;
  }, [request]);
  React.useEffect(() => () => pending.current?.resolve(null), []);

  const element = request ? (
    <PromptDialog
      {...request.options}
      open={open}
      onSubmit={async (value) => {
        await request.options.onSubmit?.(value);
        answered.current = value;
      }}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) request.resolve(answered.current);
      }}
    />
  ) : (
    <React.Fragment />
  );
  return [prompt, element];
}

'use client';

import * as React from 'react';
import * as RadixAlertDialog from '@radix-ui/react-alert-dialog';
import { cn } from '../../utils/cn.js';
import { dialogSurface, overlaySurface, scrim } from '../../utils/surface.js';
import { Button, buttonVariants } from '../Button/Button.js';
import { Input } from '../Input/Input.js';
import { Textarea } from '../Textarea/Textarea.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { ClassLockOverlay, ScrollLockContext, type ScrollLock } from '../../hooks/useClassScrollLock.js';

// Type-to-confirm: Confirm registers the text, Action stays disabled until it's typed.
const ConfirmContext = React.createContext<{
  required: string | null;
  setRequired: (t: string | null) => void;
  typed: string;
  setTyped: (t: string) => void;
} | null>(null);

export interface AlertDialogRootProps extends RadixAlertDialog.AlertDialogProps {
  /** See Dialog.Root `scrollLock`. @default 'class' (since 8.0) */
  scrollLock?: ScrollLock;
}

const ALERT_LOCK = { style: { scrollLock: 'style', modal: true }, class: { scrollLock: 'class', modal: true } } as const;

function Root({ scrollLock = 'class', ...props }: AlertDialogRootProps) {
  return (
    <ScrollLockContext.Provider value={ALERT_LOCK[scrollLock]}>
      <RadixAlertDialog.Root {...props} />
    </ScrollLockContext.Provider>
  );
}
const Trigger = RadixAlertDialog.Trigger;
const Portal = RadixAlertDialog.Portal;

const Overlay = React.forwardRef<HTMLDivElement, RadixAlertDialog.AlertDialogOverlayProps>(
  function AlertDialogOverlay({ className, ...props }, ref) {
    const { scrollLock } = React.useContext(ScrollLockContext);
    if (scrollLock === 'class')
      return <ClassLockOverlay ref={ref} className={cn('fixed inset-0 z-[var(--z-modal)] nx-motion', scrim, className)} />;
    return (
      <RadixAlertDialog.Overlay
        ref={ref}
        className={cn(
          'fixed inset-0 z-[var(--z-modal)] nx-motion', scrim,
          className,
        )}
        {...props}
      />
    );
  },
);
Overlay.displayName = 'AlertDialog.Overlay';

export interface AlertDialogContentProps extends RadixAlertDialog.AlertDialogContentProps {
  /** `true`: bottom sheet. `'auto'`: bottom sheet below the `md` breakpoint, centred above. @default 'auto' (pass `sheet={false}` to keep a popover on small screens) */
  sheet?: boolean | 'auto';
}

const Content = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  function AlertDialogContent({ className, children, sheet = 'auto', ...props }, ref) {
    const narrow = useMediaQuery('(max-width: 47.99rem)');
    const asSheet = sheet === true || (sheet === 'auto' && narrow);
    const [required, setRequired] = React.useState<string | null>(null);
    const [typed, setTyped] = React.useState('');
    const confirm = React.useMemo(() => ({ required, setRequired, typed, setTyped }), [required, typed]);
    return (
      <ConfirmContext.Provider value={confirm}>
      <RadixAlertDialog.Content
        ref={ref}
        className={cn(
          // Same shape as Dialog.Content: a 1rem gutter when centred, or a bottom sheet.
          asSheet
            ? 'fixed inset-x-0 bottom-0 z-[var(--z-modal)] w-full'
            : 'fixed left-1/2 top-1/2 z-[var(--z-modal)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2',
          'nx-motion nx-dialog', overlaySurface, dialogSurface,
          'max-h-[90dvh] overflow-y-auto p-6 focus:outline-none',
          asSheet && 'rounded-b-none pb-[calc(1.5rem+env(safe-area-inset-bottom))]',
          className,
        )}
        data-sheet={asSheet ? '' : undefined}
        {...props}
      >
        {children}
      </RadixAlertDialog.Content>
      </ConfirmContext.Provider>
    );
  },
);
Content.displayName = 'AlertDialog.Content';

const Title = React.forwardRef<HTMLHeadingElement, RadixAlertDialog.AlertDialogTitleProps>(
  function AlertDialogTitle({ className, ...props }, ref) {
    return (
      <RadixAlertDialog.Title
        ref={ref}
        className={cn('text-body-lg font-semibold text-[var(--color-on-surface)]', className)}
        {...props}
      />
    );
  },
);
Title.displayName = 'AlertDialog.Title';

const Description = React.forwardRef<
  HTMLParagraphElement,
  RadixAlertDialog.AlertDialogDescriptionProps
>(function AlertDialogDescription({ className, ...props }, ref) {
  return (
    <RadixAlertDialog.Description
      ref={ref}
      className={cn('mt-1 text-body-sm text-[var(--color-on-surface-muted)]', className)}
      {...props}
    />
  );
});
Description.displayName = 'AlertDialog.Description';

const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function AlertDialogHeader({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn('mb-4 flex flex-col gap-1', className)} {...props} />
    );
  },
);
Header.displayName = 'AlertDialog.Header';

const Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function AlertDialogFooter({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn('mt-6 flex justify-end gap-2', className)} {...props} />
    );
  },
);
Footer.displayName = 'AlertDialog.Footer';

const Action = React.forwardRef<HTMLButtonElement, RadixAlertDialog.AlertDialogActionProps>(
  function AlertDialogAction({ className, disabled, ...props }, ref) {
    const confirm = React.useContext(ConfirmContext);
    const blocked = !!confirm?.required && confirm.typed.trim() !== confirm.required;
    return (
      <RadixAlertDialog.Action
        ref={ref}
        disabled={disabled || blocked}
        className={cn(
          // The destructive confirm: same as <Button variant="destructive">.
          buttonVariants({ variant: 'destructive' }),
          className,
        )}
        {...props}
      />
    );
  },
);
Action.displayName = 'AlertDialog.Action';

const Cancel = React.forwardRef<HTMLButtonElement, RadixAlertDialog.AlertDialogCancelProps>(
  function AlertDialogCancel({ className, ...props }, ref) {
    return (
      <RadixAlertDialog.Cancel
        ref={ref}
        className={cn(
          buttonVariants({ variant: 'outlined' }),
          className,
        )}
        {...props}
      />
    );
  },
);
Cancel.displayName = 'AlertDialog.Cancel';

export interface AlertDialogConfirmProps {
  /** What the user must type, e.g. the resource name. Matching ignores outer spaces. */
  text: string;
  /** The label; defaults to "Type ‹text› to confirm". */
  label?: React.ReactNode;
  className?: string;
}

/**
 * For critical, irreversible actions: the Action button stays disabled until
 * `text` is typed. Place it inside AlertDialog.Content.
 */
function Confirm({ text, label, className }: AlertDialogConfirmProps) {
  const confirm = React.useContext(ConfirmContext);
  const t = useNexubMessages();
  const id = React.useId();
  const setRequired = confirm?.setRequired;
  React.useEffect(() => {
    setRequired?.(text);
    return () => setRequired?.(null);
  }, [text, setRequired]);
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-body-sm text-[var(--color-on-surface)]">
        {label ?? t.typeToConfirm(text)}
      </label>
      <Input
        id={id}
        value={confirm?.typed ?? ''}
        onChange={(e) => confirm?.setTyped(e.target.value)}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
}
Confirm.displayName = 'AlertDialog.Confirm';

export interface AlertDialogPromptProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** The field's label, e.g. "Reason". */
  label: React.ReactNode;
  placeholder?: string;
  defaultValue?: string;
  /** An empty answer is refused. @default true */
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  /** Return an error message to refuse the answer (checked on submit, after `required` and `minLength`). */
  validate?: (value: string) => React.ReactNode | null | undefined | void;
  /** A Textarea instead of a one-line Input. */
  multiline?: boolean;
  /** @default 'Continue' */
  confirmLabel?: React.ReactNode;
  /** @default 'Cancel' */
  cancelLabel?: React.ReactNode;
  /** `destructive` for a reason that goes with a delete or a reject. @default 'default' */
  tone?: 'default' | 'destructive';
  /**
   * Called with the trimmed answer. While a returned promise runs, the dialog is busy (it cannot be
   * closed); if it rejects, its message is shown and the dialog stays open; when it resolves, the
   * dialog closes.
   */
  onSubmit?: (value: string) => unknown;
  /** See AlertDialog.Content `sheet`. @default 'auto' */
  sheet?: boolean | 'auto';
  className?: string;
}

const errorText = (e: unknown): React.ReactNode =>
  e instanceof Error ? e.message : typeof e === 'string' ? e : String(e);

/**
 * 11.2: asks for one line of text (a reason, a name) in place of `window.prompt`: label, length
 * limits, `validate`, and a busy state while `onSubmit` runs. Use `usePrompt()` to await the answer.
 */
function Prompt({
  open: openProp,
  defaultOpen = false,
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
  sheet,
  className,
}: AlertDialogPromptProps) {
  const t = useNexubMessages();
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const [value, setValue] = React.useState(defaultValue);
  const [error, setError] = React.useState<React.ReactNode>(null);
  const [busy, setBusy] = React.useState(false);
  const id = React.useId();
  const errorId = `${id}-error`;

  // Each opening starts from the default answer.
  const wasOpen = React.useRef(open);
  React.useEffect(() => {
    if (open && !wasOpen.current) {
      setValue(defaultValue);
      setError(null);
    }
    wasOpen.current = open;
  }, [open, defaultValue]);

  const setOpen = (next: boolean) => {
    if (busy && !next) return;
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const check = (answer: string): React.ReactNode => {
    if (required && !answer) return t.fieldRequired;
    if (minLength !== undefined && answer.length > 0 && answer.length < minLength) return t.textTooShort(minLength);
    return validate?.(answer) ?? null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const answer = value.trim();
    const problem = check(answer);
    setError(problem);
    if (problem) return;
    setBusy(true);
    try {
      await onSubmit?.(answer);
      setBusy(false);
      if (openProp === undefined) setInternalOpen(false);
      onOpenChange?.(false);
    } catch (err) {
      setBusy(false);
      setError(errorText(err));
    }
  };

  const fieldProps = {
    id,
    value,
    placeholder,
    maxLength,
    readOnly: busy,
    invalid: Boolean(error),
    'aria-invalid': Boolean(error) || undefined,
    'aria-required': required || undefined,
    'aria-describedby': error ? errorId : undefined,
    autoComplete: 'off',
    autoFocus: true,
  };

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Portal>
        <Overlay />
        <Content sheet={sheet} className={className} onEscapeKeyDown={(e) => busy && e.preventDefault()}>
          <form onSubmit={submit} noValidate aria-busy={busy || undefined}>
            <Header>
              <Title>{title}</Title>
              {description && <Description>{description}</Description>}
            </Header>
            <div className="flex flex-col gap-2">
              <label htmlFor={id} className="text-body-sm font-medium text-[var(--color-on-surface)]">
                {label}
              </label>
              {multiline ? (
                <Textarea {...fieldProps} rows={3} onChange={(e) => setValue(e.target.value)} />
              ) : (
                <Input {...fieldProps} onChange={(e) => setValue(e.target.value)} />
              )}
              {error && (
                <p id={errorId} role="alert" className="text-body-sm text-[var(--color-error)]">
                  {error}
                </p>
              )}
            </div>
            <Footer>
              <Cancel disabled={busy}>{cancelLabel ?? t.cancel}</Cancel>
              <Button type="submit" variant={tone === 'destructive' ? 'destructive' : 'filled'} loading={busy}>
                {confirmLabel ?? t.promptConfirm}
              </Button>
            </Footer>
          </form>
        </Content>
      </Portal>
    </Root>
  );
}
Prompt.displayName = 'AlertDialog.Prompt';

export type PromptOptions = Omit<AlertDialogPromptProps, 'open' | 'defaultOpen' | 'onOpenChange'>;

/**
 * 11.2: `const [prompt, promptElement] = usePrompt()`. Render `promptElement` once, then
 * `const reason = await prompt({ title: 'Reject claim', label: 'Reason' })` resolves to the
 * trimmed answer, or `null` when cancelled. With `onSubmit`, it resolves after that succeeds.
 * Port of admin-ui `askText()`.
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
  pending.current = request;
  React.useEffect(() => () => pending.current?.resolve(null), []);

  const element = request ? (
    <Prompt
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

export const AlertDialog = {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Header,
  Footer,
  Action,
  Cancel,
  Confirm,
  Prompt,
};

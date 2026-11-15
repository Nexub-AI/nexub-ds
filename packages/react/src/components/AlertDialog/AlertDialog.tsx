'use client';

import * as React from 'react';
import * as RadixAlertDialog from '@radix-ui/react-alert-dialog';
import { cn } from '../../utils/cn.js';
import { overlaySurface, scrim } from '../../utils/surface.js';
import { buttonVariants } from '../Button/Button.js';
import { Input } from '../Input/Input.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
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

const Content = React.forwardRef<HTMLDivElement, RadixAlertDialog.AlertDialogContentProps>(
  function AlertDialogContent({ className, children, ...props }, ref) {
    const [required, setRequired] = React.useState<string | null>(null);
    const [typed, setTyped] = React.useState('');
    const confirm = React.useMemo(() => ({ required, setRequired, typed, setTyped }), [required, typed]);
    return (
      <ConfirmContext.Provider value={confirm}>
      <RadixAlertDialog.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-[var(--z-modal)] w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
          'nx-motion nx-dialog', overlaySurface,
          'p-6 focus:outline-none',
          className,
        )}
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
        className={cn('text-lg font-semibold text-[var(--color-on-surface)]', className)}
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
      className={cn('mt-1 text-sm text-[var(--color-on-surface-muted)]', className)}
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
};

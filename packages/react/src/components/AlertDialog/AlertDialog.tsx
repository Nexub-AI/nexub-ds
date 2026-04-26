import * as React from 'react';
import * as RadixAlertDialog from '@radix-ui/react-alert-dialog';
import { cn } from '../../utils/cn.js';

const Root = RadixAlertDialog.Root;
const Trigger = RadixAlertDialog.Trigger;
const Portal = RadixAlertDialog.Portal;

const Overlay = React.forwardRef<HTMLDivElement, RadixAlertDialog.AlertDialogOverlayProps>(
  function AlertDialogOverlay({ className, ...props }, ref) {
    return (
      <RadixAlertDialog.Overlay
        ref={ref}
        className={cn(
          'fixed inset-0 z-[var(--z-modal)] bg-black/50 backdrop-blur-sm',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
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
    return (
      <RadixAlertDialog.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-[var(--z-modal)] w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
          'rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] shadow-xl',
          'p-6 focus:outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          className,
        )}
        {...props}
      >
        {children}
      </RadixAlertDialog.Content>
    );
  },
);
Content.displayName = 'AlertDialog.Content';

const Title = React.forwardRef<HTMLHeadingElement, RadixAlertDialog.AlertDialogTitleProps>(
  function AlertDialogTitle({ className, ...props }, ref) {
    return (
      <RadixAlertDialog.Title
        ref={ref}
        className={cn('text-lg font-semibold text-[var(--color-text-primary)]', className)}
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
      className={cn('mt-1 text-sm text-[var(--color-text-muted)]', className)}
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
  function AlertDialogAction({ className, ...props }, ref) {
    return (
      <RadixAlertDialog.Action
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
          'bg-red-600 text-white hover:bg-red-700 focus:outline-none',
          'focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 ring-offset-[var(--color-bg-default)]',
          'disabled:pointer-events-none disabled:opacity-50',
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
          'inline-flex items-center justify-center rounded-md border border-[var(--color-border-default)] px-4 py-2 text-sm font-medium',
          'bg-[var(--color-bg-default)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-bg-default)]',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
Cancel.displayName = 'AlertDialog.Cancel';

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
};

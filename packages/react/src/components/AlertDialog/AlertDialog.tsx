import * as React from 'react';
import * as RadixAlertDialog from '@radix-ui/react-alert-dialog';
import { cn } from '../../utils/cn.js';
import { overlaySurface, scrim } from '../../utils/surface.js';
import { buttonVariants } from '../Button/Button.js';

const Root = RadixAlertDialog.Root;
const Trigger = RadixAlertDialog.Trigger;
const Portal = RadixAlertDialog.Portal;

const Overlay = React.forwardRef<HTMLDivElement, RadixAlertDialog.AlertDialogOverlayProps>(
  function AlertDialogOverlay({ className, ...props }, ref) {
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
    return (
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
  function AlertDialogAction({ className, ...props }, ref) {
    return (
      <RadixAlertDialog.Action
        ref={ref}
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

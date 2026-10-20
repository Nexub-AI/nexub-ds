import * as React from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { cn } from '../../utils/cn.js';

const Provider = RadixToast.Provider;

const Viewport = React.forwardRef<HTMLOListElement, RadixToast.ToastViewportProps>(
  ({ className, ...props }, ref) => (
    <RadixToast.Viewport
      ref={ref}
      className={cn(
        'fixed top-0 right-0 z-[var(--z-toast,2000)] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-sm gap-2',
        className,
      )}
      {...props}
    />
  ),
);
Viewport.displayName = 'Toast.Viewport';

const Root = React.forwardRef<HTMLLIElement, RadixToast.ToastProps>(
  ({ className, ...props }, ref) => (
    <RadixToast.Root
      ref={ref}
      className={cn(
        // Snackbar: the inverse surface stands out from any page, light or dark.
        'group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-shape-container bg-[var(--color-inverse-surface)] py-3 pl-4 pr-2 text-[var(--color-inverse-on-surface)] shadow-elevation-2',
        'duration-spatial-default ease-spatial-default data-[state=closed]:duration-effects-fast',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-right-full',
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = 'Toast.Root';

const Title = React.forwardRef<HTMLDivElement, RadixToast.ToastTitleProps>(
  ({ className, ...props }, ref) => (
    <RadixToast.Title ref={ref} className={cn('text-title-sm', className)} {...props} />
  ),
);
Title.displayName = 'Toast.Title';

const Description = React.forwardRef<HTMLDivElement, RadixToast.ToastDescriptionProps>(
  ({ className, ...props }, ref) => (
    <RadixToast.Description
      ref={ref}
      className={cn('text-body-sm text-[color-mix(in_srgb,var(--color-inverse-on-surface)_80%,transparent)]', className)}
      {...props}
    />
  ),
);
Description.displayName = 'Toast.Description';

const Action = React.forwardRef<HTMLButtonElement, RadixToast.ToastActionProps>(
  ({ className, ...props }, ref) => (
    <RadixToast.Action
      ref={ref}
      className={cn(
        'nx-state-layer relative inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-shape-control px-3 text-label-lg text-[var(--color-inverse-primary)]',
        className,
      )}
      {...props}
    />
  ),
);
Action.displayName = 'Toast.Action';

const Close = React.forwardRef<HTMLButtonElement, RadixToast.ToastCloseProps>(
  ({ className, ...props }, ref) => (
    <RadixToast.Close ref={ref} className={cn('nx-state-layer relative grid h-8 w-8 place-items-center rounded-full', className)} {...props} />
  ),
);
Close.displayName = 'Toast.Close';

export const Toast = { Provider, Viewport, Root, Title, Description, Action, Close };

import * as React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '../../utils/cn.js';
import { enterExit, overlaySurface, scrim } from '../../utils/surface.js';
import { glassSurfaceClass, type SurfaceValue } from '../../utils/glass.js';

const Root = RadixDialog.Root;
const Trigger = RadixDialog.Trigger;
const Portal = RadixDialog.Portal;
const Close = RadixDialog.Close;

const Overlay = React.forwardRef<HTMLDivElement, RadixDialog.DialogOverlayProps>(
  function DialogOverlay({ className, ...props }, ref) {
    return (
      <RadixDialog.Overlay
        ref={ref}
        className={cn(
          'fixed inset-0 z-[var(--z-modal)]', scrim, enterExit,
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
          className,
        )}
        {...props}
      />
    );
  },
);
Overlay.displayName = 'Dialog.Overlay';

interface ContentProps extends RadixDialog.DialogContentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  surface?: SurfaceValue;
}

const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  function DialogContent({ className, size = 'md', surface = 'solid', children, ...props }, ref) {
    const sizeMap = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-[calc(100vw-2rem)]',
    };
    return (
      <RadixDialog.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-[var(--z-modal)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2',
          overlaySurface, enterExit,
          'max-h-[90vh] overflow-y-auto p-6 focus:outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          sizeMap[size],
          surface === 'glass' && glassSurfaceClass,
          className,
        )}
        data-material={surface === 'glass' ? 'glass' : undefined}
        data-glass-thickness={surface === 'glass' ? 'thick' : undefined}
        {...props}
      >
        {children}
      </RadixDialog.Content>
    );
  },
);
Content.displayName = 'Dialog.Content';

const Title = React.forwardRef<HTMLHeadingElement, RadixDialog.DialogTitleProps>(
  function DialogTitle({ className, ...props }, ref) {
    return (
      <RadixDialog.Title
        ref={ref}
        className={cn('text-lg font-semibold text-[var(--color-text-primary)]', className)}
        {...props}
      />
    );
  },
);
Title.displayName = 'Dialog.Title';

const Description = React.forwardRef<HTMLParagraphElement, RadixDialog.DialogDescriptionProps>(
  function DialogDescription({ className, ...props }, ref) {
    return (
      <RadixDialog.Description
        ref={ref}
        className={cn('mt-1 text-sm text-[var(--color-text-muted)]', className)}
        {...props}
      />
    );
  },
);
Description.displayName = 'Dialog.Description';

const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function DialogHeader({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn('mb-4 flex flex-col gap-1', className)} {...props} />
    );
  },
);
Header.displayName = 'Dialog.Header';

const Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function DialogFooter({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
    );
  },
);
Footer.displayName = 'Dialog.Footer';

export const Dialog = {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Close,
  Title,
  Description,
  Header,
  Footer,
};

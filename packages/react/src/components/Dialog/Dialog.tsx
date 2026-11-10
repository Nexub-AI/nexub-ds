'use client';

import * as React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '../../utils/cn.js';
import type { Size } from '../../utils/control.js';
import { overlaySurface, scrim } from '../../utils/surface.js';
import { glassSurfaceClass, type SurfaceValue } from '../../utils/glass.js';
import { ClassLockOverlay, ScrollLockContext, type ScrollLock } from '../../hooks/useClassScrollLock.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { X } from '@nexub/icons';
import { IconButton } from '../IconButton/IconButton.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface DialogRootProps extends RadixDialog.DialogProps {
  /**
   * `'class'` locks page scroll with a class on <html> instead of the <style>
   * Radix injects, so the dialog works under a strict `style-src` with no nonce.
   * @default 'class' (since 8.0)
   */
  scrollLock?: ScrollLock;
}

function Root({ scrollLock = 'class', modal = true, ...props }: DialogRootProps) {
  const lock = React.useMemo(() => ({ scrollLock, modal }), [scrollLock, modal]);
  return (
    <ScrollLockContext.Provider value={lock}>
      <RadixDialog.Root modal={modal} {...props} />
    </ScrollLockContext.Provider>
  );
}
const Trigger = RadixDialog.Trigger;
const Portal = RadixDialog.Portal;
const Close = RadixDialog.Close;

const Overlay = React.forwardRef<HTMLDivElement, RadixDialog.DialogOverlayProps>(
  function DialogOverlay({ className, ...props }, ref) {
    const { scrollLock, modal } = React.useContext(ScrollLockContext);
    const cls = cn('fixed inset-0 z-[var(--z-modal)] nx-motion', scrim, className);
    if (scrollLock === 'class') return modal ? <ClassLockOverlay ref={ref} className={cls} /> : null;
    return (
      <RadixDialog.Overlay
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
Overlay.displayName = 'Dialog.Overlay';

interface ContentProps extends RadixDialog.DialogContentProps {
  size?: Size | 'xl' | 'full';
  surface?: SurfaceValue;
  /** Adds a close button in the top-end corner. @default false */
  showClose?: boolean;
  /** Accessible name of the close button. @default messages.close */
  closeLabel?: string;
  /** `true`: bottom sheet. `'auto'`: bottom sheet below the `md` breakpoint, centred above. @default false */
  sheet?: boolean | 'auto';
}

// Each open Content tells the Content it was opened from, which then steps back (data-nested).
const StackContext = React.createContext<React.Dispatch<React.SetStateAction<number>> | null>(null);

const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  function DialogContent(
    { className, size = 'md', surface = 'solid', showClose = false, closeLabel, sheet = false, children, ...props },
    ref,
  ) {
    const messages = useNexubMessages();
    const narrow = useMediaQuery('(max-width: 47.99rem)');
    const asSheet = sheet === true || (sheet === 'auto' && narrow);
    const parent = React.useContext(StackContext);
    const [openChildren, setOpenChildren] = React.useState(0);
    React.useEffect(() => {
      if (!parent) return;
      parent((n) => n + 1);
      return () => parent((n) => n - 1);
    }, [parent]);
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
          asSheet
            ? 'fixed inset-x-0 bottom-0 z-[var(--z-modal)] w-full'
            : 'fixed left-1/2 top-1/2 z-[var(--z-modal)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2',
          'nx-motion nx-dialog', overlaySurface,
          'max-h-[90vh] overflow-y-auto p-6 focus:outline-none',
          asSheet ? 'rounded-b-none' : sizeMap[size],
          surface === 'glass' && glassSurfaceClass,
          className,
        )}
        data-material={surface === 'glass' ? 'glass' : undefined}
        data-glass-thickness={surface === 'glass' ? 'thick' : undefined}
        data-sheet={asSheet ? '' : undefined}
        data-nested={openChildren > 0 ? '' : undefined}
        {...props}
      >
        <StackContext.Provider value={setOpenChildren}>{children}</StackContext.Provider>
        {showClose && (
          <RadixDialog.Close asChild>
            <IconButton label={closeLabel ?? messages.close} variant="ghost" size="sm" className="absolute end-3 top-3">
              <X size="sm" aria-hidden="true" />
            </IconButton>
          </RadixDialog.Close>
        )}
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
        className={cn('text-lg font-semibold text-[var(--color-on-surface)]', className)}
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
        className={cn('mt-1 text-sm text-[var(--color-on-surface-muted)]', className)}
        {...props}
      />
    );
  },
);
Description.displayName = 'Dialog.Description';

const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function DialogHeader({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn('nx-dialog-header mb-4 flex flex-col gap-1', className)} {...props} />
    );
  },
);
Header.displayName = 'Dialog.Header';

const Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function DialogFooter({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn('nx-dialog-footer mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
    );
  },
);
Footer.displayName = 'Dialog.Footer';

/** Scrolling middle between Header and Footer, which then stay put with scroll-edge hairlines. */
const Body = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function DialogBody({ className, ...props }, ref) {
    return <div ref={ref} className={cn('nx-dialog-body', className)} {...props} />;
  },
);
Body.displayName = 'Dialog.Body';

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
  Body,
  Footer,
};

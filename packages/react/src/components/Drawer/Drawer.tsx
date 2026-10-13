import * as React from 'react';
import type * as DialogPrimitive from '@radix-ui/react-dialog';
import { Slot } from '@radix-ui/react-slot';
import { Drawer as VaulDrawer } from 'vaul';
import { cn } from '../../utils/cn.js';
import { useClassScrollLock } from '../../hooks/useClassScrollLock.js';
import { glassSurfaceClass, type SurfaceValue } from '../../utils/glass.js';

// vaul is bundled into @nexub/react (see tsup.config.ts) and is not a
// dependency, so no exported type may reference it. These are vaul 1.1.2's
// Root props, re-declared; the rest of the API is typed with Radix Dialog,
// which is a dependency.
export interface DrawerRootProps {
  children?: React.ReactNode;
  open?: boolean;
  /** Opened by default, skips the initial enter animation. Still reacts to `open` changes. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Gets triggered after the open or close animation ends. */
  onAnimationEnd?: (open: boolean) => void;
  onClose?: () => void;
  /** Edge the drawer slides in from. Match it to `Content`'s `side`. @default 'bottom' */
  direction?: 'top' | 'bottom' | 'left' | 'right';
  /** When `false`, the page behind stays interactive and nothing is locked or trapped. @default true */
  modal?: boolean;
  /**
   * How page scroll is locked while the drawer is open (modal only).
   * - `'style'` (default): Radix's scroll lock. It injects a `<style>` tag, which a strict
   *   `style-src` CSP blocks.
   * - `'class'`: adds the `nexub-scroll-lock` class from `@nexub/themes/base` to `<html>`.
   *   Injects nothing, so it works under `style-src 'self'`. Focus trap, Escape and
   *   outside-click dismissal are unchanged.
   * @default 'style'
   */
  scrollLock?: 'style' | 'class';
  /** When `false`, dragging, outside clicks and Escape don't close the drawer. @default true */
  dismissible?: boolean;
  /** Only the `Drawer.Handle` starts a drag. @default false */
  handleOnly?: boolean;
  /** Fraction (0–1) of the drawer that must be dragged away to close it. @default 0.25 */
  closeThreshold?: number;
  /** Snap points, as fractions of the screen (e.g. `[0.4, 1]`) or px strings. */
  snapPoints?: (number | string)[];
  activeSnapPoint?: number | string | null;
  setActiveSnapPoint?: (snapPoint: number | string | null) => void;
  /** Index of the snap point from which the overlay fades. Defaults to the last one. */
  fadeFromIndex?: number;
  /** Don't skip snap points on fast swipes. @default false */
  snapToSequentialPoint?: boolean;
  /** ms during which the drawer can't be dragged after its content scrolls. @default 500 */
  scrollLockTimeout?: number;
  onDrag?: (event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) => void;
  onRelease?: (event: React.PointerEvent<HTMLDivElement>, open: boolean) => void;
  shouldScaleBackground?: boolean;
  /** @default true */
  setBackgroundColorOnScale?: boolean;
  /** When `true`, vaul sets no styles on `body`. */
  noBodyStyles?: boolean;
  /** Only resize (don't move) the drawer when the on-screen keyboard opens. */
  fixed?: boolean;
  nested?: boolean;
  disablePreventScroll?: boolean;
  preventScrollRestoration?: boolean;
  /** Reposition inputs instead of scrolling them into view when the keyboard opens. */
  repositionInputs?: boolean;
  container?: HTMLElement | null;
  autoFocus?: boolean;
}

type VaulRootProps = React.ComponentProps<typeof VaulDrawer.Root>;

const DrawerContext = React.createContext({ scrollLock: 'style' as 'style' | 'class', open: false, modal: true });

function Root({ scrollLock = 'style', onOpenChange, ...props }: DrawerRootProps) {
  // Mirror the open state (controlled or not) for the class-lock overlay's data-state.
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(props.defaultOpen ?? false);
  const open = props.open ?? uncontrolledOpen;
  return (
    <DrawerContext.Provider value={{ scrollLock, open, modal: props.modal ?? true }}>
      <VaulDrawer.Root
        {...(props as VaulRootProps)}
        onOpenChange={(next) => {
          setUncontrolledOpen(next);
          onOpenChange?.(next);
        }}
      />
    </DrawerContext.Provider>
  );
}
Root.displayName = 'Drawer.Root';

const Trigger: React.ForwardRefExoticComponent<
  DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>
> = VaulDrawer.Trigger;
const Close: React.ForwardRefExoticComponent<
  DialogPrimitive.DialogCloseProps & React.RefAttributes<HTMLButtonElement>
> = VaulDrawer.Close;
const Portal: (props: DialogPrimitive.DialogPortalProps) => React.JSX.Element = VaulDrawer.Portal;

// Radix's scroll lock (react-remove-scroll) lives in Dialog.Overlay, so this
// overlay is a plain element. Focus trap, aria-hidden siblings and outside-click
// dismissal live in Dialog.Content and still apply.
// ponytail: no drag-to-fade or snap-point overlay states; add if a class-lock sheet needs snap points.
const ClassLockOverlay = React.forwardRef<HTMLDivElement, DialogPrimitive.DialogOverlayProps & { open: boolean }>(
  ({ asChild, forceMount: _forceMount, open, ...props }, ref) => {
    useClassScrollLock();
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        data-vaul-overlay=""
        data-vaul-snap-points="false"
        data-state={open ? 'open' : 'closed'}
        {...props}
      />
    );
  },
);

const Overlay = React.forwardRef<HTMLDivElement, DialogPrimitive.DialogOverlayProps>(
  ({ className, ...props }, ref) => {
    const { scrollLock, open, modal } = React.useContext(DrawerContext);
    const classes = cn('fixed inset-0 z-[var(--z-modal)] bg-[var(--color-overlay)]', className);
    if (scrollLock === 'class') {
      // Non-modal drawers have no overlay (vaul's Overlay returns null too).
      if (!modal) return null;
      return <ClassLockOverlay ref={ref} open={open} className={cn('pointer-events-auto', classes)} {...props} />;
    }
    return <VaulDrawer.Overlay ref={ref} className={classes} {...props} />;
  },
);
Overlay.displayName = 'Drawer.Overlay';

const Content = React.forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogContentProps & {
    side?: 'left' | 'right' | 'top' | 'bottom';
    surface?: SurfaceValue;
  }
>(({ className, children, side = 'right', surface = 'solid', ...props }, ref) => {
  // Side panels clip x: vaul's ::after (a 200%-wide strip past the edge, for
  // over-drag) otherwise makes the panel scroll sideways. Hidden x also makes
  // y scroll, so long content works without extra classes.
  const sideMap = {
    right: 'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l overflow-x-hidden',
    left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r overflow-x-hidden',
    top: 'inset-x-0 top-0 w-full border-b',
    bottom: 'inset-x-0 bottom-0 w-full border-t rounded-t-2xl',
  };
  return (
    <VaulDrawer.Content
      ref={ref}
      className={cn(
        'fixed z-[var(--z-modal)] flex flex-col bg-[var(--color-bg-default)] shadow-xl focus:outline-none',
        sideMap[side],
        surface === 'glass' && glassSurfaceClass,
        className,
      )}
      data-material={surface === 'glass' ? 'glass' : undefined}
      {...props}
    >
      {side === 'bottom' && (
        <div className="mx-auto mt-4 h-2 w-20 rounded-full bg-[var(--color-border-default)]" />
      )}
      {children}
    </VaulDrawer.Content>
  );
});
Content.displayName = 'Drawer.Content';

const Title = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <VaulDrawer.Title
      ref={ref}
      className={cn('text-lg font-semibold text-[var(--color-text-primary)]', className)}
      {...props}
    />
  ),
);
Title.displayName = 'Drawer.Title';

const Description = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <VaulDrawer.Description
      ref={ref}
      className={cn('text-sm text-[var(--color-text-muted)]', className)}
      {...props}
    />
  ),
);
Description.displayName = 'Drawer.Description';

const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
  ),
);
Header.displayName = 'Drawer.Header';

const Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-auto flex flex-col gap-2 p-6', className)} {...props} />
  ),
);
Footer.displayName = 'Drawer.Footer';

export const Drawer = {
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

export const Sheet = Drawer;

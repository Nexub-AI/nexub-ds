import * as React from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { cn } from '../../utils/cn.js';
import { glassSurfaceClass, type SurfaceValue } from '../../utils/glass.js';

const Root = VaulDrawer.Root;
const Trigger = VaulDrawer.Trigger;
const Portal = VaulDrawer.Portal;
const Close = VaulDrawer.Close;
const Overlay = VaulDrawer.Overlay;

const Content = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof VaulDrawer.Content> & {
    side?: 'left' | 'right' | 'top' | 'bottom';
    surface?: SurfaceValue;
  }
>(({ className, children, side = 'right', surface = 'solid', ...props }, ref) => {
  const sideMap = {
    right: 'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l',
    left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r',
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

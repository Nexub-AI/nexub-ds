import * as React from 'react';
import * as RadixMenubar from '@radix-ui/react-menubar';
import { Check, ChevronRight } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { floatingSurface, menuContent, menuItem, menuLabel, menuSeparator } from '../../utils/surface.js';

const Menu = RadixMenubar.Menu;
const Portal = RadixMenubar.Portal;
const Group = RadixMenubar.Group;
const RadioGroup = RadixMenubar.RadioGroup;
const Sub = RadixMenubar.Sub;

const Root = React.forwardRef<HTMLDivElement, RadixMenubar.MenubarProps>(
  function MenubarRoot({ className, ...props }, ref) {
    return (
      <RadixMenubar.Root
        ref={ref}
        className={cn(
          'flex h-control-md items-center gap-0.5 rounded-shape-control bg-[var(--color-surface-container-low)] p-1',
          className,
        )}
        {...props}
      />
    );
  },
);
Root.displayName = 'Menubar.Root';

const Trigger = React.forwardRef<HTMLButtonElement, RadixMenubar.MenubarTriggerProps>(
  function MenubarTrigger({ className, ...props }, ref) {
    return (
      <RadixMenubar.Trigger
        ref={ref}
        className={cn(
          'nx-state-layer relative flex h-full cursor-default select-none items-center rounded-shape-control px-3 text-label-lg text-[var(--color-on-surface)]',
          'outline-none',
          'data-[state=open]:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)]',
          className,
        )}
        {...props}
      />
    );
  },
);
Trigger.displayName = 'Menubar.Trigger';

const contentBaseClasses = cn(
  'z-[var(--z-popover)] min-w-48 outline-none',
  floatingSurface,
  menuContent,
  'nx-motion nx-pop origin-[var(--radix-menubar-content-transform-origin)]',
);

const Content = React.forwardRef<HTMLDivElement, RadixMenubar.MenubarContentProps>(
  function MenubarContent({ className, sideOffset = 8, ...props }, ref) {
    return (
      <RadixMenubar.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(contentBaseClasses, className)}
        {...props}
      />
    );
  },
);
Content.displayName = 'Menubar.Content';

const itemBaseClasses = cn(
  menuItem,
);

const Item = React.forwardRef<HTMLDivElement, RadixMenubar.MenubarItemProps>(
  function MenubarItem({ className, ...props }, ref) {
    return (
      <RadixMenubar.Item
        ref={ref}
        className={cn(itemBaseClasses, className)}
        {...props}
      />
    );
  },
);
Item.displayName = 'Menubar.Item';

const Label = React.forwardRef<HTMLDivElement, RadixMenubar.MenubarLabelProps>(
  function MenubarLabel({ className, ...props }, ref) {
    return (
      <RadixMenubar.Label
        ref={ref}
        className={cn(
          menuLabel,
          className,
        )}
        {...props}
      />
    );
  },
);
Label.displayName = 'Menubar.Label';

const Separator = React.forwardRef<HTMLDivElement, RadixMenubar.MenubarSeparatorProps>(
  function MenubarSeparator({ className, ...props }, ref) {
    return (
      <RadixMenubar.Separator
        ref={ref}
        className={cn(menuSeparator, className)}
        {...props}
      />
    );
  },
);
Separator.displayName = 'Menubar.Separator';

const CheckboxItem = React.forwardRef<
  HTMLDivElement,
  RadixMenubar.MenubarCheckboxItemProps
>(function MenubarCheckboxItem({ className, children, checked, ...props }, ref) {
  return (
    <RadixMenubar.CheckboxItem
      ref={ref}
      className={cn(itemBaseClasses, 'pl-8', className)}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <RadixMenubar.ItemIndicator>
          <Check className="h-4 w-4" />
        </RadixMenubar.ItemIndicator>
      </span>
      {children}
    </RadixMenubar.CheckboxItem>
  );
});
CheckboxItem.displayName = 'Menubar.CheckboxItem';

const RadioItem = React.forwardRef<
  HTMLDivElement,
  RadixMenubar.MenubarRadioItemProps
>(function MenubarRadioItem({ className, children, ...props }, ref) {
  return (
    <RadixMenubar.RadioItem
      ref={ref}
      className={cn(itemBaseClasses, 'pl-8', className)}
      {...props}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <RadixMenubar.ItemIndicator>
          <svg className="h-2 w-2 fill-current" viewBox="0 0 8 8" aria-hidden="true">
            <circle cx="4" cy="4" r="4" />
          </svg>
        </RadixMenubar.ItemIndicator>
      </span>
      {children}
    </RadixMenubar.RadioItem>
  );
});
RadioItem.displayName = 'Menubar.RadioItem';

const SubTrigger = React.forwardRef<
  HTMLDivElement,
  RadixMenubar.MenubarSubTriggerProps
>(function MenubarSubTrigger({ className, children, ...props }, ref) {
  return (
    <RadixMenubar.SubTrigger
      ref={ref}
      className={cn(
        itemBaseClasses,
        'data-[state=open]:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)]',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </RadixMenubar.SubTrigger>
  );
});
SubTrigger.displayName = 'Menubar.SubTrigger';

const SubContent = React.forwardRef<
  HTMLDivElement,
  RadixMenubar.MenubarSubContentProps
>(function MenubarSubContent({ className, ...props }, ref) {
  return (
    <RadixMenubar.SubContent
      ref={ref}
      className={cn(contentBaseClasses, className)}
      {...props}
    />
  );
});
SubContent.displayName = 'Menubar.SubContent';

const Arrow = React.forwardRef<SVGSVGElement, RadixMenubar.MenubarArrowProps>(
  function MenubarArrow({ className, ...props }, ref) {
    return (
      <RadixMenubar.Arrow
        ref={ref}
        className={cn('fill-[var(--color-outline-variant)]', className)}
        {...props}
      />
    );
  },
);
Arrow.displayName = 'Menubar.Arrow';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Menubar: Record<string, any> = {
  Root,
  Menu,
  Trigger,
  Portal,
  Content,
  Item,
  Group,
  Label,
  Separator,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Sub,
  SubTrigger,
  SubContent,
  Arrow,
};

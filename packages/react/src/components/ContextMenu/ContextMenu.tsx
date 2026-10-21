import * as React from 'react';
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import { Check, ChevronRight } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { floatingSurface, menuContent, menuItem, menuLabel, menuSeparator } from '../../utils/surface.js';

const Root = RadixContextMenu.Root;
const Trigger = RadixContextMenu.Trigger;
const Portal = RadixContextMenu.Portal;
const Group = RadixContextMenu.Group;
const RadioGroup = RadixContextMenu.RadioGroup;
const Sub = RadixContextMenu.Sub;

const Content = React.forwardRef<HTMLDivElement, RadixContextMenu.ContextMenuContentProps>(
  function ContextMenuContent({ className, ...props }, ref) {
    return (
      <RadixContextMenu.Content
        ref={ref}
        className={cn(
          'z-[var(--z-popover)] min-w-48 outline-none',
          floatingSurface,
          menuContent,
          'nx-motion nx-pop origin-[var(--radix-context-menu-content-transform-origin)]',
          className,
        )}
        {...props}
      />
    );
  },
);
Content.displayName = 'ContextMenu.Content';

const itemBaseClasses = cn(
  menuItem,
);

const Item = React.forwardRef<HTMLDivElement, RadixContextMenu.ContextMenuItemProps>(
  function ContextMenuItem({ className, ...props }, ref) {
    return (
      <RadixContextMenu.Item
        ref={ref}
        className={cn(itemBaseClasses, className)}
        {...props}
      />
    );
  },
);
Item.displayName = 'ContextMenu.Item';

const Label = React.forwardRef<HTMLDivElement, RadixContextMenu.ContextMenuLabelProps>(
  function ContextMenuLabel({ className, ...props }, ref) {
    return (
      <RadixContextMenu.Label
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
Label.displayName = 'ContextMenu.Label';

const Separator = React.forwardRef<HTMLDivElement, RadixContextMenu.ContextMenuSeparatorProps>(
  function ContextMenuSeparator({ className, ...props }, ref) {
    return (
      <RadixContextMenu.Separator
        ref={ref}
        className={cn(menuSeparator, className)}
        {...props}
      />
    );
  },
);
Separator.displayName = 'ContextMenu.Separator';

const CheckboxItem = React.forwardRef<
  HTMLDivElement,
  RadixContextMenu.ContextMenuCheckboxItemProps
>(function ContextMenuCheckboxItem({ className, children, checked, ...props }, ref) {
  return (
    <RadixContextMenu.CheckboxItem
      ref={ref}
      className={cn(itemBaseClasses, 'ps-8', className)}
      checked={checked}
      {...props}
    >
      <span className="absolute start-2 flex h-4 w-4 items-center justify-center">
        <RadixContextMenu.ItemIndicator>
          <Check className="h-4 w-4" />
        </RadixContextMenu.ItemIndicator>
      </span>
      {children}
    </RadixContextMenu.CheckboxItem>
  );
});
CheckboxItem.displayName = 'ContextMenu.CheckboxItem';

const RadioItem = React.forwardRef<
  HTMLDivElement,
  RadixContextMenu.ContextMenuRadioItemProps
>(function ContextMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <RadixContextMenu.RadioItem
      ref={ref}
      className={cn(itemBaseClasses, 'ps-8', className)}
      {...props}
    >
      <span className="absolute start-2 flex h-4 w-4 items-center justify-center">
        <RadixContextMenu.ItemIndicator>
          <svg className="h-2 w-2 fill-current" viewBox="0 0 8 8" aria-hidden="true">
            <circle cx="4" cy="4" r="4" />
          </svg>
        </RadixContextMenu.ItemIndicator>
      </span>
      {children}
    </RadixContextMenu.RadioItem>
  );
});
RadioItem.displayName = 'ContextMenu.RadioItem';

const SubTrigger = React.forwardRef<
  HTMLDivElement,
  RadixContextMenu.ContextMenuSubTriggerProps
>(function ContextMenuSubTrigger({ className, children, ...props }, ref) {
  return (
    <RadixContextMenu.SubTrigger
      ref={ref}
      className={cn(
        itemBaseClasses,
        'data-[state=open]:bg-[color-mix(in_srgb,var(--color-on-surface)_8%,transparent)]',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ms-auto h-4 w-4 rtl:-scale-x-100" />
    </RadixContextMenu.SubTrigger>
  );
});
SubTrigger.displayName = 'ContextMenu.SubTrigger';

const SubContent = React.forwardRef<
  HTMLDivElement,
  RadixContextMenu.ContextMenuSubContentProps
>(function ContextMenuSubContent({ className, ...props }, ref) {
  return (
    <RadixContextMenu.SubContent
      ref={ref}
      className={cn(
        'z-[var(--z-popover)] min-w-48 outline-none',
        floatingSurface,
        menuContent,
        'nx-motion nx-pop origin-[var(--radix-context-menu-content-transform-origin)]',
        className,
      )}
      {...props}
    />
  );
});
SubContent.displayName = 'ContextMenu.SubContent';

export const ContextMenu = {
  Root,
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
};

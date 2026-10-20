import * as React from 'react';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { floatingSurface, menuContent, menuItem, menuLabel, menuSeparator } from '../../utils/surface.js';

const Root = RadixDropdownMenu.Root;
const Trigger = RadixDropdownMenu.Trigger;
const Portal = RadixDropdownMenu.Portal;
const Group = RadixDropdownMenu.Group;
const RadioGroup = RadixDropdownMenu.RadioGroup;
const Sub = RadixDropdownMenu.Sub;

const Content = React.forwardRef<HTMLDivElement, RadixDropdownMenu.DropdownMenuContentProps>(
  function DropdownMenuContent({ className, sideOffset = 4, ...props }, ref) {
    return (
      <RadixDropdownMenu.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-[var(--z-popover)] min-w-48 outline-none',
          floatingSurface,
          menuContent,
          'nx-motion nx-pop origin-[var(--radix-dropdown-menu-content-transform-origin)]',
          className,
        )}
        {...props}
      />
    );
  },
);
Content.displayName = 'DropdownMenu.Content';

const itemBaseClasses = cn(
  menuItem,
);

const Item = React.forwardRef<HTMLDivElement, RadixDropdownMenu.DropdownMenuItemProps>(
  function DropdownMenuItem({ className, ...props }, ref) {
    return (
      <RadixDropdownMenu.Item
        ref={ref}
        className={cn(itemBaseClasses, className)}
        {...props}
      />
    );
  },
);
Item.displayName = 'DropdownMenu.Item';

const Label = React.forwardRef<HTMLDivElement, RadixDropdownMenu.DropdownMenuLabelProps>(
  function DropdownMenuLabel({ className, ...props }, ref) {
    return (
      <RadixDropdownMenu.Label
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
Label.displayName = 'DropdownMenu.Label';

const Separator = React.forwardRef<HTMLDivElement, RadixDropdownMenu.DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator({ className, ...props }, ref) {
    return (
      <RadixDropdownMenu.Separator
        ref={ref}
        className={cn(menuSeparator, className)}
        {...props}
      />
    );
  },
);
Separator.displayName = 'DropdownMenu.Separator';

const CheckboxItem = React.forwardRef<
  HTMLDivElement,
  RadixDropdownMenu.DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem({ className, children, checked, ...props }, ref) {
  return (
    <RadixDropdownMenu.CheckboxItem
      ref={ref}
      className={cn(itemBaseClasses, 'pl-8', className)}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <RadixDropdownMenu.ItemIndicator>
          <Check className="h-4 w-4" />
        </RadixDropdownMenu.ItemIndicator>
      </span>
      {children}
    </RadixDropdownMenu.CheckboxItem>
  );
});
CheckboxItem.displayName = 'DropdownMenu.CheckboxItem';

const RadioItem = React.forwardRef<
  HTMLDivElement,
  RadixDropdownMenu.DropdownMenuRadioItemProps
>(function DropdownMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <RadixDropdownMenu.RadioItem
      ref={ref}
      className={cn(itemBaseClasses, 'pl-8', className)}
      {...props}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <RadixDropdownMenu.ItemIndicator>
          <svg className="h-2 w-2 fill-current" viewBox="0 0 8 8" aria-hidden="true">
            <circle cx="4" cy="4" r="4" />
          </svg>
        </RadixDropdownMenu.ItemIndicator>
      </span>
      {children}
    </RadixDropdownMenu.RadioItem>
  );
});
RadioItem.displayName = 'DropdownMenu.RadioItem';

const SubTrigger = React.forwardRef<
  HTMLDivElement,
  RadixDropdownMenu.DropdownMenuSubTriggerProps
>(function DropdownMenuSubTrigger({ className, children, ...props }, ref) {
  return (
    <RadixDropdownMenu.SubTrigger
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
    </RadixDropdownMenu.SubTrigger>
  );
});
SubTrigger.displayName = 'DropdownMenu.SubTrigger';

const SubContent = React.forwardRef<
  HTMLDivElement,
  RadixDropdownMenu.DropdownMenuSubContentProps
>(function DropdownMenuSubContent({ className, ...props }, ref) {
  return (
    <RadixDropdownMenu.SubContent
      ref={ref}
      className={cn(
        'z-[var(--z-popover)] min-w-48 outline-none',
        floatingSurface,
        menuContent,
        'nx-motion nx-pop origin-[var(--radix-dropdown-menu-content-transform-origin)]',
        className,
      )}
      {...props}
    />
  );
});
SubContent.displayName = 'DropdownMenu.SubContent';

export const DropdownMenu = {
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

import * as React from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { cn } from '../../utils/cn.js';
import {
  SelectableCardContent,
  selectableCardClass,
  useCardIds,
  type SelectableCardContentProps,
} from '../RadioCard/selectableCard.js';

export interface CheckboxCardProps
  extends Omit<RadixCheckbox.CheckboxProps, 'title' | 'children' | 'checked' | 'defaultChecked' | 'onCheckedChange'>,
    SelectableCardContentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const CheckboxCard = React.forwardRef<HTMLButtonElement, CheckboxCardProps>(
  ({ className, icon, title, description, children, onCheckedChange, ...props }, ref) => {
    const ids = useCardIds(description != null);
    return (
      <RadixCheckbox.Root
        ref={ref}
        aria-labelledby={ids.titleId}
        aria-describedby={ids.describedBy}
        className={cn(selectableCardClass, className)}
        onCheckedChange={onCheckedChange ? (c) => onCheckedChange(c === true) : undefined}
        {...props}
      >
        <SelectableCardContent
          icon={icon}
          title={title}
          description={description}
          titleId={ids.titleId}
          descriptionId={ids.descriptionId}
          shape="square"
        >
          {children}
        </SelectableCardContent>
      </RadixCheckbox.Root>
    );
  },
);
CheckboxCard.displayName = 'CheckboxCard';
